"use client";
import { useEffect, useState } from 'react';

export function WalletTracker() {
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
        const interval = setInterval(fetchBalances, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-8 bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase">Worker Wallet Status</h3>
                {loading && <span className="text-[10px] text-blue-400 animate-pulse">Updating...</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {wallets.length > 0 ? (
                    wallets.map((w, i) => (
                        <div key={w.address || i} className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800 text-xs">
                            <span className="text-slate-500 font-mono">
                                {w.address ? `${w.address.slice(0, 4)}...${w.address.slice(-4)}` : 'Unknown'}
                            </span>
                            <span className={w.balance < 0.01 ? "text-red-400 font-bold" : "text-green-400"}>
                                {typeof w.balance === 'number' ? w.balance.toFixed(4) : '0.0000'} SOL
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-4 text-slate-600 text-xs italic">
                        {loading ? "Loading wallets..." : "No wallets found. Check backend logs."}
                    </div>
                )}
            </div>
        </div>
    );
}