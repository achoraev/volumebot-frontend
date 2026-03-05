import { useEffect, useState } from 'react';
import { Send, Droplets, Users, ShieldCheck, Info } from 'lucide-react';


export function SolDistributor({ tokenAddress, onLog, userWallet }: { tokenAddress: string, onLog: (msg: string) => void, userWallet: any }) {
  const [amount, setAmount] = useState('0.1');
  const [walletType, setWalletType] = useState<'makers' | 'holders'>('makers');
  const [walletCount, setWalletCount] = useState(0);
  const [isDistributing, setIsDistributing] = useState(false);

  const fetchCount = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/wallet-count?type=${walletType}`);
      const data = await res.json();
      setWalletCount(data.count || 0);
    } catch (err) {
      console.log("Failed to fetch wallet count");
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, [walletType]);

  const totalCost = (parseFloat(amount) || 0) * walletCount;
  // Estimate gas (~0.000005 per txn)
  const estimatedGas = walletCount * 0.000005;

  const handleDistribute = async () => {
    if (!tokenAddress) return onLog("⚠️ Enter token address first");
    if (walletCount === 0) return alert("No wallets found in this group!");

    const confirmMsg = `Distribute ${totalCost.toFixed(5)} SOL to ${walletCount} wallets?`;
    if (!confirm(confirmMsg)) return;

    setIsDistributing(true);
    onLog(`💸 Distributing ${amount} SOL to ${walletType} wallets...`);

    try {
      const response = await fetch('http://localhost:4000/api/distribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          walletType: walletType // ✅ Passing the type to backend
        }),
      });

      const data = await response.json();
      alert(data.message || data.error);
    } catch (err) {
      alert("Network error. Is the backend running?");
    }

    setTimeout(() => {
      setIsDistributing(false);
      onLog(`✅ Distribution to ${walletType} complete.`);
    }, 1000);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Droplets size={16} className="text-blue-400" /> SOL Funding
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] text-slate-500 uppercase font-bold">Target Wallet Group</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => setWalletType('makers')}
              className={`py-2 text-[10px] font-bold rounded border transition-all flex items-center justify-center gap-2 ${walletType === 'makers'
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
            >
              <ShieldCheck size={12} /> MAKERS
            </button>
            <button
              onClick={() => setWalletType('holders')}
              className={`py-2 text-[10px] font-bold rounded border transition-all flex items-center justify-center gap-2 ${walletType === 'holders'
                ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
            >
              <Users size={12} /> HOLDERS
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-500 uppercase font-bold">Amount per Wallet (SOL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm mt-1 focus:border-cyan-500 outline-none text-white font-mono"
          />
        </div>

        <div className="bg-black/40 p-3 rounded-lg border border-slate-800 space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500 uppercase">Wallets to fund:</span>
            <span className="text-white font-bold">{walletCount}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500 uppercase">Total Distribution:</span>
            <span className="text-blue-400 font-mono font-bold">{totalCost.toFixed(4)} SOL</span>
          </div>
          <div className="flex justify-between text-[10px] border-t border-slate-800 pt-2 italic">
            <span className="text-slate-600 flex items-center gap-1"><Info size={10} /> Est. Gas Fee:</span>
            <span className="text-slate-600 font-mono">{estimatedGas.toFixed(6)} SOL</span>
          </div>
        </div>

        <button
          onClick={handleDistribute}
          disabled={isDistributing || walletCount === 0}
          className={`w-full text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${walletType === 'holders' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-blue-600 hover:bg-blue-500'
            } disabled:bg-slate-800`}
        >
          {isDistributing ? (
            "Processing..."
          ) : (
            <><Send size={14} /> Fund {walletType.toUpperCase()}</>
          )}
        </button>
      </div>
    </div>
  );
}