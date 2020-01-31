var factoryGirl = require('factory-girl');
var adapter = new factoryGirl.MongooseAdapter();
factory = factoryGirl.factory;
factory.setAdapter(adapter);

const Post = require('../../mongoose_models/post')

factory.define('post', Post, {
  title: factory.sequence((n) => `title${n}`),
  content: factory.sequence((n) => `content${n}`),
})