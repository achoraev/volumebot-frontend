import { distributeFunds, withdrawFunds } from '@/lib/bot-api';
import { Distributor } from '../components/Distributor';

export const CampaignConfig = ({ tokenAddress, setTokenAddress }: any) => (
  <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
    <h2 className="text-sm uppercase text-slate-400 mb-4 font-bold">Campaign Config</h2>
    <div className="space-y-4">
      <input 
        type="text" 
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm focus:border-cyan-500 outline-none"
        placeholder="Token Mint Address..."
      />
      <Distributor />
      <button onClick={withdrawFunds} className="w-full py-2 bg-amber-600 text-xs font-bold rounded">
        WITHDRAW ALL
      </button>
    </div>
  </section>
);