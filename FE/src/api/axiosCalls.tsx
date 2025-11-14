import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const cleanErrorMessage = (title: string): string => {
  return title
    .replace(/^.*\r\n -- : /g, "")
    .replace(/^.* -- : /g, "")
    .replace(/\. Severity: (Error|Warning)/g, "")
    .trim();
};

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ title?: string; message?: string }>) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.endsWith("/auth/login");
      const isRegisterRequest = error.config?.url?.endsWith("/auth/register");
      
      if (isLoginRequest || isRegisterRequest) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.title ||
                            "Invalid credentials";
        return Promise.reject(new Error(errorMessage));
      }
      
      localStorage.removeItem("jwt");
      window.location.href = "/login";
      return Promise.reject(new Error("Session expired, please log in again"));
    }
    
    const errorMessage = error.response?.data?.title
      ? cleanErrorMessage(error.response.data.title)
      : error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
    return Promise.reject(new Error(errorMessage));
  }
);

axios.interceptors.request.use((config) => {
  if (config.url?.endsWith("/auth/login") || config.url?.endsWith("/auth/register")) {
    return config;
  }
  
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }
  
  return Promise.reject(new Error("Please log in to continue"));
});

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${baseURL}/auth/login`, {
    username,
    password,
  });
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${baseURL}/auth/register`, {
    username,
    email,
    password,
  });
  return response.data;
};