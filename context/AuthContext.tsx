import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as keychain from 'react-native-keychain';
import { Platform } from 'react-native';

interface User {
  id: string;
  nome: string;
  email: string;
  token: string;
}

interface AuthContextData {
  user: User | null;
  login: (userData: User, persist?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  loadSavedCredentials: () => Promise<{ email: string; manter: boolean }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const clearAllLoginData = async () => {
  if (Platform.OS !== 'web') {
    await keychain.resetGenericPassword();
  } else {
    window.localStorage.removeItem('savedEmail');
  }

  await AsyncStorage.removeItem('user');
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSavedCredentials = async (): Promise<{ email: string; manter: boolean }> => {
    let email = "";
    let manter = false;

    if (Platform.OS !== 'web') {
      try {
        const credentials = await keychain.getGenericPassword();
        if (credentials && credentials.username) {
          email = credentials.username;
          manter = true;
        }
      } catch (error) {
        console.error("Erro ao carregar dados do Keychain:", error);
      }
    } else {
      email = window.localStorage.getItem('savedEmail') || "";
    }

    return { email, manter };
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          const userData: User = JSON.parse(userDataString);
          setUser(userData);
        }
      } catch (error) {
        console.log('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData: User, persist: boolean = false) => {
    setUser(userData);

   
      await AsyncStorage.setItem('user', JSON.stringify(userData));
   

    if (Platform.OS !== 'web') {
      if (persist) {
        await keychain.setGenericPassword(userData.email, "EMAIL_ONLY_SAVED");
      } else {
        await keychain.resetGenericPassword();
      }
    } else {
      window.localStorage.setItem('savedEmail', userData.email);
    }
  };

  const logout = async () => {
    await clearAllLoginData();
    setUser(null);
    console.log('Usuário removido do storage');
  };

  const isAuthenticated = !!user?.token;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, loadSavedCredentials, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
