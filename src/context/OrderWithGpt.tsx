import React, { useEffect, useState } from 'react';
import axios from 'axios';
import textToSpeech from '@google-cloud/text-to-speech';

interface MenuList{
    name: string;
    price: number;
}

const API_URL = process.env.REACT_APP_API_URL;

// 환경 변수를 설정하는 방법 카톡에 있음 확인 바람
const apiKey = '';
const gcpApiKey = ''

if (!apiKey) {
    throw new Error("OPENAI_API_KEY 환경 변수를 설정해야 합니다.");
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


const OrderWithGpt: React.FC = () => {
    const menuList = getMenuItems();
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
            "메뉴는 다음과 같습니다 \n" + menuList + "\n" +

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
        // GCP TTS
        const gcpUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${gcpApiKey}`;
        // GPT API
        const url = 'https://api.openai.com/v1/chat/completions';

        let orderComplete = false;

        let requestBody = {
            model: "gpt-4",
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
            while(!orderComplete){
                let userInput = prompt("사용자 입력을 기다립니다. 메시지를 입력하세요:");
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
                    // orderComplete = true;
                    break;
                }
                const gcpData = {
                    input: { text: script },
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
                await audio.play();
            }
        } catch (error) {
            console.error("Error calling GPT API:", error);
        }
    };


    return (
        <div>
            <h1>카페 주문 시스템</h1>
            <button onClick={() => callGPTAPI()}>커피 주문하기</button>
        </div>
    );
};

export default OrderWithGpt;
