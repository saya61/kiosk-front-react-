import React, {useState, useRef, useContext, useEffect, useCallback} from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Category from './Category';
import ProductList from './ProductList';
import SelectedItems from './SelectedItems';
import Timer from './Timer';
import CheckoutButton from '../CheckoutButton';
import CustomOptionModal from '../CustomOptionModal';
import axios from '../../api/axiosConfig';
import { Product, CustomOption, OrderModuleDTO, Category as CategoryType } from '../../types';
import Modal from 'react-modal';
import styled, { ThemeProvider } from 'styled-components';
import GetRemoteOrder from "../GetRemoteOrder";
import { lightTheme, highContrastTheme } from '../../themes';
import Webcam from "react-webcam";
import MockAdapter from 'axios-mock-adapter';
import {Button} from "../style/PaymentPageStyles";


const API_URL = process.env.REACT_APP_API_URL;

Modal.setAppElement('#root');

const HomeWrapper = styled.div<{ age: number | null }>`
    max-height: 1920px;
    display: grid;
    overflow: hidden;
    grid-template-areas:
        "header"
        "category"
        "products"
        "selected"
        "timer"
        "footer";
    gap: 1rem;
    background-color: ${({ theme }) => theme.bodyBgColor};
    color: ${({ theme }) => theme.bodyColor};
    
    font-size: ${({ age }) => (age !== null && age >= 60 ? '1.5rem' : '1rem')};
    & > :nth-child(2) {
        padding: ${({ age }) => (age !== null && age >= 60 ? '1rem' : '1rem')};
    }
`;


const FooterWrapper = styled.div`
    display: grid;
    grid-area: footer;
    grid-template-columns: 3fr 7fr;
    align-items: center;
    gap: 1rem;
`;

const ToggleButton = styled.button`
    background-color: ${({ theme }) => theme.checkoutBgColor};
    color: ${({ theme }) => theme.checkoutColor};
    border: none;
    padding: 1rem;
    cursor: pointer;
    &:hover {
        background-color: ${({ theme }) => theme.checkoutHoverBgColor};
    }
`;

const TimerWrapper = styled.div`
    grid-area: timer;
    border: 1px solid ${({ theme }) => theme.timerBorderColor};
    border-radius: 4px;
    padding: 1rem;
    text-align: center;
    color: ${({ theme }) => theme.timerColor};
`;

const PopupWrapper = styled.div`
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -20%);
    background: white;
    border-radius: 10px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
    padding: 20px;
    z-index: 1000;
    width: 300px;
    text-align: center;
`;

const CloseButton = styled.button`
    margin-top: 20px;
    padding: 10px;
    background-color: #ff7f7f;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #ff4c4c;
    }
`;

