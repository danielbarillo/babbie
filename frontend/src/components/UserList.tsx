import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface User {
  _id: string;
  username: string;
  email: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const startChat = (userId: string) => {
    navigate(`/messages/${userId}`);
  };

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="p-4 space-y-4">
        <h2 className="font-semibold text-lg">Users</h2>
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        <div className="space-y-2">
          {users.map(user => (
            <Button
              key={user._id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => startChat(user._id)}
            >
              {user.username}
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}