var factoryGirl = require('factory-girl');
var adapter = new factoryGirl.MongooseAdapter();
factory = factoryGirl.factory;
factory.setAdapter(adapter);

const Post = require('../../models/post.model')

factory.define('post', Post, {
  title: factory.sequence((n) => `title${n}`),
  content: factory.sequence((n) => `content${n}`),
  author : factory.assoc('author', '_id')
})