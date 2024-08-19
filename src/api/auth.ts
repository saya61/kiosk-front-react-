import axios from './axiosConfig';

const API_URL = process.env.REACT_APP_API_URL;

export const login = async (name: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/kk/kiosk/login`, {
            name,
            password
        });
        return response.data; // 성공 시 JWT 토큰 반환
    } catch (error) {
        throw error;
    }
};

export const fetchStoreInfo = async (adminId: number) => {
    try {
        const response = await axios.get(`${API_URL}/api/kk/store/${adminId}`);
        return response.data; // 성공 시 상점 정보 반환
    } catch (error) {
        throw error;
    }
};
