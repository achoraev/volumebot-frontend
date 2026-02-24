import { useState } from 'react';
import { Play, Square, Settings2, Zap, Wind, AlertTriangle } from 'lucide-react';

// ✅ Fixed Prop Signature
export const VolumeManager = ({ 
    currentTokenAddress, 
    onStart, 
    onStop 
}: { currentTokenAddress: string, onStart: (s: any) => void, onStop: () => void }) => {
    
    const [settings, setSettings] = useState({
        minAmount: 0.001,
        maxAmount: 0.002,
        targetMakers: 5,
        batchSize: 10,
        dryRun: true,
        minBuys: 1,
        maxBuys: 2,
        minDelay: 10,
        maxDelay: 20,
        mode: 'natural' // New field
    });

    const [isRunning, setIsRunning] = useState(false);

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleToggle = async () => {
        if (!isRunning) {
            if (!currentTokenAddress) return alert("Please set Token Address in Configuration first!");
            await onStart(settings);
            setIsRunning(true);
        } else {
            await onStop();
            setIsRunning(false);
        }
    };

    return (
        <div className={`bg-slate-900 p-6 rounded-xl border transition-all duration-500 ${isRunning ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-slate-800'}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-cyan-400 font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Settings2 size={18} /> Volume Engine
                </h2>
                {isRunning && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-cyan-500/10 rounded text-[10px] text-cyan-400 font-bold border border-cyan-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        LIVE
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* 1. TRADE SIZES */}
                <div className="space-y-3">
                    <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Trade Sizes (SOL)</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/40 p-2 rounded border border-slate-800">
                            <label className="text-[9px] text-slate-500 block mb-1">MIN</label>
                            <input type="number" step="0.001" value={settings.minAmount} onChange={(e) => updateSetting('minAmount', Number(e.target.value))} className="w-full bg-transparent text-sm outline-none text-white font-mono" />
                        </div>
                        <div className="bg-black/40 p-2 rounded border border-slate-800">
                            <label className="text-[9px] text-slate-500 block mb-1">MAX</label>
                            <input type="number" step="0.001" value={settings.maxAmount} onChange={(e) => updateSetting('maxAmount', Number(e.target.value))} className="w-full bg-transparent text-sm outline-none text-white font-mono" />
                        </div>
                    </div>
                </div>

                {/* 2. TIMING & FREQUENCY */}
                <div className="space-y-3">
                    <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Timing & Logic</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/40 p-2 rounded border border-slate-800">
                            <label className="text-[9px] text-slate-500 block mb-1">BUYS PER MAKER</label>
                            <div className="flex items-center gap-1">
                                <input type="number" value={settings.minBuys} onChange={(e) => updateSetting('minBuys', Number(e.target.value))} className="w-full bg-transparent text-sm outline-none" />
                                <span className="text-slate-700">-</span>
                                <input type="number" value={settings.maxBuys} onChange={(e) => updateSetting('maxBuys', Number(e.target.value))} className="w-full bg-transparent text-sm outline-none" />
                            </div>
                        </div>
                        <div className="bg-black/40 p-2 rounded border border-slate-800">
                            <label className="text-[9px] text-slate-500 block mb-1">DELAY (SEC)</label>
                            <div className="flex items-center gap-1">
                                <input type="number" value={settings.minDelay} onChange={(e) => updateSetting('minDelay', Number(e.target.value))} className="w-full bg-transparent text-sm outline-none" />
                                <span className="text-slate-700">-</span>
                                <input type="number" value={settings.maxDelay} onChange={(e) => updateSetting('maxDelay', Number(e.target.value))} className="w-full bg-transparent text-sm outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. TARGET MAKERS */}
                <div className="bg-black/40 p-3 rounded border border-slate-800">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] text-slate-500 font-bold uppercase">Total Target Makers</label>
                        <span className="text-cyan-400 font-mono text-xs">{settings.targetMakers} WALLETS</span>
                    </div>
                    <input 
                        type="range" min="5" max="100" 
                        value={settings.targetMakers} 
                        onChange={(e) => updateSetting('targetMakers', Number(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-3 accent-cyan-500"
                    />
                </div>

                {/* 4. TOGGLES */}
                <div className="flex flex-col gap-2">
                    <div className={`flex items-center gap-3 p-3 rounded border transition-colors cursor-pointer ${settings.dryRun ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-950 border-slate-800'}`} onClick={() => updateSetting('dryRun', !settings.dryRun)}>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.dryRun ? 'bg-amber-500' : 'bg-slate-700'}`}>
                            <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${settings.dryRun ? 'left-5' : 'left-1'}`} />
                        </div>
                        <span className={`text-[11px] font-bold uppercase ${settings.dryRun ? 'text-amber-500' : 'text-slate-500'}`}>Simulation Mode (Dry Run)</span>
                    </div>
                </div>

                {/* ACTION BUTTON */}
                <button 
                    onClick={handleToggle}
                    className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                        isRunning 
                        ? 'bg-red-500/10 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                        : 'bg-cyan-600 border border-cyan-400 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/20'
                    }`}
                >
                    {isRunning ? <><Square size={16} fill="currentColor" /> ABORT ENGINE</> : <><Play size={16} fill="currentColor" /> INITIATE STRATEGY</>}
                </button>
            </div>
        </div>
    );
};