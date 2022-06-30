import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { init, useConnectWallet, useWallets, useSetChain } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import { providers } from 'ethers';

import { __ } from '../utils/helpers';

import { BLOCKCHAIN_DAO_TOKEN, BLOCKCHAIN_NAME, BLOCKCHAIN_NATIVE_TOKEN, BLOCKCHAIN_NETWORK_ID, BLOCKCHAIN_RPC_URL } from '../config_blockchain';
import { getDAOTokenBalance, getStakedTokenData } from '../utils/blockchain';
import { DEFAULT_TITLE, LOGO_HEADER, PLATFORM_NAME } from '../config';

const injected = injectedModule();

init({
  wallets: [injected],
  chains: [
    {
      id: '0xAEF3',
      token: 'CELO test',
      label: 'Celo',
      rpcUrl: 'https://ropsten.infura.io/v3/'
    }
  ],
  accountCenter: {
    desktop: {
      position: 'bottomRight',
      enabled: true,
      minimal: true
    },
    mobile: {
      position: 'bottomRight',
      enabled: true,
      minimal: true
    }
  },
  appMetadata: {
    name: PLATFORM_NAME,
    icon: LOGO_HEADER, // svg string icon
    description: DEFAULT_TITLE,
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ]
  },
})

const BlockchainWalletPreview = () => {
  const [totalTokenBalance, setTotalTokenBalance] = useState(-1);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain ] = useSetChain()
  let provider

  console.log(wallet)

  useEffect(() => {
    async function retrieveTokenBalance(provider, address, connectedChain){
      if(connectedChain !== BLOCKCHAIN_NETWORK_ID){
        setChain(BLOCKCHAIN_NETWORK_ID)
      }
      if(address && provider) {
        const staked = await getStakedTokenData(provider, address)
        const ercBalance = await getDAOTokenBalance(provider, address)
        setTotalTokenBalance(staked.balance + ercBalance)
      }
    }

    if (wallet) {
      provider = new providers.Web3Provider(wallet.provider, 'any')
      console.log(connectedChain)
      retrieveTokenBalance(provider, wallet?.accounts[0]?.address, connectedChain)
    }
  },[wallet])
  //const { wallet, tokens, onboard, provider, address, network, switchNetwork } = useWeb3();

  return (
    <>
      <button
        disabled={connecting}
        onClick={() => (wallet ? disconnect() : connect())}
      >
        {connecting ? 'connecting' : wallet ? 'disconnect' : 'connect'}
      </button>
      {/* { wallet ? ( !address ? 
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
      )} */}
    </>
  )
}

export default BlockchainWalletPreview