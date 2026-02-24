import { useEffect, useState } from 'react';
import { Wallet, ExternalLink, ArrowDownToLine, Coins, Loader2 } from 'lucide-react';

export const WalletTracker = ({ tokenAddress, userWallet }: { tokenAddress: string, userWallet: any }) => {
    const [wallets, setWallets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchBalances = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/balances');
            const data = await res.json();
            setWallets(Array.isArray(data) ? data : data.wallets || []);
        } catch (err) {
            console.error("❌ Wallet fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalances();
        const interval = setInterval(fetchBalances, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleWithdraw = async (address: string, type: 'SOL' | 'TOKENS') => {
        setProcessingId(`${address}-${type}`);
        try {
            const endpoint = type === 'SOL' ? '/api/withdraw-sol' : '/api/withdraw-tokens';
            const res = await fetch(`http://localhost:4000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address,
                    mint: tokenAddress,
                    destination: userWallet
                })
            });

            if (res.ok) {
                console.log(`✅ ${type} Withdrawal initiated for ${address}`);
                setTimeout(fetchBalances, 2000); // Refresh after a short delay
            }
        } catch (err) {
            console.error(`❌ ${type} Withdrawal failed:`, err);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <Wallet size={16} className="text-cyan-400" /> BATCH MAKERS
                </h3>
                <button onClick={fetchBalances} className="text-slate-500 hover:text-white transition-colors">
                    <Loader2 size={14} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-500 bg-black/40 uppercase sticky top-0 z-10">
                        <tr>
                            <th className="p-3">Address</th>
                            <th className="p-3">SOL</th>
                            <th className="p-3">Tokens</th>
                            <th className="p-3 text-right">Reclaim</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {wallets.map((w, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                <td className="p-3 font-mono text-slate-400 flex items-center gap-2">
                                    {w.address.slice(0, 4)}...{w.address.slice(-4)}
                                    <a href={`https://solscan.io/account/${w.address}`} target="_blank" className="opacity-0 group-hover:opacity-100 text-cyan-500 transition-opacity">
                                        <ExternalLink size={10} />
                                    </a>
                                </td>
                                <td className="p-3 text-white font-medium">
                                    {parseFloat(w.balance).toFixed(3)}
                                </td>
                                <td className="p-3 text-cyan-400 font-bold">
                                    {w.tokenBalance > 0 ? parseFloat(w.tokenBalance).toLocaleString() : '0'}
                                </td>
                                <td className="p-3 text-right space-x-2">
                                    {/* Withdraw Tokens Button */}
                                    <button
                                        disabled={processingId !== null || !w.tokenBalance || w.tokenBalance === "0"}
                                        onClick={() => handleWithdraw(w.address, 'TOKENS')}
                                        className="p-1.5 rounded bg-slate-800 hover:bg-cyan-900/40 text-cyan-400 disabled:opacity-30 disabled:hover:bg-slate-800 transition-all"
                                        title="Sell & Reclaim Tokens"
                                    >
                                        {processingId === `${w.address}-TOKENS` ? <Loader2 size={12} className="animate-spin" /> : <Coins size={12} />}
                                    </button>

                                    {/* Withdraw SOL Button */}
                                    <button
                                        disabled={processingId !== null || w.balance < 0.001}
                                        onClick={() => handleWithdraw(w.address, 'SOL')}
                                        className="p-1.5 rounded bg-slate-800 hover:bg-orange-900/40 text-orange-400 disabled:opacity-30 disabled:hover:bg-slate-800 transition-all"
                                        title="Sweep SOL to Main"
                                    >
                                        {processingId === `${w.address}-SOL` ? <Loader2 size={12} className="animate-spin" /> : <ArrowDownToLine size={12} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {wallets.length === 0 && !loading && (
                    <div className="p-12 text-center">
                        <p className="text-slate-600 italic text-xs">No active maker wallets in current batch.</p>
                    </div>
                )}
            </div>
        </div>
    );
};