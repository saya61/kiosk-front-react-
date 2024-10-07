import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginModal from '../admin/modals/AdminLoginModal';
import styled from 'styled-components';
import {CrossIcon} from "react-select/dist/declarations/src/components/indicators";
import {Button} from "../style/PaymentPageStyles";
import './Menu.css'

const HeaderWrapper = styled.header`
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({ theme }) => theme.headerBgColor};
    color: ${({ theme }) => theme.headerColor};
    padding: 1rem;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const HomeIcon = styled.div`
    cursor: pointer;
    font-size: 1.5rem;
`;

const SettingsIcon = styled.div`
    cursor: pointer;
    font-size: 1.5rem;
`;

const Title = styled.h1`
    flex-grow: 1;
    text-align: center;
    font-size: 1.8rem;
`;

interface HeaderProps {
    title?: string;  // Title 이름 변경(기본값: AI KIOSK)
}

const Header: React.FC<HeaderProps> = ({ title = 'AI KIOSK' }) => { // title 값 변경으로 각 사이트마다 고유의 이름 가질 수 있음.
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
            <h1 className="custom-font">{title}</h1>
            <SettingsIcon onClick={handleAdminClick}>⚙️</SettingsIcon>
            {isAdminLoginOpen && <AdminLoginModal onClose={handleAdminLoginClose} />}
        </HeaderWrapper>
    );
}

export default Header;
