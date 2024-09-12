// header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginModal from '../admin/modals/AdminLoginModal';
import styled from 'styled-components';
import {CrossIcon} from "react-select/dist/declarations/src/components/indicators";
import {Button} from "../style/PaymentPageStyles";

const HeaderWrapper = styled.header`
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({ theme }) => theme.headerBgColor};
    color: ${({ theme }) => theme.headerColor};
    padding: 1rem;
`;

const HomeIcon = styled.div`
    cursor: pointer;
`;

const SettingsIcon = styled.div`
    cursor: pointer;
`;

const Header: React.FC = () => {
    const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
    const navigate = useNavigate();

    const handleAdminClick = () => {
        setIsAdminLoginOpen(true);
    };

    const handleAdminLoginClose = () => {
        setIsAdminLoginOpen(false);
    };

    const handleMainPage = () => {
        navigate('/guard');
    };

    const handleSirenHomePage = () => {
        navigate('/siren');
    }

    return (
        <HeaderWrapper>
            <HomeIcon onClick={handleMainPage}>🏠</HomeIcon>
            <h1>Easy KIOSK</h1>
            <SettingsIcon onClick={handleAdminClick}>⚙️</SettingsIcon>
            {isAdminLoginOpen && <AdminLoginModal onClose={handleAdminLoginClose} />}
        </HeaderWrapper>
    );
}

export default Header;
