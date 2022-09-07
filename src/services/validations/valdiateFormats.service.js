const validateFormat = async (data, schema) => {
  const isValid = await schema.isValid(data);
  schema.validate(data).catch((err) => {
    // * err.name
    // * err.errors

    console.log('error name ->', err.name);
    console.log('error ->', err.errors);
  });

  return isValid;
};

const services = { validateFormat };

module.exports = services;
