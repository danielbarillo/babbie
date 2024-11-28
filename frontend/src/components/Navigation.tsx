import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">Chappy</div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <div className="space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}