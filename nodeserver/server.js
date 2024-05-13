const express = require('express');
const app = express();
const { parseMarkdown } = require('./util');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/markdown', (req, res) => {
  const markdown = req.query.markdown || '';
  res.send(parseMarkdown(markdown));
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});
