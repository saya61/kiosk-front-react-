import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSirenUser } from '../../api/SirenAuth'; // sirenAuth 모듈 import

import { LoginBox, Container, Title, Header, Input, Button, RegisterLabel } from "../style/siren/LoginStyles";
import axios from "axios";

const SirenLoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await loginSirenUser(username, password);
            const { accessToken, tokenType } = response;

            if (accessToken) {
                // JWT를 로컬 스토리지에 저장
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('tokenType', tokenType);

                // 로그인 성공 후 리디렉션
                navigate('/siren');
            }
        } catch (error) {
            // 로그인 실패 처리
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || '로그인 실패');
            } else {
                setError('로그인 실패');
            }
        }
    };

    const goToRegister = () => {
        navigate('/siren/register');
    };

    return (
        <Container>
            <Header>
                <Title>AIKiosk</Title>
            </Header>
            <LoginBox>
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
                {error && <p>{error}</p>}
                <RegisterLabel onClick={goToRegister}>계정이 없으신가요? 회원가입</RegisterLabel>
            </LoginBox>
        </Container>
    );
};

export default SirenLoginPage;
