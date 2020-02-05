'use strict';

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
    title : String,
    content: String,
    author: { type: Schema.ObjectId, ref: 'Author' },
  })
  
module.exports = mongoose.model('Post', postSchema)