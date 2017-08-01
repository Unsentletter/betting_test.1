const expect = require('chai').expect;
const should = require('chai').should;
const fn = require('../functions');

describe('testing PoolMinusCommission fn', () => {
  it('should return a value', () => {
    expect(fn.poolMinusCommission(600, 0.10)).to.be.equal(540);
  })
});

describe('testing getResults fn', () => {
  it('should return an object', () => {
    expect(fn.getResults()).to.
  })
})