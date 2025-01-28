import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useSocket } from '../context/SocketContext';

export function ConnectionTest() {
  const [apiStatus, setApiStatus] = useState<string>('Testing...');
  const [wsStatus, setWsStatus] = useState<string>('Testing...');
  const { socket } = useSocket();

  useEffect(() => {
    // Test REST API connection
    const testApi = async () => {
      try {
        const response = await axios.get('/api/test/db');
        setApiStatus(`Connected! MongoDB: ${response.data.mongodb}`);
      } catch (error) {
        setApiStatus('Failed to connect to API');
        console.error('API test error:', error);
      }
    };

    // Test WebSocket connection
    if (socket) {
      socket.on('connect', () => {
        setWsStatus('Connected!');
      });

      socket.on('connect_error', (error) => {
        setWsStatus('Failed to connect');
        console.error('WebSocket connection error:', error);
      });
    }

    testApi();

    return () => {
      socket?.off('connect');
      socket?.off('connect_error');
    };
  }, [socket]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-bold">API Status:</h3>
        <p>{apiStatus}</p>
      </div>
      <div>
        <h3 className="font-bold">WebSocket Status:</h3>
        <p>{wsStatus}</p>
      </div>
    </div>
  );
}