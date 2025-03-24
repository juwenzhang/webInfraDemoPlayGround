function example_loader_03(source, map, meta) {
    console.log("example_loader_01", source, map, meta)
    return source + "example_loader_03";
}

module.exports = example_loader_03;