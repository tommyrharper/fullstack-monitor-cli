const express = require('express');
const path = require('path'); // NEW
// const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist'); // NEW
const HTML_FILE = path.join(DIST_DIR, 'index.html'); // NEW
const mockResponse = {
  foo: 'bar',
  bar: 'foo'
};
// app.use(cors());
app.use(express.static(DIST_DIR)); // NEW
// app.options('', cors());

app.get('/apiTest', (req, res) => {
  console.log('hit /api');
  res.send(mockResponse);
});
app.get('/', (req, res) => {
  res.sendFile(HTML_FILE); // EDIT
});
app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
