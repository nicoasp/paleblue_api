const app = require("../index");
const models = require("../models");
const User = models.User;
const Content = models.Content;
const Like = models.Like;
const request = require("request");

describe("App", () => {
  const baseUrl = "http://localhost:8888";
  const apiUrl = baseUrl + "/api/v1/";
  let server;
  let user;
  let token;

  beforeEach(done => {
    server = app.listen(8888, () => {
      User.create({
        email: "foobar@gmail.com",
        password: "password"
      })
      .then(savedUser => {
        user = savedUser;
        request.post(
          {
            url: `${apiUrl}login`,
            form: {
              email: "foobar@gmail.com",
              password: "password"
            }
          },
          (err, res, body) => {
            token = JSON.parse(body).token;
            done();
          }
        );
      });
    });
  });

  afterEach(done => {
    server.close();
    server = null;
    done();
  });

  const apiUrlFor = (type, params) => {
    params = params ? `&${qs.stringify(params)}` : "";
    return `${apiUrl}${type}?token=${user.token}${params}`;
  };

  describe("authorization routes", () => {
    it("registers user if they dont exist", done => {
      request.post(
        {
          url: `${apiUrl}register`,
          form: {
            email: "foobar11@gmail.com",
            password: "password"
          }
        },
        (err, res, body) => {
          User.findOne({ email: "foobar11@gmail.com" }, (err, user) => {
            expect(user.email).toBe("foobar11@gmail.com");
            done();
          });
        }
      );
    });

    it("should not allow passwords less than 8 chars", done => {
      request.post(
        {
          url: `${apiUrl}register`,
          form: {
            email: "foobar1@gmail.com",
            password: "pas"
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(400);
          done();
        }
      );
    });

    it("logs in a user if they exist", done => {
      request.post(
        {
          url: `${apiUrl}login`,
          form: {
            email: "foobar@gmail.com",
            password: "password"
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(200);
          done();
        }
      );
    });
  });

  describe("Content", () => {

    it("creates new image content", done => {
      var options = {
        url: `${apiUrl}content`,
        method: "POST",
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          contentType: "image",
          data: "https://tinyurl.com/ycjh83v5",
          lng: "-71.2760",
          lat: "42.4906"
        }
      };
      request(options, (err, res, body) => {
        Content.findOne({}).then(content => {
          expect(content.lng).toBe(-71.276);
          done();
        });
      });
    });
  });

  describe("Like", () => {
    let content;

    beforeEach(done => {
      Content.create({
        userId: user._id,
        contentType: "image",
        data: "https://tinyurl.com/ycjh83v5",
        lng: -71.276,
        lat: 42.4906
      })
      .then((savedContent) => {
        content = savedContent;
        done();        
      })
    });

    it("creates new like", done => {
      let options = {
        url: `${apiUrl}like`,
        method: "POST",
        headers: {
          Authorization: `JWT ${token}`
        },
        form: {
          fromUserId: user._id.toString(),
          contentId: content._id.toString(),
          fromLng: -71.276,
          fromLat: 42.4906,
        }
      };
      request(options, (err, res, body) => {
        Like.findOne({}, (err, like) => {
          expect(like.fromLng).toBe(-71.276);
          done();
        })

      });
    });

    describe("getting likes", () => {
      let newLike;
      let oldLike;
      let user2;
      let contentFromUser2;
      let likeToUser2;
      beforeEach(done => {
        User.create({
          email: "foobar2@gmail.com",
          password: "password"
        })
        .then(result => {
          user2 = result;
          Content.create({
            contentType: "image",
            data: "https://tinyurl.com/ycjh83v5",
            lng: "-71.2760",
            lat: "42.4906",
            userId: user2._id
          })
          .then(result => {
            contentFromUser2 = result;
            Like.create({
              fromUserId: user2._id.toString(),
              contentId: content._id.toString(),
              fromLng: -71.276,
              fromLat: 42.4906,
            })
            .then(result => {
              newLike = result;
              Like.create({
                fromUserId: user2._id.toString(),
                contentId: content._id.toString(),
                fromLng: 34.276,
                fromLat: 21.4906,
                createdAt: new Date(Date.now() - 36000000)
              })
              .then(result => {
                oldLike = result;
                Like.create({
                  fromUserId: user._id.toString(),
                  contentId: contentFromUser2._id.toString(),
                  fromLng: 34.276,
                  fromLat: 21.4906,
                })
                .then(result => {
                  likeToUser2 = result;
                  done();
                })              
              })
            }); 
          })         
        });
      });

      it("gets likes from the right user and time", done => {
        var options = {
          url: `${apiUrl}like`,
          method: "GET",
          headers: {
            Authorization: `JWT ${token}`
          }
        };
        request(options, (err, res, body) => {
          let likes = JSON.parse(body);
          expect(likes.length).toBe(1);
          expect(likes[0].fromLat).toBe(42.4906);
          done()
        });
      })     
    })

  });

  describe("error handling", () => {
    let token;
    beforeEach(done => {
      request.post(
        {
          url: `${apiUrl}register`,
          form: {
            email: "foobar11@gmail.com",
            password: "password"
          }
        },
        (err, res, body) => {
          token = JSON.parse(body).token;
          done();
        }
      );
    });
    it("returns an error when incorrect login info is provided", done => {
      request.post(
        {
          url: `${apiUrl}login`,
          form: {
            email: "foobar99@gmail.com",
            password: "password"
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(401);
          done();
        }
      );
    });
  });
});
