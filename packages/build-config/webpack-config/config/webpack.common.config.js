const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const getWebpackDevConfig = require("./webpack.dev.config")
const getWebpackProdConfig = require("./webpack.prod.config")
const { merge } = require("webpack-merge");

const WebpackCommonConfig = {
    // 入口文件
    entry: {
        app: {
            import: "./src/index.js",
            filename: "js/[id]_[name]_[hash]_bundle.js",
            chunkFilename: "js/[id]_[name]_[hash]_chunk.js",
            dependOn: ["shared"]
        },
        shared: ["axios", "lodash", "dayjs", "moment"]
    },
    // 输出文件
    output: {
        clean: true,
        path: path.resolve(__dirname, "../dist"),
        filename: "js/[id]_[name]_[hash]_bundle.js",
        chunkFilename: "js/[id]_[name]_[hash]_chunk.js",
        publicPath: "./"
    },
    // 自定义解析规则
    module: {
        rules: [
            {
                test: /\.(js|ts|jsx|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
                presets: [
                    "@babel/preset-env",
                    "@babel/preset-react",
                    "@babel/preset-typescript"
                ]
            },
            {
                test: /\.(css|less|scss)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../"
                        }
                    },
                    "postcss-loader",
                    "sass-loader",
                    "less-loader",
                    "css-loader",
                ]
            }
        ]
    },
    // 排除模块
    exclude: [
        /node_modules/
    ],
    // 模块解析规则
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".json"]
    },
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
    // 插件使用
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            inject: "body"
        }),
    ],
}

module.exports = function getWebpackConfig(env = { mode: "production" }){
    const isProd = env.mode === "production"
    const mergeConfig = isProd ? getWebpackProdConfig() : getWebpackDevConfig()
    return merge(WebpackCommonConfig, mergeConfig)
}