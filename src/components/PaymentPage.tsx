import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { OrderModuleDTO, Product } from '../types';
import { loadScript } from './LoadScript';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './PaymentPage.css';
import { lightTheme } from '../themes';
import {
    PaymentPageWrapper,
    PaymentHeader,
    PaymentContent,
    OrderList,
    OptionBox,
    PaymentOptions,
    Button,
    PaymentFooter,
    TotalAmount,
    PaymentButton,
    ProductItem,
    GoBackButton, ProductInfo,PageButton,PaginationWrapper
} from './style/PaymentPageStyles';
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
    const { orderData, selectedProducts: initialSelectedProducts } = state;

    const [selectedProducts, setSelectedProducts] = useState<Product[]>(initialSelectedProducts);
    const [finalTotalPrice, setFinalTotalPrice] = useState(orderData.price);// 초기 상태 설정

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 4;

    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isPackaged, setIsPackaged] = useState<boolean | undefined>(undefined);
    const [highlightButtons, setHighlightButtons] = useState(false);
    const [isPointModalOpen, setIsPointModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [storedPhoneNumber, setStoredPhoneNumber] = useState('');// 전화번호 저장 변수 추가
    const [password, setPassword] = useState('');
    const [existingCustomer, setExistingCustomer] = useState(false);
    const [isValid, setIsValid] = useState(false);// 비밀번호 유효성 상태 추가
    const [points, setPoints] = useState(0);// 포인트 상태 추가
    const authContext = useContext(AuthContext);

    const [order, setOrder] = useState<any>(null);
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
            humanRekognition();
        }

        loadIamportScript();
    }, [capturedImage]);

    const webcamRef = useRef<Webcam>(null);
