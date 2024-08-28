import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { login, fetchStoreInfo } from '../api/auth';

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f7f7f7;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    color: #333;
`;

const Input = styled.input`
    width: 300px;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
`;

const Button = styled.button`
    width: 300px;
    padding: 10px;
    margin: 10px 0;
    background-color: #FF5733;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        background-color: #e04e2a;
    }
`;

const Error = styled.p`
    color: red;
    margin-bottom: 10px;
`;

const SignUpLink = styled(Link)`
    margin-top: 10px;
    color: #FF5733;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const Login: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const { accessToken, refreshToken, adminId } = await login(username, password);
            // authContext?.login(accessToken);
            localStorage.setItem('token', accessToken);
            authContext?.setRefreshToken(refreshToken);
            localStorage.setItem('adminId', adminId.toString());
            localStorage.setItem('adminPassword', password);

            const storeInfo = await fetchStoreInfo(adminId);
            authContext?.setStoreInfo(storeInfo);

            navigate('/kiosk-selection');
        } catch (err) {
            setError('Invalid name or password');
        }
    };

    return (
        <LoginContainer>
            <Title>로그인</Title>
            {error && <Error>{error}</Error>}
            <Input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>로그인</Button>
            <SignUpLink to="/sign_up">계정이 없으신가요? 회원가입</SignUpLink>
        </LoginContainer>
    );
};

export default Login;
