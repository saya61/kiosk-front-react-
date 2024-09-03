import styled from 'styled-components';
import { Container as OriginalContainer, Header as OriginalHeader, Title as OriginalTitle } from './HomeStyles';

// Container 스타일 오버라이딩
export const Container = styled(OriginalContainer)`
    background-color: #af4c12; // 배경 색상을 변경
`;

export const LoginBox = styled.div`
    width: 30%;
    height: 30%;
    margin: 3rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10rem;
    border-radius: 20px;
    overflow: hidden;

    @media (max-width: 768px) {
        width: 40%;
        height: 35%;
        padding: 5rem;
    }
`;

// Header 스타일 오버라이딩
export const Header = styled(OriginalHeader)`
    display: flex;
    justify-content: center; /* 수평 중앙 정렬 */
    align-items: center;     /* 수직 중앙 정렬 */
    height: 10vh;            /* Header 높이를 설정 */
`;

// Title 스타일 오버라이딩
export const Title = styled(OriginalTitle)`
    padding-left: 0;
    text-align: center;       /* 텍스트를 중앙 정렬 */
    flex: 1;                  /* 부모 요소에서 여유 공간을 모두 차지 */
`;

export const Input = styled.input`
    width: 300px;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
`;

export const Button = styled.button`
    width: 20rem;
    padding: 10px;
    margin: 10px 0;
    background-color: #FF5733;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        background-color: #e04e2a;
    }
`;

export const RegisterLabel = styled.p`
    color: #FF7D3C;
    font-weight: bold;
    font-style: italic;
    cursor: pointer;
    text-align: center;
    margin-top: 20px;
    text-decoration: underline; 

`;

export const ErrorText = styled.p`
    color : #ff3636
`