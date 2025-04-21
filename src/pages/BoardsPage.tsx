
import React, { useEffect, useState } from 'react';
import { fetchBoards } from '@/api/client';
import { Board } from '@/types';
import { BoardCard } from '@/components/BoardCard';

export function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBoards();
        setBoards(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch boards:', err);
        setError('Failed to load boards. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBoards();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Boards</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Loading boards...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center text-red-700">
          {error}
        </div>
      ) : boards.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No boards found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </div>
  );
}
