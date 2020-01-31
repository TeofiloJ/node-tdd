const Post = require('../../../mongoose_models/post')
const Author = require('../../../mongoose_models/author')

module.exports = (app, db) => {
    app.post('/post', async (req, res) => {
      const { title, content, author } = req.body 
      const post = new Post({ title, content, author })
      const ret = await post.save()
      res.json(ret)
    })  

    app.get('/posts', async (req, res) => {
      const ret = await Post.find()
      const post = await serialize(ret)
      res.json(post)
    })
  }

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

   async function serialize(postList){
    var newPostList = []
    await asyncForEach(
      postList,
      async (post) => {
        author = await Author.findOne({_id:post.author.toString()})
        newPostList.push
          ({
            data : 
            [{
              _id : post._id,
              title : post.title,
              content : post.content,
              relationship : 
              {
                author : 
                {
                  data : 
                  {
                    id : post.author.toString()
                  }
                }
              }
            }],
            included: 
            [{
              firstName: author.firstName,
              lastName: author.lastName,
              _id: author._id.toString()
            }]
        });       
      }
    )
    return newPostList; 
  }
  
  // {
  //   "_v":"eterter"
  //   "_id": "12345",
  //   "title": "Titre",
  //   "content": "ceci est le content",
  //   "author": "12345"
  // }


  // {
  //   "data": [{
  //     "_id": "12345",
  //     "title": "Titre",
  //     "content": "ceci est le content",
  //     "relationships": {
  //       "author": {
  //         "data": {"id": "42"}
  //       }
  //     }
  //   }],
  //   "included": [
  //     {
  //       "firstName": "John",
  //       "lastName": "Doe",
  //       "id": "42"
  //     }
  //   ]
  // }
  