// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {Storage} from "../utils/types/storege"

interface User {
  id: string;
  nome: string;
  // outros campos que você quiser
}

interface AuthContextData {
  user: User | null;
  login: (userData: User, persist?:boolean) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar usuário salvo ao iniciar
    const loadUser = async () => {
      const userData = await Storage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const login = async (userData: User, persist:boolean= false) => {
    setUser(userData);
    await Storage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await Storage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto facilmente
export const useAuth = () => useContext(AuthContext);
