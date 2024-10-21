import React from 'react';
import { Product, OrderModuleDTO } from '../types';
import axios from "axios";
import styled from 'styled-components';

const CheckoutButtonWrapper = styled.button<{ isHighContrast: boolean | null }>`
    color: ${({ theme }) => theme.checkoutColor};
    border: none;
    cursor: pointer;
    font-size: 24px; /* 버튼 글꼴 크기 증가 */
    padding: 20px 30px; /* 버튼 패딩 증가 */
    width: 60%; /* 너비 설정 */
    border-radius: 50px;
    margin-top: 20px;
    margin-left: 31%;
    background-color: ${({ isHighContrast }) => (isHighContrast ? 'yellow' : 'black')}; /* 노란색 또는 검정색 */

    &:hover {
        background-color: ${({ theme, isHighContrast }) => (isHighContrast ? '#ffd700' : theme.checkoutHoverBgColor)}; /* 호버 색상 변경 */
    }
`;

const API_URL = process.env.REACT_APP_API_URL;

interface CheckoutButtonProps {
    selectedProducts: Product[];
    totalPrice: number;
    onCheckoutClick: (orderData: OrderModuleDTO) => void;
    isHighContrast: boolean | null; // 추가된 isHighContrast 프로퍼티
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ selectedProducts, totalPrice, onCheckoutClick, isHighContrast }) => {
    const handleCheckout = () => {
        const adminName = localStorage.getItem('adminId');
        axios.get(`${API_URL}/api/request_payment/check_out/${adminName}`)
            .then(response => {
                const data = response.data;
                console.log(data);
                const orderData: OrderModuleDTO = {
                    id: data.id,
                    price: totalPrice,
                    storeName: data.storeName,
                    email: data.email,
                    address: data.address,
                    status: data.status,
                    paymentUid: '',
                    orderUid: data.orderUid
                };

                console.log('Checkout data:', orderData);
                onCheckoutClick(orderData);
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <CheckoutButtonWrapper onClick={handleCheckout} isHighContrast={isHighContrast}>
            결제하기
        </CheckoutButtonWrapper>
    );
};

export default CheckoutButton;
