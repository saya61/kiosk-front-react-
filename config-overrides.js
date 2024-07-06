const { override, overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
    return {
        ...config,
        allowedHosts: [
            'localhost',
            '.localhost'
        ],
    };
};

module.exports = {
    webpack: override(), // 기본 웹팩 설정을 그대로 사용
    devServer: overrideDevServer(devServerConfig())
};
