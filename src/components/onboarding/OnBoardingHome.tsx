import React, {useRef} from 'react';
import {
    Arrow,
    Container, FifthSection, FirstHorizontalContainer,
    FirstSection,
    FirstSectionButton, FourthSection,
    Header,
    HorizontalContainer, SecondSection, SecondSectionContent, SecondSectionTitle, ThirdSection,
    Title
} from '../style/onboarding/HomeStyles';
import NavBar from "./NavBar";

const OnBoardingHome: React.FC = () => {
    const secondSectionRef = useRef<HTMLDivElement>(null);

    const scrollToSecondSection = () => {
        secondSectionRef.current?.scrollIntoView({behavior: 'smooth'});
    };
    return (
        <Container>
            <Header>
                <NavBar/>
            </Header>
            <FirstSection>
                <Title>디지털 취약계층을 위한 웹 키오스크</Title>
                <Title>AIKiosk로 간편하게 사용하기</Title>
                <FirstHorizontalContainer>
                    <FirstSectionButton>사업자 로그인</FirstSectionButton>
                    <FirstSectionButton>유저 로그인</FirstSectionButton>
                </FirstHorizontalContainer>
                <Arrow onClick={scrollToSecondSection}/>
            </FirstSection>
            <SecondSection ref={secondSectionRef}>
                <SecondSectionTitle>간단하게 구성할 수 있는 키오스크 웹 서비스</SecondSectionTitle>
                <SecondSectionContent>웹 사이트로 매장을 관리하세요.</SecondSectionContent>
            </SecondSection>
            <ThirdSection>
                <HorizontalContainer>
                    <Title>디지털 취약 계층을 위한 키오스크</Title>
                    <Title>화면 강조 기능</Title>
                    <Title>음성 주문 기능</Title>
                </HorizontalContainer>

            </ThirdSection>
            <FourthSection>
                <HorizontalContainer>
                    <Title>웹 사이트로 간편한 메뉴 관리</Title>
                    <Title>사진</Title>
                </HorizontalContainer>
            </FourthSection>
            <FifthSection>
                <HorizontalContainer>
                    <Title>고객 맞춤형 키오스크 커스터마이징 지원</Title>
                    <Title>사진</Title>
                </HorizontalContainer>
            </FifthSection>
        </Container>
    );
};

export default OnBoardingHome;
