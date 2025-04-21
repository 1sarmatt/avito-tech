
export type Priority = "low" | "medium" | "high";
export type Status = "to_do" | "in_progress" | "done";

export interface User {
  id: number;
  name: string;
  avatar?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  boardId: number;
  assignee?: User;
  assigneeId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
