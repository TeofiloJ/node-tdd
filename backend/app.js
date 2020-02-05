var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var mongoose = require('./database')

// App setup

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors());

// Endpoints

const postRoutes = require('./api/post')
const authorRoutes = require('./api/author')

app.use(postRoutes)
app.use(authorRoutes)

// Root endpoint

app.get('/', (req, res) => {
  res.json({message:'Hello'})
});

module.exports = app