import React from 'react';
import RedeemADAFromPlutusScript from './RedeemADAFromPlutusScript';
import RedeemTokenFromPlutusScript from './RedeemTokenFromPlutusScript';
import SendADAToAddress from './SendADAToAddress';
import SendADAToPlutusScript from './SendADAToPlutusScript';
import SendTokenToAddress from './SendTokenToAddress';
import SendTokenToPlutusScript from './SendTokenToPlutusScript';
import useCardano from 'common/hooks/useCardano';

const WalletTransactions: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState<string>('sendADAToAddress');

  const { transaction } = useCardano();

  const tabs = [
    {
      id: 'sendADAToAddress',
      text: '1. Send ADA to Address',
    },
    {
      id: 'sendTokenToAddress',
      text: '2. Send Token to Address',
    },
    {
      id: 'sendADAToPlutusScript',
      text: '3. Send ADA to Plutus Script',
    },
    {
      id: 'sendTokenToPlutusScript',
      text: '4. Send Token to Plutus Script',
    },
    {
      id: 'redeemADAFromPlutusScript',
      text: '5. Redeem ADA from Plutus Script',
    },
    {
      id: 'redeemTokenFromPlutusScript',
      text: '6. Redeem Token from Plutus Script',
    },
  ];

  const openTab = (e: React.MouseEvent<HTMLElement>) => {
    const id = e.currentTarget.id;
    transaction.setSubmittedTxHash('');
    setCurrentTab(id || 'sendADAToAddress');
  };

  return (
    <>
      <div
        className="tabContainer"
        style={{
          minHeight: 464,
          display: 'flex',
          flexDirection: 'row',
          gap: 30,
          background: 'rgba(0,0,0,0.1)',
          borderRadius: 10,
          padding: 25,
        }}
      >
        <div
          className="tabs"
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: 20,
          }}
        >
          {tabs.map(({ id, text }) => (
            <button
              className="tabButton"
              style={{
                textAlign: 'left',
                padding: 9,
                marginBottom: 8,
                borderRadius: 4,
                border: 0,
                background: currentTab === id ? '#4F545C' : '#202225',
                color: '#E2E3E4',
                cursor: 'pointer',
              }}
              id={id}
              key={id}
              onClick={openTab}
            >
              {text}
            </button>
          ))}
        </div>

        {currentTab === 'sendADAToAddress' && <SendADAToAddress transaction={transaction} />}
        {currentTab === 'sendTokenToAddress' && <SendTokenToAddress transaction={transaction} />}
        {currentTab === 'sendADAToPlutusScript' && (
          <SendADAToPlutusScript transaction={transaction} />
        )}
        {currentTab === 'sendTokenToPlutusScript' && (
          <SendTokenToPlutusScript transaction={transaction} />
        )}
        {currentTab === 'redeemADAFromPlutusScript' && (
          <RedeemADAFromPlutusScript transaction={transaction} />
        )}
        {currentTab === 'redeemTokenFromPlutusScript' && (
          <RedeemTokenFromPlutusScript transaction={transaction} />
        )}
      </div>
      {transaction.submittedTxHash.length > 0 && (
        <p style={{ textAlign: 'center' }}>
          <b>Submitted Tx Hash: </b>
          <br />
          <span style={{ fontSize: 12, marginTop: 3 }}>{transaction.submittedTxHash}</span>
        </p>
      )}
    </>
  );
};

export default WalletTransactions;
