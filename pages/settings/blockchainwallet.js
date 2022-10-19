import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { utils, BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';


import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';

import { useAuth } from '../../contexts/auth'
import { __ } from '../../utils/helpers';

import PageNotAllowed from '../401';

import {  } from '../../config';
import { BLOCKCHAIN_NETWORK_ID, BLOCKCHAIN_NATIVE_TOKEN, BLOCKCHAIN_STABLE_COIN, BLOCKCHAIN_DAO_TOKEN } from '../../config_blockchain';
import { formatBigNumberForDisplay, getDAOTokenBalance, getNativeBalance, getStakedTokenData, sendDAOToken } from '../../utils/blockchain';


const CryptoWallet = () => {
  const { isAuthenticated } = useAuth();
  const { chainId, account, activate, deactivate, setError, active, library } = useWeb3React()

  const [ tokenBalance, setTokenBalance ] = useState({})
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
        setTokenBalance({ 'unencumbered': DAOTokenBalance, ...staked })
      }
    }
    async function retrieveNativeBalance(){
      if(chainId !== BLOCKCHAIN_NETWORK_ID){
        return
      }
      if(account && library) {
        const balance = await getNativeBalance(library, account)
        setNativeBalance(balance)
      }
      
    }
    retrieveTokenBalance()
    retrieveNativeBalance()
  },[chainId, account, active, library])

  const sendTokenTransaction = async () => {
    if(chainId !== BLOCKCHAIN_NETWORK_ID){
      return
    }

    if (!toAddress || !library) {
      alert('A Celo address to send Tokens to is required.')
      return
    }

    const tx = await sendDAOToken(library, toAddress, BigNumber.from(amountToSend));
    
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
              ({BLOCKCHAIN_NATIVE_TOKEN.name}) - ({account?.substring(0, 4) + '...' + account?.substring(account?.length - 4)})
                </span>
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
            <div className='m-2'>{formatBigNumberForDisplay(nativeBalance, BLOCKCHAIN_NATIVE_TOKEN.decimals, 2)} {BLOCKCHAIN_NATIVE_TOKEN.symbol}
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

              {tokenBalance && 
            <div className='m-2'>{formatBigNumberForDisplay(tokenBalance['unencumbered'], BLOCKCHAIN_DAO_TOKEN['decimals'])} {BLOCKCHAIN_DAO_TOKEN.symbol}
              <button
                className="btn-primary w-48 m-2"
                onClick={async () => {
                  sendTokenTransaction()
                } }
              >
                Send {BLOCKCHAIN_NATIVE_TOKEN.name}
              </button>
            </div>
              }
            </>
          )}

        </main>
      </div>
      
    </Layout>
  )

}

export default CryptoWallet