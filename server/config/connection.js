const mongoose = require('mongoose');

//server uses Mongoose for all of its MongoDB data handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/deep-thoughts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

//mongoose.connection object is exported.
module.exports = mongoose.connection;
