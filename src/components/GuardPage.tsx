import React, {useEffect, useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from "axios";
import './GuardPage.css';

interface Image {
    url: string;
}
import './Webfont.css'

const GuardPage: React.FC = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [imgs, setImgs] = useState<Image[]>([]);
    const [img, setImg] = useState<Image>();

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchImg = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/guardImgs`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log('Response data:', response.data);
                const imgList: Image[] = response.data.map((url: string) => ({url}));
                setImgs(imgList);
                console.log('Fetched images:', imgList);
            } catch (error) {
                console.error('Failed to fetch image', error);
            }
        };

        fetchImg();

        // GuardPage로 돌아갈 때 usePointSwitch 초기화
        authContext?.setUsePointSwitch(false);
    }, [authContext]);

    // 3초 마다 이미지 변경
    useEffect(() => {
        if(imgs != null && imgs.length > 0){
            let index = 0;
            const interval = setInterval(()=> {
                setImg(imgs[index]);
                index = (index + 1) % imgs.length;
            }, 3000)
            // 타이머를 정리하는 함수
            return () => clearInterval(interval);
        }
    }, [imgs]);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div className="kiosk-main">
            {img? (
                // 이미지가 있을 때
                <div>
                    <img src={img?.url} onClick={() => handleNavigation('/menu')} alt={"이미지 로딩 실패"}/>
                </div>
            ) : (
                // 이미지가 없을 때
                <div>
                    <h1 className="custom-font">Welcome to Easy KIOSK</h1>
                    <div className="button-container">
                        <button onClick={() => handleNavigation('/menu')} className="kiosk-button">
                            주문하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuardPage;
