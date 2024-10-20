import React, { useState } from 'react';
import { Product, CustomOption } from '../../types';
import styled from 'styled-components';
import './Menu.css'

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
`;

const ItemsGrid = styled.div<{ age: number | null }>`
    display: grid;
    grid-template-columns: 1fr;  // 모든 상황에서 1열로 배치
    grid-template-rows: ${({ age }) => (age && age > 60 ? 'repeat(3,2rem)' : 'repeat(5, 4.3rem)')};
    gap: 0.5rem;
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
    height: 100px;
    background-color: transparent;
`;

const TotalPrice = styled.div`
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
`;

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
`;

const PaginationButton = styled.button`
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
    const itemsPerPage = age && age > 60 ? 3 : 5; // 나이에 따라 페이지당 항목 수를 결정
    const [currentPage, setCurrentPage] = useState(0); // 페이지네이션을 위한 현재 페이지

    // 현재 페이지에 표시할 제품 목록 계산
    const currentPageProducts = selectedProducts.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const totalPrice = selectedProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );

    // 총 페이지 수 계산
    const totalPages = Math.ceil(selectedProducts.length / itemsPerPage);

    // 빈 슬롯 계산
    const emptySlots = itemsPerPage - currentPageProducts.length;

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    return (
        <SelectedItemsWrapper age={age}>
            <h2 className="custom-font">Selected Products</h2>
            <ItemsGrid age={age}>
                {currentPageProducts.map((product, index) => (
                    <div key={index}>
                        <ItemDetails>
                            <ItemName className="custom-font1">{product.name} - {product.price}원 (수량: {product.quantity})</ItemName>
                            <QuantityControls>
                                <button onClick={() => onIncreaseQuantity(product.id, product.options)}>+</button>
                                <button onClick={() => onDecreaseQuantity(product.id, product.options)}>-</button>
                            </QuantityControls>
                        </ItemDetails>
                        <ul>
                            {product.options.map((option, optIndex) => (
                                <OptionName key={optIndex}>{option.name}</OptionName>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* 빈 슬롯을 추가하여 3개 또는 5개 항목의 공간을 확보 */}
                {Array.from({ length: emptySlots }).map((_, index) => (
                    <EmptySlot key={`empty-${index}`} />
                ))}
            </ItemsGrid>

            <TotalPrice>
                <strong className="custom-font">Total Price: {totalPrice}원</strong>
            </TotalPrice>
            <button onClick={onClear} className="custom-font1">전체삭제</button>

            <PaginationWrapper>
                <PaginationButton
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    이전
                </PaginationButton>

                <PaginationButton
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                >
                    다음
                </PaginationButton>
            </PaginationWrapper>
        </SelectedItemsWrapper>
    );
};

export default SelectedItems;
