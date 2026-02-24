// import { useState } from 'react';
// import { Users, Send, AlertCircle, Loader2 } from 'lucide-react';
// import { buyHolders } from '@/lib/bot-api';

// export const HoldersManager = ({ tokenAddress }: any) => {
//     const [holderCount, setHolderCount] = useState(30);
//     const [buyAmount, setBuyAmount] = useState(0.001);
//     const [isProcessing, setIsProcessing] = useState(false);

//     const handleBuyHolders = async () => {
//         if (!tokenAddress) return alert("Please set a Token Address first.");
        
//         setIsProcessing(true);
//         try {
//             // Passing the custom fields to your API logic
//             await buyHolders(tokenAddress, { 
//                 count: holderCount, 
//                 amount: buyAmount 
//             });
//             alert(`Initiated ${holderCount} holder buys!`);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     return (
//         <section className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-5 shadow-xl">
//             <div className="flex items-center justify-between">
//                 <h2 className="text-sm uppercase text-indigo-400 font-bold flex items-center gap-2">
//                     <Users size={18} /> Holder Growth
//                 </h2>
//                 <span className="text-[10px] text-slate-500 font-mono">STABLE MODE</span>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                     <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Number of Holders</label>
//                     <input 
//                         type="number" 
//                         value={holderCount}
//                         onChange={(e) => setHolderCount(Number(e.target.value))}
//                         className="w-full bg-black border border-slate-800 rounded p-2 text-sm text-white outline-none focus:border-indigo-500 transition-all"
//                         placeholder="e.g. 50"
//                     />
//                 </div>
//                 <div className="space-y-1.5">
//                     <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Amount per Buy (SOL)</label>
//                     <input 
//                         type="number" 
//                         step="0.001"
//                         value={buyAmount}
//                         onChange={(e) => setBuyAmount(Number(e.target.value))}
//                         className="w-full bg-black border border-slate-800 rounded p-2 text-sm text-white outline-none focus:border-indigo-500 transition-all"
//                         placeholder="0.001"
//                     />
//                 </div>
//             </div>

//             <div className="bg-indigo-500/5 border border-indigo-500/20 p-3 rounded-lg flex gap-3">
//                 <AlertCircle size={16} className="text-indigo-400 shrink-0 mt-0.5" />
//                 <p className="text-[10px] text-slate-400 leading-relaxed">
//                     This will spawn <span className="text-indigo-300 font-bold">{holderCount}</span> unique wallets and perform <span className="text-indigo-300 font-bold">{buyAmount} SOL</span> buys to increase the holder count on Solscan/DexScreener.
//                 </p>
//             </div>

//             <button 
//                 onClick={handleBuyHolders}
//                 disabled={isProcessing || !tokenAddress}
//                 className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
//                     isProcessing 
//                     ? 'bg-indigo-900/40 text-indigo-300 cursor-not-allowed' 
//                     : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
//                 }`}
//             >
//                 {isProcessing ? (
//                     <><Loader2 size={16} className="animate-spin" /> EXECUTING BATCH...</>
//                 ) : (
//                     <><Send size={16} /> INITIATE GROWTH BATCH</>
//                 )}
//             </button>
            
//             <div className="text-center">
//                 <p className="text-[9px] text-slate-600 italic">Estimated Total: {(holderCount * buyAmount).toFixed(3)} SOL + fees</p>
//             </div>
//         </section>
//     );
// };