import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ success: true });

  res.cookies.set("auth", "", {
    expires: new Date(0),
    path: "/",
  });

  return res;
}
