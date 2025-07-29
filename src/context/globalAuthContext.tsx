import { createContext, useContext, useState, type ReactNode } from 'react';

export interface AuthFormValues {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  values: AuthFormValues;
  updateValues: (values: Partial<AuthFormValues>) => void;
}

const defaultValues: AuthFormValues = {
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [values, setValues] = useState<AuthFormValues>(defaultValues);

  const updateValues = (newValues: Partial<AuthFormValues>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  };

  return (
    <AuthContext.Provider value={{ values, updateValues }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};
