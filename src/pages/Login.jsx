import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md space-y-4 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-indigo-700 text-center">
            Iniciar sesión
          </h2>
          <input
            type="email"
            placeholder="Correo"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            Entrar
          </button>
          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-indigo-500 hover:underline">
              Registrate aqui
            </a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
