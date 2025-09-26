// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as keychain from 'react-native-keychain';
import { Platform } from 'react-native';

interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  login: (userData: User, senha: string, persist?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  loadSavedCredentials: () => Promise<{ email: string, senha: string, salvar: boolean }>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const saveCredentials = async (email: string, senha: string, persist: boolean) => {
  if (Platform.OS !== 'web') {

    if (persist) {
      await keychain.setGenericPassword(email, senha);
    } else {
      await keychain.resetGenericPassword();
    }
  } else {

    if (persist) {
      window.localStorage.setItem('savedEmail', email);
    } else {
      window.localStorage.removeItem('savedEmail');
    }
    // Garante que a senha nunca seja armazenada no web
    window.localStorage.removeItem('savedPassword');
  }
};

const clearAllLoginData = async () => {
  // Limpa o Keychain (Nativo)
  if (Platform.OS !== 'web') {
    await keychain.resetGenericPassword();
  }
  // Limpa o localStorage (Web)
  else {
    window.localStorage.removeItem('savedEmail');
  }
  // Remove o token/dados do usuário do AsyncStorage (compartilhado)
  await AsyncStorage.removeItem('user');
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSavedCredentials = async (): Promise<{ email: string, senha: string, salvar: boolean }> => {
    let email = "";
    let senha = "";
    let salvar = false;

    if (Platform.OS !== 'web') {
      // NATIVO: Carrega do Keychain
      try {
        const credentials = await keychain.getGenericPassword();
        if (credentials && credentials.username && credentials.password) {
          email = credentials.username;
          senha = credentials.password;
          salvar = true;
        }
      } catch (error) {
        // Erros no nativo devem ser logados, mas não interrompem o app
        console.error("Erro ao carregar dados do Keychain:", error);
      }
    } else {
      // WEB: Carrega apenas o email do localStorage
      email = window.localStorage.getItem('savedEmail') || "";
      salvar = email !== "";
      // Senha permanece vazia por segurança
    }

    return { email, senha, salvar };
  };

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

  const login = async (userData: User, senha: string, persist = false) => {
    setUser(userData);
    await saveCredentials(userData.email, senha, persist)

    if (persist) {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    
    console.log('Usuário removido do storage');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, loadSavedCredentials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);