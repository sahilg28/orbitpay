import {
  isConnected,
  requestAccess,
  getPublicKey,
  signTransaction,
} from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

const NETWORK = 'TESTNET';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const FRIENDBOT_URL = 'https://friendbot.stellar.org';

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

class StellarHelper {
  constructor() {
    this.publicKey = null;
  }

  async connectWallet() {
    const connResult = await isConnected();
    const connected =
      typeof connResult === 'boolean' ? connResult : connResult?.isConnected;

    if (!connected) {
      throw new Error(
        'Freighter not found. Install it from freighter.app and refresh the page.'
      );
    }

    const accessResult = await requestAccess();
    if (accessResult?.error) {
      throw new Error(accessResult.error);
    }

    const keyResult = await getPublicKey();
    const key =
      typeof keyResult === 'string' ? keyResult : keyResult?.publicKey;

    if (!key) {
      throw new Error('Could not get public key from Freighter.');
    }

    this.publicKey = key;
    return key;
  }

  disconnect() {
    this.publicKey = null;
  }

  async getBalance(address) {
    try {
      const account = await server.loadAccount(address);
      const native = account.balances.find((b) => b.asset_type === 'native');
      return native ? native.balance : '0';
    } catch (err) {
      if (err?.response?.status === 404) {
        return '0';
      }
      throw err;
    }
  }

  async fundWithFriendbot(address) {
    const res = await fetch(`${FRIENDBOT_URL}?addr=${address}`);
    if (!res.ok) {
      throw new Error(
        'Friendbot funding failed. Account may already be funded — try refreshing.'
      );
    }
    return true;
  }

  async sendPayment(destination, amount) {
    if (!this.publicKey) throw new Error('Wallet not connected.');

    if (!StellarSdk.StrKey.isValidEd25519PublicKey(destination)) {
      throw new Error('Invalid Stellar address. It should start with G.');
    }

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      throw new Error('Enter a valid amount greater than 0.');
    }

    // Check if destination account exists on the network
    let destinationExists = true;
    try {
      await server.loadAccount(destination);
    } catch (err) {
      if (err?.response?.status === 404) {
        destinationExists = false;
      } else {
        throw err;
      }
    }

    const account = await server.loadAccount(this.publicKey);
    const fee = await server.fetchBaseFee();

    // Use createAccount for new accounts, payment for existing ones
    const operation = destinationExists
      ? StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount: parsed.toFixed(7),
        })
      : StellarSdk.Operation.createAccount({
          destination,
          startingBalance: parsed.toFixed(7),
        });

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: String(fee),
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(180)
      .build();

    const xdr = transaction.toXDR();

    const signedResult = await signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
      network: NETWORK,
    });

    const signedXdr =
      typeof signedResult === 'string'
        ? signedResult
        : signedResult?.signedTxXdr || signedResult;

    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_PASSPHRASE
    );

    const result = await server.submitTransaction(signedTx);
    return result.hash;
  }

  getExplorerUrl(hash) {
    return `https://stellar.expert/explorer/testnet/tx/${hash}`;
  }

  formatAddress(addr) {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  }
}

const stellar = new StellarHelper();
export default stellar;
