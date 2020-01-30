const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)

const Author = require('../mongoose_models/author')



// const db = require('../models');
// const cleanDb = require('./helpers/cleanDb')


require('./factories/post').factory

// const factory = require('factory-girl').factory



// beforeAll(async () => {
//   await cleanDb(db)
// });

// afterAll(async () => {
//   await cleanDb(db)
//   await db.close()
// });

// describe('GET /', () => {
//   let response;

//   beforeEach(async () => {
//     await cleanDb(db)
//     response = await request(app).get('/');
//   })  

//   test('It should respond with a 200 status code', async () => {
//     expect(response.statusCode).toBe(200);
//   });
// });


// describe('POST /author', () => {

//   let response;
//   let data = {};

//   beforeAll(async () => {
//     data.firstName = 'John'
//     data.lastName = 'Wick'
//     response = await request(app).post('/author').send(data);
//   })

//   test('It should respond with a 200 status code', async () => {
//     expect(response.statusCode).toBe(200);
//   });

//   test('It should return a json with the new author', async () => {
//     expect(response.body.firstName).toBe(data.firstName);
//     expect(response.body.lastName).toBe(data.lastName);
//   });

//   test('It should create and retrieve a post for the selected author', async () => {
//     const author = await db.Author.findOne({where: {
//       id: response.body.id
//     }})
//     expect(author.id).toBe(response.body.id)
//     expect(author.firstName).toBe(data.firstName)
//     expect(author.lastName).toBe(data.lastName)
//   });
  
// });

// describe('GET /authors', () => {

//   let response;
//   let data = {};

//   beforeAll(async () => await cleanDb(db))

//   describe('when there is no author in database', () => {
//     beforeAll(async () => {
//       response = await request(app).get('/authors').set('Accept', 'application/json');
//     })

//     test('It should not retrieve any authors in db', async () => {
//       const authors = await db.Author.findAll()
//       expect(authors.length).toBe(0);
//     });

//     test('It should respond with a 200 status code', async () => {
//       expect(response.statusCode).toBe(200);
//     });

//     test('It should return a json with a void array', async () => {
//       expect(response.body).toStrictEqual([]);
//     });
    
//   })
// });


// describe('when there is one or more authors in database', () => {
//   beforeAll(async () => {
//     authors = await factory.createMany('author', 5)
//     response = await request(app).get('/authors').set('Accept', 'application/json')
//   })

//   test('It should not retrieve any author in db', async () => {
//     const authorsInDatabase = await db.Author.findAll()
//     expect(authorsInDatabase.length).toBe(5)
//   });
//   test('It should respond with a 200 status code', async () => {
//     expect(response.statusCode).toBe(200)
//   });
//   test('It should return a json with a void array', async () => {
//     expect(response.body.length).toBe(5)
//     for (i = 0; i < 5 ; i++) {
//       const expectedBody = {
//         id: authors[i].id,
//         firstName: authors[i].firstName,
//         lastName: authors[i].lastName,
//       }
//       expect(response.body).toContainEqual(expectedBody)
//     }
//   });
// })

// describe('POST /post', () => {

//   let response
//   let data = {}
//   let post
//   let author

//   beforeAll(async () => await cleanDb(db))

//   describe('The author has one or multiple posts', () => {
//     beforeAll(async () => {
//       author = await factory.create('author')
//       post = await factory.build('post')
//       data.title = post.title
//       data.content = post.content
//       data.AuthorId = author.id
//       response = await request(app).post('/post').send(data).set('Accept', 'application/json')
//     })
//     test('It should respond with a 200 status code', async () => {
//       expect(response.statusCode).toBe(200);
//     });

//     test('It should create and retrieve a post for the selected author', async () => {
//       const postsInDatabase = await db.Post.findAll()
//       expect(postsInDatabase.length).toBe(1)
//       expect(postsInDatabase[0].title).toBe(post.title)
//       expect(postsInDatabase[0].content).toBe(post.content)
//     });
    
//     test('It should return a json with the author\'s posts', async () => {
//       expect(response.body.title).toBe(data.title);
//       expect(response.body.content).toBe(data.content);
//     });
    
//     test('The post should belong to the selected authors\' posts', async () => {
//       const posts = await author.getPosts()
//       expect(posts.length).toBe(1)
//       expect(posts[0].title).toBe(post.title)
//       expect(posts[0].content).toBe(post.content)
//     })
    
//   })
// });


const mongoose = require('mongoose')

beforeAll(async () => {
  const url = `mongodb://localhost/node_tdd`
  await mongoose.connect(url, { useNewUrlParser: true })

  const data = {firstName:'John', lastName:'Wick'} 
  const user = new Author(data)
  await user.save()
})

it('GET /', async done => {
  const response = await request.get('/')

  expect(response.status).toBe(200)

  expect(response.body.message).toBe('Hello')
  done()
})

it('GET /author', async done => {
  const response = await request.get('/author')
  .send({
    firstName: 'John',
    lastName: 'Doe'
  })

  expect(response.status).toBe(200)

  expect(response.body.firstName).toBe('John')
  expect(response.body.lastName).toBe('Wick')
  done()
})

it('POST /author', async done => {
  const response = await request.post('/author')
	.send({
      firstName: 'John',
      lastName: 'Doe'
    })
  expect(response.status).toBe(200)

  expect(response.body.firstName).toBe('John')
  expect(response.body.lastName).toBe('Doe')
  done()
})

it('POST /post', async done => {
  const post = await factory.create('post')
  var data = {};
  data.title = post.title
  data.content = post.content
  data.author = post.author
  const response = await request.post('/post').send(data).set('Accept', 'application/json')
  
  expect(response.status).toBe(200)

  expect(response.body.title).toBe('title1')
  expect(response.body.content).toBe('content1')
  expect(response.body.author).toBe('_id1')
  done()
})







