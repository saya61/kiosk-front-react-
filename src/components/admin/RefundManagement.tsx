import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import {format} from 'date-fns';
import './AdminDashboardGlobal.css';

interface Order{
    id: number;
    customerId: number;
    kioskId: number;
    dateTime: Date;
    totalPrice: number;
    paymentUid: string;
}

interface Refund{
    imp_uid: string
}

const RefundManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [refunds, setRefunds] = useState<Refund[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;
    const iamportHost = "https://api.iamport.kr";

    useEffect(() => {
        axios.get(`${API_URL}/admin/payment/all`)
            .then(response => setOrders(response.data))
            .catch(err => console.log('에러 확인: ', err));
    },[])

    const handleDeleteOrder = (id:number) => {
        if(!window.confirm('결제를 취소하시겠습니까?')){
            return;
        }
        const order = orders.find(order => order.id === id);
        const paymentUid = order?.paymentUid;
        /*axios.post(`${iamportHost}/users/getToken`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                data: {
                    "imp_key": "",
                    "imp_secret": ""
                }
            })
            .then((response) => console.log(response))
            .catch(err => console.log(err));
        axios.post(`https://api.iamport.kr/payments/cancel?_token=ef40495dd39d10d51dfb289d9789af246659cc51`,
            {imp_uid: {paymentUid}})*/
        axios.delete(`${API_URL}/admin/payment/delete`, {params: {id}})
            .then(()=>{
                setOrders(orders.filter(order => order.id !== id))
                alert('취소되었습니다.');
            })
            .catch(error => console.error('삭제 오류 확인: ', error));
    }

    const handleCloseModal = () => {
        setShowAddModal(false);
    }

    const handleOpenModal = () => {
        handleCloseModal();
        setShowAddModal(true);
    }

    return (
        <div className="container">
            <head>
                {/* Google Fonts link */}
                <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap"
                      rel="stylesheet"/>
            </head>
            <h2 className="custom-font">결제 취소 관리</h2>
            <table>
                <thead>
                <tr>
                    <th className="custom-font1">구매 시간</th>
                    <th className="custom-font1">가격</th>
                    <th className="custom-font1">액션</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>{format(order.dateTime, 'yyyy-MM-dd HH:mm')}</td>
                        <td>{order.totalPrice}</td>
                        <td>
                            <button onClick={() => handleDeleteOrder(order.id)}>취소</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default RefundManagement;