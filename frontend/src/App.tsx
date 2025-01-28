import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { Toaster } from 'sonner';
import Routes from './Routes';
import { useAuth, useChat } from './store/useStore';
import { socketService } from './lib/socket';

function App() {
  const { checkAuth, user } = useAuth();
  const { addMessage } = useChat();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        socketService.connect(token);
        const cleanup = socketService.onMessage((message) => {
          addMessage(message);
        });
        return cleanup;
      }
    } else {
      socketService.disconnect();
    }
  }, [user, addMessage]);

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <Toaster position="top-center" richColors />
        <Routes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
