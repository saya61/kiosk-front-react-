export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    quantity: number;
    imageUrl: string;
    options: CustomOption[];
}

export interface CustomOption {
    id: number;
    name: string;
    additionalPrice: number;
}

export enum PaymentStatus {
    READY = 'READY',
    OK = 'OK',
    CANCEL = 'CANCEL',
}


export interface OrderModuleDTO {
    id: number;
    price: number;
    storeName: string;
    email: string;
    address: string;
    status: PaymentStatus;
    paymentUid: string;
    orderUid: string;
}

export interface PaymentResponse {
    response: {
        status: string;
        amount: number;
    };
}

export interface Category {
    id: number;
    name: string;
    visible: boolean;
}