import React, {useEffect, useState} from "react";
import axios from "axios";
import './AdminDashboardGlobal.css';

interface orderItem {
    menuId: number;
    paymentUid: string | null;
    quantity: number;
    price: number;
}

interface orderComplete {
    id: number;
    orderItemList: orderItem[];
    datetime: Date;
    complete: boolean;
    orderId: number;
}

interface menu {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: {
        id: number;
        name: string;
    };
    soldOut: boolean;
    tag: any;
}

const API_URL = process.env.REACT_APP_API_URL;

const OrderCompleteCheck = () => {
    const [orderCompleteList, setOrderCompleteList] = useState<orderComplete[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [menuList, setMenuList] = useState<menu[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMenuList = async () => {
            try {
                const result = await axios.get(`${API_URL}/api/menus/all`);
                setMenuList(result.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchOrderCompleteList = async () => {
            try {
                const result = await axios.get(`${API_URL}/admin/orderComplete`);
                const sortedList = result.data.sort((a: orderComplete, b: orderComplete) => {
                    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
                });
                setOrderCompleteList(result.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMenuList();
        fetchOrderCompleteList();
    }, [refresh]);

    const completeOrder = async (orderId: number) => {
        setLoading(true); // 로딩 시작
        try {
            await axios.post(`${API_URL}/admin/orderComplete`, {orderId});
            setRefresh(!refresh);
        } catch (error) {
            console.error("Failed to complete order", error);
        } finally {
            setLoading(false); // 로딩 끝
        }
    };

    // OrderCompleteCheck.tsx - 한국어로 변환된 코드
    return (
        <div className="container">
            <head>
                {/* Google Fonts link */}
                <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap"
                      rel="stylesheet"/>
            </head>
            <h1 className="custom-font">주문 확인</h1>
            <table>
                <thead>
                <tr>
                    <th className="custom-font1">주문 번호</th>
                    <th className="custom-font1">주문 시간</th>
                    <th className="custom-font1">완료 여부</th>
                    <th className="custom-font1">주문 항목</th>
                    <th className="custom-font1">액션</th>
                </tr>
                </thead>
                <tbody>
                {orderCompleteList.map(orderComplete => (
                    <tr key={orderComplete.orderId}>
                        <td>{orderComplete.orderId}</td>
                        <td>{new Date(orderComplete.datetime).toLocaleString()}</td>
                        <td>{orderComplete.complete ? "예" : "아니오"}</td>
                        <td>
                            <ul>
                                {orderComplete.orderItemList.map(orderItem => (
                                    <li key={orderItem.menuId}>
                                        메뉴: {menuList?.find(menu => menu.id === orderItem.menuId)?.name},
                                        수량: {orderItem.quantity},
                                        가격: {orderItem.price}
                                    </li>
                                ))}
                            </ul>
                        </td>
                        <td>
                            <button onClick={() => completeOrder(orderComplete.orderId)}
                                    disabled={orderComplete.complete || loading}>
                                {orderComplete.complete ? "완료됨" : "주문 완료 처리"}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {loading && (
                <div className="overlay">
                    <div className="modal">
                        <p>주문을 처리 중입니다...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderCompleteCheck;
