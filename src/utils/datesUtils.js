const dateFnsTz = require('date-fns-tz');
const { formatInTimeZone } = dateFnsTz;

const getLocalDateTime = (formateDate = 'America/Caracas') => {
  const date = new Date();

  const converterDate = formatInTimeZone(
    date,
    formateDate,
    'yyyy-MM-dd HH:mm:ssXXX'
  );

  return converterDate.toString();
};

const getElapseDaysBetweenTwoDates = (initialDate, finalDate) => {
  const lastPayment = String(initialDate).split(' ')[0].split('-');
  const actualDate = String(finalDate).split(' ')[0].split('-');

  const millisecondsLastPayment = Date.UTC(
    String(lastPayment[0]),
    String(lastPayment[1]),
    String(lastPayment[2])
  );
  const millisecondsActualDate = Date.UTC(
    String(actualDate[0]),
    String(actualDate[1]),
    String(actualDate[2])
  );

  const days = Math.floor(
    (millisecondsActualDate - millisecondsLastPayment) / (1000 * 60 * 60 * 24)
  );

  return days;
};

module.exports.getLocalDateTime = getLocalDateTime;
module.exports.getElapseDaysBetweenTwoDates = getElapseDaysBetweenTwoDates;
