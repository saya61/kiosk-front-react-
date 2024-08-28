import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface Store {
    id: number;
    name: string;
    location: string;
    adminID: number;
}

interface Kiosk {
    id: number;
    number: string;
}

interface Customer {
    id: number;
    name: string;
    phoneNumber: string;
    points: number;
    email: string;
    address: string;
}

interface Token{
    accessToken: string;
    tokenType: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    setRefreshToken: (token: string) => void;
    logout: () => void;
    storeInfo: Store | null;
    setStoreInfo: (info: Store | null) => void;
    kioskInfo: Kiosk | null;
    setKioskInfo: (info: Kiosk | null) => void;
    customerInfo: Customer | null;
    setCustomerInfo: (info: Customer | null) => void;
    usePointSwitch: boolean;
    setUsePointSwitch: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [storeInfo, setStoreInfo] = useState<Store | null>(null);
    const [kioskInfo, setKioskInfo] = useState<Kiosk | null>(null);
    const [customerInfo, setCustomerInfo] = useState<Customer | null>(null);
    const [usePointSwitch, setUsePointSwitch] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const setRefreshToken = (token : string) => {
        localStorage.setItem('refreshToken', token);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setStoreInfo(null);
        setKioskInfo(null);
        setCustomerInfo(null);
        setUsePointSwitch(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, setRefreshToken, logout, storeInfo, setStoreInfo, kioskInfo, setKioskInfo, customerInfo, setCustomerInfo, usePointSwitch, setUsePointSwitch }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
