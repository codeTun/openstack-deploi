import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all todos with optional filters
export async function GET(req: NextRequest) {
  try {
    const completed = req.nextUrl.searchParams.get("completed");
    const priority = req.nextUrl.searchParams.get("priority");
    const status = req.nextUrl.searchParams.get("status");

    const where: any = {};
    if (completed !== null) where.completed = completed === "true";
    if (priority) where.priority = priority.toUpperCase();
    if (status) where.status = status.toUpperCase();

    const todos = await prisma.todo.findMany({
      where,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("GET /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// Create a new todo
export async function POST(req: NextRequest) {
  try {
    const {
      title,
      description,
      status = "PENDING",
      priority = "MEDIUM",
      dueDate,
    } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("POST /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
