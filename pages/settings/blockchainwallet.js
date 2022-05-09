import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useWeb3 } from '@rastaracoon/web3-context';
import { utils, BigNumber, Contract } from 'ethers';

import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';

import { useAuth } from '../../contexts/auth'
import { __ } from '../../utils/helpers';
import { BLOCKCHAIN_CROWDSALE_CONTRACT_ABI } from '../../utils/blockchain';

import PageNotAllowed from '../401';

import { BLOCKCHAIN_NATIVE_TOKEN, BLOCKCHAIN_CROWDSALE_CONTRACT, BLOCKCHAIN_STABLE_COIN } from '../../config';


const CryptoWallet = () => {
  const { isAuthenticated } = useAuth();
  const { address, ethBalance: celoBalance, provider, wallet, onboard, tokens } = useWeb3();

  const [toAddress, setToAddress] = useState('')
  const [amountToSend, setamountToSend] = useState(0)
  const [pendingTransactions, setPendingTransactions] = useState([])

  const sendTokenTransaction = async (token) => {
    if (!toAddress || !provider) {
      alert('A Celo address to send Tokens to is required.')
      return
    }

    const { hash } = await token.transfer(
      utils.getAddress(toAddress),
      BigNumber.from(amountToSend)
    )

    setPendingTransactions([...pendingTransactions, hash])

    provider.once(hash, (transaction) => {
      console.log(`${hash} mined`)
      setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== hash));
      // Emitted when the transaction has been mined
    })
  }

  const sendCeloTransaction = async () => {
    if (!toAddress || !provider) {
      alert('A Celo address to send CELO to is required.')
      return
    }

    const signer = provider.getUncheckedSigner()

    const { hash } = await signer.sendTransaction({
      to: utils.getAddress(toAddress),
      value: BigNumber.from(amountToSend)
    })

    setPendingTransactions([...pendingTransactions, hash])

    provider.once(hash, (transaction) => {
      console.log(`${hash} mined`)
      setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== hash));
      // Emitted when the transaction has been mined
    })
  }

  const approveStableForCrowdsaleContract = async () => {
    if (!amountToSend) {
      alert('Input an amount in Wei')
      return
    }

    const stableCoin = tokens[BLOCKCHAIN_STABLE_COIN.address]

    const { hash } = await stableCoin.approve(
      BLOCKCHAIN_CROWDSALE_CONTRACT.address,
      BigNumber.from(amountToSend)
    )

    setPendingTransactions([...pendingTransactions, hash])

    provider.once(hash, (transaction) => {
      console.log(`${hash} mined`)
      setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== hash));
      // Emitted when the transaction has been mined
    })
  }

  const participateInCrowdsale = async () => {
    if (!amountToSend) {
      alert('Input an amount in Wei')
      return
    }

    const CrowsaleContract = new Contract(
      BLOCKCHAIN_CROWDSALE_CONTRACT.address,
      BLOCKCHAIN_CROWDSALE_CONTRACT_ABI,
      provider.getUncheckedSigner()
    )

    const { hash } = await CrowsaleContract.buy(BigNumber.from(amountToSend))

    setPendingTransactions([...pendingTransactions, hash])

    provider.once(hash, (transaction) => {
      console.log(`${hash} mined`)
      setPendingTransactions((pendingTransactions) => pendingTransactions.filter((h) => h !== hash));
      // Emitted when the transaction has been mined
    })
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
            {wallet?.provider &&
              <>
                <span className='px-4'>
              ({BLOCKCHAIN_NATIVE_TOKEN}) - ({address?.substring(0, 4) + '...' + address?.substring(address?.length - 4)})
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
          {!wallet?.provider &&
          <button
            className="btn-primary w-48 px-4"
            onClick={() => {
              onboard?.walletSelect();
            } }
          >
            {__('blockchain_connect_wallet')}
          </button>}
          {wallet?.provider && (
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

              {celoBalance && 
            <div className='m-2'>{celoBalance.toFixed(4)} {BLOCKCHAIN_NATIVE_TOKEN}
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
        

              {Object.keys(tokens).map((ta) => {
                const t = tokens[ta];
                return (
                  <div className='m-2' key={ta}>
                    {t.balance.toFixed(4)} {t.name}
                    <button
                      className="btn-primary w-48 m-2"
                      onClick={async () => {
                        sendTokenTransaction(tokens[ta])
                      }}
                    >
                Send {t.name}
                    </button>
                  </div>
                );
              })}

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