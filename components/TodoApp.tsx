"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  Edit2,
  X,
} from "lucide-react";
import { Todo, PRIORITY, STATUS } from "@/types/todo";
import { fetchTodos } from "@/lib/models/fetchers";
import { createTodo } from "@/lib/models/posters";
import { updateTodo } from "@/lib/models/puters";
import { deleteTodo } from "@/lib/models/deleters";

type Filter = "all" | "active" | "completed";

const STATUSES: STATUS[] = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const PRIORITIES: PRIORITY[] = ["LOW", "MEDIUM", "HIGH"];

const PRIORITY_COLORS: Record<PRIORITY, string> = {
  LOW: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
  MEDIUM:
    "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
  HIGH: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
};

const PRIORITY_ICONS: Record<PRIORITY, string> = {
  LOW: "📌",
  MEDIUM: "⚡",
  HIGH: "🔥",
};

const STATUS_ICONS: Record<STATUS, string> = {
  PENDING: "⏳",
  IN_PROGRESS: "🚀",
  COMPLETED: "✅",
  CANCELLED: "❌",
};

const STATUS_COLORS: Record<STATUS, string> = {
  PENDING: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
  IN_PROGRESS: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
  COMPLETED:
    "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
  CANCELLED: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
};

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<PRIORITY>("MEDIUM");
  const [status, setStatus] = useState<STATUS>("PENDING");
  const [dueDate, setDueDate] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch todos
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      const filters: Record<string, boolean | PRIORITY | STATUS> = {};
      if (filter !== "all") filters.completed = filter === "completed";
      if (priorityFilter) filters.priority = priorityFilter as PRIORITY;
      if (statusFilter) filters.status = statusFilter as STATUS;

      const data = await fetchTodos(
        filters as Parameters<typeof fetchTodos>[0]
      );
      setTodos(data);
    } catch (error) {
      console.error("Failed to load todos:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, statusFilter, priorityFilter]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Add or update todo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editingId) {
        await updateTodo(String(editingId), {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          dueDate: dueDate || undefined,
        });
        setEditingId(null);
      } else {
        await createTodo({
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          dueDate: dueDate || undefined,
        });
      }
      resetForm();
      loadTodos();
    } catch (error) {
      console.error("Failed to save todo:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setStatus("PENDING");
    setDueDate("");
    setEditingId(null);
  };

  // Toggle todo completion
  const handleToggle = async (todo: Todo) => {
    try {
      const newStatus = todo.status === "COMPLETED" ? "PENDING" : "COMPLETED";
      await updateTodo(String(todo.id), {
        status: newStatus,
        completed: newStatus === "COMPLETED",
      });
      loadTodos();
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  // Delete todo
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteTodo(String(id));
      loadTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  // Edit todo
  const handleEdit = (todo: Todo) => {
    setTitle(todo.title);
    setDescription(todo.description || "");
    setPriority(todo.priority as PRIORITY);
    setStatus(todo.status as STATUS);
    setDueDate(todo.dueDate ? todo.dueDate.split("T")[0] : "");
    setEditingId(todo.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (statusFilter && todo.status !== statusFilter) return false;
    if (priorityFilter && todo.priority !== priorityFilter) return false;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(
      (t) => t.status !== "COMPLETED" && t.status !== "CANCELLED"
    ).length,
    completed: todos.filter((t) => t.status === "COMPLETED").length,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-5xl font-bold bg-linear-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
            My Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {stats.active} active · {stats.completed} done · {stats.total} total
          </p>
        </div>

        {/* Add/Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="What's on your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PRIORITY)}
                className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_ICONS[p]} {p.charAt(0) + p.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as STATUS)}
                className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_ICONS[s]} {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
            >
              <Plus size={20} />
              {editingId ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-8 space-y-4">
          {/* Filter by completion */}
          <div className="flex flex-wrap gap-2">
            {(["all", "active", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Filter by status */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !statusFilter
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              }`}
            >
              All Status
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  STATUS_COLORS[s]
                } ${
                  statusFilter === s
                    ? "ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800"
                    : ""
                }`}
              >
                {STATUS_ICONS[s]} {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          {/* Filter by priority */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPriorityFilter("")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !priorityFilter
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              }`}
            >
              All Priorities
            </button>
            {PRIORITIES.map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(priorityFilter === p ? "" : p)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  PRIORITY_COLORS[p]
                } ${
                  priorityFilter === p
                    ? "ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800"
                    : ""
                }`}
              >
                {PRIORITY_ICONS[p]} {p.charAt(0) + p.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Todos List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              Loading tasks...
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-5xl mb-4">🎉</div>
              {todos.length === 0
                ? "No tasks yet. Add one to get started!"
                : "No tasks match your filters."}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-all transform hover:scale-[1.02] hover:shadow-lg ${
                  todo.status === "COMPLETED" ? "opacity-75" : ""
                } group`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggle(todo)}
                    className="shrink-0 mt-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {todo.status === "COMPLETED" ? (
                      <CheckCircle size={24} className="text-green-500" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p
                        className={`font-bold text-lg ${
                          todo.status === "COMPLETED"
                            ? "line-through text-gray-500 dark:text-gray-600"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {todo.title}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          PRIORITY_COLORS[todo.priority as PRIORITY]
                        }`}
                      >
                        {PRIORITY_ICONS[todo.priority as PRIORITY]}{" "}
                        {todo.priority}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          STATUS_COLORS[todo.status as STATUS]
                        }`}
                      >
                        {STATUS_ICONS[todo.status as STATUS]}{" "}
                        {todo.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    {todo.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {todo.description}
                      </p>
                    )}

                    {todo.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <Calendar size={14} />
                        {new Date(todo.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-600 dark:text-gray-400">
          <p>✨ Built with Next.js, Prisma & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}
