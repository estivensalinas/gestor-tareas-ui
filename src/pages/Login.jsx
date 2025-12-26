import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [showMfa, setShowMfa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    }

    if (showMfa && !mfaToken) {
      newErrors.mfa = "El código de verificación es requerido";
    } else if (showMfa && !/^\d{6}$/.test(mfaToken)) {
      newErrors.mfa = "El código debe tener 6 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password, showMfa ? mfaToken : null);

      // Si requiere MFA, mostrar campo
      if (result?.requiresMfa) {
        setShowMfa(true);
        setLoading(false);
        toast("Ingresa el código de tu app autenticadora", { icon: "🔐" });
        return;
      }

      toast.success("¡Bienvenido!");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Error al iniciar sesión";
      toast.error(message);

      // Manejar cuenta bloqueada
      if (message.includes("bloqueada")) {
        setErrors({ general: message });
      }

      // Limpiar código MFA si es inválido
      if (message.includes("autenticación")) {
        setMfaToken("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg space-y-5 w-full max-w-md"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-700">
            Iniciar sesión
          </h2>
          <p className="text-gray-500 mt-2">
            Accede a tu Gestor de Tareas
          </p>
        </div>

        {/* Error general (cuenta bloqueada) */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            ⚠️ {errors.general}
          </div>
        )}

        {/* Campo Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="tu@email.com"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Campo Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Tu contraseña"
              className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Campo MFA (condicional) */}
        {showMfa && (
          <div className="animate-fadeIn">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🔐 Código de verificación
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-mono ${errors.mfa ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              value={mfaToken}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setMfaToken(value);
                if (errors.mfa) setErrors({ ...errors, mfa: null });
              }}
              disabled={loading}
              autoFocus
            />
            {errors.mfa && (
              <p className="text-red-500 text-sm mt-1">{errors.mfa}</p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              Ingresa el código de 6 dígitos de tu app autenticadora (Google Authenticator, Authy, etc.)
            </p>
          </div>
        )}

        {/* Botón de login */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verificando...
            </span>
          ) : showMfa ? (
            'Verificar código'
          ) : (
            'Entrar'
          )}
        </button>

        {/* Link a registro */}
        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
