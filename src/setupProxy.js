const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            onProxyReq: (proxyReq, req, res) => {
                console.log(`Proxying request: ${req.method} ${req.url}`);
            },
            onProxyRes: (proxyRes, req, res) => {
                console.log(`Received response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
            }
        })
    );
};
