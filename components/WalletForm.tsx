"use client";

import React, { useState } from "react";
const api = process.env.NEXT_PUBLIC_API_URL!;

const tokens = [
  {
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    icon: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=023",
  },
  {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=023",
  },
  {
    symbol: "USDC",
    address: "0xA0b86991C6218b36C1d19D4a2E9Eb0CE3606EB48",
    decimals: 6,
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=023",
  },
];

const WalletForm = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balances, setBalances] = useState<{ symbol: string; balance: number; icon: string }[]>([]);

  const fetchBalances = async () => {
    try {
      const allBalances: { symbol: string; balance: number; icon: string }[] = [];

      // Fetch ETH Balance
      const ethResponse = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [walletAddress, "latest"],
          id: 1,
        }),
      });

      const ethData = await ethResponse.json();
      const ethBalanceInWei = parseInt(ethData.result, 16);
      const ethBalanceInEther = ethBalanceInWei / 10 ** 18;

      allBalances.push({
        symbol: "ETH",
        balance: ethBalanceInEther,
        icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023",
      });

      // Fetch Token Balances
      for (const token of tokens) {
        const tokenData = "0x70a08231" + walletAddress.replace("0x", "").padStart(64, "0");

        const tokenResponse = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_call",
            params: [
              {
                to: token.address,
                data: tokenData,
              },
              "latest",
            ],
            id: 1,
          }),
        });

        const tokenResult = await tokenResponse.json();
        const tokenBalanceInWei = parseInt(tokenResult.result, 16);
        const tokenBalance = tokenBalanceInWei / Math.pow(10, token.decimals);

        if (tokenBalance > 0) {
          allBalances.push({ symbol: token.symbol, balance: tokenBalance, icon: token.icon });
        }
      }

      setBalances(allBalances);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  return (
    <div className="min-h-screen bg-cyan-100 flex flex-col items-center justify-center py-10 px-5 gap-10">
      <p className="">Wallet Balance Checker</p>
      <div className="bg-cyan-500 shadow-md rounded-lg p-6 w-full max-w-4xl">
        <label className="block text-cyan-950 text-sm font-bold mb-2">Wallet Address</label>
        <div className="flex">
          <input
            type="text"
            placeholder="Enter Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="flex-grow px-4 py-2 border  bg-cyan-900  border-cyan-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-cyan-950 text-cyan-300"
          />
          <button
            onClick={fetchBalances}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Check
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="bg-cyan-500 shadow-md rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-cyan-950 ">Ethereum Balance</h2>
          {balances
            .filter((item) => item.symbol === "ETH")
            .map((item) => (
              <div key={item.symbol} className="flex items-center space-x-4">
                <img src={item.icon} alt={item.symbol} className="w-10 h-10 rounded-full" />
                <span className="text-gray-700 text-lg">
                  {item.balance.toFixed(4)} {item.symbol}
                </span>
              </div>
            ))}
        </div>
        <div className="bg-cyan-500 shadow-md rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-cyan-950 ">Token Balances</h2>
          {balances
            .filter((item) => item.symbol !== "ETH")
            .map((item) => (
              <div key={item.symbol} className="flex items-center space-x-4 mb-4">
                <img src={item.icon} alt={item.symbol} className="w-10 h-10 rounded-full" />
                <span className="text-gray-700 text-lg">
                  {item.balance.toFixed(4)} {item.symbol}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WalletForm;
