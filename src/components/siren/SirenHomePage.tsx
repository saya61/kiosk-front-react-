import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import {
    Container,
    Header,
    Title,
    UserSection,
    LocationSection,
    LocationText,
    LocationIcon,
    MainContent,
    StoreListContainer,
    StoreCard,
    StoreImage,
    StoreInfo,
    StoreLocation,
    StoreName,
} from '../style/siren/HomeStyles';

interface Store {
    id: number;
    name: string;
    location: string;
    imageUrl: string;
}

interface DecodedToken {
    name: string;  // JWT 페이로드에 포함된 필드
    // 필요한 다른 필드들도 추가
}

const SirenHomePage: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [userName, setUserName] = useState<string>(''); // 사용자 이름 상태
    const navigate = useNavigate();

    useEffect(() => {
        // API에서 스토어 데이터 가져오기
        axios.get('/api/stores')
            .then(response => setStores(response.data))
            .catch(error => console.error('Error fetching stores:', error));

        // JWT에서 사용자 이름 추출하기
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const decodedToken = jwt.decode(accessToken) as DecodedToken | null; // 타입 캐스팅
                if (decodedToken && 'name' in decodedToken) {
                    setUserName(decodedToken.name); // 사용자 이름 상태 업데이트
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleLocationClick = () => {
        navigate('/siren/location');
    };

    return (
        <Container>
            <Header>
                <Title>AIKiosk</Title>
                <UserSection>
                    <p>{userName} 님</p> {/* 사용자 이름 표시 */}
                    {/* TO DO : 로그아웃 상태에서는 로그인 버튼으로 변경해야함 */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="41" height="34" viewBox="0 0 41 34" fill="none">
                        <path
                            d="M39.5 17C39.5 25.3098 31.2685 32.5 20.5 32.5C9.73151 32.5 1.5 25.3098 1.5 17C1.5 8.69019 9.73151 1.5 20.5 1.5C31.2685 1.5 39.5 8.69019 39.5 17Z"
                            stroke="white" strokeWidth="3"/>
                        <circle cx="20.5" cy="11.5" r="5.5" fill="white"/>
                        <ellipse cx="20.5" cy="25.5" rx="10.5" ry="8.5" fill="white"/>
                    </svg>
                </UserSection>
            </Header>
            <LocationSection onClick={handleLocationClick}>
                <LocationIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="24" viewBox="0 0 34 24" fill="none">
                        <path
                            d="M29.75 13V20C29.75 20.5523 29.1158 21 28.3333 21H5.66667C4.88426 21 4.25 20.5523 4.25 20V4C4.25 3.44771 4.88426 3 5.66667 3H15.5833"
                            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.91666 13.3599V17H15.0997L29.75 6.65405L24.5757 3L9.91666 13.3599Z" fill="white"
                              stroke="#FFC5AE" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                </LocationIcon>
                <LocationText>노원구 공릉동 삼육대학교 시온관</LocationText>
            </LocationSection>
            <MainContent>
                <StoreListContainer>
                    {stores.map((store) => (
                        <StoreCard key={store.id}>
                            <StoreImage src={store.imageUrl} alt={store.name} />
                            <StoreInfo>
                                <StoreLocation>{store.location}</StoreLocation>
                                <StoreName>{store.name}</StoreName>
                            </StoreInfo>
                        </StoreCard>
                    ))}
                </StoreListContainer>
            </MainContent>
        </Container>
    );
};

export default SirenHomePage;
