import React, { useState } from 'react';
import './AddCategoryModal.css'

interface AddCategoryModalProps {
    onAdd: (name: string) => void;
    onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onAdd, onClose }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleAdd = () => {
        onAdd(categoryName);
        setCategoryName('');
    };

    return (
        <div className="custom-modal">
            <h3>카테고리 추가</h3>
            <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="카테고리 이름"
            />
            <div className="button-group">
                <button onClick={handleAdd}>저장</button>
                <button onClick={onClose}>취소</button>
            </div>
        </div>
    );
};

export default AddCategoryModal;
