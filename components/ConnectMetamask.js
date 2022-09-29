import { useEffect, useState } from 'react'
import Link from 'next/link';

import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';
import { InjectedConnector, UserRejectedRequestError } from '@web3-react/injected-connector'

import { __ } from '../utils/helpers';
import { getDAOTokenBalance, getStakedTokenData } from '../utils/blockchain'
import { BLOCKCHAIN_NETWORK_ID, BLOCKCHAIN_NAME, BLOCKCHAIN_RPC_URL, BLOCKCHAIN_NATIVE_TOKEN, BLOCKCHAIN_NATIVE_TOKEN_SYMBOL, BLOCKCHAIN_NATIVE_TOKEN_DECIMALS, BLOCKCHAIN_EXPLORER_URL, BLOCKCHAIN_DAO_TOKEN } from '../config_blockchain';

const injected = new InjectedConnector({
  supportedChainIds: [
    BLOCKCHAIN_NETWORK_ID,
    1,
    3,
    4,
    5,
    10,
    42,
    42220,
    44787
  ]
})

const ConnectMetamask = () => {
  const { chainId, account, activate,deactivate, setError, active, library } = useWeb3React()

  const all = useWeb3React()

  const [ totalTokenBalance, setTotalTokenBalance ] = useState(-1)

  const onClickConnect = () => {
    activate(injected,(error) => {
      if (error instanceof UserRejectedRequestError) {
        // ignore user rejected error
        console.log('user refused')
      } else {
        console.log(error)
        setError(error)
      }
    }, false)
  }

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: utils.hexlify(BLOCKCHAIN_NETWORK_ID) }]
      });
      console.log('done')
    } catch (switchError) {
      console.log(switchError.code === 4902)
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
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
    console.log(all)
    async function retrieveTokenBalance(){
      if(chainId !== BLOCKCHAIN_NETWORK_ID){
        return
      }
      if(account && library) {
        const nativeBalance = await getDAOTokenBalance(library, account)
        const staked = await getStakedTokenData(library, account)
        console.log(nativeBalance)
        console.log(staked)
        setTotalTokenBalance(staked.balance/10**BLOCKCHAIN_DAO_TOKEN.decimals + nativeBalance)
      }
    }

    retrieveTokenBalance()
  })

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
                {totalTokenBalance == -1 ? 'Loading...' : totalTokenBalance.toFixed(0)
              +' '+
              BLOCKCHAIN_DAO_TOKEN.name}
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

export default ConnectMetamask