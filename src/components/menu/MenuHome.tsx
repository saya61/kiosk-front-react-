import React, { useState, useRef, useContext, useEffect } from 'react';
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

const API_URL = process.env.REACT_APP_API_URL;

Modal.setAppElement('#root');

const HomeWrapper = styled.div`
    display: grid;
    grid-template-areas:
    "header"
    "category"
    "products"
    "selected"
    "timer"
    "footer";
    gap: 1rem;
    padding: 1rem;
    background-color: ${({ theme }) => theme.bodyBgColor};
    color: ${({ theme }) => theme.bodyColor};
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
    const navigate = useNavigate();

    useEffect(() => {
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
    }, []);

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

    return (
        <ThemeProvider theme={isHighContrast ? highContrastTheme : lightTheme}>
            <HomeWrapper>
                <Header />
                <GetRemoteOrder />
                <Category
                    categories={categories.filter(category => category.visible)}
                    onCategoryClick={handleCategoryClick}
                />
                {currentCategory && (
                    <ProductList
                        categoryId={currentCategory}
                        onProductClick={handleProductClick}
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
                />
                <TimerWrapper>
                    <Timer ref={timerRef} />
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
            </HomeWrapper>
        </ThemeProvider>
    );
};

export default MenuHome;
