import { createContext, useContext, useState, type ReactNode } from 'react';

type SignupFormData = {
    username: string;
    password: string;
    email: string;
    phone: string;
};

type SignupContextType = {
    formValues: SignupFormData;
    updateFormValues: (values: Partial<SignupFormData>) => void;
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

const defaultValues: SignupFormData = {
    username: '',
    password: '',
    email: '',
    phone: '',
};

export const SignupProvider = ({ children }: { children: ReactNode }) => {
    const [formValues, setFormValues] = useState<SignupFormData>(defaultValues);

    const updateFormValues = (values: Partial<SignupFormData>) => {
        setFormValues((prev) => ({ ...prev, ...values }));
    };

    return (
        <SignupContext.Provider value={{ formValues, updateFormValues }}>
            {children}
        </SignupContext.Provider>
    );
};

export const useSignupContext = () => {
    const context = useContext(SignupContext);
    if (!context) throw new Error('useSignupContext must be used inside SignupProvider');
    return context;
};
