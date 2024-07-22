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
}

const API_URL = process.env.REACT_APP_API_URL;

const OrderCompleteCheck = () => {
    const [orderCompleteList, setOrderCompleteList] =
        useState<orderComplete[]>([]);

    useEffect(() => {
        const fetchOrderCompleteList = async () => {
            try {
                const result = await axios.get(`${API_URL}/admin/orderComplete`);
                setOrderCompleteList(result.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchOrderCompleteList();

    }, []);
    return (
        <div>
            <h1>Order Complete Check</h1>
            {orderCompleteList.map(orderComplete => (
                <div key={orderComplete.id}>
                    <h2>Order ID: {orderComplete.id}</h2>
                    <p>Date Time: {new Date(orderComplete.datetime).toLocaleString()}</p>
                    <p>Complete: {orderComplete.complete ? "Yes" : "No"}</p>
                    <h3>Order Items:</h3>
                    <ul>
                        {orderComplete.orderItemList.map(orderItem => (
                            <li key={orderItem.menuId}>
                                <p>Menu ID: {orderItem.menuId}</p>
                                <p>Payment UID: {orderItem.paymentUid}</p>
                                <p>Quantity: {orderItem.quantity}</p>
                                <p>Price: {orderItem.price}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default OrderCompleteCheck;