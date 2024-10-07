import React from 'react';
import { Product, CustomOption } from '../../types';
import styled from 'styled-components';
import './Menu.css'

interface SelectedItemsProps {
    selectedProducts: Product[];
    onClear: () => void;
    onIncreaseQuantity: (productId: number, options: CustomOption[]) => void;
    onDecreaseQuantity: (productId: number, options: CustomOption[]) => void;
}

const SelectedItemsWrapper = styled.div`
    grid-area: selected;
    border: 1px solid ${({ theme }) => theme.selectedBorderColor};
    border-radius: 4px;
    padding: 1rem;
    background-color: ${({ theme }) => theme.selectedBgColor};
    color: ${({ theme }) => theme.selectedColor};
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

const TotalPrice = styled.div`
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
`;

const SelectedItems: React.FC<SelectedItemsProps> = ({ selectedProducts, onClear, onIncreaseQuantity, onDecreaseQuantity }) => {
    const totalPrice = selectedProducts.reduce((total, product) => total + product.price * product.quantity, 0);

    return (
        <SelectedItemsWrapper>
            <h2 className="custom-font">Selected Products</h2>
            <ul>
                {selectedProducts.map((product, index) => (
                    <li key={index}>
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
                    </li>
                ))}
            </ul>
            <TotalPrice>
                <strong className="custom-font">Total Price: {totalPrice}원</strong>
            </TotalPrice>
            <button onClick={onClear} className="custom-font1">전체삭제</button>
        </SelectedItemsWrapper>
    );
}

export default SelectedItems;
