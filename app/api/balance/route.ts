import { NextResponse } from "next/server";
import { getTokenBalance } from "@/utils/ethersHelper";

export async function POST(request: Request) {
  const body = await request.json();
  const { walletAddress, tokenAddress } = body;

  if (!walletAddress || !tokenAddress) {
    return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
  }

  try {
    const balance = await getTokenBalance(walletAddress, tokenAddress);
    return NextResponse.json({ balance });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching balance", error: (error as Error).message },
      { status: 500 }
    );
  }
}
