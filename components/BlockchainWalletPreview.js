import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { useWeb3 } from '@rastaracoon/web3-context';

import { BLOCKCHAIN_DAO_TOKEN, BLOCKCHAIN_NETWORK_ID } from '../config_blockchain';
import { getStakedTokenData } from '../utils/blockchain';

const BlockchainWalletPreview = () => {
  const { wallet, tokens, onboard, provider, address, network, switchNetwork } = useWeb3();

  useEffect(() => {
    async function retrieveTokenBalance(){
      console.log(address)
      console.log(provider)
      console.log(wallet)
      if(onboard) {
        await onboard.walletCheck();
      }
      
      if(network !== BLOCKCHAIN_NETWORK_ID){
        return
      }
      if(address && provier) {
        const staked = await getStakedTokenData(provider, address)
        setTotalTokenBalance(staked.balance/10**BLOCKCHAIN_DAO_TOKEN.decimals + tokens[BLOCKCHAIN_DAO_TOKEN.address]?.balance)
      }
      
    }
    retrieveTokenBalance()
    
  }, [tokens])

  return (
    <>
      { wallet ? ( !address ? 
        <a className='hidden md:flex mr-3'>
          <span className='h-12 border-l mr-3' />
          <button className='btn-primary'
            onClick={() => {
              onboard.walletCheck();
            } }>
            {__('blockchain_link_wallet_again')}
          </button>
        </a>
        :
        ( network == BLOCKCHAIN_NETWORK_ID ? (
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
                switchNetwork(BLOCKCHAIN_NETWORK_ID);
              } }>
              {__('blockchain_switch_chain')}
            </button>
          </a>
        )) : (
        
        <a className='hidden md:flex mr-3'>
          <span className='h-12 border-l mr-3' />
          <button className='btn-primary'
            onClick={() => {
              onboard?.walletSelect();
            } }>
            {__('blockchain_connect_wallet')}
          </button>
        </a>
      )}
    </>
  )
}

export default BlockchainWalletPreview