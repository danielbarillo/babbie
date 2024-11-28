import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { userState } = useStore();

  // If not authenticated, redirect to login
  if (!userState || (userState.type !== 'authenticated' && userState.type !== 'guest')) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
}