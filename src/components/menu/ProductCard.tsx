import React from 'react';
import { Product } from '../../types';
import styled from 'styled-components';
import './Menu.css'

interface ProductCardProps {
    product: Product;
    onClick: () => void;
    age: number | null;
}

const ProductCardWrapper = styled.div<{ age: number | null }>`
    border: 1px solid ${({ theme }) => theme.productBorderColor};
    border-radius: 4px;
    margin: ${({ age }) => (age && age > 60 ? '5rem' : '0rem')}; // 나이에 따라 마진 조정
    text-align: center;
    width: 100%;
    max-width: 800px; // 최대 너비 조정
    cursor: pointer;
    color: ${({ theme }) => theme.productTextColor};
    box-sizing: border-box;
    transform: ${({ age }) => (age && age > 60 ? 'scale(1.1)' : 'scale(1)')};
    transition: transform 0.2s ease-in-out; // 스무스한 스케일 효과
`;

const ProductImage = styled.img<{ age: number | null }>`
    width: ${({ age }) => (age && age > 60 ? '400px' : '140px')};
    height: ${({ age }) => (age && age > 60 ? '300px' : '150px')};
    object-fit: cover;
    border-radius: 4px;
    gap:10rem;
`;

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, age }) => {
    return (
        <ProductCardWrapper onClick={onClick} age={age}>
            <head>
                {/* Google Fonts link */}
                <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap"
                      rel="stylesheet"/>
            </head>
            <ProductImage src={product.imageUrl} alt={product.name} age={age} />
            <h2 style={{ fontSize: age && age > 60 ? '2rem' : '1rem' }}>{product.name}</h2>
            <p style={{ fontSize: age && age > 60 ? '1.5rem' : '1rem' }}>{product.price}원</p>
            <p style={{ fontSize: age && age > 60 ? '1.5rem' : '1rem' }}>{product.description}</p>
        </ProductCardWrapper>
    );
}

export default ProductCard;
