const fs = require('fs');
const getStream = require('get-stream');
const stream = fs.createReadStream('data.txt');

getStream(stream, {encoding: 'utf8'}).then(stream => {

  const data = stream.split('\n');
  const bets = data.map(b => {
    const bet = b.split(':');
    return {
      type: bet[1],
      number: bet[2],
      amount: parseInt(bet[3], 10)
    };
  });

  const winCommission = 0.15;
  const placeCommission = 0.12;
  const exactaCommission = 0.18;
  let winnerPool, placePool, placePool2, placePool3, exactaPool;
  let winningBets = [];
  let placingBets1 = [];
  let placingBets2 = [];
  let placingBets3 = [];
  let exactaBets = [];
  let winNum = 0;
  let placeNum = 0;
  let exactaNum = 0;

  const first = getResults(data).first;
  const second = getResults(data).second;
  const third = getResults(data).third;

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
  }

  for (let i=0; i < bets.length; i++) {
    if (bets[i].type === 'W') {
      winnerPool = winNum += parseInt(bets[i].amount);
      if (bets[i].number === first) {
        winningBets.push(bets[i])
      }
    } else if (bets[i].type === 'P') {
      placePool = placeNum += parseInt(bets[i].amount)
      if (bets[i].number === first) {
        placingBets1.push(bets[i]);
      } else if (bets[i].number === second) {
        placingBets2.push(bets[i]);
      } else if (bets[i].number === third) {
        placingBets3.push(bets[i]);
      }
    } else if (bets[i].type === 'E') {
      exactaPool = exactaNum += parseInt(bets[i].amount);
      if (bets[i].number === '2,3') {
        exactaBets.push(bets[i])
      }
    }
  }

  function poolMinusComission(pool, commission) {
    return pool - (pool * commission);
  }

  function calculateDivs(payingBets, remainingPool) {
    const pool = payingBets.reduce((sum, bet) => sum + bet.amount, 0);
    const percentage = payingBets[0].amount / pool;
    const percentageOfPool = remainingPool * percentage;
    return percentageOfPool / payingBets[0].amount;
  }

  let placePrizePool = parseInt(poolMinusComission(placePool, placeCommission)) / 3;
  
  let winningDivs = calculateDivs(winningBets, poolMinusComission(winnerPool, winCommission)).toFixed(2);
  let placeDivs1 = calculateDivs(placingBets1, 189).toFixed(2);
  let placeDivs2 = calculateDivs(placingBets2, placePrizePool).toFixed(2);
  let placeDivs3 = calculateDivs(placingBets3, placePrizePool).toFixed(2);
  let exactaDivs = calculateDivs(exactaBets, poolMinusComission(exactaPool, exactaCommission)).toFixed(2);

  process.stdout.write(String(`Win:${first}:$${winningDivs}\nPlace:${first}:$${placeDivs1}\nPlace:${second}:$${placeDivs2}\nPlace:${third}:$${placeDivs3}\nExacta:${first},${second}:$${exactaDivs}\n`));


});
