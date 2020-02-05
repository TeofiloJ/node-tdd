var mongoose = require('mongoose')

// Database setup

mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb://localhost:27017/node_tdd', 
    { useNewUrlParser: true }
).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can\'t connect to the database: '+ err)}
);

module.exports = mongoose