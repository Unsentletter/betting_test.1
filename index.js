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
  let winnerPool, placePool, exactaPool;
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
      if (bets[i].number === first) {
        placingBets1.push(bets[i]);
        placePool = placeNum += parseInt(bets[i].amount);
      } else if (bets[i].number === second) {
        placingBets2.push(bets[i]);
        placePool = placeNum += parseInt(bets[i].amount);
      } else if (bets[i].number === third) {
        placingBets3.push(bets[i]);
        placePool = placeNum += parseInt(bets[i].amount);
      }
    } else if (bets[i].type === 'E') {
      exactaPool = exactaNum += parseInt(bets[i].amount);
      if (bets[i].number === '2,3') {
        exactaBets.push(bets[i])
      }
    }
  }

  function takeCommission(pool, commission) {
    return pool * commission;
  }

  function poolMinusComission(pool, commission) {
    return pool - commission;
  }

  function calculateDivs(payingBets, remainingPool) {
    const pool = payingBets.reduce((sum, bet) => sum + bet.amount, 0);
    const percentage = payingBets[0].amount / pool;
    const percentageOfPool = remainingPool * percentage;
    return percentageOfPool / payingBets[0].amount;
  }
  
  let winnerPrizePool = poolMinusComission(winnerPool, takeCommission(winnerPool, winCommission));
  let placePrizePool = parseInt(poolMinusComission(placePool, takeCommission(placePool, placeCommission))) / 3;
  let exactaPrizePool = poolMinusComission(exactaPool, takeCommission(exactaPool, exactaCommission));
  let winningDivs = calculateDivs(winningBets, winnerPrizePool).toFixed(2);
  let placeDivs1 = calculateDivs(placingBets1, placePrizePool).toFixed(2);
  let placeDivs2 = calculateDivs(placingBets2, placePrizePool).toFixed(2);
  let placeDivs3 = calculateDivs(placingBets3, placePrizePool).toFixed(2);
  let exactaDivs = calculateDivs(exactaBets, exactaPrizePool).toFixed(2);

  process.stdout.write(String(`Win:${first}:${winningDivs}\n`));
  process.stdout.write(String(`Place:${first}:${placeDivs1}\n`));
  process.stdout.write(String(`Place:${second}:${placeDivs2}\n`));
  process.stdout.write(String(`Place:${third}:${placeDivs3}\n`));
  process.stdout.write(String(`Exacta:${first},${second}:${exactaDivs}\n`));


});
