# webpack demo_infra
> 文档阅读: http://juwenzhang.github.io/juwenzhang_ssg/frontend/webpack.html

* config 主要是对我们的 webpack 进行的一个生产环境和开发环境抽离的配置
* loaders 主要是探究一些 webpack loader 的使用以及自定义 loader 的实现吧
* plugins 主要是针对我们的 webpack 插件的实现以及 hook 的探究吧

# plugin 是如何注入 webpack 的声明周期的呐？？？
* 内部的源码的话通过的是对数组进行操作（这里使用的是集合Set的数据结构吧）
* 然后通过每个插件内部的一些 apply 方法进行注入和执行的对应的函数的吧
* 同时在注入插件入生命周期的历程中主要还使用了我们的类型缩小判断吧
  * 判断是否是函数或者说是对象吧
  * 通过不同的类型判断，就具备不同的处理逻辑吧
```javascript
// --webpack-config.js 中的配置体现
module.exports = {
    plugins: [
        // 函数插件
        function() {
            console.log('plugin1')
        },
        // 实例化插件
        new htmlWebpackPlugin({
            template: './src/index.html'
        }),
        new cleanWebpackPlugin(),
        new terserWebpackPlugin()
    ]
}
```
```javascript
const { SyncHook } = require('tapable');  // pnpm add tapable 安装依赖
// 插件注入的源码核心逻辑吧
const plugins = options.plugins || [];
// 开始实现循环遍历+判断进行注入
for (const plugin of plugins) {
    if (typeof plugin === 'function') {
        plugin.apply(compiler, [compiler]); // 每一个插件内部都是具由我们的 apply 方法进行注入的
    } else {
        plugin.apply()
    }
}

class Compiler {
    constructor() {
        this.hooks = {
            // 调用 tapable 中的不同 hook 钩子函数吧
            compilation: new SyncHook(['compilation', 'compiler']),
        }
        // 由于早期的 webpack 进行开展的时候没有 promise 出现的原因，所以说 webpack 中存在着大量的回调地狱吧
        // 这一点呐是 webpack 源码值得进行后续优化修改的地方吧，但是呐 webpack 这个打包工具的很多的思想很优秀的呐
        // 同时我们webpack 作为前端的元老级打包工具，很多的其他的打包工具都是借鉴了他的一定的思想吧
        // webpack 打包速度比 vite 慢的最主要原因就是 webpack 是实现的是现形成我们的 依赖图后再进行的打包吧
        // 这个也是 webpack 的打包上速度上没有 vite 快的原因吧
        this.hooks.compilation.tap('Compiler', (compilation, compiler) => {
            console.log('compilation')
            compiler.hooks.compilation.tap('Compiler', (compilation, compiler) => {
                console.log('compilation')
            })
        })
    }
}
```
* 通过上面的源码阅读，我们的每个自定义插件的话需要提供一个示例方法名为: `apply 的，同时该方法接收一个参数，名为: compiler`
  * 我们在进行配置 webpack 的时候可能常用到的一些插件
    * CleanWebpackPlugin 实现的是清理我们的构建目录的，保证每次的构建都是最新的
    * HtmlWebpackPlugin 实现的是我们的 html 文件的打包
    * TerserWebpackPlugin 进行的代码压缩
    * MiniCssExtractPlugin 进行的 css 文件的打包，CSS文件的分离
    * CompressionWebpackPlugin 进行的代码压缩
    * BundleAnalyzerPlugin 进行webpack打包分析的
    * webpack-bundle-analyzer 进行打包分析的
    * ServiceWorkerPlugin 实现的是我们的离线缓存
    * splitChunksPlugin 实现的是我们的代码的分离
    * HotModuleReplacementPlugin 实现的是我们的热更新
* 反正的都是对我们的 webpack 进行生产构建产物的时候进行优化的呐
  * 最基本的原理还是围绕的是浏览器的原理来进行的
  * 最终的要是这里涉及到了我们的浏览器的`首屏渲染的优化`以及`项目构建的速度优化` 和 `浏览器兼容性的优化`

## 实现的具体流程
* 第一步: 在webpack函数中调用 createCompiler 方法，进行注册所有的插件
* 第二步: 在createCompiler 方法中调用每个插件中定义的 apply 方法
* 第三步: 在apply 方法中调用 compiler 的 hook 进行注册，hook 是一个 Hook 系列的父类吧
* 第四步: 在compiler hook 中调用对应的方法进行注册

## webpack 常见配置
* mode  区分我们的开发环境和生产环境
* devtool 进行的代码调试
* module.rules.loader 解析不同文件的 loader 配置
* plugins 插件的配置
* resolve 包含的文件名后缀名配置
* externals 排除的一些配置
* devServer 开发服务器的配置
* output 输出文件的配置，可以进行代码分包吧
* entry 入口文件的配置
* target 配置我们的环境
* optimization 优化配置