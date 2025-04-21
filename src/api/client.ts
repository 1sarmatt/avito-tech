
import { Board, Task, User } from '@/types';

// Mock data for boards
const mockBoards: Board[] = [
  {
    id: 1,
    title: 'Development',
    description: 'Software development tasks',
    createdAt: '2023-10-01T09:00:00Z',
    updatedAt: '2023-10-01T09:00:00Z'
  },
  {
    id: 2,
    title: 'Design',
    description: 'UI/UX design tasks',
    createdAt: '2023-10-01T09:30:00Z',
    updatedAt: '2023-11-01T09:30:00Z'
  },
  {
    id: 3,
    title: 'Marketing',
    description: 'Marketing campaign tasks',
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-01T10:00:00Z'
  }
];

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Implement authentication',
    description: 'Add user authentication using JWT',
    priority: 'high',
    status: 'in_progress',
    boardId: 1,
    assignee: { id: 1, name: 'Alex' },
    assigneeId: 1,
    createdAt: '2023-10-01T09:00:00Z',
    updatedAt: '2023-10-02T10:00:00Z'
  },
  {
    id: 2,
    title: 'Create landing page',
    description: 'Design and implement the landing page',
    priority: 'medium',
    status: 'to_do',
    boardId: 2,
    assignee: { id: 2, name: 'Samvel' },
    assigneeId: 2,
    createdAt: '2023-10-01T09:30:00Z',
    updatedAt: '2023-10-02T10:30:00Z'
  },
  {
    id: 3,
    title: 'Prepare social media campaign',
    description: 'Create content for social media campaign',
    priority: 'low',
    status: 'done',
    boardId: 3,
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-02T11:00:00Z'
  },
  {
    id: 4,
    title: 'Fix navigation bug',
    description: 'The navigation menu disappears on mobile devices',
    priority: 'high',
    status: 'to_do',
    boardId: 1,
    assignee: { id: 1, name: 'Alex' },
    assigneeId: 1,
    createdAt: '2023-10-02T09:00:00Z',
    updatedAt: '2023-10-03T10:00:00Z'
  },
  {
    id: 5,
    title: 'Improve button styles',
    description: 'Make buttons more consistent across the app',
    priority: 'medium',
    status: 'in_progress',
    boardId: 2,
    assignee: { id: 3, name: 'Kate' },
    assigneeId: 3,
    createdAt: '2023-10-02T09:30:00Z',
    updatedAt: '2023-10-03T10:30:00Z'
  }
];

// Mock data for users
const mockUsers: User[] = [
  { id: 1, name: 'Alex', avatar: 'https://ui-avatars.com/api/?name=John+Doe' },
  { id: 2, name: 'Samvel', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith' },
  { id: 3, name: 'Kate', avatar: 'https://ui-avatars.com/api/?name=Emily+Johnson' }
];

// Helper function for simulating async API calls
const mockApiCall = <T>(data: T, delay: number = 300): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Boards API
export const fetchBoards = async (): Promise<Board[]> => {
  return mockApiCall(mockBoards);
};

export const fetchBoard = async (id: number): Promise<Board> => {
  const board = mockBoards.find(b => b.id === id);
  if (!board) {
    return Promise.reject(new Error('Board not found'));
  }
  return mockApiCall(board);
};

// Tasks API
export const fetchTasks = async (): Promise<Task[]> => {
  return mockApiCall(mockTasks);
};

export const fetchBoardTasks = async (boardId: number): Promise<Task[]> => {
  const tasks = mockTasks.filter(t => t.boardId === boardId);
  return mockApiCall(tasks);
};

export const fetchTask = async (id: number): Promise<Task> => {
  const task = mockTasks.find(t => t.id === id);
  if (!task) {
    return Promise.reject(new Error('Task not found'));
  }
  return mockApiCall(task);
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  // Generate a new task with ID and timestamps
  const newTask: Task = {
    ...task,
    id: Math.max(0, ...mockTasks.map(t => t.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add the new task to our mock data
  mockTasks.push(newTask);
  
  return mockApiCall(newTask);
};

export const updateTask = async (id: number, taskUpdates: Partial<Task>): Promise<Task> => {
  const taskIndex = mockTasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return Promise.reject(new Error('Task not found'));
  }
  
  // Update the task in our mock data
  const updatedTask = {
    ...mockTasks[taskIndex],
    ...taskUpdates,
    updatedAt: new Date().toISOString()
  };
  
  mockTasks[taskIndex] = updatedTask;
  
  return mockApiCall(updatedTask);
};

// Users API
export const fetchUsers = async (): Promise<User[]> => {
  return mockApiCall(mockUsers);
};
