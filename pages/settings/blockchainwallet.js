import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { utils, BigNumber, Contract } from 'ethers';
import { useWeb3React } from '@web3-react/core';


import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';

import { useAuth } from '../../contexts/auth'
import { __ } from '../../utils/helpers';
import { BLOCKCHAIN_CROWDSALE_CONTRACT_ABI, getDAOTokenBalance, getNativeBalance, getStakedTokenData } from '../../utils/blockchain';

import PageNotAllowed from '../401';

import { BLOCKCHAIN_NATIVE_TOKEN, BLOCKCHAIN_CROWDSALE_CONTRACT, BLOCKCHAIN_STABLE_COIN } from '../../config';
import { BLOCKCHAIN_NETWORK_ID } from '../../config_blockchain';


const CryptoWallet = () => {
  const { isAuthenticated } = useAuth();
  const { chainId, account, activate, deactivate, setError, active, library } = useWeb3React()

  const [ totalTokenBalance, setTotalTokenBalance ] = useState(null)
  const [ nativeBalance, setNativeBalance ] = useState(null)

  const [toAddress, setToAddress] = useState('')
  const [amountToSend, setamountToSend] = useState(0)
  const [pendingTransactions, setPendingTransactions] = useState([])

  useEffect(() => {
    async function retrieveTokenBalance(){
      if(chainId !== BLOCKCHAIN_NETWORK_ID){
        return
      }
      if(account && library) {
        const DAOTokenBalance = await getDAOTokenBalance(library, account)
        const staked = await getStakedTokenData(library, account)
        setTotalTokenBalance(staked.balance.add(DAOTokenBalance))
      }
    }
    async function getBalance(){
      if(chainId !== BLOCKCHAIN_NETWORK_ID){
        return
      }
      if(account && library) {
        const balance = await getNativeBalance(library, account)
        setNativeBalance(balance.toString())
      }
      
    }

    retrieveTokenBalance()
    getBalance()
  })

  const sendTokenTransaction = async (token) => {
    if (!toAddress || !library) {
      alert('A Celo address to send Tokens to is required.')
      return
    }

    const tx = await token.transfer(
      utils.getAddress(toAddress),
      BigNumber.from(amountToSend)
    )

    setPendingTransactions([...pendingTransactions, tx.hash])
    await tx.wait();
    console.log(`${tx.hash} mined`)
    setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== tx.hash));
      
  }

  const sendCeloTransaction = async () => {
    if (!toAddress || !library) {
      alert('A Celo address to send CELO to is required.')
      return
    }

    const signer = library.getUncheckedSigner()

    const tx = await signer.sendTransaction({
      to: utils.getAddress(toAddress),
      value: BigNumber.from(amountToSend)
    })

    setPendingTransactions([...pendingTransactions, tx.hash])
    await tx.wait();
    console.log(`${tx.hash} mined`)
    setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== tx.hash));
  }

  const approveStableForCrowdsaleContract = async () => {
    if (!amountToSend) {
      alert('Input an amount in Wei')
      return
    }

    const stableCoin = tokens[BLOCKCHAIN_STABLE_COIN.address]

    const tx = await stableCoin.approve(
      BLOCKCHAIN_CROWDSALE_CONTRACT.address,
      BigNumber.from(amountToSend)
    )

    setPendingTransactions([...pendingTransactions, tx.hash])
    await tx.wait();
    console.log(`${tx.hash} mined`)
    setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== tx.hash));      
  }

  const participateInCrowdsale = async () => {
    if (!amountToSend) {
      alert('Input an amount in Wei')
      return
    }

    const CrowsaleContract = new Contract(
      BLOCKCHAIN_CROWDSALE_CONTRACT.address,
      BLOCKCHAIN_CROWDSALE_CONTRACT_ABI,
      library.getUncheckedSigner()
    )

    const tx = await CrowsaleContract.buy(BigNumber.from(amountToSend))

    setPendingTransactions([...pendingTransactions, tx.hash])
    await tx.wait();
    console.log(`${tx.hash} mined`)
    setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== tx.hash));      
  }


  if (!isAuthenticated) {
    return <PageNotAllowed />;
  }

  return (
    <Layout protect>
      <Head>
        <title>{ __('blockchainwallet_title') }</title>
      </Head>
      {pendingTransactions?.length > 0 && <Spinner fixed />}
      <div className='main-content min-h-[300px]'>
        <main className="flex flex-col justify-between md:max-w-[60%]">
          <div className='flex flex-row items-baseline'>
            <h3 className="mt-9 mb-8 text-4xl font-light">{__('blockchain_wallet')}</h3>
            {account && library &&
              <>
                <span className='px-4'>
              ({BLOCKCHAIN_NATIVE_TOKEN}) - ({account?.substring(0, 4) + '...' + account?.substring(account?.length - 4)})
                </span>
                <button
                  className="btn-primary w-36"
                  onClick={() => onboard?.walletSelect()}
                >
                  {__('blockchain_switch_wallet')}
                </button>
              </>
            }
          </div>
          {!account && library &&
          <button
            className="btn-primary w-48 px-4"
            onClick={() => {
              onboard?.walletSelect();
            } }
          >
            {__('blockchain_connect_wallet')}
          </button>}
          {account && library && (
            <>
              <h4>Wallet contents</h4>
              <div className="flex justify-between md:flex-row m-4">
                <label>Sending params:</label>
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
              </div>

              {nativeBalance && 
            <div className='m-2'>{nativeBalance} {BLOCKCHAIN_NATIVE_TOKEN}
              <button
                className="btn-primary w-48 m-2"
                onClick={async () => {
                  sendCeloTransaction();
                } }
              >
                Send CELO
              </button>
            </div>
              }
      

              <h4 className='mt-16'>Crowdsale simulation</h4>

              <div className='flex flex-row'>
                <input
                  className="w-12"
                  type="number"
                  value={amountToSend}
                  placeholder="cEUR amount (wei)"
                  onChange={e => setamountToSend(e.target.value)} />
                <button
                  className="btn-primary w-48 m-2"
                  onClick={async () => {
                    approveStableForCrowdsaleContract();
                  } }
                >
                Approve amount
                </button>
                <button
                  className="btn-primary w-48 m-2"
                  onClick={async () => {
                    participateInCrowdsale();
                  } }
                >
                Participate in Crowsale
                </button>
              </div>
            </>
          )}

        </main>
      </div>
      
    </Layout>
  )

}

export default CryptoWallet