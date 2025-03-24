/**
 * 开始使用我们的 bail hooks 吧
 * @fileOverview bail hooks 示例
 * @author juwenzhang
 * @version 1.0.0
 * @description bail hooks 是我们的 tapable 中的一个重要的 hooks，可以大量的使用吧, bail hooks 中如果具备返回值的话后续的代码直接终端执行吧
 */
const { SyncBailHook } = require("tapable")

class BailHookExampleCompiler {
    constructor() {
        // 开始实现收集依赖
        this.hooks = {
            sync_bail_hook: new SyncBailHook(["name", "age"])
        }

        // 开始定义插件和定义事件触发
        this.hooks.sync_bail_hook.tap("event1", (name, age) => {
            console.log("event1事件被触发了",`name: ${name}, age: ${age}`)
            // return "event1事件被触发了"  // 这里的返回值可以阻断后续的事件进行执行吧
        })
        this.hooks.sync_bail_hook.tap("event2", (name, age) => {
            console.log("event2事件被触发了",`name: ${name}, age: ${age}`)
            return "event2事件被触发了"
        })
    }
}

const sync_bail_hook = new BailHookExampleCompiler()
sync_bail_hook.hooks.sync_bail_hook.call("Juwenzhang", 18)