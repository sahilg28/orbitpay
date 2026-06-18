import React, { useState } from 'react';
import { Wallet, Copy, Check, LogOut, Link } from './Icons';
import stellar from '../lib/stellar';

export default function WalletConnect({ publicKey, isConnected, onConnect, onDisconnect }) {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isConnected && publicKey) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-3.5 py-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
          </span>
          <span className="text-sm font-mono text-slate-300 hidden sm:inline">
            {stellar.formatAddress(publicKey)}
          </span>
          <button
            onClick={copyAddress}
            className="text-slate-500 hover:text-blue-400 transition-colors"
            title="Copy address"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        </div>
        <button
          onClick={onDisconnect}
          className="p-2 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
          title="Disconnect wallet"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="group flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 text-white"
    >
      <Link size={14} />
      <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Connect</span>
    </button>
  );
}
