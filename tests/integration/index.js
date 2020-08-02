const { expect } = require('chai');
const request = require('supertest');

const app = require('../../app');
const { privateUser, invalidUser, publicUser } = require('../data/insta-users');

describe('Integration tests', () => {
  describe('get user media test /media/user/:user', () => {
    it('Getting private user profile should return appropriate message', (done) => {
      request(app)
        .get(`/media/user/${privateUser}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.text).to.equal('User is private');
          done();
        });
    });

    it('Getting invalid user should return 404', (done) => {
      request(app)
        .get(`/media/user/${invalidUser}`)
        .expect(404, done);
    });

    it('Getting valid user should return appropriate data', (done) => {
      request(app)
        .get(`/media/user/${publicUser}`)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.username).to.equal(publicUser);
          done();
        });
    });
  });
});
