import React, { useState } from 'react';
import { Category as CategoryType } from '../../types';
import styled from 'styled-components';
import './Menu.css'

interface CategoryProps {
    categories: CategoryType[];
    onCategoryClick: (categoryId: number) => void;
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

const CategoryButton = styled.button`
    background-color: ${({ theme }) => theme.categoryBgColor};
    color: ${({ theme }) => theme.categoryColor};
    border: none;
    padding: 1rem;
    cursor: pointer;
    flex: 1;
    margin: 0 5px;
    white-space: nowrap;
`;

const ArrowButton = styled.button<{ show: boolean }>`
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    display: ${({ show }) => (show ? 'block' : 'none')};
`;

const Category: React.FC<CategoryProps> = ({ categories, onCategoryClick }) => {
    const [startIndex, setStartIndex] = useState(0);

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
            <ArrowButton onClick={handlePrevClick} disabled={startIndex === 0} show={categories.length > 4}>
                {"<"}
            </ArrowButton>
            <CategoryList>
                {visibleCategories.map(category => (
                    <CategoryButton key={category.id} onClick={() => onCategoryClick(category.id)}>
                        {category.name}
                    </CategoryButton>
                ))}
            </CategoryList>
            <ArrowButton onClick={handleNextClick} disabled={startIndex + 4 >= categories.length} show={categories.length > 4}>
                {">"}
            </ArrowButton>
        </CategoryWrapper>
    );
}

export default Category;
