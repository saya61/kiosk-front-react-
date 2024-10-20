import React from 'react';

interface BackgroundImageComponentProps {
    imagePath: string;
}


const BackgroundImageComponent: React.FC<BackgroundImageComponentProps> = ({ imagePath }) => {
    const backgroundStyle: React.CSSProperties = {
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '80vw',
        height: '80vh',
    };

    return <div style={backgroundStyle}></div>;
};

export default BackgroundImageComponent;
