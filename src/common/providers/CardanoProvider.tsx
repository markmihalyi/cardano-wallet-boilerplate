/* eslint-disable react-hooks/exhaustive-deps */

import { API, CardanoContextType, CollatUtxos, ProtocolParams, Utxos } from 'types/cardano.types';
import {
  Address,
  AssetName,
  Assets,
  BaseAddress,
  BigInt,
  BigNum,
  ConstrPlutusData,
  CostModel,
  Costmdls,
  Ed25519KeyHashes,
  ExUnits,
  Int,
  Language,
  LinearFee,
  MultiAsset,
  PlutusData,
  PlutusList,
  PlutusScript,
  PlutusScripts,
  Redeemer,
  RedeemerTag,
  Redeemers,
  ScriptHash,
  Transaction,
  TransactionBuilder,
  TransactionBuilderConfigBuilder,
  TransactionHash,
  TransactionInput,
  TransactionInputs,
  TransactionOutput,
  TransactionOutputBuilder,
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
  TransactionWitnessSet,
  Value,
  hash_plutus_data,
  hash_script_data,
} from '@emurgo/cardano-serialization-lib-asmjs';

import { Buffer } from 'buffer';
import React from 'react';

const CardanoContext = React.createContext<CardanoContextType>({} as CardanoContextType);

type Props = {
  children: React.ReactNode;
};

