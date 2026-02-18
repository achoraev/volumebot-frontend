import { buyHolders } from '@/lib/bot-api';

export const HoldersManager = ({ tokenAddress, setTokenAddress }: any) => (
    <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h2 className="text-sm uppercase text-slate-400 mb-4 font-bold">Holders Manager</h2>
        <div className="space-y-4">

            <button onClick={() => buyHolders(tokenAddress)}
                className="w-full py-2 bg-green-600 text-xs font-bold rounded hover:bg-green-500 transition-colors">
                Buy 30 holders with 0.01 SOL
            </button>
        </div>
    </section>
);