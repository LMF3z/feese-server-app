const validateFormats = require('../../services/validations/valdiateFormats.service');
const { FormProductsSchema } = require('../../validations/form.products');

const validateCreateNewOrdersProductsMiddleware = async (req, res, next) => {
  try {
    // * 1) Validamos los formatos de los datos
    const isValid = await validateFormats.validateFormat(
      req.body,
      FormProductsSchema.FormOrdersProductsSchema
    );

    if (!isValid) {
      return res.status(406).json({
        success: false,
        msg: 'Formato de datos no es valido.',
        data: [],
      });
    }

    const isValidArrayProductsToOrder =
      await validateFormats.validateFormatArray(
        req.body.products_selected,
        FormProductsSchema.FormProductsOrders
      );

    if (!isValidArrayProductsToOrder) {
      return res.status(406).json({
        success: false,
        msg: 'Formato de datos de los productos no es valido.',
        data: [],
      });
    }

    // * 2) Validamos la logica de los tipos de pago
    // * validamos los tipos de pagos de la orden
    const isValidAmountsPayments =
      validateFormats.validateAmountTypePaymentOrdersProducts(req.body);

    if (!isValidAmountsPayments.success) {
      return res.json(isValidAmountsPayments);
    }

    // * validamos la cantidad a pagar por cada producto
    const isValidAmountToPaymentForProducts =
      validateFormats.validateArrayProductsSelectedAmountPayment(
        req.body.products_selected
      );

    if (!isValidAmountToPaymentForProducts.success) {
      return res.json(isValidAmountToPaymentForProducts);
    }

    next();
  } catch (error) {
    return {
      success: false,
      msg: 'Formato de datos no es valido.',
      data: [],
    };
  }
};

module.exports.validateCreateNewOrdersProductsMiddleware =
  validateCreateNewOrdersProductsMiddleware;
