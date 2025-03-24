const WebpackDevConfig = {
    mode: "development",
    // cdn 引入文件
    externals: {
        react: "React",
        "react-dom": "ReactDOM",
        "@ant-design/icons": "antd.Icon",
        "@ant-design/pro-layout": "ProLayout",
        "@ant-design/pro-form": "ProForm",
        "@ant-design/pro-table": "ProTable",
        "@ant-design/pro-descriptions": "ProDescriptions",
    },
    // devServer 启动配置
    devServer: {
        contentBase: "./dist",
        compress: true,
        port: 9000,
        hot: true,
        inline: true,
        overlay: true,
        open: true,
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
    },
}

module.exports = function getWebpackDevConfig(){
    return WebpackDevConfig
}