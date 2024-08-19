import axios from 'axios';

// 요청 인터셉터 설정
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.withCredentials = true; // withCredentials 설정 추가
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axios;
