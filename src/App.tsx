import { CardanoContextType } from './types/cardano.types';
import React from 'react';
import WalletTransactions from '@/components/WalletTransactions';
import { formatBalance } from '@/common/helpers/formatBalance';
import { getWalletComponent } from '@/common/helpers/getWalletComponent';
import useCardano from '@/common/hooks/useCardano';

const App: React.FC = () => {
  const cardano: CardanoContextType = useCardano();

  return (
    <div
      className="main"
      style={{
        height: '100vh',
        margin: 0,
        textAlign: 'center',
        color: '#f7f7f7',
      }}
    >
      <div
        className="header"
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#282b30',
          paddingBottom: 20,
          boxShadow: '0px 2px 2px rgba(0,0,0,0.15)',
        }}
      >
        <p style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 0 }}>
          Cardano Wallet Boilerplate
        </p>
        <p style={{ marginTop: 10 }}>~ typesafe, functional component version ~</p>
      </div>
      <div
        className="walletSelection"
        style={{
          maxWidth: 400,
          margin: 'auto',
          textAlign: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#36393e',
          border: '1px solid #222',
          marginTop: 15,
          padding: 20,
          borderRadius: 10,
        }}
      >
        <p
          style={{
            fontSize: 26,
            fontWeight: 'bold',
            marginTop: 0,
            marginBottom: 10,
          }}
        >
          Select a wallet:
        </p>
        <div
          className="walletRadioButtons"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            minHeight: 24,
          }}
        >
          {cardano.wallets.map((key) => getWalletComponent(key))}
        </div>
        <button
          className="refreshButton"
          style={{
            marginTop: 15,
            padding: '10px 20px 10px 20px',
            borderRadius: 4,
            border: 0,
            background: '#4F545C',
            color: '#E2E3E4',
            cursor: 'pointer',
          }}
          onClick={cardano.refreshData}
        >
          Refresh
        </button>
      </div>
      <p style={{ color: cardano.status.color, marginBottom: 20 }}>{cardano.status.message}</p>
      <div
        className="main"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}
      >
        <div
          className="walletInformations"
          style={{
            minHeight: 464,
            background: 'rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: 25,
            textAlign: 'left',
            fontSize: 16,
          }}
        >
          <p>
            <b>Wallet found: </b>
            <span>{String(Boolean(cardano.walletInformations.walletFound))}</span>
          </p>
          <p>
            <b>Wallet connected: </b>
            <span>{String(cardano.walletInformations.walletIsEnabled)}</span>
          </p>
          <p>
            <b>Wallet API version: </b>
            <span>{cardano.walletInformations.walletAPIVersion}</span>
          </p>
          <p>
            <b>Wallet name: </b>
            <span>{cardano.walletInformations.walletName}</span>
          </p>
          <p>
            <b>Network ID (0 = testnet; 1 = mainnet): </b>
            <span>{cardano.walletInformations.networkId}</span>
          </p>

          <p style={{ marginTop: 30, marginBottom: 30 }}>
            <b>UTXOs: </b>
            <span style={{ fontSize: 11 }}>
              (UTXO #txid = ADA amount + AssetAmount + policyId.AssetName + ...)
            </span>
            <br />
            {cardano.Utxos?.map((x) => (
              <li
                style={{ fontSize: '10px' }}
                key={`${x.str}${x.multiAssetStr}`}
              >{`${x.str}${x.multiAssetStr}`}</li>
            ))}
          </p>

          <p>
            <b>Balance: </b>
            <span>{formatBalance(cardano.balance)}</span>
          </p>
          <p>
            <b>Change Address: </b>
            <br />
            <span style={{ fontSize: 12, marginTop: 3 }}>
              {cardano.walletAddresses.changeAddress}
            </span>
          </p>
          <p>
            <b>Staking Address: </b>
            <br />
            <span style={{ fontSize: 12, marginTop: 3 }}>
              {cardano.walletAddresses.rewardAddress}
            </span>
          </p>
          <p>
            <b>Used Address: </b>
            <br />
            <span style={{ fontSize: 12, marginTop: 3 }}>
              {cardano.walletAddresses.usedAddress}
            </span>
          </p>
        </div>
        <div
          className="walletAddresses"
          style={{
            textAlign: 'right',
            fontSize: 16,
          }}
        >
          <WalletTransactions />
        </div>
      </div>
    </div>
  );
};

export default App;
