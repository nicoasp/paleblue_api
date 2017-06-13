const mongoose = require('mongoose');

// Set test environment
process.env.NODE_ENV = 'test';

beforeEach((done) => {
  if (mongoose.connection.readyState) {
    cleanDb(done);
  } else {
    require('./../../../mongo')()
      .then(() => cleanDb(done));
  }
});



const cleanDb = (done) => {
  require('./../../../clearDb')()
  .then(() => {
  	done();
  })
  .catch((e) => console.error(e.stack))	
}