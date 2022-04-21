import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { initWeb3Onboard, initNotify, TDFContracts } from '../utils/blockchain'
import { useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'

let provider

let TDFTokenContract

const BlockchainWallet = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()

  const [celoTokens, setCeloTokens] = useState(null)
  const [TDFTokens, setTDFTokens] = useState(null)
  const [pendingTransactions, setPendingTransactions] = useState([])

  const [web3Onboard, setWeb3Onboard] = useState(null)

  const [toAddress, setToAddress] = useState('')
  const [amountToSend, setamountToSend] = useState(0)

  useEffect(() => {
    setWeb3Onboard(initWeb3Onboard)
  }, [])

  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    )
    window.localStorage.setItem(
      'connectedWallets',
      JSON.stringify(connectedWalletsLabelArray)
    )
  }, [connectedWallets])

  useEffect(() => {
    if (!wallet?.provider) {
      provider = null
    } else {
      provider = new ethers.providers.Web3Provider(wallet.provider, 'any')

      async function getCeloBalance() {
        const celoBal = await provider.getBalance(wallet.accounts[0].address);
        setCeloTokens(celoBal/(10**18).toString());
      }
      
      getCeloBalance()

      TDFTokenContract = new ethers.Contract(
        TDFContracts.TDFTokenCeloTestnet.address,
        TDFContracts.TDFTokenCeloTestnet.ABI,
        provider.getUncheckedSigner()
      )

      async function getTDFTokenBalance() {
        const TDFBal = await TDFTokenContract.balanceOf(wallet.accounts[0].address);
        setTDFTokens(TDFBal/(10**18).toString());
      }

      getTDFTokenBalance()
      
    }
  }, [wallet,pendingTransactions])  

  useEffect(() => {
    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem('connectedWallets')
    )

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        await connect({ autoSelect: previouslyConnectedWallets[0] })
      }
      setWalletFromLocalStorage()
    }
  }, [web3Onboard, connect])

  const readyToTransact = async () => {
    if (!wallet) {
      const walletSelected = await connect()
      if (!walletSelected) return false
    }
    // prompt user to switch to Celo Alfajores for test -- TO CHANGE IN PROD
    await setChain({ chainId: '0xaef3' })

    return true
  }

  const sendHash = async () => {

    if (!toAddress) {
      alert('A Celo address to send Celo to is required.')
      return
    }

    const signer = provider.getUncheckedSigner()
   
    const { hash } = await signer.sendTransaction({
      to: ethers.utils.getAddress(toAddress),
      value: ethers.BigNumber.from(amountToSend)
    })

    setPendingTransactions([...pendingTransactions, hash])

    provider.once(hash, (transaction) => {
      console.log(`${hash} mined`)
      setPendingTransactions({pendingTransactions: pendingTransactions.filter(function(tx) { 
        return tx !== hash 
      })});
      // Emitted when the transaction has been mined
    })

  }

  const sendTDFTokenTransaction = async () => {
    if (!toAddress) {
      alert('A Celo address to send Tokens to is required.')
      return
    }

    const { hash } = await TDFTokenContract.transfer(
      ethers.utils.getAddress(toAddress),
      ethers.BigNumber.from(amountToSend)
    )

    setPendingTransactions([...pendingTransactions, hash])

    provider.once(hash, (transaction) => {
      console.log(`${hash} mined`)
      setPendingTransactions({pendingTransactions: pendingTransactions.filter(function(tx) { 
        return tx !== hash 
      })});
      // Emitted when the transaction has been mined
    })
  }

  if (!web3Onboard) return <div>Loading...</div>

  return (
    <>
      <div>
        <h2>Chain Actions</h2>
        {wallet && (
          <div className="network-select">
            <label>Switch Chains</label>
            {settingChain ? (
              <span>Switching Chains...</span>
            ) : (
              <select
                onChange={({ target: { value } }) => setChain({ chainId: value })}
                value={connectedChain?.id}
              >
                {chains.map(({ id, label }) => {
                  return (
                    <option value={id} key={id}>
                      {label}
                    </option>
                  )
                })}
              </select>
            )}
          </div>
        )}
        <div>
          {!wallet && (
            <button
              className="btn-primary"
              onClick={() => {
                connect()
              } }
            >
              Select a Wallet
            </button>
          )}

          {wallet && (
            <>
              <button
                className="btn-primary"
                onClick={() => {
                  disconnect(wallet)
                  const connectedWalletsList = connectedWallets.map(
                    ({ label }) => label
                  )
                  window.localStorage.setItem(
                    'connectedWallets',
                    JSON.stringify(connectedWalletsList)
                  )
                } }
              >
                  Reset Wallet State
              </button>
            </>
          )}
        </div>
      </div>
      <div>
        <h2>Wallet information</h2>
        {wallet?.accounts[0]?.address && <span>{wallet?.accounts[0]?.address}</span>}
        {wallet && (
          <span>
              <div>
                {celoTokens} CELO
              </div>
              <div>
                {TDFTokens} TDF
              </div>
          </span>
        )}
        {wallet && connectedChain && connectedChain?.id && (
          <span>{connectedChain.id == '0xa4ec' ? 'Celo mainnet' : 'Celo Alfajores testnet'}</span>
        )}
      </div>
      <div>
        {wallet &&
        <>
          <h2>Actions</h2>
          <div className="flex justify-between md:flex-row">
            <label>Send Celo to:</label>
            <input
              className="w-64"
              type="text"
              value={toAddress}
              placeholder="Address"
              onChange={e => setToAddress(e.target.value)} />
            <input
              className="w-32"
              type="number"
              value={amountToSend}
              placeholder="Celo amount"
              onChange={e => setamountToSend(e.target.value)} />
            <button
              className="btn-primary"
              onClick={async () => {
                const ready = await readyToTransact()
                if (!ready) return
                sendHash()
              }}
            >
              Send CELO
            </button>
            <button
              className="btn-primary"
              onClick={async () => {
                const ready = await readyToTransact()
                if (!ready) return
                sendTDFTokenTransaction()
              }}
            >
              Send TDF tokens
            </button>
          </div>
        </>
        }
      </div>
    </>
  )
}

export default BlockchainWallet
