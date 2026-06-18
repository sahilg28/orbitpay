import React, { useState } from 'react';
import { Send, Loader2 } from './Icons';
import stellar from '../lib/stellar';

export default function SendPayment({ onTxResult }) {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  var validate = function() {
    var e = {};
    if (!destination.trim()) e.destination = 'Recipient address is required';
    else if (!destination.trim().startsWith('G') || destination.trim().length !== 56)
      e.destination = 'Invalid Stellar address (must start with G, 56 characters)';
    if (!amount.trim()) e.amount = 'Amount is required';
    else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)
      e.amount = 'Enter a valid amount greater than 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  var handleSubmit = async function(e) {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      var hash = await stellar.sendPayment(destination.trim(), amount.trim());
      onTxResult({ success: true, hash: hash });
      setDestination('');
      setAmount('');
      setErrors({});
    } catch (err) {
      var msg = (err && err.response && err.response.data && err.response.data.extras && err.response.data.extras.result_codes && err.response.data.extras.result_codes.operations && err.response.data.extras.result_codes.operations[0]) || err.message || 'Transaction failed.';
      onTxResult({ success: false, message: String(msg) });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
          <Send size={14} className="text-blue-400" />
        </div>
        Send Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
            Recipient Address
          </label>
          <input
            type="text"
            value={destination}
            onChange={function(ev) { setDestination(ev.target.value); setErrors(function(p) { return Object.assign({}, p, {destination: undefined}); }); }}
            placeholder="GABC...XYZ"
            className={'w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 font-mono text-sm transition-all duration-200 ' + (errors.destination ? 'border-red-500/40' : 'border-white/[0.08]')}
          />
          {errors.destination && (
            <p className="mt-1.5 text-xs text-red-400">{errors.destination}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              step="any"
              min="0"
              value={amount}
              onChange={function(ev) { setAmount(ev.target.value); setErrors(function(p) { return Object.assign({}, p, {amount: undefined}); }); }}
              placeholder="0.00"
              className={'w-full bg-white/[0.03] border rounded-xl px-4 py-3 pr-16 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 text-sm transition-all duration-200 ' + (errors.amount ? 'border-red-500/40' : 'border-white/[0.08]')}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-400">
              XLM
            </span>
          </div>
          {errors.amount && (
            <p className="mt-1.5 text-xs text-red-400">{errors.amount}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={sending || !destination || !amount}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/15 disabled:shadow-none text-white"
        >
          {sending ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Confirming in wallet...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send size={15} />
              Send XLM
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
