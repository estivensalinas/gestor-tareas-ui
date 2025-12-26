import { useAuth } from "./context/AuthContext";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MFASetup from "./pages/MFASetup";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from './context/AuthContext';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const publicPaths = ["/", "/register"];
  const isPublic = publicPaths.includes(location.pathname);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  // Redirigir usuarios autenticados fuera de páginas públicas
  if (user && isPublic) {
    return <Navigate to="/dashboard" replace />;
  }

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
        <Route
          path="/mfa-setup"
          element={
            <PrivateRoute>
              <MFASetup />
            </PrivateRoute>
          }
        />
        {/* Ruta 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-300">404</h1>
                <p className="text-gray-600 mt-2">Página no encontrada</p>
                <a href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
                  Volver al inicio
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
