import { BigNumber, Contract } from 'ethers';

import blockchainConfig from '../config_blockchain.js';

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

  const balance = await DAOTokenContract.balanceOf(address)/decimals_dao_token;

  return balance
}

export async function getStakedTokenData(provider, address) {

  if(!provider || !address){
    return
  }
  const decimals_dao_token = blockchainConfig.BLOCKCHAIN_DAO_TOKEN.decimals

  const StakingContract = new Contract(
    blockchainConfig.BLOCKCHAIN_DAO_STAKING_CONTRACT_ADDRESS,
    blockchainConfig.BLOCKCHAIN_DAO_STAKING_CONTRACT_ABI,
    provider.getUncheckedSigner()
  );

  const balance = await StakingContract.balanceOf(address)/decimals_dao_token;
  const locked = await StakingContract.lockedAmount(address)/decimals_dao_token;
  const unlocked = await StakingContract.unlockedAmount(address)/decimals_dao_token;
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