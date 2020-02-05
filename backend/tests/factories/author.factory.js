var factoryGirl = require('factory-girl');
var adapter = new factoryGirl.MongooseAdapter();
factory = factoryGirl.factory;
factory.setAdapter(adapter);

const Author = require('../../models/author.model')

factory.define('author', Author, {
  firstName: factory.sequence((n) => `firstName${n}`),
  lastName: factory.sequence((n) => `lastName${n}`),
})