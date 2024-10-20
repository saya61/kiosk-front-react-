import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import './AdminDashboardGlobal.css';
import RefundManagement from "./RefundManagement";

interface Image {
    url: string;
    name: string;
}

const GuardImgManagement: React.FC = ()=>{
    const [imgs, setImgs] = useState<Image[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [desiredFileName, setDesiredFileName] = useState('');
    const [imageWidth, setImageWidth] = useState(200); // 기본값 예시
    const [imageHeight, setImageHeight] = useState(200); // 기본값 예시
    // 모달 상태
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        axios.get(`${API_URL}/admin/img/guardImgsName`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }})
            .then(response => setImgs(response.data))
            .catch(error => console.error('Error fetching imgs:', error));
    }, [imgs.length]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDesiredFileName(event.target.value);
    };

    const handleImageResize = (width: number, height: number) => {
        setImageWidth(width);
        setImageHeight(height);
    };

    const handleUpload = async () => {
        if (!file || !desiredFileName) {
            alert('파일과 파일 이름을 입력해주세요.');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = async () => {
            canvas.width = imageWidth;
            canvas.height = imageHeight;
            ctx?.drawImage(img, 0, 0, imageWidth, imageHeight);

            canvas.toBlob(async (blob) => {
                if(blob){
                    const formData = new FormData();
                    formData.append('file', blob, desiredFileName);
                    formData.append('fileName', desiredFileName);

                    try {
                        const response = await uploadImg(formData)
                        console.log('성공:', response);
                        setShowAddModal(false);
                    } catch (error) {
                        console.error('실패:', error);
                    }
                }
                else {
                    console.log("Blob 오류");
                }
            });
        };
        img.src = URL.createObjectURL(file);
    };

    const API_URL = process.env.REACT_APP_API_URL;


    const uploadImg = async (formData: FormData) => {
        try {
            await axios.post(
                `${API_URL}/admin/img/saveGuardImg`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`}
                }
            ).then(response => {
                setImgs([...imgs,{url:response.data.url, name: response.data.name}]);
                setShowAddModal(false);
            });
        } catch (error) {
            console.error('실패:', error);
        }
    };

    // 이미지 지우기
    const deleteImg = (url: string) => {
        if (!window.confirm("정말로 삭제하시겠습니까?")) {
            return;
        }
        axios.delete(`${API_URL}/admin/img/delete`, { params: { url } })
            .then(() => {
                setImgs(imgs.filter(img => img.url !== url))
                alert('삭제되었습니다');
            })
            .catch(error => console.error('Error deleting category:', error));
    };

    return (
        <div className="container">
            <head>
                {/* Google Fonts link */}
                <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap"
                      rel="stylesheet"/>
            </head>
            <h2 className="custom-font">이미지 관리</h2>
            <button className="add-button-right" onClick={() => setShowAddModal(true)}>+ 이미지 추가</button>
            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3 className="custom-font">이미지 업로드</h3>
                        <input type="file" onChange={handleFileChange}/>
                        <input
                            type="text"
                            placeholder="파일 이름을 입력하세요"
                            value={desiredFileName}
                            onChange={handleFileNameChange}
                        />
                        <label>
                            가로 크기:
                            <input
                                type="number"
                                value={imageWidth}
                                onChange={(e) => handleImageResize(Number(e.target.value), imageHeight)}
                            />
                        </label>
                        <label>
                            세로 크기:
                            <input
                                type="number"
                                value={imageHeight}
                                onChange={(e) => handleImageResize(imageWidth, Number(e.target.value))}
                            />
                        </label>
                        <button onClick={handleUpload}>업로드</button>
                        <button onClick={() => setShowAddModal(false)}>닫기</button>
                    </div>
                </div>
            )}
            <table>
                <thead>
                <tr>
                    <th className="custom-font1">이미지</th>
                    <th className="custom-font1">이름</th>
                    <th className="custom-font1">액션</th>
                </tr>
                </thead>
                <tbody>
                {imgs.map((img, index) => (
                    <tr key={index}>
                        <td><img src={img.url} alt={"None"}/></td>
                        <td>{img.name}</td>
                        <td>
                            <button onClick={() => deleteImg(img.url)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}


export default GuardImgManagement;