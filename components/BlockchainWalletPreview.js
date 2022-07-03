import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { providers } from 'ethers';

import { __ } from '../utils/helpers';

import { BLOCKCHAIN_DAO_TOKEN, BLOCKCHAIN_NETWORK_ID } from '../config_blockchain';
import { getDAOTokenBalance, getStakedTokenData, initBlockchainWithParams, useConnectWallet, useSetChain } from '../utils/blockchain';

initBlockchainWithParams()

const BlockchainWalletPreview = () => {
  const [totalTokenBalance, setTotalTokenBalance] = useState(-1);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain ] = useSetChain()
  let provider

  useEffect(() => {
    async function retrieveTokenBalance(provider, address, connectedChain){
      if(connectedChain.id !== BLOCKCHAIN_NETWORK_ID){
        setChain({ chainId: BLOCKCHAIN_NETWORK_ID  })
      }
      if(address && provider) {
        const staked = await getStakedTokenData(provider, address)
        const ercBalance = await getDAOTokenBalance(provider, address)
        setTotalTokenBalance(staked.balance + ercBalance)
      }
    }

    if (wallet) {
      provider = new providers.Web3Provider(wallet.provider, 'any')
      retrieveTokenBalance(provider, wallet?.accounts[0]?.address, connectedChain)
    }
  },[wallet])
  //const { wallet, tokens, onboard, provider, address, network, switchNetwork } = useWeb3();

  return (
    <>
      { wallet ? 
        ( connectedChain.id == BLOCKCHAIN_NETWORK_ID ? (
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
        ) : 
          <a className='hidden md:flex mr-3'>
            <span className='h-12 border-l mr-3' />
            <button className='btn-primary'
              onClick={() => {
                setChain({ chainId: BLOCKCHAIN_NETWORK_ID })
              } }>
              {__('blockchain_switch_chain')}
            </button>
          </a>
        ) : (
          <a className='hidden md:flex mr-3'>
            <span className='h-12 border-l mr-3' />
            <button className='btn-primary'
              onClick={() => {
                connect();
              } }>
              {__('blockchain_connect_wallet')}
            </button>
          </a>
        )}
    </>
  )
}

export default BlockchainWalletPreview