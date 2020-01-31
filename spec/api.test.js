const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)

const Author = require('../mongoose_models/author')
const Post = require('../mongoose_models/post')

const config = require(__dirname + '/../config/config');

function getDbUrl(){
    return "mongodb://" + config.host + "/" + config.database
}


function clearDB() {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(function() {});
  }
}

require('./mongoose_factories/post').factory
require('./mongoose_factories/author').factory


const mongoose = require('mongoose')

beforeAll(async () => {
  const url = getDbUrl()
  await mongoose.connect(url, { useNewUrlParser: true })
  clearDB()
})

// Root Endpoint

// it('GET /', async done => {
//   const response = await request.get('/')

//   expect(response.status).toBe(200)

//   expect(response.body.message).toBe('Hello')
//   done()
// })

// // Author POST Endpoints

// describe('POST /author', () => {

//   let response;
//   let data = {};

//   beforeAll(async () => {
//     clearDB()
//     data.firstName = 'John'
//     data.lastName = 'Wick'
//     response = await request.post('/author').send(data);
//   })

//   test('It should respond with a 200 status code', async () => {
//     expect(response.statusCode).toBe(200);
//   });

//   test('It should return a json with the new author', async () => {
//     expect(response.body.firstName).toBe(data.firstName);
//     expect(response.body.lastName).toBe(data.lastName);
//   });

//   test('It should create and retrieve a post for the selected author', async () => {
//     const author = await Author.findOne({_id: response.body._id})
//     expect(author._id.toString()).toBe(response.body._id)
//     expect(author.firstName).toBe(data.firstName)
//     expect(author.lastName).toBe(data.lastName)
//   });
  
// });

// // Author GET Endpoints

// describe('GET /authors', () => {

//   let response;
//   let authors;

//   describe('when there is no author in database', () => {
//     beforeAll(async () => {
//       clearDB()
//       response = await request.get('/authors').set('Accept', 'application/json');
//     })

//     test('It should not retrieve any authors in db', async () => {
//       const authors = await Author.find()
//       expect(authors.length).toBe(0);
//     });

//     test('It should respond with a 200 status code', async () => {
//       expect(response.statusCode).toBe(200);
//     });

//     test('It should return a json with a void array', async () => {
//       expect(response.body).toStrictEqual([]);
//     });
    
//   })

//   describe('when there is one or more authors in database', () => {
  
//     beforeAll(async () => {
//       authors = await factory.createMany('author', 5)
//       response = await request.get('/authors').set('Accept', 'application/json')
//     }) 

//     test('It should respond with a 200 status code', async () => {
//       expect(response.statusCode).toBe(200)
//     });

//     test('It should retrieve 5 lines from the db', async () => {
//       const authorsInDatabase = await Author.find()
//       expect(authorsInDatabase.length).toBe(5)
//     });

//     test('It should return a json with a 5 correct authors', async () => {
//       expect(response.body.length).toBe(5)
//       for (i = 0; i < 5 ; i++) {
//         const expectedBody = {
//           _id: authors[i]._id.toString(),
//           firstName: authors[i].firstName,
//           lastName: authors[i].lastName,
//         }
//         expect(response.body).toContainEqual(expectedBody)
//       }
//     });
//   })
// });

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
      author = await factory.create('author')
      post = await factory.build('post')

      data.title = post.title
      data.content = post.content
      data.author = author._id
      post = await request.post('/post').send(data).set('Accept', 'application/json')
      response = await request.get('/posts').set('Accept', 'application/json')

    })

    test('It should respond a correct post', async () => {
      expect(response.body.length).toBe(1)
      expect(response.body[0]).toStrictEqual(
          {
            data: [{
              _id: post.body._id.toString(),
              title: post.body.title,
              content:post.body.content,
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
      author = await factory.create('author')
      post = await factory.build('post')
      data.title = post.title
      data.content = post.content
      data.author = author._id
      post = await request.post('/post').send(data).set('Accept', 'application/json')
      responseWithParams = await request.get('/posts?included=author').set('Accept', 'application/json')
    })

    test('It should respond included a correct post included', async () => {
      expect(responseWithParams.body.length).toBe(1)
      expect(responseWithParams.body[0]).toStrictEqual(
          {
            data: [{
              _id: post.body._id.toString(),
              title: post.body.title,
              content:post.body.content,
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

// // Post POST Endpoints

// describe('POST /post', () => {

//   let response
//   let data = {}
//   let post
//   let author

//   // beforeAll(async () => await cleanDb(db))

//   describe('The author has one or multiple posts', () => {
//     beforeAll(async () => {
//       clearDB()
//       author = await factory.create('author')
//       post = await factory.build('post')
//       data.title = post.title
//       data.content = post.content
//       data.author = author._id

//       response = await request.post('/post').send(data).set('Accept', 'application/json')
//     })
//     test('It should respond with a 200 status code', async () => {
//       expect(response.statusCode).toBe(200);
//     });

//     test('It should create and retrieve a post for the selected author', async () => {
//       const postsInDatabase = await Post.find()
//       expect(postsInDatabase.length).toBe(1)
//       expect(postsInDatabase[0].title).toBe(post.title)
//       expect(postsInDatabase[0].content).toBe(post.content)
//     });
    
//     test('It should return a json with the author\'s posts', async () => {
//       expect(response.body.title).toBe(data.title);
//       expect(response.body.content).toBe(data.content);
//     });
    
//   })
// });






