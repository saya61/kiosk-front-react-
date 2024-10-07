import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import OrderWithGpt from "../context/OrderWithGpt";

interface Kiosk {
    id: number;
    number: string;
}

const Container = styled.div`
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

const KioskList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    max-width: 400px;
`;

const KioskItem = styled.li`
    background-color: #007bff;
    color: white;
    padding: 15px;
    margin: 10px 0;
    border-radius: 5px;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

const API_URL = process.env.REACT_APP_API_URL;

const KioskSelectionPage: React.FC = () => {
    const [kiosks, setKiosks] = useState<Kiosk[]>([]);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchKiosks = async () => {
            try {
                const adminId = localStorage.getItem('adminId');
                const storeId = localStorage.getItem('storeId'); // storeId 추가
                const token = localStorage.getItem('token');

                console.log(token);
                console.log('adminId:', adminId);
                console.log('storeId:', storeId); // storeId 확인

                if (!adminId || !storeId) { // 둘 중 하나가 없다면
                    console.error('No adminId or storeId found in localStorage');
                    return;
                }

                // storeId를 사용하여 키오스크를 가져오는 API 호출
                const response = await axios.get(`${API_URL}/api/kiosks/${adminId}/${storeId}/kiosks`);
                console.log('Fetched kiosks:', response.data);
                setKiosks(response.data);
            } catch (error) {
                console.error('Failed to fetch kiosks', error);
            }
        };

        fetchKiosks();
    }, []);

    const handleKioskSelect = (kiosk: Kiosk) => {
        console.log('Selected kiosk:', kiosk);
        authContext?.setKioskInfo(kiosk);
        navigate('/guard');
    };

    return (
        <Container>
            <Title>키오스크 선택</Title>
            <KioskList>
                {kiosks.map((kiosk) => (
                    <KioskItem key={kiosk.id} onClick={() => handleKioskSelect(kiosk)}>
                        {kiosk.number}
                    </KioskItem>
                ))}
            </KioskList>
            <OrderWithGpt/>
        </Container>
    );
};

export default KioskSelectionPage;
