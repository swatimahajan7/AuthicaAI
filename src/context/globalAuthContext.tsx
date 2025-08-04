import { createContext, useContext, useState, type ReactNode } from 'react';
import { AuthMethods } from '../constants';

export interface AuthFormValues {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
}

export interface RiskConfig {
  risk: 'Medium' | 'High' | 'Severe';
  authMethods: string[];
  requireEmailOTP: boolean;
  requirePhoneOTP: boolean;
}

export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  risk: 'Medium' | 'High' | 'Severe';
  isAdmin?: boolean;
}

interface AuthContextType {
  values: AuthFormValues;
  updateValues: (values: Partial<AuthFormValues>) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  riskConfig: RiskConfig[];
  setRiskConfig: React.Dispatch<React.SetStateAction<RiskConfig[]>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const defaultRiskConfig: RiskConfig[] = [
  { risk: 'Medium', authMethods: [AuthMethods.usernamePassword], requireEmailOTP: true, requirePhoneOTP: true },
  { risk: 'High', authMethods: [AuthMethods.usernamePassword, AuthMethods.emailMobileOTP], requireEmailOTP: true, requirePhoneOTP: true },
  { risk: 'Severe', authMethods: [AuthMethods.usernamePassword, AuthMethods.emailMobileOTP, AuthMethods.authenticatorOTP], requireEmailOTP: true, requirePhoneOTP: true },
];

const defaultValues: AuthFormValues = {
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
};

const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    username: 'john_doe',
    password: 'pass123',
    email: 'john.doe@example.com',
    phone: '9876543210',
    risk: 'Medium',
    isAdmin: true
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    username: 'sarah_j',
    password: 'pass123',
    email: 'sarah.j@example.com',
    phone: '9876543211',
    risk: 'High'
  },
  {
    id: 3,
    name: 'Mike Chen',
    username: 'mike_chen',
    password: 'pass123',
    email: 'mike.chen@example.com',
    phone: '9876543212',
    risk: 'Medium',
    isAdmin: true
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    username: 'emily_r',
    password: 'pass123',
    email: 'emily.r@example.com',
    phone: '9876543213',
    risk: 'Severe'
  },
  {
    id: 5,
    name: 'David Kim',
    username: 'david_k',
    password: 'pass123',
    email: 'david.kim@example.com',
    phone: '9876543214',
    risk: 'Medium'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [values, setValues] = useState<AuthFormValues>(defaultValues);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [riskConfig, setRiskConfig] = useState<RiskConfig[]>(defaultRiskConfig);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const updateValues = (newValues: Partial<AuthFormValues>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        values,
        updateValues,
        users,
        setUsers,
        riskConfig,
        setRiskConfig,
        currentUser,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};
