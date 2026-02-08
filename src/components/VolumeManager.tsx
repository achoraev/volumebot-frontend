import { useState } from 'react';
import { Play, Square, Settings2 } from 'lucide-react';

export const VolumeManager = ({ 
    currentTokenAddress, 
    onStart, 
    onStop}: any) => {
    const [settings, setSettings] = useState({
        minAmount: 0.01,
        maxAmount: 0.05,
        dryRun: true,
        minBuys: 2,
        maxBuys: 5,
        minDelay: 10,
        maxDelay: 30
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
            <h2 className="text-cyan-400 font-bold flex items-center gap-2">
                <Settings2 size={20} /> VOLUME STRATEGY
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
                className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg ${
                    isRunning 
                        ? 'bg-red-500 hover:bg-red-600 shadow-red-900/20' 
                        : 'bg-green-600 hover:bg-green-500 shadow-green-900/20'
                }`}
            >
                {isRunning ? (
                    <><Square size={20} fill="white" /> STOP BOT</>
                ) : (
                    <><Play size={20} fill="white" /> START VOLUME BOT</>
                )}
            </button>
            
            {isRunning && (
                <div className="text-center animate-pulse text-xs text-green-400 font-mono">
                    ● BOT ACTIVE: Randomizing {settings.minBuys}-{settings.maxBuys} buys...
                </div>
            )}
        </div>
    );
};