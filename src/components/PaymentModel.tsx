import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { OrderModuleDTO } from '../types';
import { loadScript } from './LoadScript';
import './PaymentPage.css';
import * as PortOne from "@portone/browser-sdk/v2";

interface PaymentModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    orderData: OrderModuleDTO;
}

const API_URL = process.env.REACT_APP_API_URL;

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onRequestClose, orderData }) => {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        const loadIamportScript = async () => {
            try {
                await loadScript('https://cdn.portone.io/v2/browser-sdk.js');
                await loadScript('https://code.jquery.com/jquery-1.12.4.min.js');
                setIsScriptLoaded(true);
            } catch (error) {
                console.error(error);
            }
        };

        loadIamportScript();
    }, []);

    const requestPay = () => {
        // if (window.IMP) {
        //     const { IMP } = window;
        //     IMP.init('imp55148327'); // 가맹점 식별코드
        //
        //     IMP.request_pay(
        //         {
        //             pg: 'html5_inicis.INIpayTest',
        //             pay_method: 'card',
        //             merchant_uid: orderData.orderUid, // 주문 번호
        //             name: orderData.storeName, // 상품 이름
        //             amount: orderData.price, // 상품 가격
        //             buyer_email: orderData.email, // 구매자 이메일
        //             buyer_name: orderData.storeName, // 구매자 이름
        //             buyer_tel: '010-1234-5678', // 임의의 값
        //             buyer_addr: orderData.address, // 구매자 주소
        //             buyer_postcode: '123-456', // 임의의 값
        //         },
        //         async (rsp: any) => {
        //             if (rsp.success) {
        //                 console.log('결제 성공:', rsp);
        //                 try {
        //                     const response = await axios.post(`${API_URL}/api/request_payment/check_out`, {
        //                         order_uid: rsp.merchant_uid, // 주문번호
        //                         payment_uid: rsp.imp_uid, // 결제 고유번호
        //                     });
        //                     console.log('서버 응답:', response.data);
        //                     alert('결제 완료!');
        //                 } catch (error) {
        //                     console.error('결제 검증 실패:', error);
        //                     alert('결제 검증 실패!');
        //                 }
        //             } else {
        //                 console.error('결제 실패:', rsp.error_msg);
        //                 alert('결제 실패: ' + rsp.error_msg);
        //             }
        //         }
        //     );
        // } else {
        //     console.error('Iamport object is not found.');
        // }
        // @ts-ignore
        const response = PortOne.requestPayment(
            {
                // Store ID 설정
                storeId: "store-4ff4af41-85e3-4559-8eb8-0d08a2c6ceec",
                // 채널 키 설정
                channelKey: "channel-key-893597d6-e62d-410f-83f9-119f530b4b11",
                paymentId: orderData.orderUid,  // 주문 번호
                orderName: orderData.storeName, // 상품 이름
                totalAmount: orderData.price,   // 상품 가격
                currency: "CURRENCY_KRW",
                payMethod: "CARD"
            }
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="결제 모달"
            className="custom-modal"
            overlayClassName="custom-overlay"
        >
            <div className="modal-header">
                <button className="modal-button" onClick={() => alert('먹고가기')}>먹고가기</button>
                <button className="modal-button" onClick={() => alert('포장하기')}>포장하기</button>
            </div>
            <div className="modal-body">
                <button className="modal-button" onClick={() => alert('포인트 적립')}>포인트 적립</button>
            </div>
            <div className="modal-footer">
                <button className="payment-button" onClick={requestPay} disabled={!isScriptLoaded}>결제하기</button>
                <button className="modal-button" onClick={onRequestClose}>닫기</button>
            </div>
        </Modal>
    );
};

export default PaymentModal;
