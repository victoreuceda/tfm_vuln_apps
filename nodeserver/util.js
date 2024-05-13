const marked = require('marked');

function parseMarkdown(markdownText) {
  return marked(markdownText);
}

module.exports = { parseMarkdown };