
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '@/types';

interface TaskModalContextProps {
  isOpen: boolean;
  taskData: Partial<Task> | null;
  openTaskModal: (task?: Partial<Task>, boardId?: number) => void;
  closeTaskModal: () => void;
  navigateToBoard?: (boardId: number, taskId: number) => void;
  setNavigateToBoard: (callback: (boardId: number, taskId: number) => void) => void;
}

const TaskModalContext = createContext<TaskModalContextProps>({
  isOpen: false,
  taskData: null,
  openTaskModal: () => {},
  closeTaskModal: () => {},
  setNavigateToBoard: () => {},
});

export function TaskModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [taskData, setTaskData] = useState<Partial<Task> | null>(null);
  const [navigateToBoardFn, setNavigateToBoardFn] = 
    useState<((boardId: number, taskId: number) => void) | undefined>(undefined);

  const openTaskModal = (task: Partial<Task> | undefined = null, boardId?: number) => {
    // Set task data or initialize with board ID if provided
    setTaskData(task || (boardId ? { boardId } : {}));
    setIsOpen(true);
  };

  const closeTaskModal = () => {
    setIsOpen(false);
    // Add a slight delay to reset the task data after animation completes
    setTimeout(() => {
      setTaskData(null);
    }, 300);
  };

  const setNavigateToBoard = (callback: (boardId: number, taskId: number) => void) => {
    setNavigateToBoardFn(() => callback);
  };

  return (
    <TaskModalContext.Provider 
      value={{ 
        isOpen, 
        taskData, 
        openTaskModal, 
        closeTaskModal, 
        navigateToBoard: navigateToBoardFn,
        setNavigateToBoard 
      }}
    >
      {children}
    </TaskModalContext.Provider>
  );
}

export function useTaskModal() {
  return useContext(TaskModalContext);
}
