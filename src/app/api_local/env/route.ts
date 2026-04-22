import { NextResponse } from "next/server";

const ALLOWED_ENV = {
  WS_PORT: process.env.WS_PORT,
  API_URL: process.env.API_URL,
  WS_HOST: process.env.WS_HOST,
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Key required" }, { status: 400 });
  }

  const value = (ALLOWED_ENV as any)[key];

  if (!value) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ value });
}