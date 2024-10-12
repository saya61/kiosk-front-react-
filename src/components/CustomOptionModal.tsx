import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from '../api/axiosConfig';
import { CustomOption, Product } from '../types';
import styled from 'styled-components';
import './Webfont.css'

interface CustomOptionModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onRequestCancel: () => void;
    menuId: number;
    selectedProduct: Product;
    onAddOption: (option: CustomOption) => void;
    onRemoveOption: (option: CustomOption) => void;
    onUpdateProduct: (updatedProduct: Product) => void;
}

const API_URL = process.env.REACT_APP_API_URL;

const CustomOptionModal: React.FC<CustomOptionModalProps> = ({
                                                                 isOpen,
                                                                 onRequestClose,
                                                                 onRequestCancel,
                                                                 menuId,
                                                                 selectedProduct,
                                                                 onAddOption,
                                                                 onRemoveOption,
                                                                 onUpdateProduct
                                                             }) => {
    const [options, setOptions] = useState<CustomOption[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({});
    const [selectedSize, setSelectedSize] = useState<string | null>('medium'); // Default size initially
    const [sizeOptionsAvailable, setSizeOptionsAvailable] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<number>(selectedProduct.price);

    useEffect(() => {
        axios.get(`${API_URL}/api/menus/select-custom-option/${menuId}`)
            .then(response => {
                const options: CustomOption[] = response.data;
                setOptions(options);
                const hasSizeOptions = options.some((opt: CustomOption) => opt.name === 'SIZE');
                setSizeOptionsAvailable(hasSizeOptions);
                if (hasSizeOptions) {
                    setSelectedSize('medium'); // Default size set to 'medium' if size options are available
                }
                if (options.length === 0) {
                    onRequestClose();
                }
            })
            .catch(error => {
                console.error('There was an error fetching the custom options!', error);
            });
    }, [menuId]);

    useEffect(() => {
        if (isOpen) {
            setSelectedOptions({});
            setTotalPrice(selectedProduct.price); // Reset price when modal opens
            setSelectedSize('medium'); // Ensure default size is 'medium' when modal opens
        }
    }, [isOpen]);

    const handleAddOption = (option: CustomOption) => {
        if (option.name.includes('추가')) {
            const newSelectedOptions = { ...selectedOptions, [option.id]: (selectedOptions[option.id] || 0) + 1 };
            setSelectedOptions(newSelectedOptions);
            const newTotalPrice = totalPrice + option.additionalPrice;
            setTotalPrice(newTotalPrice);
            onAddOption(option);
            onUpdateProduct({ ...selectedProduct, price: newTotalPrice, options: [...selectedProduct.options, option] });
        }
    };

    const handleRemoveOption = (option: CustomOption) => {
        if (option.name.includes('추가') && selectedOptions[option.id]) {
            const newSelectedOptions = { ...selectedOptions, [option.id]: selectedOptions[option.id] - 1 };
            if (newSelectedOptions[option.id] === 0) {
                delete newSelectedOptions[option.id];
            }
            setSelectedOptions(newSelectedOptions);
            const newTotalPrice = totalPrice - option.additionalPrice;
            setTotalPrice(newTotalPrice);
            onRemoveOption(option);
            onUpdateProduct({ ...selectedProduct, price: newTotalPrice, options: selectedProduct.options.filter(opt => opt.id !== option.id) });
        }
    };

    const handleSizeChange = (size: string) => {
        const sizePriceDifference = getSizeAdditionalPrice(size) - getSizeAdditionalPrice(selectedSize || 'medium');
        const newTotalPrice = totalPrice + sizePriceDifference;
        setTotalPrice(newTotalPrice);
        setSelectedSize(size);
        const sizeOption = { id: -1, name: `SIZE-${size}`, additionalPrice: sizePriceDifference }; // Updated size option format
        onUpdateProduct({ ...selectedProduct, price: newTotalPrice, options: [...selectedProduct.options.filter(opt => !opt.name.startsWith('SIZE-')), sizeOption] });
    };

    const handleClose = () => {
        if (selectedSize) {
            const sizeOption = { id: -1, name: `SIZE-${selectedSize}`, additionalPrice: getSizeAdditionalPrice(selectedSize) };
            onUpdateProduct({ ...selectedProduct, options: [...selectedProduct.options.filter(opt => !opt.name.startsWith('SIZE-')), sizeOption] });
        }
        onRequestClose();
    };

    const handleCancel = () => {
        onRequestCancel();
    };

    const getSizeAdditionalPrice = (size: string) => {
        switch (size) {
            case 'large':
                return 500;
            case 'medium':
                return 0;
            case 'small':
                return -400;
            default:
                return 0;
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={handleCancel} contentLabel="Custom Options">
            <ModalContent>
                <h2 className="custom-font">추가 옵션 선택</h2>
                <OptionsContainer>
                    {options.filter(opt => opt.name !== 'SIZE').map(option => (
                        <OptionItem key={option.id}>
                            <OptionName className="custom-font1">{option.name}</OptionName>
                            <OptionPrice className="custom-font1">{option.additionalPrice}원</OptionPrice>
                            {option.name.includes('추가') ? (
                                <>
                                    <OptionQuantity className="custom-font1">수량: {selectedOptions[option.id] || 0}</OptionQuantity>
                                    <OptionButtonGroup>
                                        <OptionButton className="custom-font1" onClick={() => handleAddOption(option)}>추가</OptionButton>
                                        <OptionButton className="custom-font1" onClick={() => handleRemoveOption(option)}>제거</OptionButton>
                                    </OptionButtonGroup>
                                </>
                            ) : (
                                <input
                                    type="radio"
                                    id={`option-${option.id}`}
                                    name="custom-option"
                                    value={option.name}
                                    onChange={() => handleAddOption(option)}
                                />
                            )}
                        </OptionItem>
                    ))}
                    {sizeOptionsAvailable && (
                        <SizeOptionsContainer>
                            <h3 className="custom-font">사이즈 선택</h3>
                            {['large', 'medium', 'small'].map(size => {
                                const additionalPrice = getSizeAdditionalPrice(size);
                                return (
                                    <SizeOptionItem key={size}>
                                        <input
                                            type="radio"
                                            id={size}
                                            name="size"
                                            value={size}
                                            checked={selectedSize === size}
                                            onChange={() => handleSizeChange(size)}
                                        />
                                        <label htmlFor={size} className="custom-font">{size}</label>
                                        <span className="custom-font1">{additionalPrice}원</span>
                                    </SizeOptionItem>
                                );
                            })}
                        </SizeOptionsContainer>
                    )}
                </OptionsContainer>
                <TotalPrice>
                    <strong className="custom-font">총 가격: {totalPrice}원</strong>
                </TotalPrice>
                <ButtonGroup>
                    <ModalButton  className="custom-font1" onClick={handleClose}>완료</ModalButton>
                    <ModalButton  className="custom-font1" onClick={handleCancel}>취소</ModalButton>
                </ButtonGroup>
            </ModalContent>
        </Modal>
    );
};

export default CustomOptionModal;

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    max-width: 500px;
    margin: 0 auto;
`;

const OptionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;

const OptionItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
`;

const OptionName = styled.span`
    flex: 1;
`;

const OptionPrice = styled.span`
    flex: 1;
    text-align: right;
`;

const OptionQuantity = styled.span`
    flex: 1;
    text-align: right;
    margin-right: 10px; /* Add margin to create space between quantity text and buttons */
`;

const OptionButtonGroup = styled.div`
    display: flex;
    gap: 5px;
`;

const OptionButton = styled.button`
    background-color: #FF5733;
    color: white;
    border: none;
    padding: 5px 20px;
    cursor: pointer;
    &:hover {
        background-color: #e04e2a;
    }
`;

const SizeOptionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;

const SizeOptionItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
`;

const TotalPrice = styled.div`
    margin-top: 20px;
    font-size: 1.2rem;
    font-weight: bold;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 20px;
`;

const ModalButton = styled.button`
    background-color: #555;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    &:hover {
        background-color: #333;
    }
`;
