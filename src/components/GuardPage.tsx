import React, {useEffect, useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from "axios";
import './GuardPage.css';
import './Webfont.css'
import BackgroundImageComponent from './BackgroundImageComponent';

interface Image {
    url: string;
}


const GuardPage: React.FC = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [imgs, setImgs] = useState<Image[]>([]);
    const [img, setImg] = useState<Image>();
    const storedImgs = localStorage.getItem('imgs');
    const imgList = storedImgs ? JSON.parse(storedImgs) : [];

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchImg = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/img/guardImgs`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Response data:', response.data);
            const imgList: Image[] = response.data.map((url: string) => ({url}));
            localStorage.setItem('imgs', JSON.stringify(imgList));
            console.log(localStorage.getItem('imgs'));
            // setImgs(imgList);
            console.log('Fetched images:', imgList);
        } catch (error) {
            console.error('Failed to fetch image', error);
        }
    };

    useEffect(() => {
        setImgs(imgList);
        fetchImg();
    }, []);

    useEffect(() => {
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
                        <div className="button-container">
                            <BackgroundImageComponent imagePath={img.url}/>
                            <button onClick={() => handleNavigation('/menu')} className="kiosk-button">
                                주문하기
                            </button>
                            {/*<button onClick={() => handleNavigation('/menu')} className="kiosk-button"><OrderWithGpt/></button>*/}
                        </div>
                    </div>
            ) : (
                // 이미지가 없을 때
                <div>
                <h1 className="custom-font">Welcome to Easy KIOSK</h1>
                    <div className="button-container">
                        <button onClick={() => handleNavigation('/menu')} className="kiosk-button">
                            주문하기
                        </button>
                        {/*<button onClick={() => handleNavigation('/menu')} className="kiosk-button"><OrderWithGpt/></button>*/}
                    </div>
                </div>
            )}
        </div>
    );
};


export default GuardPage;
