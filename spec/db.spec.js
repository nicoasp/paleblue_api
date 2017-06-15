const mongoose = require("mongoose");
const models = require("../models");
const User = models.User;
const Content = models.Content;
var bcrypt = require("bcrypt-nodejs");

describe("Create a instance of", () => {
  describe("User", () => {
    it("should save to the database", done => {
      const user = new User();
      let pass = "hhhhssss11";
      let passHash = bcrypt.hashSync(pass);
      let passCheck;
      user.email = "foo@bar.com";
      user.password = pass;
      user.save((err, user) => {
        expect(err).toBeNull();
        User.find({}, (err, result) => {
          // Not using the pass returned by find for the passCheck?
          passCheck = bcrypt.compareSync(pass, passHash);
          expect(result.length).toBe(1);
          expect(result[0].email).toBe("foo@bar.com");
          expect(passCheck).toBe(true);
          done();
        });
      });
    });
    it("should not allow duplicate emails", done => {
      const user1 = new User();
      const user2 = new User();
      user1.email = "foo@bar.com";
      user1.password = "thingamajig";
      user2.email = "foo@bar.com";
      user2.password = "thingamajig";
      user1.save((err, user) => {
        expect(err).toBeNull;
        user2.save((err, user) => {
          expect(err.errors.email.name).toBe("ValidatorError");
          done();
        });
      });
    });
  });

  describe("Content", () => {
    let user;
    beforeEach(done => {
      user = new User();
      user.email = "foo@bar.com";
      user.password = "hhhhssss11";
      user.save((err, savedUser) => {
        user = savedUser;
        done();
      });
    });

    it("should save to the database", done => {
      console.log("user", user);
      const content = new Content();
      content.userId = user._id;
      content.contentType = "image";
      content.data =
        "https://i0.wp.com/st.gdefon.ru/wallpapers_original/wallpapers/393789_tigry_art_planeta_zemlya_1680x1050_(www.GdeFon.ru).jpg";
      content.lng = -71.276;
      content.lat = 42.4906;
      content.save((err, content) => {
        expect(err).toBeNull();
        Content.find({}, (err, result) => {
          expect(result.length).toBe(1);
          expect(result[0].lat).toBe(42.4906);
          done();
        });
      });
    });
  });
});
