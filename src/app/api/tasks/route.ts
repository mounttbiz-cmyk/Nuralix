import { NextResponse } from "next/server";
import { db, DEFAULT_BUSINESS_ID } from "@/lib/db";

export async function GET() {
  try {
    const tasks = db
      .prepare("SELECT * FROM tasks WHERE business_id = ? ORDER BY created_at DESC")
      .all(DEFAULT_BUSINESS_ID) as any[];

    return NextResponse.json({
      success: true,
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        owner: t.owner,
        gap: t.gap,
        priority: t.priority,
        status: t.status, // 'todo' | 'in_progress' | 'done'
        createdAt: t.created_at,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, owner = "Founder", gap = "General Execution", priority = "medium", status = "todo" } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 });
    }

    const taskId = `task_${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO tasks (id, business_id, title, owner, gap, priority, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      taskId,
      DEFAULT_BUSINESS_ID,
      title.trim(),
      owner,
      gap,
      priority,
      status,
      now
    );

    return NextResponse.json({
      success: true,
      task: {
        id: taskId,
        title: title.trim(),
        owner,
        gap,
        priority,
        status,
        createdAt: now,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    if (!["todo", "in_progress", "done"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    db.prepare("UPDATE tasks SET status = ? WHERE id = ? AND business_id = ?").run(
      status,
      id,
      DEFAULT_BUSINESS_ID
    );

    return NextResponse.json({
      success: true,
      message: "Task updated",
      id,
      status,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
