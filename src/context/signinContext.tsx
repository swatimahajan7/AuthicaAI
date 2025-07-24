import { createContext, useContext, useState, type ReactNode } from 'react';

export interface SigninFormValues {
    username: string;
    password: string;
    email: string;
    phone: string;
}

interface SigninContextType {
    signinValues: SigninFormValues;
    setSigninValues: (values: Partial<SigninFormValues>) => void;
}

const defaultValues: SigninFormValues = {
    username: '',
    password: '',
    email: '',
    phone: ''
};

const SigninContext = createContext<SigninContextType | undefined>(undefined);

export const SigninProvider = ({ children }: { children: ReactNode }) => {
    const [signinValues, setValues] = useState<SigninFormValues>(defaultValues);

    const setSigninValues = (values: Partial<SigninFormValues>) => {
        setValues((prev) => ({ ...prev, ...values }));
    };

    return (
        <SigninContext.Provider value={{ signinValues, setSigninValues }}>
            {children}
        </SigninContext.Provider>
    );
};

export const useSigninContext = (): SigninContextType => {
    const context = useContext(SigninContext);
    if (!context) {
        throw new Error('useSigninContext must be used within a SigninProvider');
    }
    return context;
};
