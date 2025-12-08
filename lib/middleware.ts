import { NextResponse } from "next/server";
import { getUserFromRequest, JWTPayload } from "./auth";

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

/**
 * Middleware to require authentication
 * Returns user payload if authenticated, or error response if not
 */
export async function requireAuth(
  request: Request
): Promise<{ user: JWTPayload } | NextResponse> {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Please login." },
      { status: 401 }
    );
  }

  return { user };
}

/**
 * Create a standardized error response
 */
export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Create a standardized success response
 */
export function successResponse(data: unknown, status: number = 200) {
  return NextResponse.json(data, { status });
}

