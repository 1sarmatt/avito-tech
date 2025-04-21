
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { fetchBoard, fetchBoardTasks, updateTask } from '@/api/client';
import { Board, Task, Status } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import { useTaskModal } from '@/hooks/useTaskModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SortableTaskCard } from '@/components/SortableTaskCard';

export function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const boardId = parseInt(id || '0');
  
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { openTaskModal } = useTaskModal();

  // Define sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const loadBoardData = async () => {
      if (!boardId) return;
      
      try {
        setIsLoading(true);
        const [boardData, tasksData] = await Promise.all([
          fetchBoard(boardId),
          fetchBoardTasks(boardId)
        ]);
        
        setBoard(boardData);
        setTasks(tasksData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch board data:', err);
        setError('Failed to load board data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBoardData();
  }, [boardId]);

  // Handle task drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Return if no valid over container
    if (!over) return;

    // Get the task being dragged
    const taskId = parseInt(active.id.toString());
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Get the status it's being dropped into
    const newStatus = over.id as Status;
    
    // If the status is the same, no update needed
    if (task.status === newStatus) return;
    
    try {
      // Optimistically update the UI
      setTasks(prev => 
        prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
      );
      
      // Update the task status in the backend
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status:', err);
      
      // Revert the optimistic update on error
      setTasks(prev => [...prev]);
    }
  };

  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === 'to_do');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  // Handle opening task modal with task data
  const handleTaskClick = (task: Task) => {
    openTaskModal(task);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Loading board...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center text-red-700">
          {error}
        </div>
      ) : board ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">{board.title}</h1>
              {board.description && (
                <p className="text-muted-foreground mt-1">{board.description}</p>
              )}
            </div>
            <Button onClick={() => openTaskModal({}, boardId)} className="flex items-center">
              <Plus className="mr-1 h-4 w-4" />
              Add Task
            </Button>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* To Do column */}
              <div className="board-column">
                <h2 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
                  To Do ({todoTasks.length})
                </h2>
                <SortableContext
                  id="to_do"
                  items={todoTasks.map(t => t.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div id="to_do" className="h-full">
                    {todoTasks.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onClick={() => handleTaskClick(task)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
              
              {/* In Progress column */}
              <div className="board-column">
                <h2 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
                  In Progress ({inProgressTasks.length})
                </h2>
                <SortableContext
                  id="in_progress"
                  items={inProgressTasks.map(t => t.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div id="in_progress" className="h-full">
                    {inProgressTasks.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onClick={() => handleTaskClick(task)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
              
              {/* Done column */}
              <div className="board-column">
                <h2 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
                  Done ({doneTasks.length})
                </h2>
                <SortableContext
                  id="done"
                  items={doneTasks.map(t => t.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div id="done" className="h-full">
                    {doneTasks.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onClick={() => handleTaskClick(task)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </div>
          </DndContext>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Board not found.</p>
        </div>
      )}
    </div>
  );
}
