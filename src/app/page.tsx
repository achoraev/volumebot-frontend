"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Activity, Database } from 'lucide-react';

import { VolumeManager } from '../components/VolumeManager';
import { CampaignConfig } from '../components/CampaignConfig';
import { WalletTracker } from '../components/WalletTracker';
import { ProfitTracker } from '../components/ProfitTracker';
import { Stats } from '@/components/Stats';
import { startBotAction, stopBotAction } from '@/lib/bot-api';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export default function Home() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [logs, setLogs] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const savedLogs = localStorage.getItem('bot_logs');
      return savedLogs ? JSON.parse(savedLogs) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('bot_logs', JSON.stringify(logs));
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem('bot_logs');
  };
  
  const handleStart = async (settings: any) => {
    try {
        const res = await startBotAction(tokenAddress, settings);
        if (res.ok) {
            setLogs(prev => [`[${new Date().toLocaleTimeString()}] 🚀 Bot Started: ${tokenAddress.slice(0, 6)}...`, ...prev]);
        } else {
            // Log the actual error from the server
            const errorData = await res.json();
            setLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ Start Failed: ${errorData.message || 'Unknown Error'}`, ...prev]);
        }
    } catch (err) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ⚠️ Connection Error: Server unreachable`, ...prev]);
    }
  };

  const handleStop = async () => {
    const res = await stopBotAction(tokenAddress);
    if (res.ok) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] 🛑 Bot Stopped`, ...prev]);
    } else {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ⚠️ Stop failed: Loop not found`, ...prev]);
    }
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
            <VolumeManager currentTokenAddress={tokenAddress} onStart={handleStart} onStop={handleStop} />
          </div>

          {/* Right Column (8/12) */}
          <div className="md:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WalletTracker />
              <ProfitTracker />
            </div>
            <Stats tokenAddress={tokenAddress}/>
            <div className="md:col-span-8 space-y-6">
              <div className="relative">
                  <button 
                      onClick={clearLogs}
                      className="absolute right-4 top-4 text-[10px] text-slate-500 hover:text-red-400 transition-colors"
                  >
                      CLEAR LOGS
                  </button>
                  <ActivityLog logs={logs} />
              </div>
          </div>
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
      {logs.map((log, i) => (
        <p key={i} className={`pl-2 border-l border-slate-700 ${
            log.includes('❌') ? 'text-red-400' : 
            log.includes('🚀') ? 'text-green-400' : 
            'text-slate-300'
        }`}>
          {log}
        </p>
      ))}
    </div>
  </section>
);