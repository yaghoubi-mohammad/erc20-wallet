"use client";

import React, { useState } from "react";

const WalletForm = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balances, setBalances] = useState<
    { symbol: string; balance: number }[]
  >([]);

  const fetchBalances = async () => {
    try {
      const response = await fetch("/api/balances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      });
  
      if (!response.ok) {
        console.error("Server error:", response.status, response.statusText);
        return;
      }
  
      const data = await response.json();
      setBalances(data.balances);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };
  

  return (
    <div>
      <h1>ERC-20 Wallet Token Balances</h1>
      <input
        type="text"
        placeholder="Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <button onClick={fetchBalances}>Check Balances</button>
      {balances.length > 0 && (
        <ul>
          {balances.map((token, index) => (
            <li key={index}>
              {token.symbol}: {token.balance}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WalletForm;
