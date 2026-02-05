import React, { useEffect, useState } from 'react';

export function ProfitTracker() {
  const [stats, setStats] = useState({ totalFeesPaid: 0, totalTrades: 0, estimatedSolLoss: 0 });

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/stats');
        
        if (!res.ok) throw new Error("Stats API unavailable");

        const data = await res.json();

        if (isMounted && data) {
          setStats({
            totalTrades: data.totalTrades || 0,
            totalFeesPaid: data.totalFeesPaid || 0,
            estimatedSolLoss: data.estimatedSolLoss || 0
          });
        }
      } catch (err) {
        console.error("Stats Fetch Error:", err);
      }
    };

    const interval = setInterval(fetchStats, 5000);
    fetchStats();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
      <h3 className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-4">Live Statistics</h3>
      <div className="grid grid-cols-3 gap-4">
        <StatItem label="Trades" value={stats.totalTrades} />
        <StatItem label="Fees" value={`${stats.totalFeesPaid.toFixed(4)} SOL`} color="text-red-400" />
        <StatItem label="Cost" value={`~${stats.estimatedSolLoss.toFixed(4)} SOL`} color="text-orange-400" />
      </div>
    </div>
  );
}

const StatItem = ({ label, value, color = "text-white" }: any) => (
  <div>
    <p className="text-slate-500 text-[9px] uppercase font-bold">{label}</p>
    <p className={`text-lg font-mono font-bold ${color}`}>{value}</p>
  </div>
);