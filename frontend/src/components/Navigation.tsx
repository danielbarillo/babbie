import React from 'react';
import { useStore } from '../store/useStore';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export function Navigation() {
  const { userState, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center gap-4">
        <span className="font-semibold">
          {userState?.type === 'authenticated' ? userState.username : 'Guest'}
        </span>
      </div>
      <Button variant="ghost" onClick={handleLogout}>
        Logout
      </Button>
    </nav>
  );
}