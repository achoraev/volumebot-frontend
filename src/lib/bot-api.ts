export const distributeFunds = async () => {
    if (!confirm("Send 0.02 SOL to ALL child wallets?")) return;
    const res = await fetch('http://localhost:4000/api/distribute', { method: 'POST' });
    return res.json();
};

export const withdrawFunds = async () => {
    if (!confirm("Pull all SOL back to Main Wallet?")) return;
    const res = await fetch('http://localhost:4000/api/withdraw', { method: 'POST' });
    return res.ok;
};

export const startBotAction = async (tokenAddress: string, settings: any) => {
    const response = await fetch('http://localhost:4000/api/start-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenAddress, settings }),
    });
    console.log("Bot start command sent successfully");
    return response;
};

export const stopBotAction = async (tokenAddress: string) => {
    const response = await fetch('http://localhost:4000/api/stop-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenAddress })
    });
    console.log("Bot stop command sent successfully");
    return response; 
};