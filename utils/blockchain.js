import Notify from 'bnc-notify'

import closerLogo from '../public/image/logo.svg'

import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import ledgerModule from '@web3-onboard/ledger'
import walletConnectModule from '@web3-onboard/walletconnect'
import walletLinkModule from '@web3-onboard/walletlink'
import torusModule from '@web3-onboard/torus'
import keepkeyModule from '@web3-onboard/keepkey'
import gnosisModule from '@web3-onboard/gnosis'

const networkId = 80001
const dappId = 'd31b131d-94ef-43ab-b51e-5a86e4bd68d9'

const injected = injectedModule()
const walletLink = walletLinkModule()
const walletConnect = walletConnectModule()

const torus = torusModule()
const ledger = ledgerModule()
const keepkey = keepkeyModule()
const gnosis = gnosisModule()

export const initWeb3Onboard = init({
  wallets: [
    injected,
    ledger,
    walletLink,
    walletConnect,
    gnosis,
    keepkey,
    torus
  ],
  chains: [
    
    {
      id: '0x13881',
      token: 'MATIC',
      label: 'Polygon testnet Mumbai',
      rpcUrl: 'https://rpc-mumbai.matic.today'
    },
    {
      id: '0x89',
      token: 'MATIC',
      label: 'Polygon Mainnet',
      rpcUrl: 'https://polygon-rpc.com'
    }
  ],
  appMetadata: {
    name: 'Closer Web3',
    icon: closerLogo,
    logo: closerLogo,
    description: 'Closer Web3 connector',
    recommendedInjectedWallets: [
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
      { name: 'MetaMask', url: 'https://metamask.io' }
    ]
  }
})

export function initNotify() {
  const notify = Notify
  return notify({
    dappId,
    networkId,
    onerror: error => console.log(`Notify error: ${error.message}`)
  })
}
