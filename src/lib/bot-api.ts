export const distributeFunds = async () => {
    if (!confirm("Send 0.02 SOL to ALL child wallets?")) return;
    const res = await fetch('http://localhost:4000/api/distribute', { method: 'POST' });
    return res.json();
};

export const withdrawFunds = async (tokenAddress: string, userWallet: string) => {
    if (!confirm("Pull all SOL back to Main Wallet?")) return;

    const response = await fetch('http://localhost:4000/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            tokenAddress, 
            destinationWallet: userWallet
        }),
    });

    return response;
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

export const buyHolders = async (tokenAddress: string, settings: { count: number, amount: number }) => {
    if (!confirm(`Initiate buys for ${settings.count} holders at ${settings.amount} SOLs each?`)) return;
    if (!tokenAddress) return alert("Please set a Token Address first.");
    if (settings.count <= 0 || settings.amount <= 0) return alert("Please enter valid holder count and amount.");
    if (settings.amount > 1) return alert("Amount per buy should be 1 SOL or less for safety.");
    if (settings.count > 100) return alert("Buying more than 100 holders at once may cause issues. Please reduce the count.");
    return await fetch('http://localhost:4000/api/holders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenAddress, ...settings }),
    });
};