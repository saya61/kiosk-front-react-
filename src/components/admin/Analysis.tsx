// Analysis.tsx
import React, { useEffect, useState } from 'react';
const API_URL = process.env.REACT_APP_API_URL;

const Analysis: React.FC = () => {
    const [data, setData] = useState<string | null>(null); // 데이터 상태를 정의합니다.
    const [loading, setLoading] = useState<boolean>(true); // 로딩 상태를 정의합니다.
    const [error, setError] = useState<string | null>(null); // 에러 상태를 정의합니다.
    const apiHost = `${API_URL}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiHost}/bot/analysis?prompt=시작`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.text();
                setData(result); // 데이터를 상태에 저장합니다.
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message); // 에러 발생 시 에러 메시지를 상태에 저장합니다.
                }
            } finally {
                setLoading(false); // 로딩이 끝났음을 표시합니다.
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>로딩 중...</div>; // 로딩 중일 때 표시할 내용
    }

    if (error) {
        return <div>오류 발생: {error}</div>; // 에러 발생 시 표시할 내용
    }

    return (
        <div>
            <head>
                {/* Google Fonts link */}
                <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap"
                      rel="stylesheet"/>
            </head>
            <h1 className="custom-font">분석 결과</h1>
            <pre>{data}</pre>
            {/* 결과를 문자열로 출력 */}
        </div>
    );
};

export default Analysis;
