import { useEffect, useState } from 'react'
import Link from 'next/link';

import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { InjectedConnector, NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector'

import { __ } from '../utils/helpers';
import { formatBigNumberForDisplay, getDAOTokenBalance, getStakedTokenData } from '../utils/blockchain'
import { BLOCKCHAIN_NETWORK_ID, BLOCKCHAIN_NAME, BLOCKCHAIN_RPC_URL, BLOCKCHAIN_NATIVE_TOKEN, BLOCKCHAIN_NATIVE_TOKEN_SYMBOL, BLOCKCHAIN_NATIVE_TOKEN_DECIMALS, BLOCKCHAIN_EXPLORER_URL, BLOCKCHAIN_DAO_TOKEN } from '../config_blockchain';
import { useEagerConnect } from '../hooks/blockchain_hooks';

const injected = new InjectedConnector({
  supportedChainIds: [...new Set([
    BLOCKCHAIN_NETWORK_ID,
    1,
    3,
    4,
    5,
    10,
    42,
    137,
    420,
    42220,
    42161,
    44787,
    80001,
    421611
  ])]
})

const ConnectInjected = () => {
  const { chainId, account, activate,deactivate, setError, active, library } = useWeb3React()

  const [ totalTokenBalance, setTotalTokenBalance ] = useState()

  const tried = useEagerConnect(injected)

  const onClickConnect = () => {
    activate(injected, async (error) => {
      if (error instanceof UserRejectedRequestError) {
        // ignore user rejected error
      } else if (error instanceof UnsupportedChainIdError && window.ethereum){
        //Unrecognized chain, provider not loaded, attempting hard forced chain change if metamask is injected
        switchNetwork(window.ethereum)
      }
      else if (error instanceof NoEthereumProviderError) {
        alert('You need to install and activate an Ethereum compatible wallet')
      } else {
        setError(error)
      }
    }, false)
  }

  const switchNetwork = async (provider = library.provider) => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: utils.hexlify(BLOCKCHAIN_NETWORK_ID) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: utils.hexlify(BLOCKCHAIN_NETWORK_ID),
              rpcUrls: [BLOCKCHAIN_RPC_URL],
              chainName: BLOCKCHAIN_NAME,
              nativeCurrency: {
                name: BLOCKCHAIN_NATIVE_TOKEN,
                symbol: BLOCKCHAIN_NATIVE_TOKEN_SYMBOL,
                decimals: BLOCKCHAIN_NATIVE_TOKEN_DECIMALS
              },
              blockExplorerUrls: [BLOCKCHAIN_EXPLORER_URL]
            }]
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const onClickDisconnect = () => {
    deactivate()
  }

  useEffect(() => {
    async function retrieveTokenBalance(){
      if(chainId !== BLOCKCHAIN_NETWORK_ID){
        return
      }
      if(account && library) {
        const nativeBalance = await getDAOTokenBalance(library, account)
        const staked = await getStakedTokenData(library, account)
        setTotalTokenBalance(staked.balance.add(nativeBalance))
      }
    }

    retrieveTokenBalance()
  }, [account, library, chainId, active])

  return (
    <div>
      {active && typeof account === 'string' ? ( 
        (chainId == BLOCKCHAIN_NETWORK_ID) ? (
          <Link
            href="/settings/blockchainwallet"
          >
        
            <a className='hidden md:flex mr-3'>
              <span className='h-12 border-l mr-3' />
              <button className='btn-primary'>
                {totalTokenBalance && formatBigNumberForDisplay(totalTokenBalance, BLOCKCHAIN_DAO_TOKEN.decimals)+' '+BLOCKCHAIN_DAO_TOKEN.name}
                {!totalTokenBalance && 'Loading...'}
              </button>
            </a>
          </Link>
        ) : (
          <a className='hidden md:flex mr-3'>
            <span className='h-12 border-l mr-3' />
            <button className='btn-primary'
              onClick={async () => {await switchNetwork()}}>
              {__('blockchain_switch_chain')}
            </button>
          </a>
        )
        
      ) : (
        <a className='hidden md:flex mr-3'>
          <span className='h-12 border-l mr-3' />
          <button className='btn-primary'
            onClick={onClickConnect}>
            {__('blockchain_connect_wallet')}
          </button>
        </a>  

      )} 
    </div>
  )
}

export default ConnectInjected