// const uploadImage = async () => {
    //     if (capturedImage) {
    //         console.log("there is captured image");
    //         const response = await fetch(capturedImage);
    //         const blob = await response.blob();
    //
    //         let now = new Date();
    //         let thistime = now.getTime();
    //         let fileName = thistime.toString() + ".jpg";
    //
    //         const file = new File([blob], fileName, { type: "image/jpeg" });
    //
    //         const formData = new FormData();
    //         formData.append("file", file);
    //
    //         try {
    //             const uploadResponse = axios.post(`${API_URL}/test/upload_test`, formData, {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             });
    //         } catch (error) {
    //             console.error("Failed to upload image", error);
    //         }
    //     } else {
    //         console.log("there is no captured image");
    //     }
    // };

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
        }
    }, [webcamRef]);

    const humanRekognition = async () => {
        if (capturedImage) {
            const response = await fetch(capturedImage);
            const blob = await response.blob();

            let now = new Date();
            let thistime = now.getTime();
            let fileName = thistime.toString() + ".jpg";

            const file = new File([blob], fileName, { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("image", file);
            formData.append("order", new Blob([JSON.stringify(order)], { type: "application/json" }));

            try {
                await axios.post(`${API_URL}/human-rekognition/image`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } catch (error) {
                console.error("Failed to upload image", error);
            }
        }
        // const captureAndUpload = () => {
        //     capture();
        // }
    };

    const humanRekognitionAndUpload = () => {
        capture();
    };

    const handlePackagedClick = (isPackaged: boolean) => {
        setIsPackaged(isPackaged);
    };

    const handlePointModalOpen = () => {
        setIsPointModalOpen(true);
    };

    const handlePointModalClose = () => {
        setIsPointModalOpen(false);
        setSearchInput('');
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
                    authContext?.setUsePointSwitch(true);
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
                alert('고객이 등록되었습니다!');
                authContext?.setCustomerInfo({
                    id: response.data.id,
                    name: response.data.name,
                    phoneNumber: response.data.phoneNumber,
                    points: response.data.points,
                    email: response.data.email,
                    address: response.data.address
                });
                authContext?.setUsePointSwitch(true);
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
        const pointsToUse = points;
        const newTotalPrice = orderData.price - pointsToUse;
        setFinalTotalPrice(newTotalPrice < 0 ? 0 : newTotalPrice);
        handlePasswordModalClose();
    };

    const handleSkipPoints = () => {
        setFinalTotalPrice(orderData.price);
        handlePasswordModalClose();
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
                            await axios.post(`${API_URL}/api/orders/createOrderRequest`, {
                                storeId: authContext?.storeInfo?.id,
                                kioskId: authContext?.kioskInfo?.id,
                                productId: selectedProducts.map(p => p.id).join(","),
                                orderId: orderData.orderUid,
                                payload: rsp.imp_uid
                            });
                            // 결제 성공 시 주문 생성
                            const orderDTO = {
                                customerId: authContext?.customerInfo?.id || 1,
                                kioskId: authContext?.kioskInfo?.id,
                                datetime: new Date(),
                                totalPrice: orderData.price,
                                packaged: isPackaged,// 포장 여부 설정
                                paymentUid: rsp.imp_uid
                            };

                            //const response = await axios.post(`${API_URL}/api/orders`, orderDTO);
                            // 새로고침한 뒤에 문제 생김 (해결)
                            const response = await axios.post(`${API_URL}/api/orders`, orderDTO, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                }
                            });
                            //response가 order임
                            setOrder(response.data);
                            await humanRekognitionAndUpload();

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
                                await axios.post(`${API_URL}/api/orderitems`, orderItemDTOList[i]);
                            }

                            // alert('결제 완료!');
                            setSelectedProducts([]);
                            // navigate('/guard');

                            let orderid = response.data.id;
                            navigate(`/order-number/${orderid}`)

                        } catch (error) {
                            console.error('주문 생성 실패:', error);
                            // alert('주문 생성 실패!');
                        }
                    } else {
                        console.error('결제 실패:', rsp.error_msg);
                        // alert('결제 실패: ' + rsp.error_msg);
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
                store: { storeID: authContext?.storeInfo?.id }
            },
            dateTime: new Date(),
            totalPrice: finalTotalPrice,
            isPackaged: isPackaged
        };
        console.log('생성될 주문 객체:', order);
    };

    const handleInputChange = (input: string) => {
        setSearchInput(input);
    };

    const handleGoBack = () => {
        navigate('/menu', { state: { selectedProducts } });
    };

    // 페이징 로직
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = selectedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(selectedProducts.length / productsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <PaymentPageWrapper>
            <PaymentHeader>
                <GoBackButton onClick={handleGoBack}>뒤로가기</GoBackButton>주문목록
            </PaymentHeader>
            <PaymentContent>
                <OrderList>
                    {currentProducts.map(product => (
                        <ProductItem key={product.id}>
                            <ProductInfo>
                            <h3>{product.name}</h3>
                            <p>가격: {product.price}원</p>
                            <p>수량: {product.quantity}</p>
                            </ProductInfo>
                            <OptionBox>
                                {product.options.map(option => (
                                    <p key={option.id}>옵션: {option.name} (+{option.additionalPrice}원)</p>
                                ))}
                            </OptionBox>
                        </ProductItem>
                    ))}
                </OrderList>
                <PaymentOptions>
                    <Button
                        selected={isPackaged === false}
                        onClick={() => handlePackagedClick(false)}
                        highlight={highlightButtons && isPackaged === undefined}
                    >
                        먹고가기
                    </Button>
                    <Button
                        selected={isPackaged === true}
                        onClick={() => handlePackagedClick(true)}
                        highlight={highlightButtons && isPackaged === undefined}
                    >
                        포장하기
                    </Button>
                    <Button onClick={handlePointModalOpen}>
                        포인트 적립 및 사용
                    </Button>
                    <Button onClick={handleTestButtonClick}>
                        테스트
                    </Button>
                </PaymentOptions>
            </PaymentContent>

            <PaginationWrapper>
                <PageButton onClick={handlePreviousPage} disabled={currentPage === 1}>
                    이전
                </PageButton>
                <span>{currentPage} / {Math.ceil(selectedProducts.length / productsPerPage)}</span>
                <PageButton onClick={handleNextPage} disabled={currentPage === Math.ceil(selectedProducts.length / productsPerPage)}>
                    다음
                </PageButton>
            </PaginationWrapper>

            <PaymentFooter>
                <TotalAmount>결제 금액: {finalTotalPrice}원</TotalAmount>
                <PaymentButton onClick={requestPay} disabled={!isScriptLoaded}>
                    결제하기
                </PaymentButton>
            </PaymentFooter>

            <div style={{ position: 'absolute', zIndex: -1, width: '1px', height: '1px', overflow: 'hidden' }}>
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
                storedPhoneNumber={storedPhoneNumber}
            />
        </PaymentPageWrapper>
    );
};

export default PaymentPage;
