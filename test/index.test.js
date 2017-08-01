const expect = require('chai').expect;
const should = require('chai').should;
const fn = require('../functions');

describe('testing PoolMinusCommission fn', () => {
  it('should return a value', () => {
    expect(fn.poolMinusCommission(600, 0.10)).to.be.equal(540);
  })
});

describe('testing getResults fn', () => {
  const data = [ 'Bet:W:1:3', 'Bet:W:2:4', 'Bet:W:3:5', 'Bet:W:4:5', 'Result:2:3:1' ];

  it('should return an object', () => {
    expect(fn.getResults(data)).to.be.an('object');
  });
  it('should return a first, second, and third', () => {
    expect(fn.getResults(data)).to.include.any.keys('first');
    expect(fn.getResults(data)).to.include.any.keys('second');
    expect(fn.getResults(data)).to.include.any.keys('third');
  });
});

describe('testing calculate divs', () => {
  const payingBets = [ { type: 'P', number: '2', amount: 89 }, { type: 'P', number: '2', amount: 16 }, { type: 'P', number: '2', amount: 74 } ];
  const remainingPool = 189.33333333333334;
  it('should return a string', () => {
    expect(fn.calculateDivs(payingBets, remainingPool).toFixed(2)).to.be.equal('1.06');
  })
});