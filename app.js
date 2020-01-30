const express = require('express')
const bodyParser = require('body-parser')
const db = require('./models')
const Author = require('./mongoose_models/author')
const Post = require('./mongoose_models/post')

const app = express()

const postRoutes = require('./app/api/post')
const authorRoutes = require('./app/api/authors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static('app/public'))


// postRoutes(app, db)
// authorRoutes(app, db)


app.get('/', async (req, res) => {
  res.json({message:'Hello'})
})

app.post('/author', async (req, res) => {
    const { firstName, lastName } = req.body 
    const user = new Author({firstName, lastName})
    const ret = await user.save()
    res.json(ret)
  })

app.get('/author', async (req, res) => {
  const { firstName, lastName } = req.body
  const ret = await Author.findOne({firstName:'John',lastName:'Wick'})
  res.json(ret)
})


app.post('/post', async (req, res) => {
  const { title, content, author } = req.body 
  const post = new Post({ title, content, author })
  const ret = await post.save()
  res.json(ret)
})


  

module.exports = app
