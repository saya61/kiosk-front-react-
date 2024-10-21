import React from 'react';

interface BackgroundImageComponentProps {
    imagePath: string;
}

// 이미지를 따로 띄우는 컴포넌트
const BackgroundImageComponent: React.FC<BackgroundImageComponentProps> = ({ imagePath }) => {
    const backgroundStyle: React.CSSProperties = {
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '80vw',
        height: '90vh',
    };

    return <div style={backgroundStyle}></div>;
};

export default BackgroundImageComponent;
