const { SyncWaterfallHook } = require("tapable")

/**
 * waterfall 实现的就是我们的一遍一遍的将我们的上一次结果进行的返回做为下一次事件的第一个参数的吧
 */
class WaterFallHookExampleCompiler {
    constructor() {
        this.hooks = {
            waterFallHook: new SyncWaterfallHook(["name", "age"])
        }
        this.hooks.waterFallHook.tap("waterFallHook", (name, age) => {
            console.log(name, age)
            return "waterFallHook"
        })
        this.hooks.waterFallHook.tap("waterFallHook2", (name, age) => {
            console.log(name, age)
            return "waterFallHook2"
        })
    }
}
const compiler = new WaterFallHookExampleCompiler()
compiler.hooks.waterFallHook.call("juwenzhang", 18)