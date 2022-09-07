module.exports.generateSequentialNumber = (last_number) => {
  const current_number = '000000';
  const split = current_number.split('');

  const wildcard =
    last_number >= 10 && last_number < 100
      ? 2
      : last_number >= 100 && last_number < 1000
      ? 3
      : last_number >= 1000 && last_number < 10000
      ? 4
      : last_number >= 10000 && last_number < 100000
      ? 5
      : 6;

  if (last_number <= 0) {
    let withoutLast = split.pop();
    withoutLast = String(last_number + 1);
    split.push(withoutLast);
    return split.join().replace(/,/g, '');
  }

  if (last_number < 10 && last_number > 0) {
    let withoutLast = split.pop();
    withoutLast = String(last_number);
    split.push(withoutLast);
    return split.join().replace(/,/g, '');
  }

  if (last_number > 999999) {
    return String(last_number);
  }

  let withoutLast = split.slice(0, split.length - wildcard);
  withoutLast.push(String(last_number));
  return withoutLast.join().replace(/,/g, '');
};

module.exports.getHourOfDate = (date) =>
  date.split(' ')[1].replace('-04:00', '');

module.exports.getDateOfDate = (date) => date.split(' ')[0];

const getTotalByTypePayment = (arr) => {
  const result = arr.reduce((acc, el) => {
    if (!el.state_null) {
      acc.cash = acc?.cash
        ? acc.cash + (el.cash - el.cashChange)
        : el.cash - el.cashChange;
      acc.card = acc?.card ? acc.card + el.card : el.card;
      acc.transfer = acc?.transfer ? acc.transfer + el.transfer : el.transfer;
    }
    return acc;
  }, {});

  return result;
};

module.exports.getTotalByTypePayment = getTotalByTypePayment;
