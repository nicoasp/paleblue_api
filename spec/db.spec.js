const mongoose = require('mongoose');
const models = require('../models');
const User = models.User;
var bcrypt = require('bcrypt');

describe('Create a instance of', () => {
  describe("User", () => {

    it('should save to the database', done => {
      const user = new User();
      let pass = 'hhhhssss11';
      let passHash = bcrypt.hashSync(pass, 8)
      let passCheck;
      user.email = 'foo@bar.com';
      user.password = pass;
      user.save((err, user) => {
        expect(err).toBeNull();
        User.find({},(err, result) => {
          passCheck = bcrypt.compareSync(pass, passHash)
          expect(result.length).toBe(1);
          expect(result[0].email).toBe('foo@bar.com');
          expect(passCheck).toBe(true)
          done()
        })
      });
    })
    it("should not allow duplicate emails", done => {
      const user1 = new User();
      const user2 = new User();
      user1.email = 'foo@bar.com';
      user1.password = 'thingamajig';
      user2.email = 'foo@bar.com';
      user2.password = 'thingamajig';
      user1.save((err, user) => {
        expect(err).toBeNull;
        user2.save((err, user) => {
          expect(err.errors.email.name).toBe('ValidatorError');
          done()
        })
      })
    })
  })
});
