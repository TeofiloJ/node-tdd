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

// Author GET Endpoints

describe('GET /authors', () => {

  let response;
  let authors;

  describe('when there is no author in database', () => {
    beforeAll(async () => {
      clearDB()
      response = await request.get('/authors').set('Accept', 'application/json');
    })

    test('It should not retrieve any authors in db', async () => {
      const authors = await Author.find()
      expect(authors.length).toBe(0);
    });

    test('It should respond with a 200 status code', async () => {
      expect(response.statusCode).toBe(200);
    });

    test('It should return a json with a void array', async () => {
      expect(response.body).toStrictEqual([]);
    });
    
  })

  describe('when there is one or more authors in database', () => {
  
    beforeAll(async () => {
      authors = await factory.createMany('author', 5)
      response = await request.get('/authors').set('Accept', 'application/json')
    }) 

    test('It should respond with a 200 status code', async () => {
      expect(response.statusCode).toBe(200)
    });

    test('It should retrieve 5 lines from the db', async () => {
      const authorsInDatabase = await Author.find()
      expect(authorsInDatabase.length).toBe(5)
    });

    test('It should return a json with a 5 correct authors', async () => {
      expect(response.body.length).toBe(5)
      for (i = 0; i < 5 ; i++) {
        const expectedBody = {
          _id: authors[i]._id.toString(),
          firstName: authors[i].firstName,
          lastName: authors[i].lastName,
        }
        expect(response.body).toContainEqual(expectedBody)
      }
    });
  })
});







