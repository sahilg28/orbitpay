import React, { useState } from 'react';
import { Wallet, Copy, Check, RefreshCw, Coins } from './Icons';
import stellar from '../lib/stellar';

export default function WalletCard({ publicKey, balance, loading, onRefresh, onFund }) {
  const [copied, setCopied] = useState(false);

  var displayBalance = balance !== null
    ? parseFloat(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
    : '—';

  var isZero = balance === '0' || balance === '0.0000000';

  var copyAddress = async function() {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(function() { setCopied(false); }, 2000);
  };

  return (
    <div className="card p-6 glow-blue">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
            <Wallet size={18} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Connected Wallet</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-mono text-slate-300">{stellar.formatAddress(publicKey)}</span>
              <button
                onClick={copyAddress}
                className="text-slate-600 hover:text-blue-400 transition-colors"
                title="Copy full address"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
          </span>
          <span className="text-xs text-emerald-400 font-medium">Connected</span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Balance</p>
          <div className="flex items-baseline gap-2">
            <span className={'text-4xl font-bold tracking-tight ' + (loading ? 'shimmer text-slate-600' : 'text-white')}>
              {loading ? '...' : displayBalance}
            </span>
            <span className="text-lg font-semibold text-blue-400">XLM</span>
          </div>
          <span className="badge-testnet mt-2 inline-block">Stellar Testnet</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 rounded-xl text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 disabled:text-slate-700 transition-all duration-200"
          title="Refresh balance"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isZero && (
        <button
          onClick={onFund}
          disabled={loading}
          className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 hover:bg-emerald-500/15 hover:border-emerald-500/30 disabled:opacity-40 transition-all duration-200"
        >
          <Coins size={15} />
          {loading ? 'Funding account...' : 'Fund with Friendbot — Get 10,000 XLM'}
        </button>
      )}
    </div>
  );
}
