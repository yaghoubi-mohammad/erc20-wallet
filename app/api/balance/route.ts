import { NextResponse } from "next/server";
import { getWalletBalance } from "@/utils/ethersHelper";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { message: "Wallet address is required" },
        { status: 400 }
      );
    }

    const infuraUrl = process.env.INFURA_URL;

    if (!infuraUrl) {
      return NextResponse.json(
        { message: "INFURA_URL is not configured" },
        { status: 500 }
      );
    }

    const balance = await getWalletBalance(walletAddress, infuraUrl);

    return NextResponse.json({ balance });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { message: "Error fetching wallet balance", error: (error as Error).message },
      { status: 500 }
    );
  }
}
