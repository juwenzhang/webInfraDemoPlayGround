/**
 * loop hook 实现的是我们的事件循环执行钩子函数吧
 */
const { SyncLoopHook } = require("tapable");
class LoopHookExampleCompiler {
    constructor() {
        this.hooks = {
            sync_loop_hook: new SyncLoopHook(["name", "age"])
        }

        this.hooks.sync_loop_hook.tap("loop_hook_1", (name, age) => {
            console.log("loop_hook_1", name, age);
            return "loop_hook_1";
        });
        this.hooks.sync_loop_hook.tap("loop_hook_2", (name, age) => {
            console.log("loop_hook_2", name, age);
            return "loop_hook_2";
        });
        this.hooks.sync_loop_hook.tap("loop_hook_3", (name, age) => {
            console.log("loop_hook_3", name, age);
            return "loop_hook_3";
        });
        this.hooks.sync_loop_hook.tap("loop_hook_4", (name, age) => {
            console.log("loop_hook_4", name, age);
            return undefined;  // 这里的返回值可以阻断后续的事件进行执行吧
        });
    }
}

const LoopHookExampleCompilerInstance = new LoopHookExampleCompiler();
LoopHookExampleCompilerInstance.hooks.sync_loop_hook.call("loop_hook_name", "loop_hook_age");