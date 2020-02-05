var express = require('express');
var router = express.Router();

const Author = require('../models/author.model')

router.post('/author', async (req, res) => {
  const { firstName, lastName } = req.body 
  const user = new Author({firstName, lastName})
  const ret = await user.save()
  res.json(ret)
})

router.get('/authors', async (req, res) => {
  const ret = await Author.find().select('firstName lastName')
  res.json(ret)
})

router.get('/author', async (req, res) => {
  const ret = await Author.find({_id: req.body._id})
  res.json(ret)
})

module.exports = router
  
  