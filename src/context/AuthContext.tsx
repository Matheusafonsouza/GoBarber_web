import React, { createContext, useCallback } from 'react';
import { string } from 'yup';
import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextState {
  name: string;
  signIn(credentials: SignInCredentials): Promise<void>;
}

export const AuthContext = createContext<AuthContextState>(
  {} as AuthContextState,
);

export const AuthProvider: React.FC = ({ children }) => {
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password });

    console.log(response.data);
  }, []);

  return (
    <AuthContext.Provider value={{ name: 'teste', signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
