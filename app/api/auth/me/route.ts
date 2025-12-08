import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/middleware";

export async function GET(request: Request) {
  try {
    const userPayload = await getUserFromRequest(request);

    if (!userPayload) {
      return errorResponse("Unauthorized", 401);
    }

    // Fetch fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            todos: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse({
      user: {
        ...user,
        todosCount: user._count.todos,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return errorResponse("Failed to get user information", 500);
  }
}
