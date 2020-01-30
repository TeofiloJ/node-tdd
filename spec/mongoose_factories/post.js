var FactoryGirl = require('factory-girl');
var MongooseAdapter = require('factory-girl-mongoose').MongooseAdapter;
var Factory = new FactoryGirl.Factory();
Factory.setAdapter(MongooseAdapter);

const Post = require('../../models').Post

factory.define('post', Post, {
  title: factory.sequence((n) => `title${n}`),
  content: factory.sequence((n) => `content${n}`),
})