import { createContext, useContext, ReactNode } from 'react';
import { useStore } from '../store/useStore';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { userState, login: storeLogin, logout: storeLogout } = useStore();

  const isAuthenticated = userState?.type === 'authenticated';

  const login = async (username: string, password: string) => {
    await storeLogin({ username, password });
  };

  const logout = () => {
    storeLogout();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}