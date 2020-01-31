const express = require('express')
const bodyParser = require('body-parser')
const db = require('./models')

const app = express()

const postRoutes = require('./app/api/mongoose/post')
const authorRoutes = require('./app/api/mongoose/authors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static('app/public'))

postRoutes(app, db)
authorRoutes(app, db)

app.get('/', async (req, res) => {
  res.json({message:'Hello'})
})

module.exports = app
