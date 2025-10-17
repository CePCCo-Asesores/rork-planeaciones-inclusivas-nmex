import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { User, CreateUserInput, LoginInput } from '@/types/user';

const AUTH_STORAGE_KEY = '@auth_user';
const USERS_STORAGE_KEY = '@users_db';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<{ success: boolean; error?: string }>;
  register: (input: CreateUserInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<User, 'userId' | 'email'>>) => Promise<void>;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsersDb = async (): Promise<Record<string, { user: User; password: string }>> => {
    try {
      const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading users db:', error);
      return {};
    }
  };

  const saveUsersDb = async (db: Record<string, { user: User; password: string }>) => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(db));
    } catch (error) {
      console.error('Error saving users db:', error);
    }
  };

  const register = useCallback(async (input: CreateUserInput): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!input.aceptaTerminos) {
        return { success: false, error: 'Debes aceptar los términos y condiciones' };
      }

      const usersDb = await getUsersDb();

      if (usersDb[input.email]) {
        return { success: false, error: 'Este correo ya está registrado' };
      }

      const newUser: User = {
        userId: Date.now().toString(),
        nombreCompleto: input.nombreCompleto,
        email: input.email,
        estado_membresia: 'Gratuita',
        nombreEscuela: '',
        nivelPredeterminado: 'Primaria',
        gradoPredeterminado: '1',
      };

      usersDb[input.email] = {
        user: newUser,
        password: input.password,
      };

      await saveUsersDb(usersDb);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);

      return { success: true };
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, error: 'Error al registrar usuario' };
    }
  }, []);

  const login = useCallback(async (input: LoginInput): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersDb = await getUsersDb();
      const userRecord = usersDb[input.email];

      if (!userRecord || userRecord.password !== input.password) {
        return { success: false, error: 'Correo o contraseña incorrectos' };
      }

      if (input.mantenerseConectado) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userRecord.user));
      }

      setUser(userRecord.user);
      return { success: true };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Omit<User, 'userId' | 'email'>>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...updates };
      const usersDb = await getUsersDb();

      if (usersDb[user.email]) {
        usersDb[user.email].user = updatedUser;
        await saveUsersDb(usersDb);
      }

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }, [user]);

  return useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    updateProfile,
  }), [user, isLoading, login, register, logout, updateProfile]);
});
