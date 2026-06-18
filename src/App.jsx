import React, { useState, useCallback, useEffect } from 'react';
import { Orbit, Wallet, ArrowUpRight, Activity, X, Link } from './components/Icons';
import stellar from './lib/stellar';
import WalletConnect from './components/WalletConnect';
import WalletCard from './components/WalletCard';
import SendPayment from './components/SendPayment';
import TransactionStatus from './components/TransactionStatus';

function Toast({ message, type, onClose }) {
  useEffect(function() {
    var t = setTimeout(onClose, 4000);
    return function() { clearTimeout(t); };
  }, [onClose]);
  var colors = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    error: 'bg-red-500/10 border-red-500/20 text-red-300',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
  };
  return (
    <div className={'animate-toast-in flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ' + colors[type]}>
      <p className="text-sm flex-1">{message}</p>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}

export default function App() {
  var _pk = useState(null);
  var publicKey = _pk[0]; var setPublicKey = _pk[1];
  var _conn = useState(false);
  var isConnected = _conn[0]; var setIsConnected = _conn[1];
  var _bal = useState(null);
  var balance = _bal[0]; var setBalance = _bal[1];
  var _load = useState(false);
  var loading = _load[0]; var setLoading = _load[1];
  var _tx = useState(null);
  var txResult = _tx[0]; var setTxResult = _tx[1];
  var _toasts = useState([]);
  var toasts = _toasts[0]; var setToasts = _toasts[1];

  var addToast = useCallback(function(message, type) {
    if (!type) type = 'info';
    var id = Date.now();
    setToasts(function(prev) { return prev.concat([{ id: id, message: message, type: type }]); });
  }, []);

  var removeToast = useCallback(function(id) {
    setToasts(function(prev) { return prev.filter(function(t) { return t.id !== id; }); });
  }, []);

  var fetchBalance = useCallback(async function(key) {
    try {
      var bal = await stellar.getBalance(key);
      setBalance(bal);
    } catch (e) {
      setBalance('0');
    }
  }, []);

  var handleConnect = async function() {
    try {
      var address = await stellar.connectWallet();
      setPublicKey(address);
      setIsConnected(true);
      setLoading(true);
      addToast('Wallet connected successfully', 'success');
      await fetchBalance(address);
      setLoading(false);
    } catch (err) {
      addToast(err.message || 'Failed to connect wallet.', 'error');
    }
  };

  var handleDisconnect = function() {
    stellar.disconnect();
    setPublicKey(null);
    setIsConnected(false);
    setBalance(null);
    setTxResult(null);
    addToast('Wallet disconnected', 'info');
  };

  var handleRefresh = async function() {
    if (!publicKey) return;
    setLoading(true);
    await fetchBalance(publicKey);
    setLoading(false);
  };

  var handleFund = async function() {
    if (!publicKey) return;
    setLoading(true);
    try {
      await stellar.fundWithFriendbot(publicKey);
      await fetchBalance(publicKey);
      addToast('Account funded with 10,000 XLM!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  var handleTxResult = function(result) {
    setTxResult(result);
    if (result && result.success) {
      addToast('Payment sent successfully!', 'success');
      handleRefresh();
    } else if (result && !result.success) {
      addToast(result.message || 'Transaction failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-orbitpay flex flex-col">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
        {toasts.map(function(t) {
          return <Toast key={t.id} message={t.message} type={t.type} onClose={function() { removeToast(t.id); }} />;
        })}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0B0F1A]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Orbit size={18} className="text-white" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold tracking-tight">
                <span className="text-gradient-blue">Orbit</span>
                <span className="text-white">Pay</span>
              </span>
              <span className="badge-testnet hidden sm:inline-block">Testnet</span>
            </div>
          </div>
          <WalletConnect
            publicKey={publicKey}
            isConnected={isConnected}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero (compact) ── */}
        <section className="px-5 sm:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="orbit-container mb-6 h-12">
              <div className="orbit-ring orbit-ring-1"></div>
              <div className="orbit-ring orbit-ring-2"></div>
              <Orbit size={24} className="text-blue-400 relative z-10" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">
              Send <span className="text-gradient-blue">Stellar</span> payments in seconds
            </h1>
            <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
              Connect your wallet, check your balance, and send XLM on the Stellar testnet.
            </p>
          </div>
        </section>

        {/* ── dApp Section ── */}
        <section className="px-5 sm:px-8 pb-10">
          <div className="max-w-xl mx-auto space-y-4">
            {isConnected ? (
              <React.Fragment>
                <div className="animate-slide-up">
                  <WalletCard
                    publicKey={publicKey}
                    balance={balance}
                    loading={loading}
                    onRefresh={handleRefresh}
                    onFund={handleFund}
                  />
                </div>
                <div className="animate-slide-up-delay">
                  <SendPayment onTxResult={handleTxResult} />
                </div>
                {txResult && (
                  <TransactionStatus
                    result={txResult}
                    onDismiss={function() { setTxResult(null); }}
                  />
                )}
              </React.Fragment>
            ) : (
              <div className="card-static p-8 sm:p-10 text-center glow-blue animate-fade-in">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center mb-5">
                  <Wallet size={24} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Connect your wallet to get started</h2>
                <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                  Link your Freighter wallet to view your balance and send XLM payments.
                </p>
                <button onClick={handleConnect} className="btn-primary">
                  <Link size={16} />
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="px-5 sm:px-8 pb-12">
          <div className="max-w-md mx-auto">
            <p className="text-center text-xs font-semibold text-slate-600 uppercase tracking-widest mb-6">How it works</p>
            <div className="flex flex-col items-center">
              {[
                { num: '1', title: 'Connect Wallet', desc: 'Link your Freighter wallet in one click', icon: Wallet },
                { num: '2', title: 'Fund with Friendbot', desc: 'Get free testnet XLM to experiment', icon: Activity },
                { num: '3', title: 'Send XLM', desc: 'Enter an address and amount — done in seconds', icon: ArrowUpRight },
              ].map(function(item, i) {
                return (
                  <React.Fragment key={item.num}>
                    {i > 0 && <div className="step-line"></div>}
                    <div className="flex items-center gap-4 w-full max-w-xs">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/8 border border-blue-500/10 flex items-center justify-center">
                        <item.icon size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-5 sm:px-8 py-5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-slate-600">Stellar Testnet &middot; No real funds</span>
          <div className="flex items-center gap-4">
            <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Stellar.org</a>
            <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Freighter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
