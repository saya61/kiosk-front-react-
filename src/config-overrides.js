const { override, devServer } = require('customize-cra');

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
    devServer: override(devServerConfig())
};
