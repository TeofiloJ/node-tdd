const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)

const Author = require('../mongoose_models/author')
const Post = require('../mongoose_models/post')

function clearDB() {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(function() {});
  }
}

require('./mongoose_factories/post').factory
require('./mongoose_factories/author').factory


const mongoose = require('mongoose')

beforeAll(async () => {
  const url = `mongodb://localhost/node_tdd`
  await mongoose.connect(url, { useNewUrlParser: true })
  clearDB()
})

// Root Endpoint

it('GET /', async done => {
  const response = await request.get('/')

  expect(response.status).toBe(200)

  expect(response.body.message).toBe('Hello')
  done()
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

// Post POST Endpoints

describe('POST /post', () => {

  let response
  let data = {}
  let post
  let author

  // beforeAll(async () => await cleanDb(db))

  describe('The author has one or multiple posts', () => {
    beforeAll(async () => {
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
    
    test('The post should belong to the selected authors\' posts', async () => {
      const posts = await Post.find({author: author._id.toString()})
      expect(posts.length).toBe(1)
      expect(posts[0].title).toBe(post.title)
      expect(posts[0].content).toBe(post.content)
    })
    
  })
});






