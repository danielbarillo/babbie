import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from './ui/card';

interface User {
  _id: string;
  username: string;
  isOnline?: boolean;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const { currentChannel } = useStore();

  useEffect(() => {
    // Hämta bara användare för den aktuella kanalen
    if (currentChannel) {
      fetch(`/api/channels/${currentChannel._id}/users`)
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(console.error);
    }
  }, [currentChannel]);

  if (!users.length) return null;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Online Users</h3>
      <div className="space-y-1">
        {users.map(user => (
          <div
            key={user._id}
            className="flex items-center gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm">{user.username}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}