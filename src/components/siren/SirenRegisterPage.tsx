import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { LoginBox, Container, Title, Header, Input, Button, ErrorText } from "../style/siren/LoginStyles";

const SirenRegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); // 전화번호 상태 추가
    const [error, setError] = useState(''); // 에러 메시지 상태 추가
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            // 서버로 회원가입 요청을 보냅니다.
            await axios.post(`${process.env.REACT_APP_API_URL}/api/kk/siren/user/register`, {
                name: username,
                password: password,
                phoneNumber: `010-${phoneNumber}`
            });

            // 성공 시, 홈으로 리디렉션
            navigate('/siren/login');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // 에러 메시지를 문자열로 변환
                const errorMessage = error.response?.data?.message || '회원가입 실패';
                setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
            } else {
                setError('회원가입 실패');
            }
        }
    };


    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자는 제거

        if (input.startsWith('010')) {
            input = input.slice(3); // "010" 부분은 삭제하지 않고 나머지 부분만 처리
        }

        if (input.length > 8) {
            input = input.slice(0, 8); // 최대 8자리까지만 입력 가능
        }

        if (input.length > 4) {
            input = `${input.slice(0, 4)}-${input.slice(4)}`; // 4자리마다 - 추가
        }

        setPhoneNumber(input);
    };

    const handlePhoneNumberFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // 사용자가 입력 필드를 포커스할 때 커서를 항상 "010-" 다음으로 이동
        if (e.target.selectionStart !== null && e.target.value.startsWith("010-")) {
            e.target.setSelectionRange(4, 4);
        }
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
                <Input
                    type="text"
                    placeholder="전화번호"
                    value={`010-${phoneNumber}`}
                    onChange={handlePhoneNumberChange}
                    onFocus={handlePhoneNumberFocus}
                    maxLength={13} // 010-1234-5678 형태로 최대 13자 입력 가능
                />
                <Button onClick={handleRegister}>회원가입</Button>
                {error && <ErrorText>{error}</ErrorText>} {/* 에러 메시지 표시 */}
            </LoginBox>
        </Container>
    );

};

export default SirenRegisterPage;
