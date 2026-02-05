// src/components/Distributor.tsx
import React, { useState } from 'react';

export function Distributor() {
  const [fundAmount, setFundAmount] = useState<number>(0.03);
  const [loading, setLoading] = useState(false);

  const handleDistribute = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/distribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: fundAmount }),
      });

      const data = await response.json();
      alert(data.message || data.error);
    } catch (err) {
      alert("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-lg">
      <h3 className="text-white font-bold mb-4">Worker Funding</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-slate-400 text-xs uppercase font-bold">SOL Amount per Worker</label>
        <input 
          type="number" 
          step="0.01"
          value={fundAmount}
          onChange={(e) => setFundAmount(parseFloat(e.target.value))}
          className="bg-slate-900 text-cyan-400 p-2 rounded border border-slate-700 outline-none focus:border-cyan-500"
        />
        
        <button 
          onClick={handleDistribute}
          disabled={loading}
          className={`mt-2 p-2 rounded font-bold text-white transition ${
            loading ? 'bg-slate-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          {loading ? 'Processing...' : `Distribute ${fundAmount} SOL Each`}
        </button>
      </div>
    </div>
  );
}