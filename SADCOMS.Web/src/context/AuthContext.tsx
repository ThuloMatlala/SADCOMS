import { createContext, useState } from "react";
import { api } from "../api/client";

interface AuthContextType {
  token: string | null;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

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