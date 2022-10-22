import { utils, BigNumber, Contract } from 'ethers';

import blockchainConfig from '../config_blockchain.js';

export function formatBigNumberForDisplay(bigNumber, tokenDecimals, displayDecimals = 0) {
  if(displayDecimals > 5 || displayDecimals > tokenDecimals) {
    //Prevent overflow errors
    throw new Error('Too many decimals')
  }
  if (BigNumber.isBigNumber(bigNumber)) {
    const divisor = BigNumber.from(10).pow(tokenDecimals-displayDecimals);
    return bigNumber.div(divisor).toString() / 10**displayDecimals
    
  }
  else return null
}

//Returns BigNumber
export async function getNativeBalance(provider, address) {

  if(!provider || !address){
    return
  }

  const balance = await provider.getBalance(address)
  return balance
}

//Returns BigNumber
export async function getDAOTokenBalance(provider, address) {
  if(!provider || !address){
    return
  }

  const DAOTokenContract = new Contract(
    blockchainConfig.BLOCKCHAIN_DAO_TOKEN.address,
    blockchainConfig.BLOCKCHAIN_DAO_TOKEN_ABI,
    provider.getUncheckedSigner()
  );
  
  const balance = await DAOTokenContract.balanceOf(address) ;
  return balance
}

//Expects BigNumber for amount
export async function sendDAOToken(provider, toAddress, amount) {
  if(!provider || !toAddress){
    return
  }

  const DAOTokenContract = new Contract(
    blockchainConfig.BLOCKCHAIN_DAO_TOKEN.address,
    blockchainConfig.BLOCKCHAIN_DAO_TOKEN_ABI,
    provider.getUncheckedSigner()
  );
  
  const tx = await DAOTokenContract.transfer(
    utils.getAddress(toAddress),
    amount
  )

  return tx
}

//Returns BigNumbers and array of dates
export async function getStakedTokenData(provider, address) {

  if(!provider || !address){
    return
  }

  const Diamond = new Contract(
    blockchainConfig.BLOCKCHAIN_DAO_DIAMOND_ADDRESS,
    blockchainConfig.BLOCKCHAIN_DIAMOND_ABI,
    provider.getUncheckedSigner()
  );

  const balance = await Diamond.stakedBalanceOf(address);
  const locked = await Diamond.lockedStake(address);
  const unlocked = await Diamond.unlockedStake(address);
  const depositsFor = await Diamond.depositsStakedFor(address);

  return { balance, locked, unlocked, depositsFor }
}

export async function isMember(provider, address) {
  if(!provider || !address){
    return
  }
  
  const Diamond = new Contract(
    blockchainConfig.BLOCKCHAIN_DAO_DIAMOND_ADDRESS,
    blockchainConfig.BLOCKCHAIN_DIAMOND_ABI,
    provider.getUncheckedSigner()
  );

  return await Diamond.isMember(address);
}

export async function getBookedNights(provider, address, bookingYear) {
  if(!provider || !address){
    return
  }
  
  const Diamond = new Contract(
    blockchainConfig.BLOCKCHAIN_DAO_DIAMOND_ADDRESS,
    blockchainConfig.BLOCKCHAIN_DIAMOND_ABI,
    provider.getUncheckedSigner()
  );

  return await Diamond.getAccommodationBookings(address, bookingYear);
}