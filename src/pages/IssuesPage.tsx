
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, fetchBoards } from '@/api/client';
import { Task, Board } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import { useTaskModal } from '@/hooks/useTaskModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';

export function IssuesPage() {
  const navigate = useNavigate();
  const { openTaskModal, setNavigateToBoard } = useTaskModal();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [boardFilter, setBoardFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  
  // Configure navigation to board callback
  useEffect(() => {
    setNavigateToBoard((boardId, taskId) => {
      navigate(`/board/${boardId}`);
      // We'd ideally open the task modal here, but that would require
      // setting up a more complex state management solution
      // For now, let's just navigate to the board
    });
  }, [navigate, setNavigateToBoard]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [tasksData, boardsData] = await Promise.all([
          fetchTasks(),
          fetchBoards()
        ]);
        
        setTasks(tasksData);
        setFilteredTasks(tasksData);
        setBoards(boardsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load issues. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters when filter states change
  useEffect(() => {
    let result = [...tasks];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(task => task.status === statusFilter);
    }
    
    // Apply board filter
    if (boardFilter) {
      const boardId = parseInt(boardFilter);
      result = result.filter(task => task.boardId === boardId);
    }
    
    // Apply assignee filter
    if (assigneeFilter) {
      const assigneeId = parseInt(assigneeFilter);
      result = result.filter(task => task.assigneeId === assigneeId);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, boardFilter, assigneeFilter]);

  // Get unique assignees from tasks
  const assignees = [...new Map(
    tasks
      .filter(task => task.assignee)
      .map(task => [task.assignee?.id, task.assignee])
  ).values()];

  // Handle opening task modal with task data
  const handleTaskClick = (task: Task) => {
    openTaskModal(task);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">All Issues</h1>
        <Button onClick={() => openTaskModal()} className="flex items-center">
          <Plus className="mr-1 h-4 w-4" />
          Create Task
        </Button>
      </div>
      
      {/* Filters */}
      <div className="bg-secondary/30 rounded-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <span className="truncate">
                  {statusFilter ? `Status: ${statusFilter.replace('_', ' ')}` : 'Filter by status'}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_statuses">All statuses</SelectItem>
                <SelectItem value="to_do">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={boardFilter} onValueChange={setBoardFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <span className="truncate">
                  {boardFilter ? `Board: ${boards.find(b => b.id === parseInt(boardFilter))?.title}` : 'Filter by board'}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_boards">All boards</SelectItem>
                {boards.map((board) => (
                  <SelectItem key={board.id} value={board.id.toString()}>
                    {board.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <span className="truncate">
                  {assigneeFilter ? `Assignee: ${assignees.find(a => a.id === parseInt(assigneeFilter))?.name}` : 'Filter by assignee'}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_assignees">All assignees</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id.toString()}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Task list */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Loading issues...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center text-red-700">
          {error}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No issues found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
          ))}
        </div>
      )}
    </div>
  );
}