const CardanoContextProvider: React.FC<Props> = ({ children }) => {
  const [status, setStatus] = React.useState({
    message: 'Loading wallets...',
    color: '#FFBF00',
  });
  const [whichWalletSelected, setWhichWalletSelected] = React.useState<string>();
  const [walletFound, setWalletFound] = React.useState<boolean>(false);
  const [walletIsEnabled, setWalletIsEnabled] = React.useState<boolean>(false);
  const [walletName, setWalletName] = React.useState<string>();
  const [walletAPIVersion, setWalletAPIVersion] = React.useState<string>();
  const [wallets, setWallets] = React.useState<string[]>([]);

  const [networkId, setNetworkId] = React.useState<number>();
  const [Utxos, setUtxos] = React.useState<Utxos | null>(null);
  const [CollatUtxos, setCollatUtxos] = React.useState<CollatUtxos | null>(null);
  const [balance, setBalance] = React.useState<number | null>(null);
  const [changeAddress, setChangeAddress] = React.useState<string>('');
  const [rewardAddress, setRewardAddress] = React.useState<string>('');
  const [usedAddress, setUsedAddress] = React.useState<string>('');

  const [submittedTxHash, setSubmittedTxHash] = React.useState<string>('');

  const [addressBech32SendADA, setAddressBech32SendADA] = React.useState<string>(
    'addr_test1qzacpw8ddvtemncvjewzy5h8zumkkgndxy7jugzvteskcua2hqaf6ldd5trdgj3tmur0setwvnac8sfvy30yr0e0l4gqpxnp2w',
  );
  const [lovelaceToSend, setLovelaceToSend] = React.useState(3000000);
  const [assetNameHex, setAssetNameHex] = React.useState<string>('4c494645');
  const [assetPolicyIdHex, setAssetPolicyIdHex] = React.useState<string>(
    'ae02017105527c6c0c9840397a39cc5ca39fabe5b9998ba70fda5f2f',
  );
  const [assetAmountToSend, setAssetAmountToSend] = React.useState<number>(5);
  const [addressScriptBech32, setAddressScriptBech32] = React.useState<string>(
    'addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8',
  );
  const [datumStr, setDatumStr] = React.useState<string>('12345678');
  const [plutusScriptCborHex, setPlutusScriptCborHex] = React.useState<string>(
    '4e4d01000033222220051200120011',
  );
  const [transactionIdLocked, setTransactionIdLocked] = React.useState<string>('');
  const [transactionIndxLocked, setTransactionIndxLocked] = React.useState<number>(0);
  const [lovelaceLocked, setLovelaceLocked] = React.useState<number>(3000000);
  const [manualFee, setManualFee] = React.useState<number>(900000);

  /**
   * When the wallet is connect it returns the connector which is
   * written to this API variable and all the other operations
   * run using this API object
   */
  // let API: API | undefined = undefined;
  // const [API, setAPI] = React.useState<API | undefined>(undefined);
  const API = React.useRef<API | undefined>(undefined);

  /**
   * Protocol parameters
   */
  let protocolParams: ProtocolParams = {
    linearFee: {
      minFeeA: '44',
      minFeeB: '155381',
    },
    minUtxo: '34482',
    poolDeposit: '500000000',
    keyDeposit: '2000000',
    maxValSize: 5000,
    maxTxSize: 16384,
    priceMem: 0.0577,
    priceStep: 0.0000721,
    coinsPerUtxoWord: '34482',
  };

  /**
   * Poll the wallets it can read from the browser.
   *
   * Note: CCVault and Eternl are the same wallet, Eternl is a rebrand of CCVault
   * So both of these wallets as the Eternl injects itself twice to maintain
   * backward compatibility
   */
  const pollWallets = () => {
    const wallets = [];
    for (const key in window.cardano) {
      if (window.cardano[key].enable && wallets.indexOf(key) === -1) {
        wallets.push(key);
      }
    }
    setWallets(wallets);
    setStatus({
      message: 'Found ' + wallets.length + ' wallets.',
      color: '#37ff77',
    });
  };

  /**
   * Resets every state variable to its default value
   */
  const resetWalletData = (): any => {
    setWalletFound(false);
    setWalletIsEnabled(false);
    setWalletName(undefined);
    setWalletAPIVersion(undefined);
    setNetworkId(0);
    setUtxos(null);
    setCollatUtxos(null);
    setBalance(null);
    setChangeAddress('');
    setRewardAddress('');
    setUsedAddress('');
  };

  /**
   * Handles the radio buttons on the form that
   * let the user choose which wallet to work with
   */
  const handleWalletSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus({
      message: "Loading '" + e.target.value + "' wallet...",
      color: '#FFBF00',
    });
    resetWalletData();
    const whichWalletSelected = e.target.value;
    setWhichWalletSelected(whichWalletSelected);
  };

  /**
   * Checks if the wallet is running in the browser
   * Does this for Nami, Eternl and Flint wallets
   */
  const checkIfWalletFound = (): boolean => {
    const walletKey = whichWalletSelected;
    if (walletKey === undefined) {
      return false;
    }
    const walletFound = !!window?.cardano?.[walletKey];
    setWalletFound(walletFound);
    return walletFound;
  };

  /**
   * Get the API version used by the wallets
   * writes the value to state
   */
  const getAPIVersion = (): any => {
    const walletKey = whichWalletSelected;
    if (walletKey === undefined) {
      return false;
    }
    const walletAPIVersion = window?.cardano?.[walletKey].apiVersion;
    setWalletAPIVersion(walletAPIVersion);
    return walletAPIVersion;
  };

  /**
   * Get the name of the wallet (nami, eternl, flint)
   * and store the name in the state
   */
  const getWalletName = (): any => {
    const walletKey = whichWalletSelected;
    if (walletKey === undefined) {
      return false;
    }
    const walletName = window?.cardano?.[walletKey].name;
    setWalletName(walletName);
    return walletName;
  };

  /**
   * Checks if a connection has been established with
   * the wallet
   */
  const checkIfWalletEnabled = async (): Promise<boolean> => {
    let walletIsEnabled = false;

    try {
      const walletName = whichWalletSelected;
      walletIsEnabled = await window.cardano[walletName].isEnabled();
    } catch (err) {
      console.log(err);
    }
    setWalletIsEnabled(walletIsEnabled);

    return walletIsEnabled;
  };

  /**
   * Enables the wallet that was chosen by the user
   * When this executes the user should get a window pop-up
   * from the wallet asking to approve the connection
   * of this app to the wallet
   */
  const enableWallet = async (): Promise<boolean> => {
    const walletKey = whichWalletSelected;
    try {
      const apiData = await window.cardano[walletKey].enable();
      API.current = apiData;
    } catch (err) {
      console.log(err);
    }
    return checkIfWalletEnabled();
  };

  /**
   * Gets the Network ID to which the wallet is connected
   * 0 = testnet
   * 1 = mainnet
   * Then writes either 0 or 1 to state
   */
  const getNetworkId = async (): Promise<void> => {
    try {
      if (API.current === undefined) throw new Error('API is undefined');

      const networkId = await API.current.getNetworkId();
      setNetworkId(networkId);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Gets the UTXOs from the user's wallet and then
   * stores in an object in the state
   */
  const getUtxos = async (): Promise<void> => {
    let Utxos: Utxos = [];

    try {
      if (API.current === undefined) throw new Error('API is undefined');

      const rawUtxos = await API.current.getUtxos();

      for (const rawUtxo of rawUtxos) {
        const utxo = TransactionUnspentOutput.from_bytes(Buffer.from(rawUtxo, 'hex'));
        const input = utxo.input();

        const txid = Buffer.from(input.transaction_id().to_bytes()).toString('hex');
        const txindx = input.index();
        const output = utxo.output();
        const amount = output.amount().coin().to_str(); // ADA amount in lovelace
        const multiasset = output.amount().multiasset();
        let multiAssetStr = '';

        if (multiasset) {
          const keys = multiasset.keys(); // policy Ids of thee multiasset
          const N = keys.len();
          // console.log(`${N} Multiassets in the UTXO`)

          for (let i = 0; i < N; i++) {
            const policyId = keys.get(i);
            const policyIdHex = Buffer.from(policyId.to_bytes()).toString('hex');
            // console.log(`policyId: ${policyIdHex}`)
            const assets = multiasset.get(policyId) || new Assets();
            const assetNames = assets.keys();
            const K = assetNames.len();
            // console.log(`${K} Assets in the Multiasset`)

            for (let j = 0; j < K; j++) {
              const assetName = assetNames.get(j);
              const assetNameString = Buffer.from(assetName.name()).toString();
              const assetNameHex = Buffer.from(assetName.name()).toString('hex');
              const multiassetAmt = multiasset.get_asset(policyId, assetName);
              multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`;
              // console.log(assetNameString)
              // console.log(`Asset Name: ${assetNameHex}`)
            }
          }
        }

        const obj = {
          txid: txid,
          txindx: txindx,
          amount: amount,
          str: `${txid} #${txindx} = ${amount}`,
          multiAssetStr: multiAssetStr,
          TransactionUnspentOutput: utxo,
        };
        Utxos.push(obj);
        // console.log(`utxo: ${str}`)
      }
      setUtxos(Utxos);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * The collateral is need for working with Plutus Scripts
   * Essentially you need to provide collateral to pay for fees if the
   * script execution fails after the script has been validated...
   * this should be an uncommon occurrence and would suggest the smart contract
   * would have been incorrectly written.
   * The amount of collateral to use is set in the wallet
   */
  const getCollateral = async (): Promise<void> => {
    let CollatUtxos: CollatUtxos = [];

    try {
      if (API.current === undefined) throw new Error('API is undefined');

      let collateral: CollatUtxos | null = [];

      const wallet = whichWalletSelected;
      if (wallet === 'nami') {
        collateral = (await API.current.experimental?.getCollateral()) || null;
      } else {
        collateral = await API.current.getCollateral();
      }

      if (collateral === null) {
        throw new Error('Collateral is null');
      }

      for (const x of collateral) {
        const utxo = TransactionUnspentOutput.from_bytes(Buffer.from(x.toString(), 'hex'));
        CollatUtxos.push(utxo);
      }
      setCollatUtxos(CollatUtxos);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Gets the current balance of in Lovelace in the user's wallet
   * This doesnt resturn the amounts of all other Tokens
   * For other tokens you need to look into the full UTXO list
   */
  const getBalance = async (): Promise<void> => {
    try {
      if (API.current === undefined) throw new Error('API is undefined');

      const balanceCBORHex = await API.current.getBalance();

      const balance = Value.from_bytes(Buffer.from(balanceCBORHex, 'hex')).coin().to_str();

      setBalance(Number(balance));
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Get the address from the wallet into which any spare UTXO should be sent
   * as change when building transactions.
   */
  const getChangeAddress = async (): Promise<void> => {
    try {
      if (API.current === undefined) throw new Error('API is undefined');

      const raw = await API.current.getChangeAddress();
      const changeAddress = Address.from_bytes(Buffer.from(raw, 'hex')).to_bech32();
      setChangeAddress(changeAddress);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * This is the Staking address into which rewards from staking get paid into
   */
  const getRewardAddresses = async (): Promise<void> => {
    try {
      if (API.current === undefined) throw new Error('API is undefined');

      const raw = await API.current.getRewardAddresses();
      const rawFirst = raw[0];
      const rewardAddress = Address.from_bytes(Buffer.from(rawFirst, 'hex')).to_bech32();
      setRewardAddress(rewardAddress);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Gets previsouly used addresses
   */
  const getUsedAddresses = async (): Promise<void> => {
    try {
      if (API.current === undefined) throw new Error('API is undefined');

      const raw = await API.current.getUsedAddresses();
      const rawFirst = raw[0];
      if (rawFirst === undefined) {
        return;
      }
      const usedAddress = Address.from_bytes(Buffer.from(rawFirst, 'hex')).to_bech32();
      // console.log(rewardAddress)
      setUsedAddress(usedAddress);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Refresh all the data from the user's wallet
   */
  const refreshData = async (): Promise<void> => {
    try {
      await resetWalletData();
      const walletFound = checkIfWalletFound();
      if (walletFound) {
        await getAPIVersion();
        await getWalletName();
        const walletEnabled = await enableWallet();
        if (walletEnabled) {
          await getNetworkId();
          await getUtxos();
          await getCollateral();
          await getBalance();
          await getChangeAddress();
          await getRewardAddresses();
          await getUsedAddresses();
        } else {
          setWalletIsEnabled(false);

          setUtxos(null);
          setCollatUtxos(null);
          setBalance(null);
          setChangeAddress('');
          setRewardAddress('');
          setUsedAddress('');

          setSubmittedTxHash('');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    (async () => {
      await refreshData();
      if (whichWalletSelected !== undefined) {
        setStatus({
          message: `Loaded '${whichWalletSelected}' wallet.`,
          color: '#37ff77',
        });
      }
    })();
  }, [whichWalletSelected]);

  React.useEffect(() => {
    console.debug('Loading...');
    setTimeout(() => {
      (async () => {
        pollWallets();
        await refreshData();
        console.debug('Wallets loaded.');
      })();
    }, 1000);
  }, []);

  /**
   * Every transaction starts with initializing the
   * TransactionBuilder and setting the protocol parameters
   * This is boilerplate
   * @returns {Promise<TransactionBuilder>}
   */
  const initTransactionBuilder = async (): Promise<TransactionBuilder> => {
    const txBuilder = TransactionBuilder.new(
      TransactionBuilderConfigBuilder.new()
        .fee_algo(
          LinearFee.new(
            BigNum.from_str(protocolParams.linearFee.minFeeA),
            BigNum.from_str(protocolParams.linearFee.minFeeB),
          ),
        )
        .pool_deposit(BigNum.from_str(protocolParams.poolDeposit))
        .key_deposit(BigNum.from_str(protocolParams.keyDeposit))
        .coins_per_utxo_word(BigNum.from_str(protocolParams.coinsPerUtxoWord))
        .max_value_size(protocolParams.maxValSize)
        .max_tx_size(protocolParams.maxTxSize)
        .prefer_pure_change(true)
        .build(),
    );

    return txBuilder;
  };

  /**
   * Builds an object with all the UTXOs from the user's wallet
   * @returns {Promise<TransactionUnspentOutputs>}
   */
  const getTxUnspentOutputs = async (): Promise<TransactionUnspentOutputs> => {
    let txOutputs = TransactionUnspentOutputs.new();

    if (Utxos === null) throw new Error('Utxos is null');

    for (const utxo of Utxos) {
      txOutputs.add(utxo.TransactionUnspentOutput);
    }
    return txOutputs;
  };

  /**
   * The transaction is build in 3 stages:
   * 1 - initialize the Transaction Builder
   * 2 - Add inputs and outputs
   * 3 - Calculate the fee and how much change needs to be given
   * 4 - Build the transaction body
   * 5 - Sign it (at this point the user will be prompted for
   * a password in his wallet)
   * 6 - Send the transaction
   */
  const buildSendADATransaction = async (): Promise<void> => {
    const txBuilder = await initTransactionBuilder();
    const shelleyOutputAddress = Address.from_bech32(addressBech32SendADA);
    const shelleyChangeAddress = Address.from_bech32(changeAddress);

    txBuilder.add_output(
      TransactionOutput.new(
        shelleyOutputAddress,
        Value.new(BigNum.from_str(lovelaceToSend.toString())),
      ),
    );

    // Find the available UTXOs in the wallet and
    // us them as Inputs
    const txUnspentOutputs = await getTxUnspentOutputs();
    txBuilder.add_inputs_from(txUnspentOutputs, 1);

    // calculate the min fee required and send any change to an address
    txBuilder.add_change_if_needed(shelleyChangeAddress);

    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();

    // Tx witness
    const transactionWitnessSet = TransactionWitnessSet.new();

    const tx = Transaction.new(
      txBody,
      TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes()),
    );

    if (API.current === undefined) throw new Error('API is undefined');

    let txVkeyWitnesses: TransactionWitnessSet = await API.current.signTx(
      Buffer.from(tx.to_bytes()).toString('hex'),
      true,
    );

    txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(String(txVkeyWitnesses), 'hex'));

    const vkeys = txVkeyWitnesses.vkeys();

    if (vkeys === undefined) throw new Error('vkeys are undefined');

    transactionWitnessSet.set_vkeys(vkeys);

    const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

    const submittedTxHash = await API.current.submitTx(
      Buffer.from(signedTx.to_bytes()).toString('hex'),
    );
    setSubmittedTxHash(submittedTxHash);

    console.log('Transaction completed:', submittedTxHash);
  };

  const buildSendTokenTransaction = async (): Promise<void> => {
    const txBuilder = await initTransactionBuilder();
    const shelleyOutputAddress = Address.from_bech32(addressBech32SendADA);
    const shelleyChangeAddress = Address.from_bech32(changeAddress);

    let txOutputBuilderTemp = TransactionOutputBuilder.new();
    txOutputBuilderTemp = txOutputBuilderTemp.with_address(shelleyOutputAddress);

    let txOutputBuilder = txOutputBuilderTemp.next();

    let multiAsset = MultiAsset.new();
    let assets = Assets.new();
    assets.insert(
      AssetName.new(Buffer.from(assetNameHex, 'hex')), // Asset Name
      BigNum.from_str(assetAmountToSend.toString()), // How much to send
    );
    multiAsset.insert(
      ScriptHash.from_bytes(Buffer.from(assetPolicyIdHex, 'hex')), // PolicyID
      assets,
    );

    txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin(
      multiAsset,
      BigNum.from_str(protocolParams.coinsPerUtxoWord),
    );
    const txOutput = txOutputBuilder.build();

    txBuilder.add_output(txOutput);

    // Find the available UTXOs in the wallet and
    // us them as Inputs
    const txUnspentOutputs = await getTxUnspentOutputs();
    txBuilder.add_inputs_from(txUnspentOutputs, 3);

    // set the time to live - the absolute slot value before the tx becomes invalid
    // txBuilder.set_ttl(51821456);

    // calculate the min fee required and send any change to an address
    txBuilder.add_change_if_needed(shelleyChangeAddress);

    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();

    // Tx witness
    const transactionWitnessSet = TransactionWitnessSet.new();

    const tx = Transaction.new(
      txBody,
      TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes()),
    );

    if (API.current === undefined) throw new Error('API is undefined');

    let txVkeyWitnesses = await API.current.signTx(
      Buffer.from(tx.to_bytes()).toString('hex'),
      true,
    );
    txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(String(txVkeyWitnesses), 'hex'));

    const vkeys = txVkeyWitnesses.vkeys();

    if (vkeys === undefined) throw new Error('vkeys are undefined');

    transactionWitnessSet.set_vkeys(vkeys);

    const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

    const submittedTxHash = await API.current.submitTx(
      Buffer.from(signedTx.to_bytes()).toString('hex'),
    );
    setSubmittedTxHash(submittedTxHash);

    console.log('Transaction completed:', submittedTxHash);

    // const txBodyCborHex_unsigned = Buffer.from(txBody.to_bytes(), "utf8").toString("hex");
    // this.setState({txBodyCborHex_unsigned, txBody})
  };

  const buildSendADAToPlutusScript = async (): Promise<void> => {
    const txBuilder = await initTransactionBuilder();
    const ScriptAddress = Address.from_bech32(addressScriptBech32);
    const shelleyChangeAddress = Address.from_bech32(changeAddress);

    let txOutputBuilderTemp = TransactionOutputBuilder.new();
    txOutputBuilderTemp = txOutputBuilderTemp.with_address(ScriptAddress);
    const dataHash = hash_plutus_data(PlutusData.new_integer(BigInt.from_str(datumStr)));
    txOutputBuilderTemp = txOutputBuilderTemp.with_data_hash(dataHash);

    let txOutputBuilder = txOutputBuilderTemp.next();

    txOutputBuilder = txOutputBuilder.with_value(
      Value.new(BigNum.from_str(lovelaceToSend.toString())),
    );
    const txOutput = txOutputBuilder.build();

    txBuilder.add_output(txOutput);

    // Find the available UTXOs in the wallet and
    // us them as Inputs
    const txUnspentOutputs = await getTxUnspentOutputs();
    txBuilder.add_inputs_from(txUnspentOutputs, 2);

    // calculate the min fee required and send any change to an address
    txBuilder.add_change_if_needed(shelleyChangeAddress);

    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();

    // Tx witness
    const transactionWitnessSet = TransactionWitnessSet.new();

    const tx = Transaction.new(
      txBody,
      TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes()),
    );

    if (API.current === undefined) throw new Error('API is undefined');

    let txVkeyWitnesses = await API.current.signTx(
      Buffer.from(tx.to_bytes()).toString('hex'),
      true,
    );
    txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(String(txVkeyWitnesses), 'hex'));

    const vkeys = txVkeyWitnesses.vkeys();

    if (vkeys === undefined) throw new Error('vkeys are undefined');

    transactionWitnessSet.set_vkeys(vkeys);

    const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

    const submittedTxHash = await API.current.submitTx(
      Buffer.from(signedTx.to_bytes()).toString('hex'),
    );
    setSubmittedTxHash(submittedTxHash);
    setTransactionIdLocked(submittedTxHash);
    setLovelaceLocked(lovelaceToSend);

    console.log('Transaction completed:', submittedTxHash);
  };

  const buildSendTokenToPlutusScript = async (): Promise<void> => {
    const txBuilder = await initTransactionBuilder();
    const ScriptAddress = Address.from_bech32(addressScriptBech32);
    const shelleyChangeAddress = Address.from_bech32(changeAddress);

    let txOutputBuilderTemp = TransactionOutputBuilder.new();
    txOutputBuilderTemp = txOutputBuilderTemp.with_address(ScriptAddress);
    const dataHash = hash_plutus_data(PlutusData.new_integer(BigInt.from_str(datumStr)));
    txOutputBuilderTemp = txOutputBuilderTemp.with_data_hash(dataHash);

    let txOutputBuilder = txOutputBuilderTemp.next();

    let multiAsset = MultiAsset.new();
    let assets = Assets.new();
    assets.insert(
      AssetName.new(Buffer.from(assetNameHex, 'hex')), // Asset Name
      BigNum.from_str(assetAmountToSend.toString()), // How much to send
    );
    multiAsset.insert(
      ScriptHash.from_bytes(Buffer.from(assetPolicyIdHex, 'hex')), // PolicyID
      assets,
    );

    // txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin(multiAsset, BigNum.from_str(this.protocolParams.coinsPerUtxoWord))

    txOutputBuilder = txOutputBuilder.with_coin_and_asset(
      BigNum.from_str(lovelaceToSend.toString()),
      multiAsset,
    );

    const txOutput = txOutputBuilder.build();

    txBuilder.add_output(txOutput);

    // Find the available UTXOs in the wallet and
    // us them as Inputs
    const txUnspentOutputs = await getTxUnspentOutputs();
    txBuilder.add_inputs_from(txUnspentOutputs, 3);

    // calculate the min fee required and send any change to an address
    txBuilder.add_change_if_needed(shelleyChangeAddress);

    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();

    // Tx witness
    const transactionWitnessSet = TransactionWitnessSet.new();

    const tx = Transaction.new(
      txBody,
      TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes()),
    );

    if (API.current === undefined) throw new Error('API is undefined');

    let txVkeyWitnesses = await API.current.signTx(
      Buffer.from(tx.to_bytes()).toString('hex'),
      true,
    );
    txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(String(txVkeyWitnesses), 'hex'));

    const vkeys = txVkeyWitnesses.vkeys();

    if (vkeys === undefined) throw new Error('vkeys are undefined');

    transactionWitnessSet.set_vkeys(vkeys);

    const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

    const submittedTxHash = await API.current.submitTx(
      Buffer.from(signedTx.to_bytes()).toString('hex'),
    );
    setSubmittedTxHash(submittedTxHash);
    setTransactionIdLocked(submittedTxHash);
    setLovelaceLocked(lovelaceToSend);

    console.log('Transaction completed:', submittedTxHash);
  };

  const buildRedeemADAFromPlutusScript = async (): Promise<void> => {
    const txBuilder = await initTransactionBuilder();
    const ScriptAddress = Address.from_bech32(addressScriptBech32);
    const shelleyChangeAddress = Address.from_bech32(changeAddress);

    txBuilder.add_input(
      ScriptAddress,
      TransactionInput.new(
        TransactionHash.from_bytes(Buffer.from(transactionIdLocked, 'hex')),
        transactionIndxLocked,
      ),
      Value.new(BigNum.from_str(lovelaceLocked.toString())),
    ); // how much lovelace is at that UTXO

    txBuilder.set_fee(BigNum.from_str(manualFee.toString()));

    const scripts = PlutusScripts.new();
    scripts.add(PlutusScript.from_bytes(Buffer.from(plutusScriptCborHex, 'hex'))); //from cbor of plutus script

    // Add outputs
    const outputVal = lovelaceLocked - manualFee;
    const outputValStr = outputVal.toString();
    txBuilder.add_output(
      TransactionOutput.new(shelleyChangeAddress, Value.new(BigNum.from_str(outputValStr))),
    );

    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();

    const collateral = CollatUtxos;
    const inputs = TransactionInputs.new();

    collateral?.forEach((utxo) => {
      inputs.add(utxo.input());
    });

    let datums = PlutusList.new();
    // datums.add(PlutusData.from_bytes(Buffer.from(this.state.datumStr, "utf8")))
    datums.add(PlutusData.new_integer(BigInt.from_str(datumStr)));

    const redeemers = Redeemers.new();

    const data = PlutusData.new_constr_plutus_data(
      ConstrPlutusData.new(BigNum.from_str('0'), PlutusList.new()),
    );

    const redeemer = Redeemer.new(
      RedeemerTag.new_spend(),
      BigNum.from_str('0'),
      data,
      ExUnits.new(BigNum.from_str('7000000'), BigNum.from_str('3000000000')),
    );

    redeemers.add(redeemer);

    // Tx witness
    const transactionWitnessSet = TransactionWitnessSet.new();

    transactionWitnessSet.set_plutus_scripts(scripts);
    transactionWitnessSet.set_plutus_data(datums);
    transactionWitnessSet.set_redeemers(redeemers);

    // Pre Vasil hard fork cost model
    // const cost_model_vals = [
    //     197209, 0, 1, 1, 396231, 621, 0, 1, 150000, 1000,
    //     0, 1, 150000, 32, 2477736, 29175, 4, 29773, 100, 29773, 100, 29773, 100,
    //     29773, 100, 29773, 100, 29773, 100, 100, 100, 29773, 100, 150000, 32, 150000,
    //     32, 150000, 32, 150000, 1000, 0, 1, 150000, 32, 150000, 1000, 0, 8, 148000,
    //     425507, 118, 0, 1, 1, 150000, 1000, 0, 8, 150000, 112536, 247, 1, 150000,
    //     10000, 1, 136542, 1326, 1, 1000, 150000, 1000, 1, 150000, 32, 150000, 32,
    //     150000, 32, 1, 1, 150000, 1, 150000, 4, 103599, 248, 1, 103599, 248, 1,
    //     145276, 1366, 1, 179690, 497, 1, 150000, 32, 150000, 32, 150000, 32, 150000,
    //     32, 150000, 32, 150000, 32, 148000, 425507, 118, 0, 1, 1, 61516, 11218, 0,
    //     1, 150000, 32, 148000, 425507, 118, 0, 1, 1, 148000, 425507, 118, 0, 1, 1,
    //     2477736, 29175, 4, 0, 82363, 4, 150000, 5000, 0, 1, 150000, 32, 197209, 0,
    //     1, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32,
    //     150000, 32, 3345831, 1, 1
    // ];

    /*
        Post Vasil hard fork cost model
        If you need to make this code work on the Mainnet, before Vasil hard-fork
        Then you need to comment this section below and uncomment the cost model above
        Otherwise it will give errors when redeeming from Scripts
        Sending assets and ada to Script addresses is unaffected by this cost model
         */
    const cost_model_vals = [
      205665, 812, 1, 1, 1000, 571, 0, 1, 1000, 24177, 4, 1, 1000, 32, 117366, 10475, 4, 23000, 100,
      23000, 100, 23000, 100, 23000, 100, 23000, 100, 23000, 100, 100, 100, 23000, 100, 19537, 32,
      175354, 32, 46417, 4, 221973, 511, 0, 1, 89141, 32, 497525, 14068, 4, 2, 196500, 453240, 220,
      0, 1, 1, 1000, 28662, 4, 2, 245000, 216773, 62, 1, 1060367, 12586, 1, 208512, 421, 1, 187000,
      1000, 52998, 1, 80436, 32, 43249, 32, 1000, 32, 80556, 1, 57667, 4, 1000, 10, 197145, 156, 1,
      197145, 156, 1, 204924, 473, 1, 208896, 511, 1, 52467, 32, 64832, 32, 65493, 32, 22558, 32,
      16563, 32, 76511, 32, 196500, 453240, 220, 0, 1, 1, 69522, 11687, 0, 1, 60091, 32, 196500,
      453240, 220, 0, 1, 1, 196500, 453240, 220, 0, 1, 1, 806990, 30482, 4, 1927926, 82523, 4,
      265318, 0, 4, 0, 85931, 32, 205665, 812, 1, 1, 41182, 32, 212342, 32, 31220, 32, 32696, 32,
      43357, 32, 32247, 32, 38314, 32, 9462713, 1021, 10,
    ];

    const costModel = CostModel.new();
    cost_model_vals.forEach((x, i) => costModel.set(i, Int.new_i32(x)));

    const costModels = Costmdls.new();
    costModels.insert(Language.new_plutus_v1(), costModel);

    const scriptDataHash = hash_script_data(redeemers, costModels, datums);
    txBody.set_script_data_hash(scriptDataHash);

    txBody.set_collateral(inputs);

    const baseAddress = BaseAddress.from_address(shelleyChangeAddress);
    const requiredSigners = Ed25519KeyHashes.new();

    const keyhash = baseAddress?.payment_cred().to_keyhash();

    if (keyhash === undefined) throw new Error('keyhash is undefined');

    requiredSigners.add(keyhash);

    txBody.set_required_signers(requiredSigners);

    const tx = Transaction.new(
      txBody,
      TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes()),
    );

    if (API.current === undefined) throw new Error('API is undefined');

    let txVkeyWitnesses = await API.current.signTx(
      Buffer.from(tx.to_bytes()).toString('hex'),
      true,
    );
    txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(String(txVkeyWitnesses), 'hex'));

    const vkeys = txVkeyWitnesses.vkeys();

    if (vkeys === undefined) throw new Error('vkeys is undefined');

    transactionWitnessSet.set_vkeys(vkeys);

    const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

    const submittedTxHash = await API.current.submitTx(
      Buffer.from(signedTx.to_bytes()).toString('hex'),
    );
    setSubmittedTxHash(submittedTxHash);

    console.log('Transaction completed:', submittedTxHash);
  };

  const buildRedeemTokenFromPlutusScript = async (): Promise<void> => {
    const txBuilder = await initTransactionBuilder();
    const ScriptAddress = Address.from_bech32(addressScriptBech32);
    const shelleyChangeAddress = Address.from_bech32(changeAddress);

    let multiAsset = MultiAsset.new();
    let assets = Assets.new();
    assets.insert(
      AssetName.new(Buffer.from(assetNameHex, 'hex')), // Asset Name
      BigNum.from_str(assetAmountToSend.toString()), // How much to send
    );

    multiAsset.insert(
      ScriptHash.from_bytes(Buffer.from(assetPolicyIdHex, 'hex')), // PolicyID
      assets,
    );

    txBuilder.add_input(
      ScriptAddress,
      TransactionInput.new(
        TransactionHash.from_bytes(Buffer.from(transactionIdLocked, 'hex')),
        transactionIndxLocked,
      ),
      Value.new_from_assets(multiAsset),
    ); // how much lovelace is at that UTXO

    txBuilder.set_fee(BigNum.from_str(Number(manualFee).toString()));

    const scripts = PlutusScripts.new();
    scripts.add(PlutusScript.from_bytes(Buffer.from(plutusScriptCborHex, 'hex'))); //from cbor of plutus script

    // Add outputs
    const outputVal = lovelaceLocked - manualFee;
    const outputValStr = outputVal.toString();

    let txOutputBuilderTemp = TransactionOutputBuilder.new();
    txOutputBuilderTemp = txOutputBuilderTemp.with_address(shelleyChangeAddress);

    let txOutputBuilder = txOutputBuilderTemp.next();
    txOutputBuilder = txOutputBuilder.with_coin_and_asset(
      BigNum.from_str(outputValStr),
      multiAsset,
    );

    const txOutput = txOutputBuilder.build();
    txBuilder.add_output(txOutput);

    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();

    const collateral = CollatUtxos;
    const inputs = TransactionInputs.new();
    collateral?.forEach((utxo) => {
      inputs.add(utxo.input());
    });

    let datums = PlutusList.new();
    // datums.add(PlutusData.from_bytes(Buffer.from(this.state.datumStr, "utf8")))
    datums.add(PlutusData.new_integer(BigInt.from_str(datumStr)));

    const redeemers = Redeemers.new();

    const data = PlutusData.new_constr_plutus_data(
      ConstrPlutusData.new(BigNum.from_str('0'), PlutusList.new()),
    );

    const redeemer = Redeemer.new(
      RedeemerTag.new_spend(),
      BigNum.from_str('0'),
      data,
      ExUnits.new(BigNum.from_str('7000000'), BigNum.from_str('3000000000')),
    );

    redeemers.add(redeemer);

    // Tx witness
    const transactionWitnessSet = TransactionWitnessSet.new();

    transactionWitnessSet.set_plutus_scripts(scripts);
    transactionWitnessSet.set_plutus_data(datums);
    transactionWitnessSet.set_redeemers(redeemers);

    // Pre Vasil hard fork cost model
    // const cost_model_vals = [197209, 0, 1, 1, 396231, 621, 0, 1, 150000, 1000, 0, 1, 150000, 32, 2477736, 29175, 4, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 100, 100, 29773, 100, 150000, 32, 150000, 32, 150000, 32, 150000, 1000, 0, 1, 150000, 32, 150000, 1000, 0, 8, 148000, 425507, 118, 0, 1, 1, 150000, 1000, 0, 8, 150000, 112536, 247, 1, 150000, 10000, 1, 136542, 1326, 1, 1000, 150000, 1000, 1, 150000, 32, 150000, 32, 150000, 32, 1, 1, 150000, 1, 150000, 4, 103599, 248, 1, 103599, 248, 1, 145276, 1366, 1, 179690, 497, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 148000, 425507, 118, 0, 1, 1, 61516, 11218, 0, 1, 150000, 32, 148000, 425507, 118, 0, 1, 1, 148000, 425507, 118, 0, 1, 1, 2477736, 29175, 4, 0, 82363, 4, 150000, 5000, 0, 1, 150000, 32, 197209, 0, 1, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 3345831, 1, 1];

    /*
        Post Vasil hard fork cost model
        If you need to make this code work on the Mainnnet, before Vasil hard-fork
        Then you need to comment this section below and uncomment the cost model above
        Otherwise it will give errors when redeeming from Scripts
        Sending assets and ada to Script addresses is unaffected by this cost model
         */
    const cost_model_vals = [
      205665, 812, 1, 1, 1000, 571, 0, 1, 1000, 24177, 4, 1, 1000, 32, 117366, 10475, 4, 23000, 100,
      23000, 100, 23000, 100, 23000, 100, 23000, 100, 23000, 100, 100, 100, 23000, 100, 19537, 32,
      175354, 32, 46417, 4, 221973, 511, 0, 1, 89141, 32, 497525, 14068, 4, 2, 196500, 453240, 220,
      0, 1, 1, 1000, 28662, 4, 2, 245000, 216773, 62, 1, 1060367, 12586, 1, 208512, 421, 1, 187000,
      1000, 52998, 1, 80436, 32, 43249, 32, 1000, 32, 80556, 1, 57667, 4, 1000, 10, 197145, 156, 1,
      197145, 156, 1, 204924, 473, 1, 208896, 511, 1, 52467, 32, 64832, 32, 65493, 32, 22558, 32,
      16563, 32, 76511, 32, 196500, 453240, 220, 0, 1, 1, 69522, 11687, 0, 1, 60091, 32, 196500,
      453240, 220, 0, 1, 1, 196500, 453240, 220, 0, 1, 1, 806990, 30482, 4, 1927926, 82523, 4,
      265318, 0, 4, 0, 85931, 32, 205665, 812, 1, 1, 41182, 32, 212342, 32, 31220, 32, 32696, 32,
      43357, 32, 32247, 32, 38314, 32, 9462713, 1021, 10,
    ];

    const costModel = CostModel.new();
    cost_model_vals.forEach((x, i) => costModel.set(i, Int.new_i32(x)));

    const costModels = Costmdls.new();
    costModels.insert(Language.new_plutus_v1(), costModel);

    const scriptDataHash = hash_script_data(redeemers, costModels, datums);
    txBody.set_script_data_hash(scriptDataHash);

    txBody.set_collateral(inputs);

    const baseAddress = BaseAddress.from_address(shelleyChangeAddress);
    const requiredSigners = Ed25519KeyHashes.new();

    const keyhash = baseAddress?.payment_cred().to_keyhash();

    if (keyhash === undefined) throw new Error('keyhash is undefined');

    requiredSigners.add(keyhash);

    txBody.set_required_signers(requiredSigners);

    const tx = Transaction.new(
      txBody,
      TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes()),
    );

    if (API.current === undefined) throw new Error('API is undefined');

    let txVkeyWitnesses = await API.current.signTx(
      Buffer.from(tx.to_bytes()).toString('hex'),
      true,
    );
    txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(String(txVkeyWitnesses), 'hex'));

    const vkeys = txVkeyWitnesses.vkeys();

    if (vkeys === undefined) throw new Error('vkeys is undefined');

    transactionWitnessSet.set_vkeys(vkeys);

    const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

    const submittedTxHash = await API.current.submitTx(
      Buffer.from(signedTx.to_bytes()).toString('hex'),
    );
    setSubmittedTxHash(submittedTxHash);

    console.log('Transaction completed:', submittedTxHash);
  };

  return (
    <CardanoContext.Provider
      value={{
        status,
        wallets,
        pollWallets,
        refreshData,
        handleWalletSelect,
        walletInformations: {
          walletFound,
          walletIsEnabled,
          walletAPIVersion,
          walletName,
          networkId,
        },
        Utxos,
        balance,
        walletAddresses: { changeAddress, rewardAddress, usedAddress },
        transaction: {
          addressBech32SendADA,
          setAddressBech32SendADA,
          lovelaceToSend,
          setLovelaceToSend,
          buildSendADATransaction,
          submittedTxHash,
          setSubmittedTxHash,
          assetAmountToSend,
          setAssetAmountToSend,
          assetPolicyIdHex,
          setAssetPolicyIdHex,
          assetNameHex,
          setAssetNameHex,
          buildSendTokenTransaction,
          addressScriptBech32,
          setAddressScriptBech32,
          datumStr,
          setDatumStr,
          buildSendADAToPlutusScript,
          buildSendTokenToPlutusScript,
          plutusScriptCborHex,
          setPlutusScriptCborHex,
          transactionIdLocked,
          setTransactionIdLocked,
          transactionIndxLocked,
          setTransactionIndxLocked,
          lovelaceLocked,
          setLovelaceLocked,
          manualFee,
          setManualFee,
          buildRedeemADAFromPlutusScript,
          buildRedeemTokenFromPlutusScript,
        },
      }}
    >
      {children}
    </CardanoContext.Provider>
  );
};

export default CardanoContext;
export { CardanoContextProvider };
