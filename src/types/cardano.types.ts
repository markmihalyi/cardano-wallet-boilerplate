import {
  TransactionUnspentOutput,
  TransactionWitnessSet,
} from '@emurgo/cardano-serialization-lib-asmjs';

export type CardanoContextType = {
  status: {
    message: string;
    color: string;
  };
  wallets: string[];
  pollWallets: () => void;
  refreshData: () => Promise<void>;
  handleWalletSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  walletInformations: {
    walletFound: boolean;
    walletIsEnabled: boolean;
    walletAPIVersion: string | undefined;
    walletName: string | undefined;
    networkId: number | undefined;
  };
  Utxos: Utxos | null;
  balance: number | null;
  walletAddresses: {
    changeAddress: string | null;
    rewardAddress: string | null;
    usedAddress: string | null;
  };
  transaction: TransactionObject;
};

export type TransactionObject = {
  addressBech32SendADA: string;
  setAddressBech32SendADA: React.Dispatch<React.SetStateAction<string>>;
  lovelaceToSend: number;
  setLovelaceToSend: React.Dispatch<React.SetStateAction<number>>;
  buildSendADATransaction: () => Promise<void>;
  submittedTxHash: string;
  setSubmittedTxHash: React.Dispatch<React.SetStateAction<string>>;
  assetAmountToSend: number;
  setAssetAmountToSend: React.Dispatch<React.SetStateAction<number>>;
  assetPolicyIdHex: string;
  setAssetPolicyIdHex: React.Dispatch<React.SetStateAction<string>>;
  assetNameHex: string;
  setAssetNameHex: React.Dispatch<React.SetStateAction<string>>;
  buildSendTokenTransaction: () => Promise<void>;
  addressScriptBech32: string;
  setAddressScriptBech32: React.Dispatch<React.SetStateAction<string>>;
  datumStr: string;
  setDatumStr: React.Dispatch<React.SetStateAction<string>>;
  buildSendADAToPlutusScript: () => Promise<void>;
  buildSendTokenToPlutusScript: () => Promise<void>;
  plutusScriptCborHex: string;
  setPlutusScriptCborHex: React.Dispatch<React.SetStateAction<string>>;
  transactionIdLocked: string;
  setTransactionIdLocked: React.Dispatch<React.SetStateAction<string>>;
  transactionIndxLocked: number;
  setTransactionIndxLocked: React.Dispatch<React.SetStateAction<number>>;
  lovelaceLocked: number;
  setLovelaceLocked: React.Dispatch<React.SetStateAction<number>>;
  manualFee: number;
  setManualFee: React.Dispatch<React.SetStateAction<number>>;
  buildRedeemADAFromPlutusScript: () => Promise<void>;
  buildRedeemTokenFromPlutusScript: () => Promise<void>;
};

export type API = {
  experimental?: {
    appVersion: {
      major: number;
      minor: number;
      patch: number;
    };
    getBalance: () => Promise<string>;
    getChangeAddress: () => Promise<string>;
    getCollateral: () => Promise<CollatUtxos>;
    getNetworkId: () => Promise<number>;
    getRewardAddresses: () => Promise<string[]>;
    getUnusedAddresses: () => Promise<string[]>;
    getUsedAddresses: (paginate?: any) => Promise<string[]>;
    getUtxos: (amount?: any, paginate?: any) => Promise<string[]>;
    signData: (addr?: any, sigStructure?: any) => Promise<void>;
    signTx: (
      tx?: any,
      partialSign?: boolean,
      createDebugTx?: boolean,
    ) => Promise<TransactionWitnessSet>;
    submitTx: (tx?: any) => Promise<string>;
  };
  getBalance: () => Promise<string>;
  getChangeAddress: () => Promise<string>;
  getCollateral: () => Promise<CollatUtxos>;
  getNetworkId: () => Promise<number>;
  getRewardAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getUsedAddresses: (paginate?: any) => Promise<string[]>;
  getUtxos: (amount?: any, paginate?: any) => Promise<string[]>;
  signData: (addr?: any, sigStructure?: any) => Promise<void>;
  signTx: (
    tx?: any,
    partialSign?: boolean,
    createDebugTx?: boolean,
  ) => Promise<TransactionWitnessSet>;
  submitTx: (tx?: any) => Promise<string>;
};

export type Utxos = {
  txid: string;
  txindx: number;
  amount: string;
  str: string;
  multiAssetStr: string;
  TransactionUnspentOutput: TransactionUnspentOutput;
}[];

export type CollatUtxos = TransactionUnspentOutput[];

export type ProtocolParams = {
  keyDeposit: string;
  coinsPerUtxoWord: string;
  minUtxo: string;
  poolDeposit: string;
  maxTxSize: number;
  priceMem: number;
  maxValSize: number;
  linearFee: { minFeeB: string; minFeeA: string };
  priceStep: number;
};
