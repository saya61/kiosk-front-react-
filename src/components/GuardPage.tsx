import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './GuardPage.css';
import './Webfont.css'

const GuardPage: React.FC = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        // GuardPage로 돌아갈 때 usePointSwitch 초기화
        authContext?.setUsePointSwitch(false);
    }, [authContext]);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className="kiosk-main">
            <h1 className="custom-font">Welcome to Easy KIOSK</h1>
            <div className="button-container">
                <button onClick={() => handleNavigation('/menu')} className="kiosk-button">
                    주문하기
                </button>
            </div>
        </div>
    );
};

export default GuardPage;
