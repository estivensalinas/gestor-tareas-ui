import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", form);
      const res = await axios.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      toast.error("Error al registrarse");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md space-y-4 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-indigo-700 text-center">
            Registrarse
          </h2>
          <input
            name="name"
            placeholder="Nombre"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Correo"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            Registrarse
          </button>
          <p className="text-center text-sm text-gray-600">
            ¿Ya tenés cuenta?{" "}
            <a href="/" className="text-indigo-500 hover:underline">
              Iniciar sesión
            </a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
