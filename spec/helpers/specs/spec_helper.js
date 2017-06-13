const mongoose = require('mongoose');

// Set test environment
process.env.NODE_ENV = 'test';

beforeEach((done) => {
  if (mongoose.connection.readyState) {
    done();
  } else {
    require('./../../../mongo')()
      .then(() => done());
  }
});

afterEach((done) => {
  require('./../../../clearTestDb')()
    .then(() => done())
    .catch((e) => console.error(e.stack));
});
