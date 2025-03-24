/**
 * 开始实现定义我们的同步 hooks Plugins
 * 首先我们一个 hook 的定义的话内部都是需要进行定义我们的 apply 方法的，内部含有一个函数 compiler
 */
const { SyncHook } = require("tapable")
class SyncHookExampleCompiler {
    constructor() {
        // 收集一些 hooks 依赖，收集 hooks 依赖的呐
        this.hooks = {
            sync_hook: new SyncHook(["name", "age"])
        }

        // 使用 hooks 进行监听一个一个的事件,该部分就是我们会使用的一些插件吧
        this.hooks.sync_hook.tap("event1", (name, age) => {
            console.log("event1事件被触发了",`name: ${name}, age: ${age}`)
        })
    }
}

// 开始实现定义我们的具体的 compiler
const syncHookExampleCompiler = new SyncHookExampleCompiler()
syncHookExampleCompiler.hooks.sync_hook.call("juwenzhang", 18)  // 通过 call 进行调用类中定义的 hooks