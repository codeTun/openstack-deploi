import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  hashPassword,
  generateToken,
  isValidEmail,
  isValidPassword,
  createAuthCookie,
} from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/middleware";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      return errorResponse("Email, password, and name are required", 400);
    }

    if (!isValidEmail(email)) {
      return errorResponse("Invalid email format", 400);
    }

    if (!isValidPassword(password)) {
      return errorResponse(
        "Password must be at least 8 characters and contain letters and numbers",
        400
      );
    }

    if (name.trim().length < 2) {
      return errorResponse("Name must be at least 2 characters", 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse("User with this email already exists", 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name.trim(),
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Create response with auth cookie
    const response = successResponse(
      {
        message: "User registered successfully",
        user,
      },
      201
    );

    response.headers.set("Set-Cookie", createAuthCookie(token));

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse("Failed to register user", 500);
  }
}
