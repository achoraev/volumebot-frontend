import { useEffect, useState } from 'react';
import { Wallet, ExternalLink, RefreshCw } from 'lucide-react';

export const WalletTracker = () => {
    const [wallets, setWallets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const fetchBalances = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/balances');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                
                const data = await res.json();
                
                if (Array.isArray(data)) {
                    setWallets(data);
                } else if (data && Array.isArray(data.wallets)) {
                    setWallets(data.wallets);
                }
                
            } catch (err) {
                console.error("❌ Wallet fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBalances();

        const interval = setInterval(fetchBalances, 10 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <Wallet size={16} className="text-cyan-400" /> CURRENT BATCH MAKERS
                </h3>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">
                    {wallets.length} ACTIVE
                </span>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                    <thead className="text-slate-500 bg-black/20 uppercase">
                        <tr>
                            <th className="p-3">Wallet Address</th>
                            <th className="p-3">SOL Balance</th>
                            <th className="p-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {wallets.map((w, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="p-3 font-mono text-slate-300">
                                    {w.address.slice(0, 4)}...{w.address.slice(-4)}
                                </td>
                                <td className="p-3 text-cyan-400 font-bold">
                                    {w.balance || '0.00'} SOL
                                </td>
                                <td className="p-3 text-right">
                                    <a href={`https://solscan.io/account/${w.address}`} target="_blank" className="text-slate-500 hover:text-white">
                                        <ExternalLink size={14} />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {wallets.length === 0 && (
                    <div className="p-8 text-center text-slate-600 italic">No active batch...</div>
                )}
            </div>
        </div>
    );
};