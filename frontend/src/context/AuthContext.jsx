import { createContext, useState } from "react";
import axios from "axios";
import { apiBaseURL } from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("authToken") || null
  );

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${apiBaseURL}/auth/login`, {
        email,
        password,
      });

      const authToken = data.token;
      const userId = data.userId;
      if (!authToken || userId == null) {
        throw new Error("Respuesta de autenticación incompleta");
      }

      localStorage.setItem("authToken", authToken);
      setToken(authToken);

      try {
        const userRes = await axios.get(`${apiBaseURL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const fullUser = userRes.data;
        setUser({
          ...fullUser,
          token: authToken,
        });
      } catch {
        setUser({
          id: userId,
          name: email.split("@")[0],
          email,
          token: authToken,
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Credenciales inválidas";
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setToken(null);
  };

  const register = async (name, email, password) => {
    try {
      await axios.post(`${apiBaseURL}/auth/register`, {
        name,
        email,
        password,
      });
      await login(email, password);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "No se pudo completar el registro";
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        token,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
