// src/api/sirenAuth.ts
import axios from './axiosConfig';
import { buildUrl } from '../utils/utils';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    throw new Error('API_URL is not defined');
}

export const loginSirenUser = async (name: string, password: string) => {
    try {
        const response = await axios.post(buildUrl(API_URL, '/api/kk/siren/user/login'), {
            name,
            password
        });
        return response.data; // 성공 시 액세스 토큰 및 리프레시 토큰 반환
    } catch (error) {
        throw error;
    }
};

export const fetchSirenUserInfo = async (userId: number) => {
    try {
        const response = await axios.get(buildUrl(API_URL, `/api/kk/siren/user/${userId}`));
        return response.data; // 성공 시 사용자 정보 반환
    } catch (error) {
        throw error;
    }
};
