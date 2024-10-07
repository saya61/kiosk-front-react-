import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface Store {
    id: number;
    name: string;
    location: string;
    adminID: number;
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

const StoreList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    max-width: 400px;
`;

const StoreItem = styled.li`
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

const StoreSelectionPage: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const adminId = localStorage.getItem('adminId');
                if (!adminId) {
                    console.error('No adminId found in localStorage');
                    return;
                }
                const response = await axios.get(`${API_URL}/api/kk/store/list/${adminId}`);
                setStores(response.data);
            } catch (error) {
                console.error('Failed to fetch stores', error);
            }
        };

        fetchStores();
    }, []);

    const handleStoreSelect = (store: Store) => {
        console.log('Selected store:', store);
        authContext?.setStoreInfo(store);
        localStorage.setItem('storeId', store.id.toString());
        navigate(`/kiosks/${store.id}`); // 선택한 스토어에 따라 키오스크 선택 페이지로 이동
    };

    return (
        <Container>
            <Title>스토어 선택</Title>
            <StoreList>
                {stores.map((store) => (
                    <StoreItem key={store.id} onClick={() => handleStoreSelect(store)}>
                        {store.name}
                    </StoreItem>
                ))}
            </StoreList>
        </Container>
    );
};

export default StoreSelectionPage;
