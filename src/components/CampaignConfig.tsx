import { useState } from 'react';
import { withdrawFunds } from '@/lib/bot-api';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

export const CampaignConfig = ({ tokenAddress, setTokenAddress, userWallet }: any) => {
  const [loading, setLoading] = useState(false);

  const handleWithdrawAll = async () => {
    if (!tokenAddress) {
      alert("Please enter the Token Address first so the bot knows what to sell.");
      return;
    }

    if (!userWallet) return alert("Please connect your wallet first!");
    
    setLoading(true);

    if (!confirm("Are you sure? This will sell all tokens in ALL maker wallets and sweep SOL to Main.")) return;

    setLoading(true);
    try {
      const res = await withdrawFunds(tokenAddress, userWallet);

      if (res && res.ok) {
        alert("Mass withdrawal complete! Check logs for details.");
      } else {
        alert("Withdrawal failed. Check console.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xs uppercase text-slate-500 font-bold tracking-widest">Campaign Configuration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] text-slate-600 font-bold uppercase ml-1">Target Token Mint</label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-cyan-400 focus:border-cyan-500 outline-none transition-all mt-1"
            placeholder="Enter token mint address"
          />
        </div>

        <button 
          onClick={handleWithdrawAll} 
          disabled={loading || !tokenAddress}
          className="w-full py-3 bg-amber-600/10 border border-amber-600/30 text-amber-500 hover:bg-amber-600 hover:text-white disabled:opacity-30 disabled:hover:bg-amber-600/10 transition-all rounded-lg font-bold text-xs flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={14} className="animate-spin" /> EXECUTING MASS WITHDRAWAL...</>
          ) : (
            <><Trash2 size={14} /> WITHDRAW ALL (RECYCLE SOL)</>
          )}
        </button>
        
        <div className="flex gap-2 p-3 bg-slate-950 rounded border border-slate-800">
           <AlertTriangle size={16} className="text-amber-500 shrink-0" />
           <p className="text-[9px] text-slate-500 leading-tight">
             This will liquidate all sub-wallet positions for the specified mint and return funds to the main controller. Use this before switching tokens.
           </p>
        </div>
      </div>
    </section>
  );
};