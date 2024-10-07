import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import './AdminDashboardGlobal.css';

interface Option {
    id: number;
    name: string;
    additionalPrice: number;
    menuName: string;
    // required: boolean;
    items: { name: string, price: number }[];
}

interface Menu {
    id: number;
    name: string;
}

const API_URL = process.env.REACT_APP_API_URL;

const OptionManagement: React.FC = () => {
    const [options, setOptions] = useState<Option[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newOptionName, setNewOptionName] = useState('');
    const [newOptionAdditionalPrice, setNewOptionAdditionalPrice] = useState(0);
    const [newOptionMenuId, setNewOptionMenuId] = useState(0);
    const [newOptionItems, setNewOptionItems] = useState<{ name: string, price: number }[]>([]);
    // const [newOptionRequired, setNewOptionRequired] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState(0);
    const [sortKey, setSortKey] = useState<'id' | 'menuName'>('id');

    useEffect(() => {
        axios.get(`${API_URL}/api/menus/all-custom-options-with-menu-name`)
            .then(response => setOptions(response.data))
            .catch(error => console.error('Error fetching options:', error));

        axios.get(`${API_URL}/api/menus/all`)
            .then(response => {
                // 중복된 메뉴 이름 제거
                const uniqueMenus = response.data.reduce((acc: Menu[], menu: Menu) => {
                    if (!acc.find(m => m.id === menu.id)) {
                        acc.push(menu);
                    }
                    return acc;
                }, []);
                setMenus(uniqueMenus);
            })
            .catch(error => console.error('Error fetching menus:', error));
    }, []);

    const handleAddOption = () => {
        // 옵션 추가를 위한 데이터 준비
        const newOption = {
            name: newOptionName,
            additionalPrice: newOptionAdditionalPrice,
            menuId: newOptionMenuId,
            items: newOptionItems // items 추가
        };

        // 백엔드 API 호출하여 옵션 추가
        axios.post(`${API_URL}/api/menus/add-custom-option`, newOption)
            .then(response => {
                // 옵션 목록 갱신
                setOptions([...options, response.data])
                alert('추가되었습니다');
                // 모달 닫기 및 입력 필드 초기화
                handleCloseModal();
            })
            .catch(error => console.error('Error adding option:', error));
    };

    const handleDeleteOption = (id: number) => {
        if (!window.confirm("정말로 삭제하시겠습니까?")) {
            return;
        }
        axios.delete(`${API_URL}/api/menus/delete-custom-option/${id}`)
            .then(() => {
                setOptions(options.filter(option => option.id !== id))
                alert('삭제되었습니다');
            })
            .catch(error => console.error('Error deleting option:', error));
    };

    // 추가된 코드: 항목 추가 시 메뉴명, 상세옵션명, 가격 모두 표시 - 기존 코드는 가격만 표시
    const handleAddItemToOption = () => {
        const selectedMenuName = menus.find(menu => menu.id === newOptionMenuId)?.name || '';
        setNewOptionItems([...newOptionItems, { name: `${selectedMenuName} - ${newOptionName}`, price: newItemPrice }]);
        setNewItemName('');
        setNewItemPrice(0);
    };

    // 모달 초기화 - 기존 코드는 취소시 항목담기 초기화가 되지않았다.
    const handleCloseModal = () => {
        setShowAddModal(false);
        setNewOptionName('');
        setNewOptionMenuId(0);
        setNewOptionItems([]);
        setNewItemName('');
        setNewItemPrice(0);

        // 추가된 코드: 새로 추가된 옵션을 포함하도록 옵션 목록 갱신
        axios.get(`${API_URL}/api/menus/all-custom-options-with-menu-name`)
            .then(response => setOptions(response.data))
            .catch(error => console.error('Error fetching options:', error));
    };

    const sortedOptions = [...options].sort((a, b) => {
        if (sortKey === 'id') {
            return a.id - b.id;
        } else if (sortKey === 'menuName') {
            return a.menuName.localeCompare(b.menuName);
        }
        return 0;
    });

    return (
        <div className="container">
            <head>
                {/* Google Fonts link */}
                <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap" rel="stylesheet"/>
            </head>
            <h2 className="custom-font">옵션 관리</h2>
            <button className="add-button-right" onClick={() => setShowAddModal(true)}>+ 옵션 추가</button>
            {showAddModal && (
                <div className="modal">
                    <h3 className="custom-font">옵션 추가</h3>
                    <h5 className="custom-font1">옵션 이름</h5>
                    <input
                        type="text"
                        value={newOptionName}
                        onChange={(e) => setNewOptionName(e.target.value)}
                        placeholder="추가할 옵션 이름"
                        style={{ width: '200px' }} // 고정된 너비 설정
                    />
                    <div>
                        <h4 className="custom-font1">상세 옵션 항목 추가</h4>
                        <h5 className="custom-font1">상품명</h5>
                        <select
                            value={newOptionMenuId}
                            onChange={(e) => setNewOptionMenuId(parseInt(e.target.value))}
                            style={{ width: '280px' }}
                        >
                            <option value={0}>상품 선택</option>
                            {menus.map(menu => (
                                <option key={menu.id} value={menu.id}>{menu.name}</option>
                            ))}
                        </select>
                        <h5 className="custom-font1">옵션 가격</h5>
                        <input
                            type="number"
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(parseFloat(e.target.value))}
                            placeholder="옵션 가격"
                            style={{ width: '200px' }} // 고정된 너비 설정
                        />
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}> {/* 버튼만 중앙 정렬 */}
                        <button onClick={handleAddItemToOption}>항목 추가</button>
                        </div>
                    </div>
                    <div>
                        {newOptionItems.map((item, index) => (
                            <div key={index}>
                                <span>{item.name} - {item.price}원</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}> {/* 버튼만 중앙 정렬 */}
                    <button onClick={handleAddOption}>저장</button>
                    <button onClick={handleCloseModal}>취소</button>
                    </div>
                </div>
            )}
            <div>
                <label className="custom-font">정렬 기준: </label>
                <select value={sortKey} onChange={(e) => setSortKey(e.target.value as 'id' | 'menuName')} style={{ width: '100px' }}>
                    <option value="id">옵션 ID</option>
                    <option value="menuName">상품명</option>
                </select>
            </div>
            <table>
                <thead>
                <tr>
                    <th className="custom-font1">상품명</th>
                    <th className="custom-font1">적용된 옵션</th>
                    <th className="custom-font1">가격</th>
                    <th className="custom-font1">액션</th>
                </tr>
                </thead>
                <tbody>
                {sortedOptions.map(option => (
                    <tr key={option.id}>
                        <td>{option.menuName}</td>
                        <td>{option.name}</td>
                        <td>{option.additionalPrice}</td>
                        <td>
                            <button onClick={() => handleDeleteOption(option.id)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OptionManagement;
