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

    const infuraUrl = process.env.INFURA_URL || ""; // آدرس Infura از فایل .env
    const balance = await getWalletBalance(walletAddress, infuraUrl);

    return NextResponse.json({ balance });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error fetching wallet balance",
        error: (error as Error).message,
      },
      { status: 500 }  
    );
  } 
}
