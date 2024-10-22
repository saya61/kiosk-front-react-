import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import * as PortOne from "@portone/browser-sdk/v2";
import {OrderModuleDTO, Product} from "../types";
import {AuthContext} from "./AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';
import Webcam from "react-webcam";

interface MenuList{
    name: string;
    price: number;
}

interface VoiceInputProps {
    onTranscription?: (transcript: string) => void; // 콜백 함수 타입 정의
}

const API_URL = process.env.REACT_APP_API_URL;

interface LocationState {
    orderData: OrderModuleDTO;
    selectedProducts: Product[];
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

// 환경 변수를 설정하는 방법 카톡에 있음 확인 바람
const apiKey = process.env.REACT_APP_API_KEY;
const gcpApiKey = process.env.REACT_APP_GCP_API_KEY;

// GCP TTS
const gcpUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${gcpApiKey}`;
// GPT API
const url = 'https://api.openai.com/v1/chat/completions';

if (!apiKey) {
    throw new Error("OPENAI_API_KEY 환경 변수를 설정해야 합니다.");
}

const OrderWithGpt: React.FC<VoiceInputProps> = ({onTranscription }) => {
    const menuList = getMenuItems();
    const [transcript, setTranscript] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    //@ts-ignore
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ko-KR'; // 한국어 설정
    recognition.interimResults = false; // 중간 결과를 반환하지 않음
    recognition.maxAlternatives = 1; // 최다 대안 개수

    useEffect(() => {
        callGPTAPI();
    }, []);

    const startListening = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            setIsListening(true);
            recognition.start();

            // 사용자가 말을 하지 않을 경우 마이크 꺼지게 설정
            const id = setTimeout(() => {
                recognition.stop();
                setIsListening(false);
                reject(new Error('음성 인식 시간이 초과되었습니다.')); // 시간 초과 시 reject
            }, 100000); // 100초 후에 꺼짐

            setTimeoutId(id);

            //@ts-ignore
            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const result = event.results[0][0].transcript;
                setTranscript(result);
                console.log('Transcription: ', result);

                // 음성 인식 결과를 resolve로 반환
                resolve(result);

                // 만약 onTranscription 프로퍼티가 있다면 호출
                if (onTranscription) {
                    onTranscription(result);
                }
            };

            recognition.onerror = (event : any) => {
                console.error('Recognition error:', event.error);
                recognition.stop();
                reject(new Error('음성 인식 오류가 발생했습니다: ' + event.error)); // 오류 시 reject
            };

            recognition.onend = () => {
                setIsListening(false);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    setTimeoutId(null);
                }
            };
        });
    };

    const stopListening = () => {
        recognition.stop();
        setIsListening(false);
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
    };
    
    // 결제 초기값 생성
    // @ts-ignore
    const handleCheckout = (totalPrice:number) => {
        const adminName = localStorage.getItem('adminId');
        axios.get(`${API_URL}/api/request_payment/check_out/${adminName}`)
            .then(response => {
                const data = response.data;
                console.log(data);
                const orderData: OrderModuleDTO = {
                    id: data.id,
                    price: totalPrice,
                    storeName: data.storeName,
                    email: data.email,
                    address: data.address,
                    status: data.status,
                    paymentUid: '',
                    orderUid: data.orderUid
                };

                console.log('Checkout data:', orderData);
                requestPayment(orderData)
            })
            .catch(error => {
                console.log(error);
            })
    };

    const extractJsonFromString = (str: string): any[] => {
        const jsonMatches: any[] = [];
        const regex = /{[^{}]*}/g; // 중괄호로 감싸인 JSON 객체를 찾는 정규식

        let match;
        while ((match = regex.exec(str)) !== null) {
            try {
                jsonMatches.push(JSON.parse(match[0])); // JSON 파싱 시도
            } catch (e) {
                console.error('JSON 파싱 오류:', e);
            }
        }

        return jsonMatches;
    };

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            recognition.stop();
        };
    }, [timeoutId]);


    let messages = [{ 'role': 'system', 'content':
            "당신은 카페 직원입니다. " + // system 역할로, AI의 행동을 지시->카페 직원
            "당신 앞에 고객이 있습니다. " +
            "고객은 한국인일 가능성이 높습니다." +

            // 시스템 메시지에 예외 상황 처리 추가
            "고객이 주문과 관련 없는 질문을 한다면, " +
            "예를 들어 카페 정보, 위치, 영업 시간 등을 물어보면, 도움 되는 답변을 제공하세요. " +
            "카페와 완전히 무관한 질문이라면, " +
            "정중하게 카페 관련 문의만 도와드릴 수 있다고 알려주세요. " +

            "당신은 주문을 받아야 합니다. " +
            "카페에는 각 카테고리마다 여러 메뉴 항목이 있습니다. " +
            "메뉴 항목이 포함되어야 하며, 메뉴 항목 없이 주문할 수 없습니다. " +
            "메뉴는 기본적인 커피 메뉴들과 옵션으로 온도(뜨거운/차가운), 사이즈(소/중/대), 수량이 있습니다. 모든 메뉴는 100원 입니다." +
            // "메뉴는 다음과 같습니다 \n" + menuList + "\n" +

            // 주문 취소
            "고객은 주문 과정 중 언제든지 주문을 취소할 수 있습니다. " +
            "메뉴의 온도(뜨겁게 또는 차갑게), 크기, 수량 등의 주문 세부 사항을 물어보세요. " +
            "고객이 특정 세부 사항을 말하는 것을 잊었다면, 다시 물어보세요. " +
            "고객이 이미 세부 사항을 지정했다면, 다시 묻지 마세요. " +

            "한 메뉴 항목의 주문을 완료한 후, 고객은 다른 항목을 선택할 수 있습니다. " +
            "따라서, 추가로 주문할 것이 있는지 물어보세요. " +
            "고객이 주문 확인이 맞다는 응답을 하면, 주문이 완료됬었음을 출력한 뒤" +
            "무조건 \'Order Complete\'라는 단어와 주문 내역을 출력하여 주문 과정이 완료되었음을 자동으로 표시하세요." +
            "주문을 다음과 같이 구조화하세요: " +
            "{\"type\": \"타입\", \"temperature\": \"온도\", \"cupSize\": \"크기\", \"quantity\": 수량, \"price\": 가격}, " +
            "타입과 크기는 영어로 바꿔서 구조화하고 " +
            "온도는 영어로 Hot과 Cold 중에 사용하세요. " +
            "수량과 가격은 숫자만 사용하세요." +
            "주문 내역을 출력할 때는 이 구조를 유지하세요." +
            "구조화된 주문은 마지막 완료시에만 표시하세요." +
            "주문이 완료되면, 주문만 반환해야 합니다. " },
        {"role": "assistant", "content": "안녕하세요. 주문을 도와드릴까요?"} //assistant 역할로, 처음 사용자에게 보일 인사 메시지를 설정
    ]

    const callGPTAPI = async () => {

        let orderComplete = false;

        let requestBody = {
            model: "gpt-4o",
            messages: messages
        };

        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify(requestBody)
            });
            // 음성 인식을 넣어 반복 시키는 부분
            await googleTTs("안녕하세요 주문을 도와드리겠습니다.", ()=> console.log("주문 시작"))
            let userInput = await startListening()
            while(!orderComplete){
                // let userInput = prompt("사용자 입력을 기다립니다. 메시지를 입력하세요:");
                console.log(`손님 : ${userInput}`);
                requestBody.messages.push({ "role": "user", "content": `${userInput}` });
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify(requestBody)
                });
                const data = await res.json();
                const script = data.choices[0].message.content;
                console.log(script);
                if(script.includes('Complete')){
                    console.log("주문 마침")
                    await googleTTs("주문을 마치겠습니다.", ()=>{})
                    const resultJSON = extractJsonFromString(script)
                    console.log(resultJSON)
                    let totalPrice=0
                    for(let i=0; i<resultJSON.length; i++){
                        totalPrice = totalPrice + resultJSON[i].price;
                    }
                    handleCheckout(totalPrice)
                    orderComplete = true;
                    break;
                }
                await googleTTs(script, ()=>{})
                userInput = await startListening()
            }
        } catch (error) {
            console.error("캐치 에러 오류:", error);
        }
    };

    async function googleTTs(script: string, callback: () => void) {
        try{
            const gcpData = {
                input: {text: script},
                voice: {
                    languageCode: 'ko-KR',
                    ssmlGender: 'NEUTRAL',
                },
                audioConfig: {
                    audioEncoding: 'LINEAR16',
                },
            };
            const response = await fetch(gcpUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gcpData),
            });
            const result = await response.json();
            const audioContent = result.audioContent;
            const audio = new Audio(`data:audio/wav;base64,${audioContent}`);
            return new Promise((resolve) => {
                audio.onended = () => {
                    callback(); // 오디오 재생이 끝난 후 콜백 함수 실행
                    resolve(true);
                };
                audio.play();
            });
        }
        catch(error) {
            return false;
        }
    }


    async function getMenuItems() {
        try{
            const response = await axios.get(`${API_URL}/api/menus/menuNameandPrice`)
            const menuList: MenuList[] = response.data
            let categoryText = '';
            for (const menuItem of menuList) {
                categoryText = categoryText + menuItem.name + ': ' + menuItem.price + '\n';
            }

            return categoryText;
        }
        catch (error) {
            console.error('메뉴 불러오기 실패', error);
            return '';
        }
    }

    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState || {};
    const { orderData, selectedProducts: initialSelectedProducts } = state || {};
    const [selectedProducts, setSelectedProducts] = useState<Product[]>(initialSelectedProducts || []);
    const [order, setOrder] = useState<any>(null);
    const authContext = useContext(AuthContext);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const webcamRef = useRef<Webcam>(null);
    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
        }
    }, [webcamRef]);

    const humanRekognitionAndUpload = () => {
        capture();
    };

    async function requestPayment(orderData:OrderModuleDTO) {
        // @ts-ignore
        const response = await PortOne.requestPayment(
            {
                // Store ID 설정
                storeId: "store-ad45873a-cce5-4928-88c9-2343b0fe3a2a",
                // 채널 키 설정
                channelKey: "channel-key-a8a93b55-8642-4a34-b2a5-a9e39771d2dd",
                paymentId: orderData.orderUid,  // 주문 번호
                orderName: orderData.storeName, // 상품 이름
                totalAmount: orderData.price,   // 상품 가격
                currency: "CURRENCY_KRW",
                payMethod: "CARD"
            }
        );
        // @ts-ignore
        if (response.code != null) {    // 오류 발생
            // @ts-ignore
            return console.error(response.message);
        }
        console.log('결제 성공:');
        await axios.post(`${API_URL}/api/orders/iamPortDto`, {
            price: orderData.price,
            paymentUid: orderData.orderUid, // 결제 고유번호
            orderUid: orderData.orderUid // 주문번호
        });
        try {
            await axios.post(`${API_URL}/api/orders/createOrderRequest`, {
                storeId: authContext?.storeInfo?.id,
                kioskId: authContext?.kioskInfo?.id,
                productId: selectedProducts.map(p => p.id).join(","),
                orderId: orderData.orderUid,
                payload: orderData.orderUid
            });
            // 결제 성공 시 주문 생성
            const orderDTO = {
                customerId: authContext?.customerInfo?.id || 1,
                kioskId: authContext?.kioskInfo?.id,
                datetime: new Date(),
                totalPrice: orderData.price,
                packaged: true,// 포장 여부 설정
                paymentUid: orderData.orderUid
            };

            //const response = await axios.post(`${API_URL}/api/orders`, orderDTO);
            // 새로고침한 뒤에 문제 생김 (해결)
            const response = await axios.post(`${API_URL}/api/orders`, orderDTO, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            //response가 order임
            if(response.status===201){
                setOrder(response.data);
            }
            else if(response.status===401){
                await axios.post(`${API_URL}/api/orders`, orderDTO, {
                    headers: {
                        'RefreshToken': `Bearer ${localStorage.getItem('refreshToken')}`
                    }
                });
            }

            await humanRekognitionAndUpload();

            const orderItemDTOList = selectedProducts.map(product => {
                return {
                    paymentUid: orderDTO.paymentUid,
                    menuId: product.id,
                    // customOptions: product.options,
                    quantity: product.quantity,
                    price: product.price
                }
            });

            for (let i = 0; i < orderItemDTOList.length; i++) {
                await axios.post(`${API_URL}/api/orderitems`, orderItemDTOList[i]);
            }

            // alert('결제 완료!');
            setSelectedProducts([]);
            // navigate('/guard');

            let orderid = response.data.id;
            navigate(`/order-number/${orderid}`)

        } catch (error) {
            console.error('주문 생성 실패:', error);
            // alert('주문 생성 실패!');
        }
    }

    return (
        <></>
    );
};

export default OrderWithGpt;
