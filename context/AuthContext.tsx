// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as keychain from 'react-native-keychain';

interface User {
  id: string;
  nome: string;
  email?: string;
}

interface AuthContextData {
  user: User | null;
  login: (userData: User, persist?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }

        const credenciais = await keychain.getGenericPassword();
        if (credenciais) {
          console.log('Credenciais recuperadas:', credenciais.username);
        }
      } catch (error) {
        console.log('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData: User, persist = false) => {
    setUser(userData);
    if (persist) {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await keychain.resetGenericPassword();
    console.log('Usuário removido do storage');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);