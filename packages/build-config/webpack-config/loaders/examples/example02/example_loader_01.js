// @ts-ignore
function example_loader_01(source, map, meta) {
    console.log("example_loader_01", source, map, meta)
    const callback = this.callback
    const callbackAsync = this.async();

    // 模拟异步操作，如果不做额外处理的话，这个时候我们的 loader 处理的话就是 undefined 的
    setTimeout(() => {
        // 对于异步的返回结果
        callbackAsync(null, new Buffer(source + "example_loader_01"));
    }, 1000)

    /**
     * 对于异步的 loader 来说的话，我们需要通过 this 绑定的 callback 来返回结果
     * @param errorMessage 本次loader操作的错误信息
     * @param source 操作后的需要传递给下一个loader处理的 source
     */
    callback(null, new Buffer(source + "example_loader_01"));
}

module.exports = example_loader_01;