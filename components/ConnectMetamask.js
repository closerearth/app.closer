import { useEffect } from 'react'
import Link from 'next/link';

import { useWeb3React } from '@web3-react/core'
import { InjectedConnector, UserRejectedRequestError } from '@web3-react/injected-connector'

import { __ } from '../utils/helpers';
import { BLOCKCHAIN_NETWORK_ID, BLOCKCHAIN_DAO_TOKEN, BLOCKCHAIN_STABLE_COIN } from '../config_blockchain';

const injected = new InjectedConnector({
  supportedChainIds: [
    BLOCKCHAIN_NETWORK_ID,
    1
  ]
})

const switchNetwork = async () => {
  try {
    await library.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: toHex(network) }]
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await library.provider.request({
          method: 'wallet_addEthereumChain',
          params: [networkParams[toHex(network)]]
        });
      } catch (error) {
        setError(error);
      }
    }
  }
};

const ConnectMetamask = () => {

  const { chainId, account, activate,deactivate, setError, active,library ,connector } = useWeb3React()
  const all = useWeb3React()

  const onClickConnect = () => {
    activate(injected,(error) => {
      if (error instanceof UserRejectedRequestError) {
        // ignore user rejected error
        console.log('user refused')
      } else {
        setError(error)
      }
    }, false)
  }

  const onClickDisconnect = () => {
    deactivate()
  }

  useEffect(() => {
    console.log(all)
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
                {/* {totalTokenBalance == -1 ? 'Loading...' : totalTokenBalance.toFixed(0)
              +' '+
              BLOCKCHAIN_DAO_TOKEN.name} */}
              </button>
            </a>
          </Link>
        ) : (
          <a className='hidden md:flex mr-3'>
            <span className='h-12 border-l mr-3' />
            <button className='btn-primary'
              onClick={switchNetwork}>
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

  // <a className='hidden md:flex mr-3'>
  //   <span className='h-12 border-l mr-3' />
  //   <button className='btn-primary'
  //     onClick={() => {
  //       onboard.walletCheck();
  //     } }>
  //     {__('blockchain_link_wallet_again')}
  //   </button>
  // </a>
 
  )
}

export default ConnectMetamask