import { useAuth } from "./context/AuthContext";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from './context/AuthContext';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const publicPaths = ["/", "/register"];
  const isPublic = publicPaths.includes(location.pathname);

  if (loading) return <div className="p-4">Cargando sesión...</div>;

  return (
    <>
      {isPublic && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
