import axios from "axios";

// "" debe ser válido (mismo origen en prod); con || la cadena vacía caía en localhost:8080.
const raw = import.meta.env.VITE_API_URL;
export const apiBaseURL =
  raw !== undefined && raw !== null
    ? raw
    : import.meta.env.DEV
      ? ""
      : "http://localhost:8080";

export const api = axios.create({
  baseURL: apiBaseURL,
});

// JWT interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// manejo 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);