
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import { Board } from '@/types';
import { Link } from 'react-router-dom';

interface BoardCardProps {
  board: Board;
}

export function BoardCard({ board }: BoardCardProps) {
  return (
    <Link to={`/board/${board.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-md">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">{board.title}</h3>
          </div>
          
          {board.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {board.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Created: {new Date(board.createdAt).toLocaleDateString()}
        </CardFooter>
      </Card>
    </Link>
  );
}
