// 开始实现自定义 loader 示例1
/**
 * loader 是什么？？就是是一个用于将我们的传入的资源进行转换的一个可执行函数吧
 * 我们通过外部传入资源，然后通过该对该资源进行响应的转换处理，最终将该资源返回出去
 * 如果有必要，那就交给下一个 loader 进行处理，否则就是直接交给打包工具进行构建静态资源了
 * 同时我们的 loader 的执行顺序是根据配置文件的从下往下进行执行的，内部使用的数据结构是我们的 Queue 队列
 * @param source 传入的需要进行处理的资源
 * @param map 传入的 source-map
 * @param meta 传入的元数据
 */
function example_loader_01(source, map, meta) {
    console.log("example_loader_01", source, map, meta)
    return source + "example_loader_01";
}

module.exports = example_loader_01;