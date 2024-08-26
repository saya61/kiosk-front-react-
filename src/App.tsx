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
import OrderNumber from "./components/OrderNumber"
import SirenHomePage from "./components/siren/SirenHomePage";

const App: React.FC = () => {
    const [isHighContrast, setIsHighContrast] = useState(false);

    return (
        <AuthProvider>
            <ThemeProvider theme={isHighContrast ? highContrastTheme : lightTheme}>
                <Routes>
                    <Route path="/users/login" element={<Login />} />
                    <Route path="/sign_up" element={<SignUp />} />
                    <Route path="/kiosk-selection" element={<KioskSelectionPage />} />
                    <Route path="/menu" element={<MenuHome isHighContrast={isHighContrast} setIsHighContrast={setIsHighContrast} />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/guard" element={<GuardPage />} />
                    <Route path="/admin/orderComplete" element={<OrderCompleteCheck />} />
                    <Route path="/order-number/:id" element={<OrderNumber />} />

                    <Route path="*" element={<Navigate to="/users/login" />} />
                {/*    사이렌 페이지 라우트*/}
                    <Route path="/siren" element={<SirenHomePage />}/>
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
