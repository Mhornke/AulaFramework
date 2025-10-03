import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as keychain from 'react-native-keychain';
import { Platform } from 'react-native';

interface User {
  id: string;
  nome: string;
  email: string;
  token: string
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  // Removido 'senha' do login, pois não será persistida.
  login: (userData: User, persist?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  // Removido 'senha' do retorno.
  loadSavedCredentials: () => Promise<{ email: string, salvar: boolean }>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

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
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  // Ajuste para não retornar senha, conforme solicitado.
  const loadSavedCredentials = async (): Promise<{ email: string, salvar: boolean }> => {
    let email = "";
    let salvar = false;

    if (Platform.OS !== 'web') {
      // NATIVO: Carrega do Keychain
      try {
        const credentials = await keychain.getGenericPassword();
        // Se encontrar as credenciais (email + senha dummy), preenche o email e marca 'salvar'.
        if (credentials && credentials.username) {
          email = credentials.username;
          salvar = true; // Indica que o e-mail foi carregado do armazenamento persistente
        }
      } catch (error) {
        console.error("Erro ao carregar dados do Keychain:", error);
      }
    } else {
      // WEB: Carrega apenas o email do localStorage
      email = window.localStorage.getItem('savedEmail') || "";
      // Na web, se o email existe, é considerado "salvo" para preenchimento.
      salvar = email !== "";
    }

    return { email, salvar };
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Tenta carregar a sessão permanente (user/token) do AsyncStorage
        const userDataString = await AsyncStorage.getItem('user');

        if (userDataString) {
          const userData: User = JSON.parse(userDataString)
          setUser(userData);
          setToken(userData.token)
        }
      } catch (error) {
        console.log('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Removido o argumento 'senha'
  const login = async (userData: User, persist = false) => {
    // 1. Atualiza o estado em memória (Sessão atual)
    setUser(userData);
    setToken(userData.token)

    // 2. Lógica de Persistência da Sessão (Token/User no AsyncStorage)
    if (persist) {
      // PERMANENTE: Salva o usuário completo (Token) para sobreviver a recargas/fechamento
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } else {
      // TEMPORÁRIO: Limpa qualquer sessão permanente anterior. A sessão só existe em memória.
      await AsyncStorage.removeItem('user');
    }

    // 3. Lógica de Persistência de Credenciais (E-mail para Autopreenchimento)
    if (Platform.OS !== 'web') {
      // NATIVO: Keychain (Salva E-mail de forma segura, usando senha dummy)
      if (persist) {
        // Salva o email como 'username' e uma string fixa como 'password'
        await keychain.setGenericPassword(userData.email, "EMAIL_ONLY_SAVED");
      } else {
        // Se não for persistir a sessão, reseta o email salvo no keychain
        await keychain.resetGenericPassword();
      }
    } else {
      // WEB: Salva o e-mail no localStorage (é temporário, mas serve para autopreenchimento)
      window.localStorage.setItem('savedEmail', userData.email);
    }
  };

  const logout = async () => {
    await clearAllLoginData();
    setUser(null);
    setToken(null); // Limpa o token no logout
    console.log('Usuário e token removidos do storage');
  };

  return (
    <AuthContext.Provider value={{ user, login, token, logout, isLoading, loadSavedCredentials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);