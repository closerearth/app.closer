import { useEffect } from 'react'

import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector, UserRejectedRequestError } from '@web3-react/injected-connector'

const injected = new InjectedConnector({
  supportedChainIds: [
    1, 
    3, 
    4, 
    5, 
    10, 
    42, 
    31337, 
    42161
  ]
})

const ConnectMetamask = () => {

  const { chainId, account, activate,deactivate, setError, active,library ,connector } = useWeb3React()

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
    console.log(chainId, account, active,library,connector)
  })

  return (
    <div>
      {active && typeof account === 'string' ? (
        <div>  
          <div type="button" w='100%' onClick={onClickDisconnect}>
                Account: {account}
          </div>
          <div fontSize="sm" w='100%' my='2' align='center'>ChainID: {chainId} connected</div>
        </div>
      ) : (
        <div>
          <button type="button" w='100%' onClick={onClickConnect}>
                Connect MetaMask
          </button>
          <div fontSize="sm" w='100%' my='2' align='center'> not connected </div>
        </div>  

      )}
    </div>
  )
}

export default ConnectMetamask