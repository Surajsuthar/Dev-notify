import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  // TODO: Validate signature using webhook secret
  console.log("Received GitHub webhook:", payload);
  // Handle issue events here
  return NextResponse.json({ received: true });
}
