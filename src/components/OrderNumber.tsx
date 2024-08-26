import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface OrderNumberProps {
    orderNumber: number;
}

const OrderNumber: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // id를 숫자로 변환
    const orderNumber = Number(id);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/guard');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <h1 style={{fontSize: '2em', color: '#333'}}>주문번호 확인</h1>
            <p style={{fontSize: '1.5em', color: '#666'}}>{orderNumber}</p>
        </div>
    );
};

export default OrderNumber;
