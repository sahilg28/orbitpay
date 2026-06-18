import React, { useState } from 'react';
import { CheckCircle2, XCircle, Copy, Check, ExternalLink, X } from './Icons';
import stellar from '../lib/stellar';

export default function TransactionStatus({ result, onDismiss }) {
  const [copied, setCopied] = useState(false);

  var copyHash = async function() {
    if (!result || !result.hash) return;
    await navigator.clipboard.writeText(result.hash);
    setCopied(true);
    setTimeout(function() { setCopied(false); }, 2000);
  };

  if (!result) return null;

  return (
    <div className={'card p-5 animate-slide-up ' + (result.success ? 'glow-green border-emerald-500/15' : 'glow-red border-red-500/15')}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div className={'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ' + (result.success ? 'bg-emerald-500/10' : 'bg-red-500/10')}>
            {result.success ? (
              <CheckCircle2 size={20} className="text-emerald-400" />
            ) : (
              <XCircle size={20} className="text-red-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={'font-semibold text-sm ' + (result.success ? 'text-emerald-300' : 'text-red-300')}>
              {result.success ? 'Payment Sent Successfully' : 'Transaction Failed'}
            </h3>
            {result.success && result.hash ? (
              <div>
                <div className="flex items-center gap-2 mt-2 bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.04]">
                  <p className="text-xs text-slate-400 font-mono truncate flex-1">{result.hash}</p>
                  <button onClick={copyHash} className="flex-shrink-0 text-slate-500 hover:text-blue-400 transition-colors" title="Copy transaction hash">
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
                <a href={stellar.getExplorerUrl(result.hash)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mt-2.5 transition-colors">
                  View on Stellar Expert
                  <ExternalLink size={11} />
                </a>
              </div>
            ) : (
              <p className="text-xs text-red-400/80 mt-1">{result.message}</p>
            )}
          </div>
        </div>
        <button onClick={onDismiss} className="flex-shrink-0 p-1 text-slate-600 hover:text-slate-300 transition-colors ml-2">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
