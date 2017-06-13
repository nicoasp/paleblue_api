const app = require('../index');
const models = require('../models');
const User = models.User;
const Content = models.Content;
const request = require('request');

describe('App', () => {
  const baseUrl = 'http://localhost:8888';
  const apiUrl = baseUrl + '/api/v1/';
  let server;
  let user;
  beforeEach((done) => {
      server = app.listen(8888, () => {
        User.create({
          email: 'foobar@gmail.com',
          password: 'password'
        })
        .then((result) => {
          user = result;
          done();
        });
        done();
      });
  });

  afterEach((done) => {
      server.close();
      server = null;
      done();
  });

  const apiUrlFor = (type, params) => {
    params = params ? `&${ qs.stringify(params) }` : '';
    return `${ apiUrl }${ type }?token=${ user.token }${ params }`;
  };

  xit('registers creates user if they dont exist', (done) => {
    request.post({url:`${apiUrl}register`, form:{
      email: 'foobar11@gmail.com',
      password: 'password'
    }}, ((err, res, body) => {
      User.findOne({email:'foobar11@gmail.com'},(err,user) => {
        expect(user.email).toBe('foobar11@gmail.com')
        done()
      })
    }))
  });

  xit("should not allow passwords less than 8 chars", done => {
    request.post({url:`${apiUrl}register`, form:{
      email: 'foobar1@gmail.com',
      password: 'pas'
    }}, ((err, res, body) => {
      expect(res.statusCode).toBe(400)
      done()
    }))
  })

  it('creates new image content', (done) => {
    request.post({url:`${apiUrl}login`, form:{
      email: 'foobar@gmail.com',
      password: 'password'
    }}, ((err, res, body) => {
      console.log(body);
      request.post({url:`${apiUrl}content`, form:{
        contentType: 'image',
        data: "https://i0.wp.com/st.gdefon.ru/wallpapers_original/wallpapers/393789_tigry_art_planeta_zemlya_1680x1050_(www.GdeFon.ru).jpg",
        lng: -71.2760,
        lat: 42.4906,
      }}, ((err, res, body) => {
        console.log(body);
        Content.findOne({data:'https://i0.wp.com/st.gdefon.ru/wallpapers_original/wallpapers/393789_tigry_art_planeta_zemlya_1680x1050_(www.GdeFon.ru).jpg'},(err,content) => {
          expect(content.lng).toBe(-71.2760)
          done()
        })
      }))
    }));
  });

  xit("should not allow passwords less than 8 chars", done => {
    request.post({url:`${apiUrl}register`, form:{
      email: 'foobar1@gmail.com',
      password: 'pas'
    }}, ((err, res, body) => {
      expect(res.statusCode).toBe(400)
      done()
    }))
  })
})
