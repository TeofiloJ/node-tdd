const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)

const mongoose = require('mongoose')

function clearDB() {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(function() {});
  }
}

require('./factories/post.factory').factory
require('./factories/author.factory').factory




beforeAll(async () => {
  clearDB()
})

// Root Endpoint

it('GET /', async done => {
  const response = await request.get('/')

  expect(response.status).toBe(200)

  expect(response.body.message).toBe('Hello')
  done()
})