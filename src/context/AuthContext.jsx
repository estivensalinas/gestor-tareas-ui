import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password, mfaToken = null) => {
    const payload = { email, password };
    if (mfaToken) {
      payload.mfaToken = mfaToken;
    }

    const res = await axios.post("/auth/login", payload);

    // Si requiere MFA, retornar indicador sin guardar token
    if (res.data.requiresMfa) {
      return { requiresMfa: true };
    }

    localStorage.setItem("token", res.data.token);
    await getMe();
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const getMe = async () => {
    try {
      const res = await axios.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Configurar MFA
  const setupMfa = async () => {
    const res = await axios.post("/auth/mfa/setup");
    return res.data;
  };

  // Habilitar MFA
  const enableMfa = async (token) => {
    const res = await axios.post("/auth/mfa/enable", { token });
    if (res.data.twoFactorEnabled) {
      setUser(prev => ({ ...prev, twoFactorEnabled: true }));
    }
    return res.data;
  };

  // Deshabilitar MFA
  const disableMfa = async (token) => {
    const res = await axios.post("/auth/mfa/disable", { token });
    if (!res.data.twoFactorEnabled) {
      setUser(prev => ({ ...prev, twoFactorEnabled: false }));
    }
    return res.data;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      setupMfa,
      enableMfa,
      disableMfa
    }}>
      {children}
    </AuthContext.Provider>
  );
};
