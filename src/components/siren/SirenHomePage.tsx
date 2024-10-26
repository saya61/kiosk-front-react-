// sirenhompage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
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

// JWT의 형식을 확인하는 함수
const isValidJWT = (token: string): boolean => {
    const parts = token.split('.');
    return parts.length === 3; // JWT는 정확히 3개의 부분이 있어야 합니다.
};

interface Store {
    id: number;
    name: string;
    location: string;
    imageUrl: string;
}

interface DecodedToken {
    iss: string;
    iat: number;
    exp: number;
    sub: string;
}

const SirenHomePage: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [userName, setUserName] = useState<string>(''); // 사용자 이름 상태
    const [userId, setUserId] = useState<string | null>(null); // JWT에서 추출한 유저 ID
    const [address,setAddress]=useState<string | null>(null);
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude,setLongitude] = useState<number>(0);

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        console.log('Access Token from localStorage:', accessToken);

        if (accessToken && isValidJWT(accessToken)) {
            try {
                const decodedToken = jwtDecode<DecodedToken>(accessToken);
                if (decodedToken && decodedToken.sub) {
                    fetchUser(decodedToken.sub); // 사용자 정보를 가져오기
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            console.error('Access token is missing or invalid');
        }

        // API에서 스토어 데이터 가져오기
        axios.get(`${process.env.REACT_APP_API_URL}/api/kk/store/all`)
            .then(response => setStores(response.data))
            .catch(error => console.error('Error fetching stores:', error));
    }, []);

    const fetchUser = async (userId: string) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/kk/siren/user/${userId}`);
            if (response.status === 200) {
                setUserName(response.data.name); // 사용자 이름 상태 업데이트
                setUserId(response.data.id); // 이거 왜되는거임?
                setAddress(response.data.address);
                setLatitude(response.data.latitude);
                setLongitude(response.data.longitude);
            }
            console.log(response)
            console.log(userId)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // AxiosError 타입으로 좁히기
                console.error('Error fetching user:', error.response ? error.response.data : error.message);
            } else {
                // 다른 에러 타입 처리
                console.error('Unexpected error:', error);
            }
        }
    };




    const handleStoreClick = () => {
        navigate('/menu')
    }

    const handleLocationClick = () => {
        if (userId) {
            navigate('/siren/location', { state: { userId } });
        } else {
            console.error('User ID is null');
        }
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
                <LocationText>{address ? <span>{address}</span> : <span>지역을 선택해주세요</span>}</LocationText>
            </LocationSection>
            <MainContent>
                <StoreListContainer>
                    {stores.map((store) => (
                        <StoreCard key={store.id} onClick ={handleStoreClick}>
                            <StoreImage src={store.imageUrl} alt={store.name} />
                            <StoreInfo>
                                <StoreName>{store.name}</StoreName>
                                <StoreLocation>{store.location}</StoreLocation>
                                {/*<p>(2km)</p>*/}
                            </StoreInfo>
                        </StoreCard>
                    ))}
                </StoreListContainer>
            </MainContent>
        </Container>
    );
};

export default SirenHomePage;
