const app = require("../index");
const models = require("../models");
const User = models.User;
const request = require("request");

describe("App", () => {
  const baseUrl = "http://localhost:8888";
  const apiUrl = baseUrl + "/api/v1/";
  let server;
  let user;
  beforeEach(done => {
    server = app.listen(8888, () => {
      User.create({
        email: "foobar@gmail.com",
        password: "password"
      }).then(result => {
        user = result;
        done();
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

  it("registers creates user if they dont exist", done => {
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
