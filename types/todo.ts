// Type definitions for Todo
export type STATUS = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PRIORITY = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  status: STATUS;
  priority: PRIORITY;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  status?: STATUS;
  priority?: PRIORITY;
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  status?: STATUS;
  priority?: PRIORITY;
  dueDate?: string;
}
