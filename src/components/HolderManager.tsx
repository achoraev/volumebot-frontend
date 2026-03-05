import { useState, useEffect } from 'react';
import { Users, Send, Loader2, ExternalLink, RefreshCw, Wallet, ArrowDownToLine } from 'lucide-react';
import { buyHolders } from '@/lib/bot-api';

export const HolderManager = ({ tokenAddress, userWallet }: { tokenAddress: string, userWallet: any }) => {
    const [holderCount, setHolderCount] = useState(30);
    const [buyAmount, setBuyAmount] = useState(0.001);
    const [isProcessing, setIsProcessing] = useState(false);
    const [holderWallets, setHolderWallets] = useState<any[]>([]);
    const [loadingWallets, setLoadingWallets] = useState(false);

    const handleFullReclaim = async () => {
        if (!userWallet || !tokenAddress) return alert("Connect wallet and set Token Address!");
        if (!confirm("This will reclaim ALL Tokens and SOL from all holder wallets. Continue?")) return;
    
        setIsProcessing(true);
        try {
            await fetch('http://localhost:4000/api/reclaim-all', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    destination: userWallet, 
                    type: 'holders',
                    tokenMint: tokenAddress // Pass this to reclaim tokens too
                })
            });
            fetchHolderWallets();
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchHolderWallets = async () => {
        if (!tokenAddress) return;
        setLoadingWallets(true);
        try {
            const res = await fetch(`http://localhost:4000/api/holder-balances?tokenAddress=${tokenAddress}`);
            const data = await res.json();
            console.log("Fetched Holder Wallets:", data.wallets || data);

            setHolderWallets(Array.isArray(data) ? data : data.wallets || []);
        } catch (err) {
            console.log("❌ Failed to fetch holder wallets:", err);
        } finally {
            setLoadingWallets(false);
        }
    };

    useEffect(() => {
        fetchHolderWallets();
        const interval = setInterval(fetchHolderWallets, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleBuyHolders = async () => {
        if (!tokenAddress) return alert("Please set a Token Address first.");
        setIsProcessing(true);
        try {
            await buyHolders(tokenAddress, { count: holderCount, amount: buyAmount });
            setTimeout(fetchHolderWallets, 3000); // Refresh list after initiation
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* CONFIGURATION CARD */}
            <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-5 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm uppercase text-indigo-400 font-bold flex items-center gap-2">
                        <Users size={18} /> Holder Growth
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">New Holders</label>
                        <input
                            type="number"
                            value={holderCount}
                            onChange={(e) => setHolderCount(Number(e.target.value))}
                            className="w-full bg-black border border-slate-800 rounded p-2 text-sm text-white outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Amount (SOL)</label>
                        <input
                            type="number"
                            step="0.001"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(Number(e.target.value))}
                            className="w-full bg-black border border-slate-800 rounded p-2 text-sm text-white outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <button
                    onClick={handleBuyHolders}
                    disabled={isProcessing || !tokenAddress}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    INITIATE HOLDER BATCH
                </button>
            </section>

            {/* HOLDER WALLET LIST */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="p-4 bg-slate-800/30 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <Wallet size={14} className="text-indigo-400" /> Active Holder Wallets
                    </h3>
                    <div className="flex gap-4">
                        <button
                            onClick={handleFullReclaim}
                            className="text-[10px] text-orange-400 hover:text-orange-300 font-black uppercase flex items-center gap-1"
                        >
                            <ArrowDownToLine size={12} /> Sweep All to Main
                        </button>
                        <button onClick={fetchHolderWallets} className="text-slate-500 hover:text-white">
                            <RefreshCw size={12} className={loadingWallets ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                        <thead className="text-slate-500 bg-black/40 uppercase sticky top-0">
                            <tr>
                                <th className="p-3">Wallet</th>
                                <th className="p-3">SOL</th>
                                <th className="p-3">Tokens</th>
                                <th className="p-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 font-mono">
                            {holderWallets.map((w, i) => (
                                <tr key={i} className="hover:bg-indigo-500/5 transition-colors group">
                                    <td className="p-3 font-mono text-slate-400 flex items-center gap-2">
                                        {w.address.slice(0, 4)}...{w.address.slice(-4)}
                                        <a href={`https://solscan.io/account/${w.address}`} target="_blank" className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity">
                                            <ExternalLink size={10} />
                                        </a>
                                    </td>
                                    {/* Added SOL Column */}
                                    <td className="p-3 text-slate-300 font-medium">
                                        {Number(w.balance || 0).toFixed(4)} <span className="text-[9px] text-slate-500">SOL</span>
                                    </td>
                                    {/* Token Balance Column */}
                                    <td className="p-3 text-indigo-400 font-bold">
                                        {w.tokenBalance > 0 ? Number(w.tokenBalance).toLocaleString() : '0'}
                                    </td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${w.tokenBalance > 0 ? 'bg-green-500' : 'bg-slate-700'}`} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {holderWallets.length === 0 && !loadingWallets && (
                        <div className="p-8 text-center text-slate-600 italic text-[10px]">
                            No holder wallets found.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};