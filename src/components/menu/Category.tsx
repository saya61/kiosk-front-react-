import React, { useState } from 'react';
import { Category as CategoryType } from '../../types';
import styled from 'styled-components';

interface CategoryProps {
    categories: CategoryType[];
    onCategoryClick: (categoryId: number) => void;
    age: number | null; // age prop 추가
}

const CategoryWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
`;

const CategoryList = styled.div`
    display: flex;
    justify-content: space-around;
    flex-grow: 1;
    overflow: hidden;
`;

const CategoryButton = styled.button<{ isLarge: boolean }>`
    background-color: ${({ theme }) => theme.categoryBgColor};
    color: ${({ theme }) => theme.categoryColor};
    border: none;
    padding: ${({ isLarge }) => (isLarge ? '3rem' : '1rem')}; // 나이에 따라 크기 조정
    cursor: pointer;
    flex: 1;
    margin: 0 5px;
    white-space: nowrap;
    font-size: ${({ isLarge }) => (isLarge ? '1.5rem' : '1rem')}; // 나이에 따라 폰트 크기도 조정
`;

const ArrowButton = styled.button<{ show: boolean }>`
    background-color: #f68558;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
        // display: ${({show}) => (show ? 'block' : 'none')};
`;

const Category: React.FC<CategoryProps> = ({ categories, onCategoryClick, age }) => {
    const [startIndex, setStartIndex] = useState(0);
    const isLarge = age !== null && age > 60; // 나이에 따라 크기 조정 여부

    const handlePrevClick = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (startIndex + 4 < categories.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const visibleCategories = categories.slice(startIndex, startIndex + 4);

    return (
        <CategoryWrapper>
            <ArrowButton onClick={handlePrevClick} disabled={startIndex === 0} show={categories.length > 4} style={{ fontSize: age && age > 60 ? '4rem' : '1rem' }}>
                {"<"}
            </ArrowButton>
            <CategoryList>
                {visibleCategories.map(category => (
                    <CategoryButton key={category.id} onClick={() => onCategoryClick(category.id)} isLarge={isLarge}style={{ fontSize: age && age > 60 ? '2rem' : '1rem' }}>
                        {category.name}
                    </CategoryButton>
                ))}
            </CategoryList>
            <ArrowButton onClick={handleNextClick} disabled={startIndex + 4 >= categories.length} show={categories.length > 4} style={{ fontSize: age && age > 60 ? '4rem' : '1rem' }}>
                {">"}
            </ArrowButton>
        </CategoryWrapper>
    );
}

export default Category;
