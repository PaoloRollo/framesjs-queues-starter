import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

async function handler(req: NextRequest) {
  // get the address from the request body
  const { address } = await req.json();

  // verify here that the user did not already perform the action
  // you could call a contract, your cache, a database, or w/e
  if (address === "0x123") {
    console.log("User already performed this action");
    return NextResponse.json(
      { error: "User already performed this action" },
      { status: 400 }
    );
  }

  // perform the mint or what you need to do here
  // ...

  console.log("Success: ", req.body);
  return NextResponse.json(req.body);
}

export const POST = verifySignatureAppRouter(handler);
