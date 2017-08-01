const expect = require('expect');
const index = require('../index');

describe('testing PoolMinusCommission', () => {
  it('should return a value', () => {
    console.log('index', index);


    expect(index.poolMinusCommission(600, 60)).to.equal(540);
  })
});