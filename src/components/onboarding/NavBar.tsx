import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// 스타일 컴포넌트 정의
const NavbarContainer = styled.div<{ isScrolled: boolean }>`
    display: flex;
    justify-content: space-between; /* 양쪽 끝에 요소 배치 */
    align-items: center; /* 수직 정렬 */
    background-color: #ffffff; /* 배경 색상 */
    height: 60px; /* 높이 설정 */
    width: 100%;
    padding: 0 20px; /* 좌우 패딩 */
    position: fixed; /* 고정 위치 */
    top: 0; /* 화면 상단 고정 */
    left: 0; /* 왼쪽 고정 */
    box-shadow: ${({ isScrolled }) => (isScrolled ? '0 2px 5px rgba(0,0,0,0.1)' : 'none')}; /* 스크롤 시 그림자 효과 */
    border-bottom: ${({ isScrolled }) => (isScrolled ? '1px solid #cf0000' : 'none')}; /* 스크롤 시 하단 테두리 */
    z-index: 1000; /* 다른 요소 위에 표시되도록 설정 */
`;

const SiteLogo = styled.div`
    padding-left: 17.5rem;
    font-size: 1.5rem; /* 로고 크기 */
    font-weight: bold; /* 로고 두께 */
    color: #b83d3d; /* 로고 색상 */
`;

const Brands = styled.div`
    display: flex;
    gap: 2rem; /* 브랜드 간의 간격 */
`;

const NavbarBrand = styled.div`
    color: #b83d3d; /* 글자 색상 */
    font-size: 1.2rem; /* 글자 크기 */
    font-weight: bold; /* 글자 두께 */
    cursor: pointer; /* 마우스 커서 스타일 */
    padding: 0.4rem;
    border-radius: 0.2rem;

    &:hover {
        background-color: #f0f0f0; /* 호버 시 배경 색상 변경 */
        text-decoration: underline; /* 호버 효과 */
    }
`;

const LanguageButtons = styled.div`
    padding-right: 10rem;
    display: flex;
    align-items: center; /* 버튼 수직 정렬 */
    gap: 10px; /* 언어 버튼 간의 간격 */
`;

const LButton = styled.button`
    background: none; /* 기본 배경 제거 */
    color: #b83d3d; /* 글자 색상 */
    cursor: pointer; /* 마우스 커서 스타일 */
    padding: 0.4rem 0.8rem; /* 패딩 추가 */
    border-radius: 0.2rem;

    &:hover {
        background-color: #f0f0f0; /* 호버 시 배경 색상 변경 */
    }
`;

const Separator = styled.hr`
    background-color: #cf0000; /* 구분자 색상 */
    height: 1px; /* 높이를 설정하여 가로 구분선처럼 보이게 함 */
    width: 20px; /* 너비를 설정하여 적당한 크기 */
    margin: 0 10px; /* 좌우 여백 추가 */
    border: none; /* 기본 테두리 제거 */
`;

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0); // 스크롤이 0보다 클 경우 true
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll); // 메모리 누수 방지
        };
    }, []);

    return (
        <NavbarContainer isScrolled={isScrolled}>
            <SiteLogo>로고</SiteLogo> {/* 로고 텍스트 또는 이미지 */}
            <Brands>
                <NavbarBrand>키오스크 소개</NavbarBrand>
                {/*회사소개 공지사항 등록하기 고객센터 자주 묻는 질문*/}
                <NavbarBrand>등록하기</NavbarBrand>
                {/*<NavbarBrand></NavbarBrand>*/}
                <NavbarBrand>문의하기</NavbarBrand>
                <NavbarBrand>자주 묻는 질문</NavbarBrand>
            </Brands>
            <LanguageButtons>
                <LButton>KOR</LButton>
                <Separator /> {/* 구분자 추가 */}
                <LButton>ENG</LButton>
            </LanguageButtons>
        </NavbarContainer>
    );
};

export default Navbar;
