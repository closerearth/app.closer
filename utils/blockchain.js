import { BigNumber, Contract } from 'ethers';

import blockchainConfig from '../config_blockchain.js';

export function formatBigNumberForDisplay(bigNumber, decimals) {
  if (BigNumber.isBigNumber(bigNumber)) {
    const divisor = BigNumber.from(10).pow(decimals);
    return bigNumber.div(divisor)
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
  console.log(address)
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

export async function reloadWalletOnNetworkChange() {
  if (!network) return;

  const providerNetwork = await getProviderNetwork();

  // get current wallet info so can auto log back in
  const userState = await onboard?.getState();
  const wallet = userState && userState.wallet;
  if (!wallet || !wallet.name) return;

  // if provider network is different, then the user has changed networks
  if (providerNetwork && providerNetwork.chainId !== network) {
    // reset wallet to trigger a full re-initialization on wallet select
    await onboard?.walletReset();

    // re-select the wallet
    // const walletSelected = await onboard?.walletSelect(wallet.name);
    await onboard?.walletSelect(wallet.name);
  }

  if (providerNetwork && providerNetwork.chainId !== chainId) {
    await onboard?.walletCheck();
  }
}