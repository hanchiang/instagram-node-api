import { expect } from 'chai';

import { formatCookieString, extractCookie } from '../../src/utils';

describe('Util unit tests', () => {
  it('formatCookieString() tests', () => {
    const tests = [
      { input: {}, expectedOutput: '' },
      { input: { csrftoken: 'csrf' }, expectedOutput: 'csrftoken=csrf' },
      {
        input: { csrftoken: 'csrf', sessionId: '123' },
        expectedOutput: 'csrftoken=csrf; sessionId=123',
      },
    ];

    for (const test of tests) {
      expect(formatCookieString(test.input)).to.equal(test.expectedOutput);
    }
  });

  it('extractCookie() tests', () => {
    const tests = [
      {
        input: [
          ['csrftoken=csrf;', 'sessionId=123;'],
          ['csrftoken', 'sessionId'],
        ],
        expectedOutput: { csrftoken: 'csrf', sessionId: '123' },
      },
      {
        input: [['randomKey=randomValue;'], ['csrftoken', 'sessionId']],
        expectedOutput: {},
      },
    ];

    for (const test of tests) {
      expect(extractCookie(test.input[0], test.input[1])).to.eql(
        test.expectedOutput
      );
    }
  });
});
