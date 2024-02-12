import { getAddressForFid } from "frames.js";
import { NextRequest, NextResponse } from "next/server";

const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
const QUEUE = "example";

export async function POST(_req: NextRequest) {
  // get the user fid from the request
  const fid = 1;

  // retrieve user address
  const accountAddress = await getAddressForFid({
    fid,
    options: {
      fallbackToCustodyAddress: true,
      hubRequestOptions: {
        headers: {
          api_key: process.env.NEYNAR_API_KEY!,
        },
      },
    },
  });

  // post the message in the queue, with or without deduplication
  await fetch(
    `https://qstash.upstash.io/v2/publish/${VERCEL_URL}/queues/${QUEUE}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Upstash-Deduplication-Id": `${accountAddress}`, // this sets the deduplication key to the user address, allowing that user to only put 1 message in the queue at a time
        //"Upstash-Content-Based-Deduplication": "true", // this enables content-based deduplication, so that the same message can't be put in the queue twice
        Authorization: `Bearer ${process.env.QSTASH_TOKEN!}`,
      },
      body: JSON.stringify({ address: accountAddress }),
    }
  );

  return NextResponse.json({ success: true });
}
