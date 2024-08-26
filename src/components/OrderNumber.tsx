import React, { useEffect } from "react";
import {useNavigate} from "react-router-dom";


interface OrderNumberProps {
    orderNumber: number;
}


const OrderNumber: React.FC<OrderNumberProps> = ({ orderNumber }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/guard');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);


    return (
        <div>
            <h1>주문번호 확인: {orderNumber}</h1>
        </div>
    );
};

export default OrderNumber;