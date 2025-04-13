import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Verificando sesión...</p>
      </div>
    );
  }
  console.log(user, loading);
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;