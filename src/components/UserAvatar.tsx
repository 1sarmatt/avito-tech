
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types';

interface UserAvatarProps {
  user: User;
  className?: string;
}

export function UserAvatar({ user, className = 'h-8 w-8' }: UserAvatarProps) {
  // Get initials from user name
  const initials = user.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
    
  return (
    <Avatar className={className}>
      {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
