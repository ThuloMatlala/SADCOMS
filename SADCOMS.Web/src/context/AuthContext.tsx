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

  const login = async(password:string) => {
      api.get<{ token: string }>(`/token?password=${password}`)
        .then(data => setToken(data.token))
        .catch(err => console.log(err));
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}