import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import Select, { SingleValue } from 'react-select';
import './AdminDashboardGlobal.css';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    soldOut: boolean;
    tag: string;
}

interface Category {
    id: number;
    name: string;
}

interface CategoryOption {
    value: string;
    label: string;
}

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState<Product>({ id: 0, name: '', price: 0, category: '', soldOut: false, tag: '' });
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = () => {
        axios.get(`${API_URL}/api/menus/all`)
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    };

    const fetchCategories = () => {
        axios.get(`${API_URL}/admin/category/all`)
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    };

    const handleAddProduct = () => {
        if (!newProduct.category) {
            alert('카테고리를 선택해 주세요.');
            return;
        }

        // 동일한 이름의 메뉴가 있는지 확인
        const duplicateProduct = products.find(product => product.name === newProduct.name);
        if (duplicateProduct) {
            alert('이미 있는 메뉴입니다.');
            return;
        }

        const newProductData = {
            name: newProduct.name,
            categoryId: parseInt(newProduct.category),
            price: newProduct.price,
            soldOut: newProduct.soldOut,
            tag: newProduct.tag,
        };

        axios.post(`${API_URL}/admin/menu/add_rest_simple`, newProductData)
            .then(response => {
                fetchProducts();
                handleCloseModal();
            })
            .catch(error => console.error('Error adding product:', error));
    };

    const handleEditProduct = () => {
        if (editingProductId === null) return;

        const updatedProductData = {
            name: newProduct.name,
            categoryId: newProduct.category ? parseInt(newProduct.category) : products.find(product => product.id === editingProductId)?.category,
            price: newProduct.price,
            soldOut: newProduct.soldOut,
            tag: newProduct.tag,
        };

        if (!updatedProductData.categoryId) {
            alert("카테고리를 선택하세요.");
            return;
        }

        axios.put(`${API_URL}/api/update/menus/${editingProductId}`, updatedProductData)
            .then(response => {
                fetchProducts();
                handleCloseModal();
            })
            .catch(error => console.error('Error editing product:', error));
    };

    const handleDeleteProduct = (id: number) => {
        if (!window.confirm("정말로 삭제하시겠습니까?")) {
            return;
        }
        axios.delete(`${API_URL}/admin/menu/delete/${id}`)
            .then(() => {
                fetchProducts();
                alert('삭제되었습니다');
            })
            .catch(error => console.error('Error deleting product:', error));
    };

    const openEditModal = (product: Product) => {
        setEditingProductId(product.id);
        setNewProduct(product);
        setShowEditModal(true);
    };

    const filteredProducts = selectedCategory
        ? products.filter(product => product.category === selectedCategory)
        : products;

    const handleCloseModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setNewProduct({ id: 0, name: '', price: 0, category: '', soldOut: false, tag: '' });
    };

    const handleOpenAddModal = () => {
        handleCloseModal(); // 상태 초기화
        setShowAddModal(true);
    };

    const categoryOptions: CategoryOption[] = categories.map(category => ({
        value: category.id.toString(),
        label: category.name
    }));

    return (
        <div className="container">
            <h2>상품 관리</h2>
            {/*<div>
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.name)}
                        style={{ fontWeight: selectedCategory === category.name ? 'bold' : 'normal' }}
                    >
                        {category.name}
                    </button>
                ))}
                <button
                    onClick={() => setSelectedCategory(null)}
                    style={{ fontWeight: selectedCategory === null ? 'bold' : 'normal' }}
                >
                    전체
                </button>
            </div>*/}
            <button className="add-button-right" onClick={handleOpenAddModal}>+ 상품 추가</button>
            {showAddModal && (
                <div className="modal">
                    <h3>상품 추가</h3>
                    <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="상품 이름"
                    />
                    <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                        placeholder="상품 가격"
                    />
                    <Select
                        options={categoryOptions}
                        onChange={(selectedOption: SingleValue<CategoryOption>) => setNewProduct({
                            ...newProduct,
                            category: selectedOption?.value || ''
                        })}
                        placeholder="카테고리 선택"
                    />
                    <label>
                        품절 여부
                        <input
                            type="checkbox"
                            checked={newProduct.soldOut}
                            onChange={(e) => setNewProduct({...newProduct, soldOut: e.target.checked})}
                        />
                    </label>
                    <select
                        value={newProduct.tag || ''}
                        onChange={(e) => setNewProduct({...newProduct, tag: e.target.value})}
                    >
                        <option value="">태그 선택</option>
                        <option value="인기">인기</option>
                        <option value="신규">신규</option>
                    </select>
                    <button onClick={handleAddProduct}>저장</button>
                    <button onClick={handleCloseModal}>취소</button>
                </div>
            )}
            {showEditModal && (
                <div className="modal">
                    <h3>상품 수정</h3>
                    <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="상품 이름"
                    />
                    <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                        placeholder="상품 가격"
                    />
                    <Select
                        options={categoryOptions}
                        value={categoryOptions.find(option => option.value === newProduct.category) || null}
                        onChange={(selectedOption: SingleValue<CategoryOption>) => setNewProduct({
                            ...newProduct,
                            category: selectedOption?.value || ''
                        })}
                        placeholder="카테고리 선택"
                    />
                    <label>
                        품절 여부
                        <input
                            type="checkbox"
                            checked={newProduct.soldOut}
                            onChange={(e) => setNewProduct({...newProduct, soldOut: e.target.checked})}
                        />
                    </label>
                    <select
                        value={newProduct.tag || ''}
                        onChange={(e) => setNewProduct({...newProduct, tag: e.target.value})}
                    >
                        <option value="">태그 선택</option>
                        <option value="인기">인기</option>
                        <option value="신규">신규</option>
                    </select>
                    <button onClick={handleEditProduct}>저장</button>
                    <button onClick={handleCloseModal}>취소</button>
                </div>
            )}
            <table>
                <thead>
                <tr>
                    <th>상품 이름</th>
                    <th>가격</th>
                    <th>카테고리</th>
                    <th>품절 여부</th>
                    <th>태그</th>
                    <th>액션</th>
                </tr>
                </thead>
                <tbody>
                {filteredProducts.map(product => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{categories.find(category => category.id === parseInt(product.category))?.name}</td>
                        <td>{product.soldOut ? '품절' : '판매 중'}</td>
                        <td>{product.tag}</td>
                        <td>
                            <button onClick={() => openEditModal(product)}>수정</button>
                            <button onClick={() => handleDeleteProduct(product.id)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManagement;
