
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from '@/types';
import { UserAvatar } from './UserAvatar';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityLabels = {
  low: { label: 'Low', className: 'priority-low' },
  medium: { label: 'Medium', className: 'priority-medium' },
  high: { label: 'High', className: 'priority-high' },
};

const statusLabels = {
  to_do: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { title, description, priority, status, assignee } = task;
  
  return (
    <Card className="task-card cursor-pointer mb-3" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm">{title}</h3>
          <Badge variant="outline" className={priorityLabels[priority].className}>
            {priorityLabels[priority].label}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center mt-3">
          <Badge variant="secondary" className="text-xs">
            {statusLabels[status]}
          </Badge>
          
          {assignee && (
            <div className="flex items-center">
              <UserAvatar user={assignee} className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
