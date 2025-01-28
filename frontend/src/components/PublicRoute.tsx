import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/useStore';
import { LoadingOverlay } from './ui/LoadingOverlay';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (user) {
    // Redirect to the page they came from or default to /chat
    const from = location.state?.from?.pathname || '/chat';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}