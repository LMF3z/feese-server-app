const handleErrorDb = (error) => {
  switch (error.code) {
    case 11000:
      if (error.keyPattern) {
        return 'Algunos datos ya están en uso.';
      }
      break;

    default:
      return true;
  }
};

const handleErrorsDB = (error) => {
  const type = error.errors[0];
  switch (type.type) {
    case 'unique violation':
      return `Dato ya en uso. (${type.value})`;

    default:
      return '';
  }
};

const handleErrors = { handleErrorDb, handleErrorsDB };

module.exports = handleErrors;
