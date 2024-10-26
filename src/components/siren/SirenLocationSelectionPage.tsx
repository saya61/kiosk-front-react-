import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from "axios";

const API_URL = "구글 맵 키!!!"

const containerStyle = {
    width: '100%',
    height: '500px',
};

const center = {
    lat: 37.64411773348376, // 서울특별시 노원구 화랑로 815 위치
    lng: 127.10440167864394,
};

// 라벨 스타일
const labelStyle = {
    backgroundColor: 'orange',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center' as 'center',
    marginTop: '10px',
    fontWeight: 'bold',
};

const labelTextStyle = {
    backgroundColor: 'white',
    color: 'black',
    padding: '10px',
    borderRadius: '5px',
};

// 버튼 스타일
const buttonContainerStyle = {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
};

const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'orange',
};

const SirenLocationSelectionPage: React.FC = () => {
    const [currentLocation, setCurrentLocation] = useState('지도에서 위치를 클릭하세요.');
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [savedLocation, setSavedLocation] = useState<{ location: string; latitude: number; longitude: number } | null>(null);
    const navigate = useNavigate();

    const location = useLocation();
    const userId = location.state?.userId || null; // userId가 없으면 null로 설정

    useEffect(() => {
        if (!userId) {
            console.error('User ID is missing');
        } else {
            console.log('User ID:', userId);
        }
    }, [userId]);


    // 마커 근처에 있는 상점을 검사하는 함수
    const checkNearbyStores = (lat: number, lng: number) => {
        // 상점 위치 배열 (더미)
        const stores = [
            { name: '하이오 커피', lat: 37.644078755576835, lng: 127.11023125827136 },
            { name: '린스 테이블', lat: 37.64423540010826, lng: 127.10986375808716 },
            { name: '이디야 커피', lat: 37.643713999904485, lng: 127.11023390293121 }
        ];

        const nearbyStores = stores.filter(store => {
            const distance = haversineDistance(lat, lng, store.lat, store.lng);
            return distance <= 2; // 반경 2km 이내
        });
        return nearbyStores;
    };

    // 두 좌표 사이의 거리를 계산하는 함수 (단위: km)
    const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const R = 6371; // 지구 반지름 (단위: km)
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLng = (lng2 - lng1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // 거리 계산
        return distance;
    };

    // 지도 클릭 시 장소 이름과 위도, 경도를 가져오는 함수
    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const latLng = event.latLng; // TypeScript에서 안전하게 latLng를 사용하기 위해 변수로 할당
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const placeName = results[0].formatted_address;
                    const lat = latLng.lat();
                    const lng = latLng.lng();
                    setCurrentLocation(`${placeName}`);
                    setMarkerPosition({ lat, lng });

                    // 가까운 상점 검사
                    const nearbyStores = checkNearbyStores(lat, lng);
                    console.log('Nearby stores:', nearbyStores);
                } else {
                    console.error('Geocoder failed due to:', status);
                }
            });
        } else {
            console.error('event.latLng is null');
        }
    };

    // 서버로 위치 데이터를 보내는 함수
    const sendLocationToServer = async (locationData: { location: string; latitude: number; longitude: number }) => {
        try {
            console.log(userId)
            const response = await axios.post('http://localhost:8080/api/siren-user/location/renew', {
                id: userId, // 전달받은 유저 ID 사용
                address: locationData.location,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
            });

            console.log('서버 응답:', response.data);
        } catch (error) {
            console.error('서버로 위치 전송 중 오류 발생:', error);
        }
    };

    // 확인 버튼 클릭 시 현재 위치 저장
    const handleConfirmClick = () => {
        if (markerPosition) {
            const locationData = {
                location: currentLocation,
                latitude: markerPosition.lat,
                longitude: markerPosition.lng,
            };
            setSavedLocation(locationData);

            sendLocationToServer(locationData);

            console.log('Saved Location:', locationData);
        } else {
            console.error('Marker position is null');
        }
    };


    // 뒤로가기 버튼 클릭 시 홈 페이지로 이동
    const handleBackClick = () => {
        navigate('/siren');
    };

    return (
        <div>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={16}
                    onClick={handleMapClick} // 지도 클릭 이벤트 핸들러 추가
                >
                    {markerPosition && (
                        <Marker
                            position={markerPosition} // 마커 위치 설정
                        />
                    )}
                </GoogleMap>
            </LoadScript>
            <div style={labelStyle}>
                <div style={labelTextStyle}>
                    현재 위치: {currentLocation}
                </div>
                <div style={buttonContainerStyle}>
                    <button style={buttonStyle} onClick={handleBackClick}>
                        뒤로가기
                    </button>
                    <button style={buttonStyle} onClick={handleConfirmClick}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SirenLocationSelectionPage;
