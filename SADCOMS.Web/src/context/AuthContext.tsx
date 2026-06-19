import { createContext, useState } from "react";
import { createApi } from "../api/client";

interface AuthContextType {
  token: string | null;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const api = createApi(token);

  const login = async (password: string) => {
    const data = await api.get<{ token: string }>(`/token?password=${password}`);
    setToken(data.token);
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}