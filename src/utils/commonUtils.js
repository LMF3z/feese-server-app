const addDaysToDate = (date, days) => {
  const res = new Date(date);
  res.setDate(res.getDate() + days);
  const newDate = res.toISOString().split('T')[0];
  return newDate;
};

module.exports.addDaysToDate = addDaysToDate;
