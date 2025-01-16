import fetch from "node-fetch";

interface EthGetBalanceResponse {
  jsonrpc: string;
  id: number;
  result: string; 
}

export const getWalletBalance = async (
  walletAddress: string,
  infuraUrl: string
): Promise<number> => {
  try {
    const response = await fetch(infuraUrl, {
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

    const data = (await response.json()) as EthGetBalanceResponse;

  
    const balanceInWei = parseInt(data.result, 16); 
    const balanceInEther = balanceInWei / 10 ** 18; 
    return balanceInEther;
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    throw error;
  }
};
