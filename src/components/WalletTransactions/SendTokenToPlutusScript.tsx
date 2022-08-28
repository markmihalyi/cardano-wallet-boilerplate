import React from 'react';
import { TransactionObject } from 'types/cardano.types';

type Props = {
  transaction: TransactionObject;
};

const SendTokenToPlutusScript: React.FC<Props> = ({ transaction }) => {
  return (
    <div
      className="tabContent"
      style={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'start',
        paddingRight: 20,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
        <label style={{ fontSize: 14, marginBottom: 5 }}>Script Address</label>
        <input
          className="formInput"
          type="text"
          value={transaction.addressScriptBech32}
          onChange={(e) => transaction.setAddressScriptBech32(e.target.value)}
          style={{
            width: 300,
            padding: 8,
            borderRadius: 4,
            border: '1px solid black',
            background: '#2F3136',
            color: '#E2E3E4',
          }}
        />
        <label style={{ color: '#c7c7c7', fontSize: 11, marginBottom: 5 }}>
          script address where ADA is locked
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
        <label style={{ fontSize: 14, marginBottom: 5 }}>
          Lovelaces (1 000 000 lovelaces = 1 ADA)
        </label>
        <input
          className="formInput"
          type="number"
          value={transaction.lovelaceToSend}
          onChange={(e) => transaction.setLovelaceToSend(parseInt(e.target.value))}
          style={{
            width: 300,
            padding: 8,
            borderRadius: 4,
            border: '1px solid black',
            background: '#2F3136',
            color: '#E2E3E4',
          }}
        />
        <label style={{ color: '#c7c7c7', fontSize: 11, marginBottom: 5 }}>
          you need to send ADA with Tokens
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
        <label style={{ fontSize: 14, marginBottom: 5 }}>Amount of Assets to Send</label>
        <input
          className="formInput"
          type="number"
          value={transaction.assetAmountToSend}
          onChange={(e) => transaction.setAssetAmountToSend(parseInt(e.target.value))}
          style={{
            width: 300,
            padding: 8,
            borderRadius: 4,
            border: '1px solid black',
            background: '#2F3136',
            color: '#E2E3E4',
          }}
        />
        <label style={{ color: '#c7c7c7', fontSize: 11, marginBottom: 5 }}>
          make sure you have enough asset in your wallet
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
        <label style={{ fontSize: 14, marginBottom: 5 }}>Asset PolicyId</label>
        <input
          className="formInput"
          type="text"
          value={transaction.assetPolicyIdHex}
          onChange={(e) => transaction.setAssetPolicyIdHex(e.target.value)}
          style={{
            width: 300,
            padding: 8,
            borderRadius: 4,
            border: '1px solid black',
            background: '#2F3136',
            color: '#E2E3E4',
          }}
        />
        <label style={{ color: '#c7c7c7', fontSize: 11, marginBottom: 5 }}>
          Hex of the Policy Id
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
        <label style={{ fontSize: 14, marginBottom: 5 }}>Asset Name</label>
        <input
          className="formInput"
          type="text"
          value={transaction.assetNameHex}
          onChange={(e) => transaction.setAssetNameHex(e.target.value)}
          style={{
            width: 300,
            padding: 8,
            borderRadius: 4,
            border: '1px solid black',
            background: '#2F3136',
            color: '#E2E3E4',
          }}
        />
        <label style={{ color: '#c7c7c7', fontSize: 11, marginBottom: 5 }}>
          Hex of the Asset Name
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontSize: 14, marginBottom: 5 }}>
          Datum that locks the ADA at the script address
        </label>
        <input
          className="formInput"
          type="number"
          value={transaction.datumStr}
          onChange={(e) => transaction.setDatumStr(e.target.value)}
          style={{
            width: 300,
            padding: 8,
            borderRadius: 4,
            border: '1px solid black',
            background: '#2F3136',
            color: '#E2E3E4',
          }}
        />
        <label style={{ color: '#c7c7c7', fontSize: 11 }}>insert a Datum</label>
      </div>
      <button
        className="sendButton"
        onClick={transaction.buildSendTokenToPlutusScript}
        style={{
          padding: 6,
          width: 100,
          alignSelf: 'center',
          borderRadius: 4,
          border: 0,
          cursor: 'pointer',
          background: '#686D73',
          color: '#E2E3E4',
        }}
      >
        Send Token
      </button>
    </div>
  );
};

export default SendTokenToPlutusScript;
