import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { successResponse } from "@/lib/middleware";

export async function POST() {
  const response = successResponse({ message: "Logged out successfully" });
  response.headers.set("Set-Cookie", clearAuthCookie());
  return response;
}

