import React from 'react';
import { TransactionObject } from 'types/cardano.types';

type Props = {
  transaction: TransactionObject;
};

const SendADAToPlutusScript: React.FC<Props> = ({ transaction }) => {
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
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
        <label style={{ fontSize: 14, marginBottom: 5 }}>Script Address where to send ADA</label>
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
          insert a script address where you want to send some ADA
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
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
          insert the amount of ADA you want to send
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
        <label style={{ color: '#c7c7c7', fontSize: 11, marginBottom: 5 }}>insert a Datum</label>
      </div>
      <button
        className="sendButton"
        onClick={transaction.buildSendADAToPlutusScript}
        style={{
          padding: 6,
          marginTop: 15,
          width: 100,
          alignSelf: 'center',
          borderRadius: 4,
          border: 0,
          cursor: 'pointer',
          background: '#686D73',
          color: '#E2E3E4',
        }}
      >
        Send ADA
      </button>
    </div>
  );
};

export default SendADAToPlutusScript;
