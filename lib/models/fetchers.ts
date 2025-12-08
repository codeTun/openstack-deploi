import { Todo, STATUS, PRIORITY } from "@/types/todo";

interface FetchTodosParams {
  completed?: boolean;
  status?: STATUS;
  priority?: PRIORITY;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
  };
}

export async function fetchTodos(params?: FetchTodosParams): Promise<Todo[]> {
  const query = new URLSearchParams();
  if (params?.completed !== undefined)
    query.append("completed", String(params.completed));
  if (params?.status) query.append("status", params.status);
  if (params?.priority) query.append("priority", params.priority);

  const response = await fetch(`/api/todos?${query}`, { 
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch todos");
  return response.json();
}

export async function fetchTodo(id: string): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}`, { 
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch todo");
  return response.json();
}
