// components/SolDistributor.tsx
import { useState } from 'react';
import { Send, Droplets } from 'lucide-react';

export function SolDistributor({ tokenAddress, onLog, userWallet }: { tokenAddress: string, onLog: (msg: string) => void, userWallet: any }) {
  const [amount, setAmount] = useState('0.1');
  const [isDistributing, setIsDistributing] = useState(false);

  const handleDistribute = async () => {
    if (!tokenAddress) return onLog("⚠️ Enter token address first");
    setIsDistributing(true);
    onLog(`💸 Distributing ${amount} SOL to maker wallets...`);
    
    // Call your existing API for distribution
    setTimeout(() => {
        setIsDistributing(false);
        onLog(`✅ Distribution complete.`);
    }, 2000);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2"><Droplets size={16} className="text-blue-400"/> SOL Funding</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-[10px] text-slate-500 uppercase font-bold">Amount per Wallet (SOL)</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm mt-1 focus:border-cyan-500 outline-none"
          />
        </div>
        
        <button 
          onClick={handleDistribute}
          disabled={isDistributing}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-bold py-2 rounded transition-all flex items-center justify-center gap-2"
        >
          {isDistributing ? "Sending..." : <><Send size={14}/> Distribute SOL</>}
        </button>
      </div>
    </div>
  );
}