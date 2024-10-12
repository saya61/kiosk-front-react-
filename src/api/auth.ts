import axios from './axiosConfig';
import { buildUrl } from '../utils/utils';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    throw new Error('API_URL is not defined');
}

export const login = async (name: string, password: string) => {
    try {
        const response = await axios.post(buildUrl(API_URL, '/api/kk/kiosk/login'), {
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
        // const response = await axios.get(buildUrl(API_URL, `/api/kk/store/${adminId}`));
        const response = await axios.get(buildUrl(API_URL, `/api/kk/store/list/${adminId}`));
        console.log('Admin I2D:', localStorage.getItem('adminId'));
        return response.data; // 성공 시 상점 정보 반환
    } catch (error) {
        throw error;
    }
};
