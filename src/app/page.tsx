"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Activity, Database } from 'lucide-react';

import { VolumeManager } from '../components/VolumeManager';
import { CampaignConfig } from '../components/CampaignConfig';
import { WalletTracker } from '../components/WalletTracker';
import { ProfitTracker } from '../components/ProfitTracker';
import { Stats } from '@/components/Stats';
import { startBotAction } from '@/lib/bot-api';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export default function Home() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const handleStart = async (settings: any) => {
    const res = await startBotAction(tokenAddress, settings);
    if (res.ok) setLogs(prev => [`[${new Date().toLocaleTimeString()}] 🚀 Bot Started`, ...prev]);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-bold text-cyan-400 flex gap-2"><Activity />SolanaVolumeBot</h1>
          <WalletMultiButtonDynamic />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column (4/12) */}
          <div className="md:col-span-4 space-y-6">
            <CampaignConfig tokenAddress={tokenAddress} setTokenAddress={setTokenAddress} />
            <VolumeManager currentTokenAddress={tokenAddress} onStart={handleStart} />
          </div>

          {/* Right Column (8/12) */}
          <div className="md:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WalletTracker />
              <ProfitTracker />
            </div>
            <Stats tokenAddress={tokenAddress}/>
            <ActivityLog logs={logs} />
          </div>
        </div>
      </div>
    </main>
  );
}

const ActivityLog = ({ logs }: { logs: string[] }) => (
  <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-64 overflow-y-auto">
    <h2 className="text-sm uppercase text-slate-400 mb-4 flex gap-2"><Database size={16}/> Live Activity</h2>
    <div className="font-mono text-[10px] space-y-1">
      {logs.map((log, i) => <p key={i} className="text-slate-300 border-l border-slate-700 pl-2">{log}</p>)}
    </div>
  </section>
);