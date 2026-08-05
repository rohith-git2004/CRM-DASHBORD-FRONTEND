import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const login = async (
  data: LoginData
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (
  data: RegisterData
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const saveUser = (token: string, user: User) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  return user ? (JSON.parse(user) as User) : null;
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  return !!localStorage.getItem("token");
};