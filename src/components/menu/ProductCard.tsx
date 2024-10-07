import React from 'react';
import { Product } from '../../types';
import styled from 'styled-components';
import './Menu.css'

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

const ProductCardWrapper = styled.div`
    border: 1px solid ${({ theme }) => theme.productBorderColor};
    border-radius: 4px;
    padding: 1rem;
    text-align: center;
    width: 100%;
    max-width: 350px;
    cursor: pointer;
    color: ${({ theme }) => theme.productTextColor};
    box-sizing: border-box;
`;

const ProductImage = styled.img`
    width: 200px; // 원하는 고정 너비
    height: 200px; // 원하는 고정 높이
    object-fit: cover; // 이미지가 부모 요소의 크기에 맞춰지도록 조정합니다.
    border-radius: 4px;
`;

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    return (
        <ProductCardWrapper onClick={onClick}>
            <head>
                {/* Google Fonts link */}
                <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap"
                      rel="stylesheet"/>
            </head>
            <ProductImage src={product.imageUrl} alt={product.name}/>
            <h2 className="custom-font">{product.name}</h2>
            <p className="custom-font1">{product.price}원</p>
            <p className="custom-font1">{product.description}</p>
        </ProductCardWrapper>
    );
}

export default ProductCard;
