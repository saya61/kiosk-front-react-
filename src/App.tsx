import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { lightTheme, highContrastTheme } from './themes';
import Login from './components/Login';
import MenuHome from './components/menu/MenuHome';
import SignUp from './components/SignUp';
import PaymentPage from './components/PaymentPage';
import KioskSelectionPage from './components/KioskSelectionPage';
import GuardPage from './components/GuardPage';
import OrderCompleteCheck from "./components/admin/OrderCompleteCheck";

const App: React.FC = () => {
    const [isHighContrast, setIsHighContrast] = useState(false);

    return (
        <AuthProvider>
            <ThemeProvider theme={isHighContrast ? highContrastTheme : lightTheme}>
                <Routes>
                    <Route path="/users/login" element={<Login />} />
                    <Route path="/sign_up" element={<SignUp />} />
                    <Route path="/kiosk-selection" element={<PrivateRoute component={<KioskSelectionPage />} />} />
                    <Route path="/menu" element={<PrivateRoute component={<MenuHome isHighContrast={isHighContrast} setIsHighContrast={setIsHighContrast} />} />} />
                    <Route path="/payment" element={<PrivateRoute component={<PaymentPage />} />} />
                    <Route path="/guard" element={<PrivateRoute component={<GuardPage />} />} />
                    <Route path="/admin/orderComplete" element={<OrderCompleteCheck />} />
                    <Route path="/*" element={<Navigate to="/users/login" />} />
                </Routes>
            </ThemeProvider>
        </AuthProvider>
    );
};

const PrivateRoute: React.FC<{ component: JSX.Element }> = ({ component }) => {
    const authContext = useContext(AuthContext);
    return authContext?.isAuthenticated ? component : <Navigate to="/users/login" />;
};

export default App;
