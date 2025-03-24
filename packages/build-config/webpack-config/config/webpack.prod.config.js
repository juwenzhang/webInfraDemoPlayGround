const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CSSMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const WebpackProdConfig = {
    mode: "production",
    // 优化操作
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: "~",
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                }
            }
        },
        minimization: {
            minimize: true
        },
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    sourceMap: true, // 如果需要 source map，可以在 terserOptions 中配置
                },
                extractComments: false,
                parallel: true,
            }),
            new CSSMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        "default",
                        {
                            discardComments: {
                                removeAll: true
                            }
                        }
                    ]
                }
            }),
        ],
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
        new CleanWebpackPlugin({
            dry: false,
            verbose: true,
            cleanOnceBeforeBuildPatterns: [
                "**/*",
                path.join(process.cwd(), "build/**/*")
            ],
            cleanAfterEveryBuildPatterns: [
                "**/*",
                path.join(process.cwd(), "build/**/*")
            ],
            dangerouslyAllowCleanPatternsOutsideProject: true
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            inject: "body"
        }),
        new MiniCssExtractPlugin({
            filename: "css/[id]_[name]_[hash]_bundle.css",
            chunkFilename: "css/[id]_[name]_[hash]_chunk.css"
        }),
        new CSSMinimizerPlugin(),
    ],
}

module.exports = function getWebpackProdConfig(){
    return WebpackProdConfig
}