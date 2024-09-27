import React, { useState } from 'react';
import './AdminLoginModal.css'

interface AdminLoginModalProps {
    onClose: () => void;
}

/**
 * AdminLoginModal 컴포넌트
 * - 관리자 로그인 모달
 * - 비밀번호 입력 후, 일치하면 관리자 대시보드를 새 창으로 염
 * - 취소 버튼 클릭 시 모달을 닫음
 */
const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose }) => {
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const storedPassword = localStorage.getItem('adminPassword');
        if (password === storedPassword) {
            window.open('/admin/dashboard', '_blank');
            onClose();
        } else {
            alert('잘못된 비밀번호입니다.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="admin-login-modal">
                <h2>관리자 비밀번호 확인</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="login-input"
                />
                <div className="button-group">
                    <button onClick={handleLogin}>로그인</button>
                    <button onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginModal;
