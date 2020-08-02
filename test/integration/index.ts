import { expect } from 'chai';
import request from 'supertest';

import app from '../../src/app';
import { privateUser, invalidUser, publicUser } from '../data/insta-users';

describe('Integration tests', () => {
  describe('get user media test /media/user/:user', () => {
    it('Getting private user profile should return appropriate message', async () => {
      const res = await request(app).get(`/media/user/${privateUser}`);
      expect(res.status).to.equal(200);
      expect(res.text).to.equal('User is private');
    });

    it('Getting invalid user should return 404', async () => {
      const res = await request(app).get(`/media/user/${invalidUser}`);
      expect(res.status).to.equal(404);
    });

    it('Getting valid user should return appropriate data', async function () {
      this.timeout(12000);
      const res = await request(app).get(`/media/user/${publicUser}`);
      expect(res.status).to.equal(200);
      expect(res.body.username).to.equal(publicUser);
    });
  });
});
