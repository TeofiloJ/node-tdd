const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)

const Author = require('../models/author.model')
const Post = require('../models/post.model')

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

// Author POST Endpoints

describe('POST /author', () => {

  let response;
  let data = {};

  beforeAll(async () => {
    clearDB()
    data.firstName = 'John'
    data.lastName = 'Wick'
    response = await request.post('/author').send(data);
  })

  test('It should respond with a 200 status code', async () => {
    expect(response.statusCode).toBe(200);
  });

  test('It should return a json with the new author', async () => {
    expect(response.body.firstName).toBe(data.firstName);
    expect(response.body.lastName).toBe(data.lastName);
  });

  test('It should create and retrieve a post for the selected author', async () => {
    const author = await Author.findOne({_id: response.body._id})
    expect(author._id.toString()).toBe(response.body._id)
    expect(author.firstName).toBe(data.firstName)
    expect(author.lastName).toBe(data.lastName)
  });
  
});

// Post GET Endpoints

describe('GET /posts', () => {

  let response;
  let posts;

  describe('when there is no post in database', () => {
    beforeAll(async () => {
      clearDB()
      response = await request.get('/posts').send().set('Accept', 'application/json')
    })

    test('It should not retrieve any post in db', async () => {
      const posts = await Post.find()
      expect(posts.length).toBe(0);
    });

    test('It should respond with a 200 status code', async () => {
      expect(response.statusCode).toBe(200);
    });

    test('It should return a json with a void array', async () => {
      expect(response.body).toStrictEqual([]);
    });
    
  })

  describe('when there is one or more posts in database', () => {
  
    beforeAll(async () => {
      clearDB()
      var data = {}
      post = await factory.create('post')
      const id = post.author.toString()
      author = await request.get('/author').send({_id:id}).set('Accept', 'application/json')

      response = await request.get('/posts').set('Accept', 'application/json')

    })

    test('It should respond a correct post', async () => {
      expect(response.body.length).toBe(1)
      expect(response.body[0]).toStrictEqual(
          {
            data: [{
              _id: post._id.toString(),
              title: post.title,
              content:post.content,
              relationship: {
                author: {
                  data: {id: author._id.toString()}
                }
              }
            }],
            included: []
          }
      )
    });

    
  })
  describe('when there is one or more posts included author in database', () => {

    beforeAll(async () => {
      clearDB()
      var data = {}
      post = await factory.create('post')
      const id = post.author.toString()
      author = await request.get('/author').send({_id:id}).set('Accept', 'application/json')
      responseWithParams = await request.get('/posts?included=author').set('Accept', 'application/json')
    })

    test('It should respond included a correct post included', async () => {
      expect(responseWithParams.body.length).toBe(1)
      expect(responseWithParams.body[0]).toStrictEqual(
          {
            data: [{
              _id: post._id.toString(),
              title: post.title,
              content:post.content,
              relationship: {
                author: {
                  data: {id: author._id.toString()}
                }
              }
            }],
            included: [
              {
                firstName: author.firstName,
                lastName: author.lastName,
                _id: author._id.toString()
              }
            ]
          }
      )
    });
  })
});

// Post POST Endpoints

describe('POST /post', () => {

  let response
  let data = {}
  let post
  let author

  // beforeAll(async () => await cleanDb(db))

  describe('The author has one or multiple posts', () => {
    beforeAll(async () => {
      clearDB()
      author = await factory.create('author')
      post = await factory.build('post')
      data.title = post.title
      data.content = post.content
      data.author = author._id

      response = await request.post('/post').send(data).set('Accept', 'application/json')
    })
    test('It should respond with a 200 status code', async () => {
      expect(response.statusCode).toBe(200);
    });

    test('It should create and retrieve a post for the selected author', async () => {
      const postsInDatabase = await Post.find()
      expect(postsInDatabase.length).toBe(1)
      expect(postsInDatabase[0].title).toBe(post.title)
      expect(postsInDatabase[0].content).toBe(post.content)
    });
    
    test('It should return a json with the author\'s posts', async () => {
      expect(response.body.title).toBe(data.title);
      expect(response.body.content).toBe(data.content);
    });
    
  })
});






