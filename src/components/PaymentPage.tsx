// src/components/PaymentPage.tsx
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { OrderModuleDTO, Product } from '../types';
import { loadScript } from './LoadScript';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './PaymentPage.css';
import PointModal from './PointModal';
import PasswordModal from './PasswordModal';
import Webcam from 'react-webcam';

interface LocationState {
    orderData: OrderModuleDTO;
    selectedProducts: Product[];
}

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const { orderData, selectedProducts } = state;
    const [finalTotalPrice, setFinalTotalPrice] = useState(orderData.price); // 초기 상태 설정

    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isPackaged, setIsPackaged] = useState<boolean | undefined>(undefined);
    const [highlightButtons, setHighlightButtons] = useState(false);
    const [isPointModalOpen, setIsPointModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [storedPhoneNumber, setStoredPhoneNumber] = useState(''); // 전화번호 저장 변수 추가
    const [password, setPassword] = useState('');
    const [existingCustomer, setExistingCustomer] = useState(false);
    const [isValid, setIsValid] = useState(false); // 비밀번호 유효성 상태 추가
    const [points, setPoints] = useState(0); // 포인트 상태 추가
    const authContext = useContext(AuthContext);

    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const loadIamportScript = async () => {
            try {
                await loadScript('https://cdn.iamport.kr/v1/iamport.js');
                await loadScript('https://code.jquery.com/jquery-1.12.4.min.js');
                setIsScriptLoaded(true);
            } catch (error) {
                console.error(error);
            }
        };
        if (capturedImage) {
            uploadImage();
        }

        loadIamportScript();
    }, [catpuredImage]);

    const webcamRef= useRef<Webcam>(null);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            console.log("webcamRef is not null")
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
            console.log("capturedImage: ", imageSrc);
        }
        else {
            console.log("webcamRef is null")
        }
    }, [webcamRef]);

    const uploadImage = async () => {
        if (capturedImage) {
            console.log("there is captured image");
            const response = await fetch(capturedImage);
            const blob = await response.blob();

            let now = new Date();
            let thistime = now.getTime();
            let fileName = thistime.toString() + ".jpg";

            const file = new File([blob], fileName, { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("file", file);

            try {
                const uploadResponse = axios.post(`${API_URL}/test/upload_test`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (error) {
                console.error("Failed to upload image", error);
            }
        } else {
            console.log("there is no captured image");
        }
    };

    const captureAndUpload = () => {
        capture();
    }




    const handlePackagedClick = (isPackaged: boolean) => {
        setIsPackaged(isPackaged);
    };

    const handlePointModalOpen = () => {
        setIsPointModalOpen(true);
    };

    const handlePointModalClose = () => {
        setIsPointModalOpen(false);
        setSearchInput(''); // 모달이 닫힐 때 입력 필드 초기화
    };

    const handlePasswordModalOpen = () => {
        setIsPasswordModalOpen(true);
    };

    const handlePasswordModalClose = () => {
        setIsPasswordModalOpen(false);
        setPassword(''); // 모달이 닫힐 때 비밀번호 필드 초기화
        setIsValid(false); // 모달이 닫힐 때 유효성 상태 초기화
        setStoredPhoneNumber(''); // 모달이 닫힐 때 저장된 전화번호 초기화
        setExistingCustomer(false); // 모달이 닫힐 때 기존 고객 여부 초기화
    };

    const handleSearch = async () => {
        console.log(searchInput); // 입력된 전화번호를 콘솔에 출력
        setStoredPhoneNumber(searchInput); // 검색한 전화번호를 저장
        try {
            const response = await axios.get(`${API_URL}/api/customer/${searchInput}`);
            if (response.status === 200) {
                // 전화번호가 이미 존재하면 비밀번호 입력 모달 열기
                setExistingCustomer(true);
                handlePointModalClose();
                handlePasswordModalOpen();
            } else if (response.status === 404) {
                // 전화번호가 존재하지 않으면 비밀번호 설정 모달 열기
                setExistingCustomer(false);
                handlePointModalClose();
                handlePasswordModalOpen();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response && axiosError.response.status === 404) {
                    // 전화번호가 존재하지 않으면 비밀번호 설정 모달 열기
                    setExistingCustomer(false);
                    handlePointModalClose();
                    handlePasswordModalOpen();
                } else {
                    console.error(error);
                }
            } else {
                console.error(error);
            }
        }
    };

    const handlePasswordSubmit = async () => {
        console.log(storedPhoneNumber); // 저장된 전화번호를 콘솔에 출력
        if (existingCustomer) {
            try {
                const response = await axios.post(`${API_URL}/api/customer/validatePassword`, {
                    phoneNumber: storedPhoneNumber,
                    password: password
                });
                if (response.data.valid) {
                    setIsValid(true);
                    setPoints(response.data.points);
                    authContext?.setCustomerInfo({
                        id: response.data.customer.id,
                        name: response.data.customer.name,
                        phoneNumber: response.data.customer.phoneNumber,
                        points: response.data.customer.points,
                        email: response.data.customer.email,
                        address: response.data.customer.address
                    });
                    authContext?.setUsePointSwitch(true); // usePointSwitch 설정
                } else {
                    alert('비밀번호가 유효하지 않습니다.');
                }
            } catch (error) {
                console.error(error);
                alert('포인트 확인에 실패했습니다.');
            }
        } else {
            // 새 고객 등록 및 비밀번호 설정 로직
            try {
                const response = await axios.post(`${API_URL}/api/customer/register`, {
                    phoneNumber: storedPhoneNumber,
                    password: password
                });
                console.log('Response data:', response.data); // 디버깅
                alert('고객이 등록되었습니다!');
                authContext?.setCustomerInfo({
                    id: response.data.id,
                    name: response.data.name,
                    phoneNumber: response.data.phoneNumber,
                    points: response.data.points,
                    email: response.data.email,
                    address: response.data.address
                });
                authContext?.setUsePointSwitch(true); // usePointSwitch 설정
                handlePasswordModalClose();
            } catch (error) {
                console.error(error);
                alert('고객 등록에 실패했습니다.');
            } finally {
                handlePasswordModalClose();
            }
        }
    };

    const handleUsePoints = () => {
        // 포인트 사용 로직 추가
        const pointsToUse = points; // 사용하려는 포인트 양
        const newTotalPrice = orderData.price - pointsToUse;
        setFinalTotalPrice(newTotalPrice < 0 ? 0 : newTotalPrice); // 최종 결제 금액 업데이트
        handlePasswordModalClose(); // 모달 닫기
        console.log('포인트 사용');
    };

    const handleSkipPoints = () => {
        // 포인트 사용하지 않음 로직 추가
        setFinalTotalPrice(orderData.price); // 최종 결제 금액을 원래대로
        handlePasswordModalClose(); // 모달 닫기
        console.log('포인트 사용 안함');
    };

    const requestPay = () => {
        if (isPackaged === undefined) {
            setHighlightButtons(true);
            setTimeout(() => setHighlightButtons(false), 10000);
            return;
        }

        if (window.IMP) {
            const { IMP } = window;
            IMP.init('imp55148327'); // 가맹점 식별코드

            IMP.request_pay(
                {
                    pg: 'html5_inicis.INIpayTest',
                    pay_method: 'card',
                    merchant_uid: orderData.orderUid, // 주문 번호
                    name: orderData.storeName, // 상품 이름
                    amount: finalTotalPrice, // 최종 결제 금액
                    buyer_email: orderData.email, // 구매자 이메일
                    buyer_name: orderData.storeName, // 구매자 이름
                    buyer_tel: '010-1234-5678', // 임의의 값
                    buyer_addr: orderData.address, // 구매자 주소
                    buyer_postcode: '123-456', // 임의의 값
                },
                async (rsp: any) => {
                    if (rsp.success) {
                        console.log('결제 성공:', rsp);
                        await axios.post(`${API_URL}/api/orders/iamPortDto`, {
                            price: orderData.price,
                            paymentUid: rsp.imp_uid, // 결제 고유번호
                            orderUid: rsp.merchant_uid // 주문번호
                        });
                        try {

                            captureAndUpload();

                            // 결제 성공 시 주문 생성
                            const orderDTO = {
                                customerId: authContext?.customerInfo?.id || 1,
                                kioskId: authContext?.kioskInfo?.id,
                                datetime: new Date(),
                                totalPrice: orderData.price,
                                packaged: isPackaged, // 포장 여부 설정
                                paymentUid: rsp.imp_uid
                            };



                            const response = await axios.post(`${API_URL}/api/orders`, orderDTO);


                            //

                            const orderItemDTOList = selectedProducts.map(product => {
                                return {
                                    paymentUid: orderDTO.paymentUid,
                                    menuId: product.id,
                                    // customOptions: product.options,
                                    quantity: product.quantity,
                                    price: product.price
                                }
                            });

                            for (let i = 0; i < orderItemDTOList.length; i++) {
                                const response2 = await axios.post(
                                    `${API_URL}/api/orderitems`,
                                    orderItemDTOList[i]);
                            }

                            //

                            console.log('서버 응답:', response.data);
                            alert('결제 완료!');

                            // 포인트 사용 및 적립 로직
                            if (authContext?.customerInfo) {
                                if (authContext.usePointSwitch) {
                                    // 포인트 사용 로직
                                    await axios.post(`${API_URL}/api/customer/usePoints`, {
                                        phoneNumber: authContext.customerInfo.phoneNumber,
                                        totalPrice: orderData.price,
                                        pointsToUse: points
                                    });
                                    console.log('포인트가 사용되었습니다.');
                                }

                                // 포인트 적립 로직
                                const pointsToAdd = Math.floor(orderData.price * 0.01);
                                await axios.post(`${API_URL}/api/customer/addPoints`, {
                                    phoneNumber: authContext.customerInfo.phoneNumber,
                                    totalPrice: orderData.price,
                                    pointsToUse: 0 // 적립할 때는 사용 포인트는 0으로 설정
                                });
                                console.log('포인트가 적립되었습니다.');
                            } else {
                                console.log('비회원 결제');
                            }

                            navigate('/guard'); // 결제 완료 후 홈으로 이동
                        } catch (error) {
                            console.error('주문 생성 실패:', error);
                            alert('주문 생성 실패!');
                        }
                    } else {
                        console.error('결제 실패:', rsp.error_msg);
                        alert('결제 실패: ' + rsp.error_msg);
                    }
                }
            );
        } else {
            console.error('Iamport object is not found.');
        }
    };

    const handleTestButtonClick = () => {
        console.log('현재 주문 데이터:', orderData);
        const order = {
            customer: {
                customerID: authContext?.customerInfo?.id || 1,
                customerName: authContext?.customerInfo?.name || 'not registered',
                customerPhone: authContext?.customerInfo?.phoneNumber || 'none',
                points: authContext?.customerInfo?.points || 0,
                email: orderData.email,
                address: orderData.address
            },
            kiosk: {
                id: authContext?.kioskInfo?.id,
                number: authContext?.kioskInfo?.number,
                store: { storeID: authContext?.storeInfo?.id } // Store 객체를 적절히 설정해야 함
            },
            dateTime: new Date(),
            totalPrice: finalTotalPrice,
            isPackaged: isPackaged // 포장 여부 설정
        };
        console.log('생성될 주문 객체:', order);
    };

    const handleInputChange = (input: string) => {
        setSearchInput(input);
    };

    return (
        <div className="payment-page">
            <header className="payment-header">주문목록</header>
            <div className="payment-content">
                <div className="order-list">
                    {selectedProducts.map(product => (
                        <div key={product.id} className="product-item">
                            <h3>{product.name}</h3>
                            <p>가격: {product.price}원</p>
                            <p>수량: {product.quantity}</p>
                            {product.options.map(option => (
                                <p key={option.id}>옵션: {option.name} (+{option.additionalPrice}원)</p>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="payment-options">
                    <button
                        className={`payment-button ${isPackaged === false ? 'selected' : ''} ${highlightButtons && isPackaged === undefined ? 'highlight' : ''}`}
                        onClick={() => handlePackagedClick(false)}
                    >
                        먹고가기
                    </button>
                    <button
                        className={`payment-button ${isPackaged === true ? 'selected' : ''} ${highlightButtons && isPackaged === undefined ? 'highlight' : ''}`}
                        onClick={() => handlePackagedClick(true)}
                    >
                        포장하기
                    </button>
                    <button className="payment-button" onClick={handlePointModalOpen}>
                        포인트 적립 및 사용
                    </button>
                    <button className="payment-button" onClick={handleTestButtonClick}>
                        테스트
                    </button>
                </div>
            </div>
            <footer className="payment-footer">
                <div className="total-amount">결제 금액: {finalTotalPrice}원</div>
                <button className="payment-button" onClick={requestPay} disabled={!isScriptLoaded}>
                    결제하기
                </button>
            </footer>

            <div style={{position: 'absolute', zIndex: -1, width: '1px', height: '1px', overflow: 'hidden'}}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                />
            </div>

            <PointModal
                isOpen={isPointModalOpen}
                onRequestClose={handlePointModalClose}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleSearch={handleSearch}
                handleInputChange={handleInputChange}
            />
            <PasswordModal
                isOpen={isPasswordModalOpen}
                onRequestClose={handlePasswordModalClose}
                password={password}
                setPassword={setPassword}
                handlePasswordSubmit={handlePasswordSubmit}
                isValid={isValid}
                points={points}
                handleUsePoints={handleUsePoints}
                handleSkipPoints={handleSkipPoints}
                storedPhoneNumber={storedPhoneNumber} // 추가된 부분
            />
        </div>
    );
};

export default PaymentPage;

