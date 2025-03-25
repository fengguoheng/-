const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
    // 关闭 ESLint 检查（如果有需要）

    publicPath: '/shop/', // 关键配置：设置为根路径
    outputDir: 'dist', // 输出目录（默认即可）

    lintOnSave: false,
    configureWebpack: {
        plugins: [
            new (require('webpack')).DefinePlugin({
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
            })
        ]
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'https://tender-secure-bluegill.ngrok-free.app', // 后端 API 地址，这里直接硬编码
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '' // 去除请求路径中的 /api 前缀
                }
            }
        }
    },


});