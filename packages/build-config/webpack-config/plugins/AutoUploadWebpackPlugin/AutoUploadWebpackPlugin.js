const { NodeSSH } = require("node-ssh")
const readline = require('readline');

class AutoUploadWebpackPlugin {
    // init function
    constructor(options = {}) {
        this.options = options;
        this.ssh = null;
        this.logger = null
    }

    async errorHandle(fn) {
        try {
            return await fn();
        } catch (error) {
            this.logger.error(`Error during file upload process: ${error.message}`);
        }
    }

    // connect server function
    async connectServer() {
        this.ssh = new NodeSSH();
        if (this.options.username && this.options.password && this.options.host) {
            await this.ssh.connect({
                host: this.options.host,
                username: this.options.username,
                password: this.options.password
            })
        } else {
            const rl = readline.createInterface({
                input: process.stdin,  // 输入流
                output: process.stdout  // 输出流
            });

            const askQuestion = async (question) => {
                return new Promise((resolve) => {
                    rl.question(question, (answer) => {
                        resolve(answer);
                    });
                });
            };

            try {
                // 串行提问
                this.options.host = await askQuestion("Please input your server-host: ");
                this.options.username = await askQuestion("Please input your server-username: ");
                this.options.password = await askQuestion("Please input your server-password: ");

                // 关闭 readline 接口
                rl.close();

                // 建立 SSH 连接
                await this.connectServer()
            } catch (error) {
                this.logger.error(`Error during SSH connection setup: ${error.message}`);
                rl.close();
            }
        }
    }

    async deleteFile(serverFilePath){
        try {
            await this.ssh.execCommand(`rm -rf ${serverFilePath}`); // 递归强制删除
            this.logger.info(`Deleted server files at path: ${serverFilePath}`);
        } catch (error) {
            this.logger.error(`Failed to delete server files at path: ${serverFilePath}. Error: ${error.message}`);
        }
    }

    async uploadFile(outputPath, serverFilePath){
        try {
            const status = await this.ssh.putDirectory(outputPath, serverFilePath, {
                recursive: true,  // 是否递归上传
                concurrency: 10,  // 并发上传数量
            });
            if (status) {
                this.logger.info("Files uploaded successfully.");
            } else {
                this.logger.error("File upload failed.");
            }
        } catch (error) {
            this.logger.error(`File upload failed with error: ${error.message}`);
        }
    }

    async closeConnection(){
        try {
            await this.ssh.dispose();
            this.logger.info("SSH connection closed successfully.");
        } catch (error) {
            this.logger.error(`Failed to close SSH connection: ${error.message}`);
        }
    }

    // realise apply instance method
    apply(compiler) {
        // await asset output into dist folder to upload our static files to server
        // sync use tap event
        // async use tapAsync event
        compiler.hooks.afterEmit.tapAsync("AutoUploadWebpackPlugin", async (compilation, callback) => {
            // get logger instance
            this.logger = compilation.getLogger("AutoUploadWebpackPlugin");

            // get our static output path
            const outputPath = compiler.options.output.path;

            try {
                // link our server by ssh
                await this.connectServer();

                // delete server have had static files
                await this.deleteFile(this.options?.serverFilePath);

                // upload our static files to server
                await this.uploadFile(outputPath, this.options.serverFilePath);

                // close ssh connection
                await this.closeConnection()

                // after emit, exec callback function
                callback()
            } catch (error) {
                this.logger.error(`Error during file upload process: ${error.message}`);
                callback(error); // 将错误传递给 Webpack
            }
        })
    }
}

module.exports = AutoUploadWebpackPlugin;
module.exports.AutoUploadWebpackPlugin = AutoUploadWebpackPlugin;