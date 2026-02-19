import { useState } from 'react';
import { Play, Square, Settings2 } from 'lucide-react';

export const VolumeManager = ({ 
    currentTokenAddress, 
    onStart, 
    onStop}: any) => {
    const [settings, setSettings] = useState({
        minAmount: 0.001,
        maxAmount: 0.002,
        targetMakers: 3,
        batchSize: 10,
        dryRun: true,
        minBuys: 1,
        maxBuys: 2,
        minDelay: 10,
        maxDelay: 20
    });

    const [isRunning, setIsRunning] = useState(false);

    const handleToggle = async () => {
        if (!isRunning) {
            await onStart(settings);
            setIsRunning(true);
        } else {
            await onStop();
            setIsRunning(false);
        }
    };

    return (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6 shadow-xl">
            <h2 className="text-cyan-400 font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                <Settings2 size={18} /> Volume & Maker Strategy
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-bold">MIN AMOUNT (SOL)</label>
                    <input 
                        type="number" 
                        value={settings.minAmount}
                        onChange={(e) => setSettings({...settings, minAmount: Number(e.target.value)})}
                        className="bg-black border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-bold">MAX AMOUNT (SOL)</label>
                    <input 
                        type="number" 
                        value={settings.maxAmount}
                        onChange={(e) => setSettings({...settings, maxAmount: Number(e.target.value)})}
                        className="bg-black border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Target Total Makers</label>
                    <input 
                        type="number" 
                        value={settings.targetMakers}
                        onChange={(e) => setSettings({...settings, targetMakers: Number(e.target.value)})}
                        className="bg-black border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-bold">MIN BUYS (SOL)</label>
                    <input 
                        type="number" 
                        value={settings.minBuys}
                        onChange={(e) => setSettings({...settings, minBuys: Number(e.target.value)})}
                        className="bg-black border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-bold">MAX BUYS (SOL)</label>
                    <input 
                        type="number" 
                        value={settings.maxBuys}
                        onChange={(e) => setSettings({...settings, maxBuys: Number(e.target.value)})}
                        className="bg-black border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-bold">MIN DELAYS (sec)</label>
                    <input 
                        type="number" 
                        value={settings.minDelay}
                        onChange={(e) => setSettings({...settings, minDelay: Number(e.target.value)})}
                        className="bg-black border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-500 font-bold">MAX DELAYS (sec)</label>
                    <input 
                        type="number" 
                        value={settings.maxDelay}
                        onChange={(e) => setSettings({...settings, maxDelay: Number(e.target.value)})}
                        className="bg-black border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-yellow-900/20 border border-yellow-700/50 rounded">
                <input 
                    type="checkbox" 
                    checked={settings.dryRun} 
                    onChange={(e) => setSettings({...settings, dryRun: e.target.checked})}
                    id="dryRunToggle"
                />
                <label htmlFor="dryRunToggle" className="text-yellow-500 text-sm font-bold">
                    Enable Dry Run (Simulated Trading)
                </label>
            </div>

            <button 
                onClick={handleToggle}
                className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all ${
                    isRunning ? 'bg-red-500' : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20'
                }`}
            >
                {isRunning ? <><Square size={20} fill="white" /> STOP CAMPAIGN</> : <><Play size={20} fill="white" /> START CAMPAIGN</>}
            </button>
            
            {isRunning && (
                <div className="text-center animate-pulse text-xs text-green-400 font-mono">
                    ● BOT ACTIVE: Randomizing {settings.minBuys}-{settings.maxBuys} buys...
                </div>
            )}

            {/* {isRunning && (
                <div className="flex items-center justify-center gap-2 text-xs text-cyan-400 font-mono italic">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    Rotating batches of {settings.batchSize} wallets...
                </div>
            )} */}
        </div>
    );
};