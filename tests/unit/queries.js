const { expect } = require('chai');

const { upsertUser, findUserById, getAllUsers } = require('../../db/queries');
const db = require('../../db');

const { mockUser, mockUpdatedUser } = require('../data/user');

describe('Queries test upsertUser', () => {
  beforeEach(async () => {
    await db.query({
      text: 'DELETE FROM users'
    });
  });

  it('Should insert new row when it doesn\'t exist', async () => {
    const result = await db.query(upsertUser(Object.values(mockUser)));
    expect(result.rowCount).to.equal(1);
  });

  it('should update row when it exists', async () => {
    let result = await db.query(upsertUser(Object.values(mockUser)));
    expect(result.rowCount).to.equal(1);

    result = await db.query(upsertUser(Object.values(mockUpdatedUser)));
    expect(result.rowCount).to.equal(1);

    const user = await db.query(findUserById([mockUpdatedUser.id]));
    expect(user.rowCount).to.equal(1);
    expect(user.rows.length).to.equal(1);
    expect(user.rows[0].num_posts).to.equal(mockUpdatedUser.numPosts);
    expect(user.rows[0].num_posts).to.not.equal(mockUser.numPosts);

    const users = await db.query(getAllUsers());
    expect(users.rowCount).to.equal(1);
    expect(users.rows.length).to.equal(1);
  });
});
