import { JsonRpcProvider } from "ethers"; // providers
import { formatUnits } from "ethers"; // utils
import { Contract } from "ethers"; // Contract

export const getTokenBalance = async (
  walletAddress: string,
  tokenAddress: string
): Promise<string> => {
  const provider = new JsonRpcProvider(process.env.INFURA_URL);
  const contract = new Contract(
    tokenAddress,
    ["function balanceOf(address account) external view returns (uint256)"],
    provider
  );

  const balance = await contract.balanceOf(walletAddress);
  return formatUnits(balance, 18);
};
