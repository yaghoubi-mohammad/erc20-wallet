"use client";

import React, { useState } from "react";

const WalletForm = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);

  // آدرس Infura
  const INFURA_URL =
    "https://mainnet.infura.io/v3/b84cac530ad24aeaa19de6dd1646ff15";

  const fetchBalance = async () => {
    try {
      // ارسال درخواست به Infura
      const response = await fetch(INFURA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [walletAddress, "latest"], // آدرس کیف پول و آخرین بلاک
          id: 1,
        }),
      });

      if (!response.ok) {
        console.error("Error:", response.status, response.statusText);
        return;
      }

      const data = await response.json();

      if (data.error) {
        console.error("Error in response:", data.error.message);
        return;
      }

      // تبدیل هگزادسیمال به دسیمال (Ether)
      const balanceInWei = parseInt(data.result, 16);
      const balanceInEther = balanceInWei / 10 ** 18;

      setBalance(balanceInEther);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return (
    <div>
      <h1>Ethereum Wallet Balance Checker</h1>
      <input
        type="text"
        placeholder="Enter Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <button onClick={fetchBalance}>Check Balance</button>
      {balance !== null && <p>Balance: {balance} ETH</p>}
    </div>
  );
};

export default WalletForm;
