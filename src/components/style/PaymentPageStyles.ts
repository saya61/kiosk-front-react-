import styled from 'styled-components';

export const PaymentPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: ${(props) => props.theme.bodyBgColor};
    color: ${(props) => props.theme.bodyColor};
`;

export const PaymentHeader = styled.header`
    background-color: ${(props) => props.theme.headerBgColor};
    color: ${(props) => props.theme.headerColor};
    display: flex;
    justify-content: center; /* 요소들을 중앙 정렬 */
    align-items: center; /* 수직 정렬 */
    position: relative; /* GoBackButton을 절대 위치로 고정하기 위해 상대 위치로 설정 */
    padding: 20px;
    font-size: 24px;
    font-weight: bold;
    width: 100%; /* 전체 너비를 사용 */
`;

export const PaymentContent = styled.div`
    display: flex;
    flex-grow: 1;
    padding: 20px;
`;

export const OrderList = styled.div`
    flex: 2;
    border: 2px solid ${(props) => props.theme.productBorderColor};
    margin-right: 20px;
    padding: 10px;
    overflow-y: auto;
`;

export const PaymentOptions = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;

export const Button = styled.button<{ selected?: boolean, highlight?: boolean }>`
    background-color: ${(props) =>
            props.highlight
                    ? props.theme.highlightColor
                    : props.selected
                            ? props.theme.buttonHoverBgColor
                            : props.theme.buttonBgColor};
    color: ${(props) => props.highlight ? props.theme.highlightTextColor : props.theme.headerColor};
    border: 2px solid ${(props) => props.theme.productBorderColor};
    padding: 15px 20px;
    margin: 10px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 18px;
    font-weight: bold;
    width: 100%;
`;

// TestButton
export const TestButton = styled.button`
    background-color: #fa9595; /* 원하는 배경색으로 설정 */
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    width: 30;
`;


export const TestLabel = styled.label<{ age: number | null }>`
    position: absolute;
    margin-top:1860px;
    margin-left: 5%;
    font-size: 16px; /* 원하는 글자 크기로 설정 */
    color: #333; /* 원하는 글자 색으로 설정 */
    display: block; /* label을 블록 요소로 설정하여 줄 바꿈 */
    margin-bottom: ${({ age }) => {
        if (age === null) return '0px'; /* age가 null이면 0px */
        return age > 60 ? '4rem' : '0px'; /* age가 60 넘으면 4rem, 아니면 0px */
    }};
`;


export const PaymentButton = styled(Button)`
    font-size: 24px; /* 버튼 글꼴 크기 증가 */
    padding: 20px 30px; /* 버튼 패딩 증가 */
    width: 60%; /* 너비 설정 */
    border-radius: 50px;
    background-color: black;
`;

export const GoBackButton = styled(Button)`
    position: absolute; /* 부모 요소 안에서 절대 위치 */
    left: 5%; /* 항상 좌측 끝에 위치 */
    transform: translateY(-50%); /* 수직 중앙 정렬 */
    border-color: transparent;
    background-color: transparent;
    padding: 0px 0px;
    margin: 0px;
    color: ${(props) => props.theme.headerColor};
    cursor: pointer;
    font-size: 1.6rem;
    font-weight: bold;
    height: 27%;
    width: auto; /* 너비를 자동으로 설정하여 텍스트에 맞춤 */
    ${(props) => props.highlight && `
        background-color: ${props.theme.highlightColor};
        color: ${props.theme.highlightTextColor};
    `}
`;

export const ProductItem = styled.div`
    border: 1px solid ${(props) => props.theme.productBorderColor};
    padding: 1%;
    border-radius: 8px;
    min-width: 200px; /* 최소 너비 설정 */
    margin: 1%; /* 각 항목 사이의 간격 추가 */
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
`;

export const ProductInfo = styled.div`
    width: 20vw;
    height: 20vh;
    `

export const OptionBox = styled.div`
    padding-top: 1%;
    overflow: auto;
`
export const PaymentFooter = styled.footer`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${(props) => props.theme.footerBgColor};
    padding: 20px;
    font-size: 18px;
    border-top: 2px solid ${(props) => props.theme.footerBorderColor};
`;

export const TotalAmount = styled.div`
    flex: 1;
    color: ${(props) => props.theme.totalAmountColor};
`;

export const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2%;
    margin-bottom: 2%;
    margin-left: -20%;
`;

export const PageButton = styled.button`
    padding: 10px 15px;
    margin: 0 5px;
    background-color: ${(props) => props.theme.buttonBgColor};
    color: ${(props) => props.theme.headerColor};
    border: 1px solid ${(props) => props.theme.productBorderColor};
    cursor: pointer;
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
