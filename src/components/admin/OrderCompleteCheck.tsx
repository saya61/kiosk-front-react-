import React, {useEffect, useState} from "react";
import axios from "axios";

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

    return (
        <div>
            <h1>주문 확인</h1>
            {orderCompleteList.map(orderComplete => (
                <div key={orderComplete.orderId}>
                    <h2>Order ID: {orderComplete.orderId}</h2>
                    <p>Date Time: {new Date(orderComplete.datetime).toLocaleString()}</p>
                    <p>Complete: {orderComplete.complete ? "Yes" : "No"}</p>
                    <h3>Order Items:</h3>
                    <ul>
                        {orderComplete.orderItemList.map(orderItem => (
                            <li key={orderItem.menuId}>
                                <p>Menu: {menuList?.find(menu => menu.id === orderItem.menuId)?.name}</p>
                                <p>Quantity: {orderItem.quantity}</p>
                                <p>Price: {orderItem.price}</p>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => completeOrder(orderComplete.orderId)}
                        disabled={orderComplete.complete || loading}
                    >
                        {orderComplete.complete ? "Completed" : "Complete Order"}
                    </button>
                </div>
            ))}

            {/* 로딩 중일 때 화면을 어둡게 처리하는 overlay */}
            {loading && (
                <div className="overlay">
                    <div className="modal">
                        <p>Processing your order...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderCompleteCheck;
