// 开始实现编写我们的的 markdown 的解析 loader
function md_loader(source) {
    /**
     * 对于 md 文档的解析的话主要是将我们的呈现于文档中的一些东西进行标签化返回吧
     * 一级标题: 就是使用我们的 h1 标签
     * 对于列表的话，就是使用我们的 ul 标签
     * 对于代码块的话，就是使用我们的 pre 标签 等等来实现的呐
     */
    if (typeof source === "string") {
        // title 标签的解析
        source = source.replace(/^(#{1, 6})\s*(.*)\s*#*$/gm, (match, hash, text) => {
            return `<h${hash.length}>${text}</h${hash.length}>>`
        })

        // 列表的解析
        source = source.replace(/^(\s*)([*|-])\s+(.*)$/gm, (match, space, symbol, text) => {
            return `${space}<li class="list-item">${text}</li>`
        })

        // 代码块的解析
        source = source.replace(/```(.*)\n([\s\S]*?)```/gm, (match, language, code) => {
            return `<pre><code class="language-${language}">${code}</code></pre>`
        })

        // 链接的解析
        source = source.replace(/(\[.*]\(.*\))/gm, (match, link) => {
            return `<a href="${link.split("(")[1].split(")")[0]}">${link.split("[")[1].split("]")[0]}</a>`
        })

        // 图片的解析
        source = source.replace(/!\[.*]\(.*\)/gm, (match, image) => {
            return `<img src="${image.split("(")[1].split(")")[0]}" alt="${image.split("[")[1].split("]")[0]}">`
        })

        // 包裹列表和代码块
        source = source.replace(/(<ul>|<ol>|<\/ul>|<\/ol>|<pre>|<\/pre>|<code>|<\/code>)/gi, function(match) {
            return '\n' + match + '\n';
        });
    }
    return source;
}

module.exports = md_loader;