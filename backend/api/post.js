var express = require('express');
var router = express.Router();

const Post = require('../models/post.model')
const Author = require('../models/author.model')


router.post('/post', async (req, res) => {
    const {title, content, author} = req.body
    const post = new Post({title, content, author})
    const ret = await post.save()
    res.json(ret)
})

router.get('/posts', async (req, res) => {
    let post;
    let included = false;
    const ret = await Post.find()
    if (req.query.included && req.query.included === 'author') {
        included = true;
    }
    post = await serialize(ret, included);
    res.json(post)
})

module.exports = router


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function serialize(postList, included) {
    var newPostList = []

    await asyncForEach(
        postList,
        async (post) => {
            author = await Author.findOne({_id: post.author.toString()})
            newPostList.push
            ({
                data:
                    [{
                        _id: post._id,
                        title: post.title,
                        content: post.content,
                        relationship:
                            {
                                author:
                                    {
                                        data:
                                            {
                                                id: post.author.toString()
                                            }
                                    }
                            }
                    }],
                included: []
            });
            if (included) {
                newPostList[newPostList.length - 1].included[0] = {
                    firstName: author.firstName,
                    lastName: author.lastName,
                    _id: author._id.toString()
                }
            }
        }
    )

    return newPostList;
}
