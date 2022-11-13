require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

let urls = {};

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:url', (req, res) => {
  const shorturl = Number(req.params.url) - 1;
  const url = Object.keys(urls)[shorturl];

  res.redirect(url);
});

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const urlRegex = /^https?:\/\//;
  let hostname = "Invalid";

  if (urlRegex.test(url)) {
    const urlObj = new URL(url);
    hostname = urlObj.hostname;
  }

  dns.lookup(hostname, (err) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      const num = (url in urls) ? urls[url] : Object.keys(urls).length + 1;

      urls[url] = num;

      res.json({
        original_url: url,
        short_url: num
      });
    }
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
