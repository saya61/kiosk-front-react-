import React, { useEffect } from 'react';
import Modal from 'react-modal';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './PointModal.css';

interface PointModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    handleSearch: () => void;
    handleInputChange: (input: string) => void;
}

const PointModal: React.FC<PointModalProps> = ({
                                                   isOpen,
                                                   onRequestClose,
                                                   searchInput,
                                                   setSearchInput,
                                                   handleSearch,
                                                   handleInputChange
                                               }) => {
    const keyboardOptions = {
        layout: {
            default: ['1 2 3', '4 5 6', '7 8 9', '0 {bksp}'],
        },
        display: {
            '{bksp}': '지우기',
        },
    };

    useEffect(() => {
        if (searchInput.length === 11) {
            handleSearch();
        }
    }, [searchInput, handleSearch]);

    const handleChange = (value: string) => {
        setSearchInput(value);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="포인트 적립 및 사용"
            className="custom-modal"
            overlayClassName="custom-overlay"
        >
            <h2>적립 전화번호 검색</h2>
            <div className="input-container">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="전화번호 입력"
                    className="custom-input"
                />
            </div>
            <Keyboard
                layout={keyboardOptions.layout}
                display={keyboardOptions.display}
                onChange={handleChange}
                onKeyPress={() => {}}
            />
            <button className="modal-close-button" onClick={onRequestClose}>
                닫기
            </button>
        </Modal>
    );
};

export default PointModal;
