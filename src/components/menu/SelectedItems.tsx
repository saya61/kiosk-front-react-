import React, { useState } from 'react';
import { Product, CustomOption } from '../../types';
import styled from 'styled-components';
import './Menu.css';

interface SelectedItemsProps {
    selectedProducts: Product[];
    onClear: () => void;
    onIncreaseQuantity: (productId: number, options: CustomOption[]) => void;
    onDecreaseQuantity: (productId: number, options: CustomOption[]) => void;
    age: number | null;  // age prop 추가
}

const SelectedItemsWrapper = styled.div<{ age: number | null }>`
    margin-top: ${({ age }) => (age && age > 60 ? '-7rem' : 0)};
    grid-area: selected;
    border: 1px solid ${({ theme }) => theme.selectedBorderColor};
    border-radius: 4px;
    padding: 1rem;
    background-color: ${({ theme }) => theme.selectedBgColor};
    color: ${({ theme }) => theme.selectedColor};
    height: 600px;
    position: relative; // 추가: relative 포지션으로 기준 설정
`;

const TotalPrice = styled.div<{age : number | null}>`
    font-size: ${({ age }) => (age && age > 60 ? '1.8rem' : '1.2rem')};
    margin-top: 1rem;
    font-weight: bold;
    position: absolute; // 고정
    bottom: 40px; // 바닥에서 위로 이동
    left: 20px; // 왼쪽 위치 조정
`;

const PaginationWrapper = styled.div`
    
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    position: absolute; // 고정
    bottom: 10px; // 바닥에서 위로 이동
    left: 50%; // 가운데 정렬
    transform: translateX(-50%); // 중앙 정렬을 위해 이동
`;

const ItemsGrid = styled.div<{ age: number | null }>`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 1rem;  // 아이템들 사이의 간격을 1rem으로 설정
`;

const ItemWrapper = styled.div`
    padding: 1rem;  // 각 아이템에 padding을 줘서 간격을 확보
    border: 1px solid #ddd;
    border-radius: 8px;
`;

const OptionList = styled.ul`
    margin-top: -1rem;  // 옵션 리스트와 아이템 이름 사이에 간격 추가
    padding-left: 1rem;
`;

const ItemDetails = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
`;

const ItemName = styled.span`
    font-weight: bold;
    flex: 1;
`;

const OptionName = styled.li`
    padding-left: 1rem;
`;

const QuantityControls = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const EmptySlot = styled.div`
    background-color: transparent;
    height: 70px;
`;

const PaginationButton = styled.button<{ age: number | null }>`
    font-size: ${({ age }) => (age && age > 60 ? '1.5rem' : '1rem')}; 
    margin-bottom : ${({ age }) => (age && age > 60 ? '1.5rem' : '1rem')};
    padding: 0.5rem;
    background-color: ${({ theme }) => theme.paginationBgColor || '#4CAF50'};
    color: white;
    border: none;
    cursor: pointer;

    &:disabled {
        background-color: #d3d3d3;
        cursor: not-allowed;
    }
`;

const SelectedItems: React.FC<SelectedItemsProps> = ({
                                                         selectedProducts,
                                                         onClear,
                                                         onIncreaseQuantity,
                                                         onDecreaseQuantity,
                                                         age
                                                     }) => {
    const itemsPerPage = age && age > 60 ? 2 : 3;
    const [currentPage, setCurrentPage] = useState(0);

    const currentPageProducts = selectedProducts.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const totalPrice = selectedProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );

    const totalPages = Math.ceil(selectedProducts.length / itemsPerPage);
    const emptySlots = itemsPerPage - currentPageProducts.length;

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    // 동일한 옵션 이름을 처리하는 함수
    const getOptionDisplayNames = (options: CustomOption[]) => {
        const optionCountMap: { [key: string]: number } = {};

        options.forEach(option => {
            optionCountMap[option.name] = (optionCountMap[option.name] || 0) + 1;
        });

        return Object.entries(optionCountMap).map(([name, count]) => ({
            displayName: count > 1 ? `${name} (${count})` : name,
            count,
        }));
    };

    return (
        <SelectedItemsWrapper age={age}>
            <h2 className="custom-font">장바구니</h2>
            <ItemsGrid age={age}>
                {currentPageProducts.map((product, index) => (
                    <ItemWrapper key={index}>
                        <ItemDetails>
                            <ItemName className="custom-font1">
                                {product.name} - {product.price}원 (수량: {product.quantity})
                            </ItemName>
                            <QuantityControls>
                                <button onClick={() => onIncreaseQuantity(product.id, product.options)}>+</button>
                                <button onClick={() => onDecreaseQuantity(product.id, product.options)}>-</button>
                            </QuantityControls>
                        </ItemDetails>
                        <OptionList>
                            {getOptionDisplayNames(product.options).slice(0, 2).map((option, optIndex) => (
                                <OptionName key={optIndex}>{option.displayName}</OptionName>
                            ))}
                            {getOptionDisplayNames(product.options).length > 3 && <OptionName>...</OptionName>}
                        </OptionList>
                    </ItemWrapper>
                ))}

                {Array.from({ length: emptySlots }).map((_, index) => (
                    <EmptySlot key={`empty-${index}`} />
                ))}
            </ItemsGrid>

            <TotalPrice age={age}>
                <strong className="custom-font">결제금액 : {totalPrice}원</strong>
                <button onClick={onClear} className="custom-font1">전체삭제</button>
            </TotalPrice>

            <PaginationWrapper>
                <PaginationButton
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    age={age}
                >
                    이전
                </PaginationButton>

                <PaginationButton
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                    age={age}
                >
                    다음
                </PaginationButton>
            </PaginationWrapper>
        </SelectedItemsWrapper>
    );
};

export default SelectedItems;
