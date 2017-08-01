module.exports = {
  poolMinusCommission,
  getResults,
  calculateDivs
};

function poolMinusCommission(pool, commission) {
  return pool - (pool * commission);
};

function getResults(data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].includes('Result')) {
      const grossResult = data[i].split(':');
      return {
        first: grossResult[1],
        second: grossResult[2],
        third: grossResult[3]
      }
    }
  }
};

function calculateDivs(payingBets, remainingPool) {
  const pool = payingBets.reduce((sum, bet) => sum + bet.amount, 0);
  const percentage = payingBets[0].amount / pool;
  const percentageOfPool = remainingPool * percentage;
  return percentageOfPool / payingBets[0].amount;
};
