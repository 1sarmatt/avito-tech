
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ListTodo, Plus } from "lucide-react";
import { useTaskModal } from '@/hooks/useTaskModal';

export function Header() {
  const location = useLocation();
  const { openTaskModal } = useTaskModal();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-primary">Avito Tech</h1>
            </div>
            <nav className="ml-6 flex space-x-4">
              <Link
                to="/boards"
                className={`${
                  location.pathname === '/boards'
                    ? 'text-primary border-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white border-transparent'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <LayoutDashboard className="mr-1 h-4 w-4" />
                Boards
              </Link>
              <Link
                to="/issues"
                className={`${
                  location.pathname === '/issues'
                    ? 'text-primary border-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white border-transparent'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                <ListTodo className="mr-1 h-4 w-4" />
                Issues
              </Link>
            </nav>
          </div>
          <div>
            <Button onClick={() => openTaskModal()} className="flex items-center bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              Create Task
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
