import { expect } from 'chai';
import request from 'supertest';

import app from '../../src/app';
import {
  privateUser,
  lowPostCountUser,
  invalidUser,
  publicUser,
} from '../data/insta-users';

describe('Integration tests', () => {
  describe('get user media test /media/user/:user', () => {
    it('Private user profile should return appropriate message', async () => {
      const res = await request(app).get(`/media/user/${privateUser}`);
      expect(res.status).to.equal(400);
      expect(res.body.error.message).to.equal('User is private');
    });

    it('Invalid user should return 404', async () => {
      const res = await request(app).get(`/media/user/${invalidUser}`);
      expect(res.status).to.equal(404);
      expect(res.body.error.message).to.equal(`@${invalidUser} is not found`);
    });

    it('User below minimum post count should return 400', async function () {
      const res = await request(app).get(`/media/user/${lowPostCountUser}`);
      expect(res.status).to.equal(400);
      expect(res.body.error.message).to.includes(`fewer than the required`);
    });

    it('Getting valid user should return appropriate data', async function () {
      this.timeout(12000);
      const res = await request(app).get(`/media/user/${publicUser}`);
      expect(res.status).to.equal(200);
      expect(res.body.payload.username).to.equal(publicUser);
    });
  });
});
