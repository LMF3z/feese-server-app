const yup = require('yup');

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

const validateFormatArray = async (data, schema) => {
  const schemaToValidate = yup.array().of(schema);
  const isValid = await schemaToValidate.isValid(data);

  schemaToValidate.validate(data).catch((err) => {
    // * err.name
    // * err.errors

    console.log('error name ->', err.name);
    console.log('error ->', err.errors);
  });

  return isValid;
};

const validateAmountTypePaymentOrdersProducts = (data) => {
  const totalSum =
    Number(data.cash) + Number(data.card) + Number(data.transfer);

  if (data.cash === totalSum && data.cash < data.total_payment) {
    return {
      success: false,
      message: 'Total de efectivo no puede ser menor al total de la orden.',
      data: null,
    };
  }

  if (
    (data.cash >= data.total_payment && data.card > 0) ||
    (data.cash >= data.total_payment && data.transfer > 0)
  ) {
    return {
      success: false,
      message:
        'El total de las cantidades puede ser mayor cuando es un pago total en efectivo.',
      data: null,
    };
  }

  if (totalSum < data.total_payment) {
    return {
      success: false,
      message: 'Cantidades a pagar no pueden ser menor al total de la orden',
      data: null,
    };
  }

  if (data.cash < data.total_payment && totalSum > data.total_payment) {
    return {
      success: false,
      message:
        'El total de las cantidades puede ser mayor cuando es un pago total en efectivo.',
      data: null,
    };
  }

  return {
    success: true,
    message: 'Typos de pago validos',
    data: null,
  };
};

const validateArrayProductsSelectedAmountPayment = (data) => {
  const currentValues = data.map((product) => {
    const totalToPaymentProduct =
      Number(product.current_price_product) * Number(product.amount_product);
    if (totalToPaymentProduct !== Number(product.total_payment)) {
      return false;
    }

    return true;
  });

  const isValid = currentValues.some((e) => e === false) ? false : true;

  if (isValid === false) {
    return {
      success: false,
      msg: 'El total a pagar de un producto no coincide con la cantidad a procesar. verifique por favor.',
      data: null,
    };
  }

  return {
    success: true,
    msg: 'Totales a pogar coincide con la cantidad a procesar',
    data: null,
  };
};

const services = {
  validateFormat,
  validateFormatArray,
  validateAmountTypePaymentOrdersProducts,
  validateArrayProductsSelectedAmountPayment,
};

module.exports = services;
