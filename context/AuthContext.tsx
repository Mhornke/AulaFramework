// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
//import {Storage} from "../utils/types/storege"
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as keychain from 'react-native-keychain'


interface User {
  id: string;
  nome: string;
  email?: string
}

interface AuthContextData {
  user: User | null;
  login: (userData: User, credenciais?: { username: string; password: string }, persist?: boolean) => Promise<void>;
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

      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));

        }

        const credenciais = await keychain.getGenericPassword()
        if (credenciais) {
          console.log('Credenciais recuperadas:', credenciais.username);

        }
      } catch (error) {
        console.log('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false)
      }

    };
    loadUser();
  }, []);

  const login = async (userData: User, credenciais?: { username: string; password: string }, salvar: boolean) => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));


    if (salvar) {
      try {
        await keychain.setGenericPassword(credenciais?.username, credenciais?.password)
        console.log('Credenciais salvas com sucesso!');
      } catch (error) {
        console.log('Erro ao salvar as credenciais:', error);

      }
    }

  };

  // const login = async (userData: User, persist:boolean= false) => {
  //   setUser(userData);
  //   if (persist) {

  //     await AsyncStorage.setItem('user', JSON.stringify(userData));
  //   }
  // };


  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await keychain.resetGenericPassword()
    console.log("Usuário removido do storage");
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto facilmente
export const useAuth = () => useContext(AuthContext);