const MenuHome: React.FC<{ isHighContrast: boolean, setIsHighContrast: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isHighContrast, setIsHighContrast }) => {
    const authContext = useContext(AuthContext);
    const location = useLocation();
    const [selectedProducts, setSelectedProducts] = useState<Product[]>(location.state?.selectedProducts || []);
    const [currentCategory, setCurrentCategory] = useState<number | null>(null);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [currentMenuId, setCurrentMenuId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentSelectedProduct, setCurrentSelectedProduct] = useState<Product | null>(null);
    const [orderData, setOrderData] = useState<OrderModuleDTO | null>(location.state?.orderData || null);
    const timerRef = useRef<{ resetTimer: () => void }>(null);
    const [age, setAge] = useState<number | null>(null);
    const [showVoiceAssistPopup, setShowVoiceAssistPopup] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isWebcamReady, setIsWebcamReady] = useState<boolean>(false);

    const navigate = useNavigate();



    // mock 테스트
    // const mock = new MockAdapter(axios);
    // const mockRekognitionResponse = {
    //     age: 65
    // };
    // mock.onPost(`${API_URL}/human-rekognition/only_image`).reply(200, mockRekognitionResponse); // only_image 실제 백 엔드포인트 대체

    // useEffect(() => {
    //     axios.get(`${API_URL}/api/menus/categories`)
    //         .then(response => {
    //             const updatedCategories = response.data.map((category: CategoryType) => ({
    //                 ...category,
    //                 visible: true // 기본적으로 모든 카테고리를 보이도록 설정
    //             }));
    //             setCategories(updatedCategories);
    //             if (updatedCategories.length > 0) {
    //                 setCurrentCategory(updatedCategories[0].id);
    //             }
    //         })
    //         .catch(error => {
    //             console.error('There was an error fetching the categories!', error);
    //         });
    //     if (webcamRef.current) {
    //         setIsWebcamReady(true);
    //     }
    //
    //     if (isWebcamReady) {
    //         capture();
    //     }
    //
    //     if (capturedImage) {
    //         humanRekognition();
    //     }
    //     if (age) {
    //         alert(`나이: ${age}`);
    //     }
    // }, [capturedImage, isWebcamReady]);

    useEffect(() => {
        // Fetch categories
        axios.get(`${API_URL}/api/menus/categories`)
            .then(response => {
                const updatedCategories = response.data.map((category: CategoryType) => ({
                    ...category,
                    visible: true // 기본적으로 모든 카테고리를 보이도록 설정
                }));
                setCategories(updatedCategories);
                if (updatedCategories.length > 0) {
                    setCurrentCategory(updatedCategories[0].id);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
            });
    }, []); // 빈 종속성 배열로 첫 렌더 시 한 번만 실행

// Webcam이 준비되었을 때만 capture를 실행
    useEffect(() => {
        if (isWebcamReady) {
            const timer = setTimeout(() => {
                capture();
            }, 1000); // 1초 대기
            return () => clearTimeout(timer); // 청소 함수
        }
    }, [isWebcamReady]);

// capturedImage가 있을 때 humanRekognition 실행
    useEffect(() => {
        if (capturedImage) {
            humanRekognition(); // 캡처된 이미지가 있을 때만 실행
        }
    }, [capturedImage]); // capturedImage가 업데이트될 때 실행

// 나이가 설정되었을 때 알림
//     useEffect(() => {
//         if (age) {
//             alert(`나이: ${age}`);
//         }
//     }, [age]); // age가 업데이트될 때만 실행

    useEffect(() => {
        if (age && age >= 60) {
            setShowVoiceAssistPopup(true);
        }
    }, [age]);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setCapturedImage(imageSrc);
                console.log("capture ok");
                console.log(imageSrc);
            } else {
                console.log("Failed to capture image");
            }
        }
    }, [webcamRef]);

    const handleUserMedia = () => {
        console.log("Webcam is ready");
        setIsWebcamReady(true);
    };

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

            try {
                const response = await axios.post(`${API_URL}/human-rekognition/only_image`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const age = response.data.age;
                setAge(age);
                console.log("response_ok")
                console.log(age)

            } catch (error) {
                console.error("Failed to upload image", error);
            }
        }
    };

    const handlePopupClose = () => {
        setShowVoiceAssistPopup(false);
    };

    const handleProductClick = (product: Product) => {
        axios.get(`${API_URL}/api/menus/select-custom-option/${product.id}`)
            .then(response => {
                const options = response.data;
                if (options.length > 0) {
                    setCurrentSelectedProduct({ ...product, quantity: 1, options: [], price: product.price });
                    setCurrentMenuId(product.id);
                    setIsModalOpen(true);
                } else {
                    setSelectedProducts([...selectedProducts, { ...product, quantity: 1, options: [] }]);
                    if (timerRef.current) {
                        timerRef.current.resetTimer();
                    }
                }
            })
            .catch(error => {
                console.error('There was an error fetching the custom options!', error);
            });
    };

    const handleCategoryClick = (categoryId: number) => {
        setCurrentCategory(categoryId);
        if (timerRef.current) {
            timerRef.current.resetTimer();
        }
    };

    const handleIncreaseQuantity = (productId: number, options: CustomOption[]) => {
        setSelectedProducts(selectedProducts.map(p =>
            p.id === productId && areOptionsEqual(p.options, options)
                ? { ...p, quantity: p.quantity + 1 }
                : p
        ));
        if (timerRef.current) {
            timerRef.current.resetTimer();
        }
    };

    const handleDecreaseQuantity = (productId: number, options: CustomOption[]) => {
        const product = selectedProducts.find(p => p.id === productId && areOptionsEqual(p.options, options));
        if (product && product.quantity > 1) {
            setSelectedProducts(selectedProducts.map(p =>
                p.id === productId && areOptionsEqual(p.options, options)
                    ? { ...p, quantity: p.quantity - 1 }
                    : p
            ));
        } else {
            setSelectedProducts(selectedProducts.filter(p => !(p.id === productId && areOptionsEqual(p.options, options))));
        }
        if (timerRef.current) {
            timerRef.current.resetTimer();
        }
    };

    const handleAddOption = (option: CustomOption) => {
        if (currentSelectedProduct) {
            const updatedProduct = {
                ...currentSelectedProduct,
                price: currentSelectedProduct.price + option.additionalPrice,
                options: [...currentSelectedProduct.options, option]
            };
            setCurrentSelectedProduct(updatedProduct);
        }
    };

    const handleRemoveOption = (option: CustomOption) => {
        if (currentSelectedProduct) {
            const updatedProduct = {
                ...currentSelectedProduct,
                price: currentSelectedProduct.price - option.additionalPrice,
                options: currentSelectedProduct.options.filter(opt => opt.id !== option.id)
            };
            setCurrentSelectedProduct(updatedProduct);
        }
    };

    const areOptionsEqual = (options1: CustomOption[], options2: CustomOption[]) => {
        if (options1.length !== options2.length) return false;
        const sizeOption1 = options1.find(opt => opt.name.startsWith('SIZE-'));
        const sizeOption2 = options2.find(opt => opt.name.startsWith('SIZE-'));
        if (sizeOption1?.name !== sizeOption2?.name) return false;
        const sortedOptions1 = options1.filter(opt => !opt.name.startsWith('SIZE-')).map(opt => opt.id).sort();
        const sortedOptions2 = options2.filter(opt => !opt.name.startsWith('SIZE-')).map(opt => opt.id).sort();
        return sortedOptions1.every((value, index) => value === sortedOptions2[index]);
    };

    const handleModalClose = () => {
        if (currentSelectedProduct) {
            const existingProduct = selectedProducts.find(p =>
                p.id === currentSelectedProduct.id && areOptionsEqual(p.options, currentSelectedProduct.options)
            );
            if (existingProduct) {
                setSelectedProducts(selectedProducts.map(p =>
                    p.id === currentSelectedProduct.id && areOptionsEqual(p.options, currentSelectedProduct.options)
                        ? { ...p, quantity: p.quantity + currentSelectedProduct.quantity, price: currentSelectedProduct.price }
                        : p
                ));
            } else {
                setSelectedProducts([...selectedProducts, currentSelectedProduct]);
            }
            if (timerRef.current) {
                timerRef.current.resetTimer();
            }
        }
        setIsModalOpen(false);
    };

    const handleModalCancel = () => {
        if (timerRef.current) {
            timerRef.current.resetTimer();
        }
        setIsModalOpen(false);
    };

    const handleCheckoutClick = (orderData: OrderModuleDTO) => {
        setOrderData(orderData);
        navigate('/payment', { state: { orderData, selectedProducts } });
    };

    const totalPrice = selectedProducts.reduce((total, product) => total + product.price * product.quantity, 0);

    const toggleCategoryVisibility = (categoryId: number) => {
        setCategories(categories.map(category =>
            category.id === categoryId ? { ...category, visible: !category.visible } : category
        ));
    };

    const toggleHighContrast = () => {
        setIsHighContrast(!isHighContrast);
    };

    const [ttsmodon, setTtsmodon] = useState<boolean>(false);

    return (
        <ThemeProvider theme={isHighContrast ? highContrastTheme : lightTheme}>
            <HomeWrapper age={age}>
                <Header/>
                <GetRemoteOrder/>
                <Category
                    categories={categories.filter(category => category.visible)}
                    onCategoryClick={handleCategoryClick}
                    age = {age}
                />
                {currentCategory && (
                    <ProductList
                        categoryId={currentCategory}
                        onProductClick={handleProductClick}
                        age={age}
                    />
                )}
                {currentMenuId && currentSelectedProduct && (
                    <CustomOptionModal
                        isOpen={isModalOpen}
                        onRequestClose={handleModalClose}
                        onRequestCancel={handleModalCancel}
                        menuId={currentMenuId}
                        selectedProduct={currentSelectedProduct}
                        onAddOption={handleAddOption}
                        onRemoveOption={handleRemoveOption}
                        onUpdateProduct={(updatedProduct: Product) => setCurrentSelectedProduct(updatedProduct)}
                    />
                )}
                <SelectedItems
                    selectedProducts={selectedProducts}
                    onClear={() => setSelectedProducts([])}
                    onIncreaseQuantity={(productId, options) => handleIncreaseQuantity(productId, options)}
                    onDecreaseQuantity={(productId, options) => handleDecreaseQuantity(productId, options)}
                    age={age}  // age prop 추가
                />
                <TimerWrapper>
                    <Timer ref={timerRef}/>
                </TimerWrapper>
                <FooterWrapper>
                    <ToggleButton onClick={toggleHighContrast}>Toggle High Contrast</ToggleButton>
                    <CheckoutButton
                        selectedProducts={selectedProducts}
                        totalPrice={totalPrice}
                        onCheckoutClick={handleCheckoutClick}
                    />
                </FooterWrapper>
                <div>
                    <h3>현재 키오스크: {authContext?.kioskInfo?.number}</h3>
                </div>
                <div style={{position: 'absolute', zIndex: -1, width: '1px', height: '1px', overflow: 'hidden'}}>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        onUserMedia={handleUserMedia}
                    />
                </div>
                {showVoiceAssistPopup && (
                    <PopupWrapper>
                        <h3>음성 인식이 가능합니다!</h3>
                        <p>예시: "따뜻한 아메리카노 한 잔 작은 사이즈로 주문해줘"</p>
                        <CloseButton onClick={handlePopupClose}>닫기</CloseButton>
                    </PopupWrapper>
                )}
            </HomeWrapper>
        </ThemeProvider>
    );
};

export default MenuHome;
