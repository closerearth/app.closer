import React from 'react';

import { useWeb3 } from '@rastaracoon/web3-context';
import { utils, BigNumber } from 'ethers';


import { BLOCKCHAIN_NATIVE_TOKEN } from '../config';


const Wallet = () => {
  const { address, ethBalance: celoBalance, network, wallet, onboard, tokens } = useWeb3();
  return (
    <div>
      <div className='flex flex-row content-end'>
        <h3 className="mt-9 mb-8 text-4xl font-light">Blockchain wallet ({BLOCKCHAIN_NATIVE_TOKEN})</h3>
        {!wallet?.provider ? (
          <button
            className="btn-primary w-24"
            onClick={() => {
              onboard?.walletSelect();
            }}
          >
              Select a Wallet
          </button>) : (
          <><button
            className="bn-demo-button"
            onClick={() => onboard?.walletSelect()}
          >
              Switch Wallets
          </button>
          </>
        )}
      </div>


      {celoBalance != null && <span>{celoBalance.toFixed(4)} {BLOCKCHAIN_NATIVE_TOKEN}</span>} <br />

      {Object.keys(tokens).map((ta) => {
        const t = tokens[ta];
        console.log(t);
        return (
          <div key={ta}>
            {t.balance} {t.name}
          </div>
        );
      })}

    </div>
  );
};
export default Wallet;