import { BigNumber, Contract } from 'ethers';
import { init, useConnectWallet, useWallets, useSetChain } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';

import blockchainConfig, { BLOCKCHAIN_NAME, BLOCKCHAIN_NATIVE_TOKEN, BLOCKCHAIN_NETWORK_ID, BLOCKCHAIN_RPC_URL } from '../config_blockchain.js';
import { DEFAULT_TITLE, LOGO_HEADER, PLATFORM_NAME } from '../config.js';

export { useConnectWallet, useWallets, useSetChain }

export async function initBlockchainWithParams() {
  const injected = injectedModule();

  init({
    wallets: [injected],
    chains: [
      {
        id: BLOCKCHAIN_NETWORK_ID,
        token: BLOCKCHAIN_NATIVE_TOKEN,
        label: BLOCKCHAIN_NAME,
        rpcUrl: BLOCKCHAIN_RPC_URL
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
}

export async function getDAOTokenBalance(provider, address) {

  if(!provider || !address){
    return
  }
  const decimals_dao_token = blockchainConfig.BLOCKCHAIN_DAO_TOKEN.decimals

  const DAOTokenContract = new Contract(
    blockchainConfig.BLOCKCHAIN_DAO_TOKEN.address,
    blockchainConfig.BLOCKCHAIN_DAO_TOKEN_CONTRACT_ABI,
    provider.getUncheckedSigner()
  );
  console.log(DAOTokenContract)

  const balance = await DAOTokenContract.balanceOf(address)/10**decimals_dao_token;

  return balance
}

export async function getStakedTokenData(provider, address) {

  if(!provider || !address){
    return
  }
  console.log(address)
  const decimals_dao_token = blockchainConfig.BLOCKCHAIN_DAO_TOKEN.decimals

  const StakingContract = new Contract(
    blockchainConfig.BLOCKCHAIN_DAO_STAKING_CONTRACT_ADDRESS,
    blockchainConfig.BLOCKCHAIN_DAO_STAKING_CONTRACT_ABI,
    provider.getUncheckedSigner()
  );

  const balance = await StakingContract.balanceOf(address)/10**decimals_dao_token;
  const locked = await StakingContract.lockedAmount(address)/10**decimals_dao_token;
  const unlocked = await StakingContract.unlockedAmount(address)/10**decimals_dao_token;
  const depositsFor = await StakingContract.depositsFor(address);
  const lockindPeriod = await StakingContract.lockingPeriod();

  return { balance, locked, unlocked, lockindPeriod, depositsFor }
}

export async function getBookedNights(provider, address, bookingYear) {
  if(!provider || !address){
    return
  }
  
  const ProofOfPresenceContract = new Contract(
    blockchainConfig.BLOCKCHAIN_DAO_PROOF_OF_PRESENCE_CONTRACT_ADDRESS,
    blockchainConfig.BLOCKCHAIN_DAO_PROOF_OF_PRESENCE_ABI,
    provider.getUncheckedSigner()
  );

  return await ProofOfPresenceContract.getBookings(address, bookingYear);
}