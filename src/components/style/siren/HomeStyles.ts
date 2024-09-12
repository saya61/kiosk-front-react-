//homestyle.ts
import styled from 'styled-components';

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #FFCEBA;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
`;

export const Header = styled.header`
    width: 100%;
    height: 60px;
    background-color: #E05721;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
`;

export const Title = styled.h1`
    padding-left : 4.5rem;
    font-style: italic;
    font-weight: bold;

    color: white;
`;

export const UserSection = styled.div`
    display: flex;
    align-items: center;
    color: white;
    white-space: nowrap; /* 텍스트가 줄 바꿈 없이 한 줄로 표시되도록 설정 */
    padding-right : 3rem;
    @media (max-width: 768px) {
        margin-right: -2%;
    }

    p {
        padding-left: 4rem;
        padding-right: 1rem;
        font-size: 1.8rem;

        @media (max-width: 768px) {
            padding-right: 0rem;
            padding-left: 0rem;
            margin-right: 0.5rem;
            font-size: 1.5rem; /* 작은 화면에서 텍스트 크기를 줄임 */
        }
    }

    svg {
        width: 50px;  /* 고정된 크기로 설정 */
        height: 50px; /* 고정된 크기로 설정 */
        @media (max-width: 768px) {
            font-size: 1.5rem; /* 작은 화면에서 텍스트 크기를 줄임 */
        }
    }
`;



export const LocationSection = styled.div`
    width: 100%;
    height: 7%;
    background-color: #FF7D3C;
    display: flex;
    align-items: center;
    padding-left: 4%;
`;

export const LocationIcon = styled.div`
    margin-right: 1%;

    svg {
        margin-top:20%;
        width: 100%;
        height: 20%;
    }
`;

export const LocationText = styled.div`
    color: white;
    font-weight: bold;
    font-style: italic;
    font-size: 1.5rem;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.27);
`;

export const MainContent = styled.div`
    width: 90%;
    background-color: #ffffff;
    border-radius: 16px;
    margin-top: 20px;
    padding: 20px;
    flex-grow: 1;
    overflow-x: auto;
    overflow-y: scroll; /* 세로 스크롤 가능 */
    overflow-x: hidden; /* 가로 스크롤 숨김 */

    /* 스크롤바 숨기기 (웹킷 기반 브라우저) */
    ::-webkit-scrollbar {
        width: 0;  /* 세로 스크롤바 숨기기 */
        height: 0; /* 가로 스크롤바 숨기기 */
    }

    /* Firefox에서 스크롤바 숨기기 */
    scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */
    -ms-overflow-style: none;  /* IE 10+에서 스크롤바 숨기기 */
    margin-bottom: 10px;
`;

export const StoreListContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3열로 고정 */
    grid-gap: 0.5rem; /* 카드 간의 간격을 줄이기 위해 0.5rem로 설정 */
    justify-items: center; /* 아이템을 수평으로 가운데 정렬 */
    padding: 10px;
    overflow-y: auto;
`;

export const StoreCard = styled.div`
    width: 90%;
    background-color: #FFFFFF;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;

    @media (max-width: 768px) {
        width: 75%; /* 모바일에서도 3개가 들어갈 수 있도록 30%로 설정 */
        padding: 15px;
    }
`;

export const StoreImage = styled.img`
    width: 100%;
    height: 120px;
    border-radius: 12px;
    object-fit: cover;
`;

export const StoreInfo = styled.div`
    width: 100%;
    padding-top: 10px;
    text-align: center;
`;

export const StoreLocation = styled.p`
    font-size: 0.9rem;
    color: #555555;
    margin-top: 10px;
`;

export const StoreName = styled.h2`
    font-size: 1rem;
    color: #333333;
    margin: 5px 0 0 0;
    font-weight: bold;
`;

