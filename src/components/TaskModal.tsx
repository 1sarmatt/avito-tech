
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTaskModal } from '@/hooks/useTaskModal';
import { useToast } from '@/hooks/use-toast';
import { createTask, fetchUsers, updateTask, fetchBoards } from '@/api/client';
import { Board, Priority, Status, Task, User } from '@/types';
import { saveDraft, loadDraft, clearDraft } from '@/utils/formUtils';
import { useQueryClient } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';

export function TaskModal() {
  const { isOpen, closeTaskModal, taskData, navigateToBoard } = useTaskModal();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('to_do');
  const [assigneeId, setAssigneeId] = useState<number | undefined>(undefined);
  const [boardId, setBoardId] = useState<number | undefined>(undefined);
  
  // Data for selectors
  const [users, setUsers] = useState<User[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form when task data changes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      
      // Load users and boards data
      Promise.all([fetchUsers(), fetchBoards()])
        .then(([usersData, boardsData]) => {
          setUsers(usersData);
          setBoards(boardsData);
          
          // Populate form with task data or draft
          const draft = loadDraft();
          const initialData = taskData || draft || {};

          setTitle(initialData.title || '');
          setDescription(initialData.description || '');
          setPriority(initialData.priority || 'medium');
          setStatus(initialData.status || 'to_do');
          setAssigneeId(initialData.assigneeId);
          setBoardId(initialData.boardId);
        })
        .catch(error => {
          console.error("Failed to load form data:", error);
          toast({
            title: "Error loading data",
            description: "Could not load form data. Please try again.",
            variant: "destructive"
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, taskData, toast]);

  // Save form data as draft when changed
  useEffect(() => {
    if (isOpen && title) {
      saveDraft({
        title,
        description,
        priority,
        status,
        assigneeId,
        boardId
      });
    }
  }, [isOpen, title, description, priority, status, assigneeId, boardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !boardId) {
      toast({
        title: "Validation error",
        description: "Title and board are required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const taskPayload = {
        title,
        description,
        priority,
        status,
        boardId,
        assigneeId
      };
      
      let result: Task;
      
      if (taskData?.id) {
        // Update existing task
        result = await updateTask(taskData.id, taskPayload);
        toast({
          title: "Task updated",
          description: "Task has been successfully updated"
        });
      } else {
        // Create new task
        result = await createTask(taskPayload as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: "Task created",
          description: "New task has been successfully created"
        });
      }
      
      // Clear draft after successful submit
      clearDraft();
      
      // Invalidate and refetch queries to update UI
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['board-tasks'] });
      
      // Close modal
      closeTaskModal();
      
    } catch (error) {
      console.error("Failed to save task:", error);
      toast({
        title: "Error saving task",
        description: "There was an error saving your task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToBoard = () => {
    if (taskData?.id && taskData?.boardId && navigateToBoard) {
      closeTaskModal();
      navigateToBoard(taskData.boardId, taskData.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeTaskModal()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{taskData?.id ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={priority} 
                onValueChange={(value: Priority) => setPriority(value)}
                disabled={isLoading}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={status} 
                onValueChange={(value: Status) => setStatus(value)}
                disabled={isLoading}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to_do">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select 
                value={assigneeId?.toString() || undefined} 
                onValueChange={(value) => setAssigneeId(value ? parseInt(value) : undefined)}
                disabled={isLoading}
              >
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Not assigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="board">Board *</Label>
              <Select 
                value={boardId?.toString() || undefined} 
                onValueChange={(value) => setBoardId(parseInt(value))}
                disabled={isLoading || (taskData?.id !== undefined)}
                required
              >
                <SelectTrigger id="board">
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board.id} value={board.id.toString()}>
                      {board.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="pt-4 flex items-center justify-between sm:justify-between">
            <div>
              {taskData?.id && taskData?.boardId && navigateToBoard && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleNavigateToBoard}
                  className="flex items-center"
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  View on Board
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={closeTaskModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? 'Saving...' : (taskData?.id ? 'Update' : 'Create')}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
