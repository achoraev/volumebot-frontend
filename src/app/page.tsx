"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Activity, Database, Target, Zap } from 'lucide-react';

import { VolumeManager } from '../components/VolumeManager';
import { CampaignConfig } from '../components/CampaignConfig';
import { WalletTracker } from '../components/WalletTracker';
import { ProfitTracker } from '../components/ProfitTracker';
import { Stats } from '@/components/Stats';
import { startBotAction, stopBotAction } from '@/lib/bot-api';
import { HolderManager } from '@/components/HolderManager';
import { SolDistributor } from '@/components/SolDistributor';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  const { publicKey, connected } = useWallet();
  const [tokenAddress, setTokenAddress] = useState('');

  const [logs, setLogs] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const savedLogs = localStorage.getItem('bot_logs');
      return savedLogs ? JSON.parse(savedLogs) : [];
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'volume' | 'holders'>('volume');

  // Persistent Logs Handling
  useEffect(() => {
    const savedLogs = localStorage.getItem('bot_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem('bot_logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 100));
  };

  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem('bot_logs');
  };

  const handleStart = async (settings: any) => {
    try {
      const res = await startBotAction(tokenAddress, settings);
      if (res.ok) {
        addLog(`🚀 Bot Started: ${tokenAddress.slice(0, 6)}...`);
      } else {
        const errorData = await res.json();
        addLog(`❌ Start Failed: ${errorData.message || 'Unknown Error'}`);
      }
    } catch (err) {
      addLog(`⚠️ Connection Error: Server unreachable`);
    }
  };

  const handleStop = async () => {
    addLog("🛑 Volume Engine Stopped")
    const res = await stopBotAction(tokenAddress);
    if (res.ok) {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] 🛑 Bot Stopped`, ...prev]);
    } else {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] ⚠️ Stop failed: Loop not found`, ...prev]);
    }
  };

  const ActivityLog = ({ logs }: { logs: string[] }) => (
    <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-64 overflow-y-auto">
      <h2 className="text-sm uppercase text-slate-400 mb-4 flex gap-2"><Database size={16} /> Live Activity</h2>
      <div className="font-mono text-[10px] space-y-1">
        {logs.map((log, i) => <p key={i} className="text-slate-300 border-l border-slate-700 pl-2">{log}</p>)}
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">

      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 p-2 rounded-lg">
            <Activity className="text-cyan-400" size={32} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">SolanaVolumeBot <span className="text-cyan-500 text-xs ml-2">v3.0</span></h1>
            <p className="text-slate-500 text-xs">High-Frequency Market Making & Holder Growth</p>
          </div>
        </div>
        <WalletMultiButtonDynamic />
      </header>

      {!connected && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-2 text-center text-xs text-amber-500 mb-4 rounded">
          ⚠️ Wallet not connected. Some management features may be disabled.
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: Config & Wallet Ops (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            <CampaignConfig tokenAddress={tokenAddress} setTokenAddress={setTokenAddress} userWallet={publicKey?.toBase58()} />
            <SolDistributor tokenAddress={tokenAddress} onLog={addLog} userWallet={publicKey?.toBase58()} />
            <WalletTracker tokenAddress={tokenAddress} userWallet={publicKey?.toBase58()} />
          </div>

          {/* MIDDLE: Strategy Management with TABS (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tab Switcher */}
            <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('volume')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'volume' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                <Zap size={14} /> VOLUME ENGINE
              </button>
              <button
                onClick={() => setActiveTab('holders')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'holders' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                <Target size={14} /> HOLDER GROWTH
              </button>
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">
              {activeTab === 'volume' ? (
                <VolumeManager
                  currentTokenAddress={tokenAddress}
                  onStart={handleStart}
                  onStop={handleStop}
                />
              ) : (
                <HolderManager tokenAddress={tokenAddress} userWallet={publicKey?.toBase58()} />
              )}
            </div>
          </div>

          {/* RIGHT: Stats & Logs (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            <ProfitTracker />
            <Stats tokenAddress={tokenAddress} />
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