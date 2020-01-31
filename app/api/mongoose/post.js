const Post = require('../../../mongoose_models/post')

module.exports = (app, db) => {
    app.post('/post', async (req, res) => {
      const { title, content, author } = req.body 
      const post = new Post({ title, content, author })
      const ret = await post.save()
      res.json(ret)
    })  
  }
  