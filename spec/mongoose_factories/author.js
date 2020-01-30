var FactoryGirl = require('factory-girl');
var MongooseAdapter = require('factory-girl-mongoose').MongooseAdapter;
var Factory = new FactoryGirl.Factory();
Factory.setAdapter(MongooseAdapter);

const Author = require('../../models').Author

factory.define('author', Author, {
  firstName: factory.sequence((n) => `firstName${n}`),
  lastName: factory.sequence((n) => `lastName${n}`),
})