const { marked } = require('marked');
const highlight = require('highlight.js');

function md_marked_loader(source) {
  marked.setOptions({
    highlight: function (code, lang) {
      const language = highlight.getLanguage(lang) ? lang : 'plaintext';
      return highlight.highlight(code, { language }).value;
    }
  })
  const htmlContent = marked(source);
  const innerContent = "`" + htmlContent + "`";
  return `const code = ${innerContent}; export default code`;
}

module.exports = md_marked_loader;