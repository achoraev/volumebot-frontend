import { useState, useEffect } from 'react';

export function Stats({ tokenAddress }: { tokenAddress: string }) {

    const [pnl, setPnl] = useState({ sol: 0, percent: 0 });

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/stats?token=${tokenAddress}`);
                const data = await res.json();
                
                if (data && data.simulatedPnl) {
                    setPnl(data.simulatedPnl);
                }
            } catch (err) {
                console.error("Stats fetch failed", err);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [tokenAddress]);

    const solValue = pnl?.sol || 0;
    const percentValue = pnl?.percent || 0;

    return (
        <div className="mt-4 p-4 border border-slate-700 rounded bg-slate-900">
            <h4 className="text-xs font-bold text-slate-500 uppercase text-slate-400">
                Simulated Performance
            </h4>
            <div className={`text-2xl font-mono ${solValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {solValue >= 0 ? '+' : ''}{solValue.toFixed(4)} SOL
            </div>
            <div className="text-sm text-slate-400">
                ROI: {percentValue.toFixed(2)}%
            </div>
        </div>
    );
}