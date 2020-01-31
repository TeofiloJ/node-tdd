const Author = require('../../../mongoose_models/author')

module.exports = (app, db) => {
  app.post('/author', async (req, res) => {
    const { firstName, lastName } = req.body 
    const user = new Author({firstName, lastName})
    const ret = await user.save()
    res.json(ret)
  })

  app.get('/authors', async (req, res) => {
    const ret = await Author.find().select('firstName lastName')
    res.json(ret)
  })
  }
  