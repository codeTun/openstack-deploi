import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken, JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Middleware to authenticate API requests
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ authenticated: true; user: JWTPayload } | { authenticated: false; response: NextResponse }> {
  const authHeader = request.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Authentication required. Please provide a valid token.' },
        { status: 401 }
      ),
    };
  }

  const user = verifyToken(token);

  if (!user) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Invalid or expired token. Please login again.' },
        { status: 401 }
      ),
    };
  }

  return {
    authenticated: true,
    user,
  };
}

/**
 * HOF to protect API routes with authentication
 */
export function withAuth<T>(
  handler: (request: NextRequest, context: T, user: JWTPayload) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: T): Promise<NextResponse> => {
    const authResult = await authenticateRequest(request);

    if (!authResult.authenticated) {
      return authResult.response;
    }

    return handler(request, context, authResult.user);
  };
}

