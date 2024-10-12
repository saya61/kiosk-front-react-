import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import styled from 'styled-components';

const API_URL = process.env.REACT_APP_API_URL;

const ProductListWrapper = styled.div<{ age: number | null }>`
   
    display: grid;
    grid-template-columns: repeat(4, 1fr); // 4열 그리드
    grid-template-rows: repeat(2, 1fr);   // 4행 그리드
    grid-gap: 1rem;                       // 항목 간의 간격 설정
    width: 100%;
    max-width: 1000px;
    ${({ age }) => age && age > 60 && `
     margin-top:-7rem;
        height: 50vh;
        display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap:  'nowrap';
    width: 100%;
    max-width: 1000px;
    `}
`;

const ProductGridItem = styled.div`
    flex: 0 0 23%; // 4열 그리드를 위한 너비 (각 항목이 4열 중 하나로 표시됨)
    margin: 1%;
    box-sizing: border-box;
`;

const PrevButton = styled.button<{ disabled: boolean ; isClicked: boolean }>`
    font-size: 4rem;
    background-color: ${({ isClicked }) => (isClicked ? '#f68558' : '#f68558')}; // 클릭 상태에 따라 주황색
    border: none;
    cursor: pointer;
    margin-left: 5rem;

    &:disabled {
        background-color: #777777; // 비활성화 시 색상
    }
`;

const NextButton = styled.button<{ disabled: boolean ; isClicked: boolean }>`
    font-size: 4rem;
    background-color: ${({ isClicked }) => (isClicked ? '#f68558' : '#f68558')}; // 클릭 상태에 따라 주황색
    border: none;
    cursor: pointer;
    margin-right:5rem;
`;

const NavigationWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
`;

interface ProductListProps {
    categoryId: number | null;
    onProductClick: (product: Product) => void;
    age: number | null;
}

const ProductList: React.FC<ProductListProps> = ({ categoryId, onProductClick, age }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); // 페이지네이션을 위한 현재 페이지

    const productsPerPage = 12; // 한 페이지에 보여줄 제품 수

    const [isPrevClicked, setIsPrevClicked] = useState(false);
    const [isNextClicked, setIsNextClicked] = useState(false);

    useEffect(() => {
        if (categoryId !== null) {
            axios.get(`${API_URL}/api/menus/${categoryId}`)
                .then(response => {
                    const data = response.data;
                    if (Array.isArray(data)) {
                        setProducts(data.map((product: any) => ({
                            ...product,
                            imageUrl: product.image
                        })));
                        setCurrentIndex(0); // 카테고리 변경 시 currentIndex 초기화
                        setCurrentPage(0); // 페이지도 초기화
                    } else {
                        console.error('API 응답이 배열이 아닙니다', data);
                        setProducts([]);
                    }
                })
                .catch(error => {
                    console.error('제품을 가져오는 중 오류가 발생했습니다!', error);
                    setProducts([]);
                });
        }
    }, [categoryId]);

    // 현재 페이지에 표시할 제품 목록 계산
    const currentPageProducts = products.slice(
        currentPage * productsPerPage,
        (currentPage + 1) * productsPerPage
    );



    const handlePrevClick = () => {
        if (age && age > 60) {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setIsPrevClicked(true); // 이전 버튼 클릭 상태 설정
            }
        } else {
            if (currentPage > 0) {
                setCurrentPage(currentPage - 1);
                setIsPrevClicked(true); // 이전 버튼 클릭 상태 설정
            }
        }
    };

    const handleNextClick = () => {
        if (age && age > 60) {
            if (currentIndex < products.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setIsNextClicked(true); // 다음 버튼 클릭 상태 설정
            }
        } else {
            if (currentPage < Math.ceil(products.length / productsPerPage) - 1) {
                setCurrentPage(currentPage + 1);
                setIsNextClicked(true); // 다음 버튼 클릭 상태 설정
            }
        }
    };

    return (
        <NavigationWrapper>
            {products.length > 0 && (
                <>
                    {(age && age > 60) ? (
                        // 60세 이상: 단일 제품 표시
                        <>
                            <PrevButton
                                onClick={handlePrevClick}
                                disabled={currentIndex === 0}
                                isClicked={isPrevClicked}
                            >
                               이전
                            </PrevButton>
                            <ProductListWrapper age={age}>
                                <ProductCard
                                    product={products[currentIndex]} // 현재 인덱스에 해당하는 제품만 렌더링
                                    onClick={() => onProductClick(products[currentIndex])}
                                    age={age}
                                />
                            </ProductListWrapper>
                            <NextButton
                                onClick={handleNextClick}
                                disabled={currentIndex >= products.length - 1}
                                isClicked={isNextClicked}
                            >
                                다음
                            </NextButton>
                        </>
                    ) : (
                        // 60세 이하: 3행 4열 그리드 + 페이지네이션
                        <>
                            <ProductListWrapper age={age}>
                                {currentPageProducts.map((product) => (
                                    <ProductGridItem key={product.id}>
                                        <ProductCard
                                            product={product}
                                            onClick={() => onProductClick(product)}
                                            age={age}
                                        />
                                    </ProductGridItem>
                                ))}
                            </ProductListWrapper>
                        </>
                    )}
                </>
            )}
        </NavigationWrapper>
    );
};

export default ProductList;
