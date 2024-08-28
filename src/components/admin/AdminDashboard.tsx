import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import CategoryManagement from './CategoryManagement';
import OptionManagement from './OptionManagement';
import ProductManagement from './ProductManagement';
import RefundManagement from './RefundManagement';
import './AdminDashboard.css';
import OrderCompleteCheck from "./OrderCompleteCheck";
import Analysis from "./Analysis";

/**
 * AdminDashboard 컴포넌트
 * - 관리자 대시보드
 * - 좌측 사이드바에 카테고리, 옵션, 상품 관리 탭을 포함
 * - 각 탭 클릭 시 해당 관리 페이지로 이동
 */
const AdminDashboard: React.FC = () => {
    return (
        <div className="admin-dashboard">
            <nav className="admin-sidebar">
                <ul>
                    <li><Link to="/admin/category">카테고리 관리</Link></li>
                    <li><Link to="/admin/option">옵션 관리</Link></li>
                    <li><Link to="/admin/product">상품 관리</Link></li>
                    <li><Link to="/admin/payment">주문 환불</Link></li>
                    <li><Link to={`/admin/orderComplete`}>주문 확인</Link></li>
                    <li><Link to="/admin/analysis">가게 분석</Link></li>
                </ul>
            </nav>
            <div className="admin-content">
                <Routes>
                    <Route path="category" element={<CategoryManagement />} />
                    <Route path="option" element={<OptionManagement />} />
                    <Route path="product" element={<ProductManagement />} />
                    <Route path="payment" element={<RefundManagement />} />
                    <Route path="orderComplete" element={<OrderCompleteCheck />} />
                    <Route path="analysis" element={<Analysis />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;
