const { validate } = require("schema-utils");  // 进行参数校验的库
function example_loader_02(source, map, meta) {
    console.log("example_loader_02", source, map, meta)

    if (!this || !this.getOptions) {
        throw new Error("example_loader_02 must be used in a Webpack environment.");
    }
    const options = this.getOptions();  // 获取loader配置项

    const validateSchema = {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "loader的名字",
            },
            age: {
                type: "number",
                description: "loader的年龄",
            },
            isActive: {
                type: "boolean",
                description: "loader是否活跃",
            },
            arr: {
                type: "array",
                description: "loader的数组",
                items: {
                    type: "string",
                },
            },
        },
        required: ["name", "age"],
    }

    try {
        validate(validateSchema, options)
        return source + "example_loader_02";
    } catch (error) {
        console.log(error)
        return source;
    }
}

module.exports = example_loader_02;