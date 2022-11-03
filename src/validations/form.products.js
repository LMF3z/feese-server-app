const yup = require('yup');

const FormProductsSchema = yup.object().shape({
  id_company: yup
    .number()
    .positive()
    .typeError('Error en id de la empresa.')
    .required('Id de la empresa es requerido.'),
  title: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü0-9 ]+$/, 'Ingresa un nombre valido.')
    .typeError('Ingresa un nombre valido.')
    .required('Nombre del producto requerido.'),
  price: yup
    .number()
    .positive()
    .typeError('Error en precio.')
    .required('Precio es requerido.'),
  stock: yup
    .number()
    .positive()
    .typeError('Error en stock.')
    .required('Cantidad de producto requerido.'),
  description: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü0-9 ]+$/, 'Ingrese una description valida.')
    .required('Ingrese una description valida.'),
  cover: yup
    .string()
    .url('Ingrese un enlace valido')
    .required('Ingrese un enlace valido'),
});

const FormOrdersProductsSchema = yup.object().shape({
  id_company: yup
    .number()
    .positive()
    .typeError('Error en id de la empresa.')
    .required('Id de la empresa es requerido.'),
  user_id: yup
    .number()
    .positive()
    .typeError('Error en id del usuario.')
    .required('Id del usuario que genera la orden es requerido.'),
  total_payment: yup
    .number()
    .positive()
    .typeError('Ingrese una cantidad a pagar valida.')
    .required('Cantidad a pagar es requerido.'),
  client_selected: yup
    .number()
    .positive()
    .typeError('Id del cliente es requerido.')
    .required('Id del cliente es requerido.'),
  cash: yup
    .number()
    .positive()
    .min(0)
    .typeError('Error en cantidad en efectivo.')
    .required('Cantidad de efectivo requerida.'),
  card: yup
    .number()
    .positive()
    .min(0)
    .typeError('Error en cantidad en card.')
    .required('Cantidad de card requerida.'),
  transfer: yup
    .number()
    .positive()
    .min(0)
    .typeError('Error en cantidad en transfer.')
    .required('Cantidad de transfer requerida.'),
  cash_change: yup
    .number()
    .positive()
    .min(0)
    .typeError('Error en cantidad en cambio efectivo.')
    .required('Cantidad de cambio en efectivo es requerido.'),
});

const FormProductsOrders = yup.object().shape({
  id_product: yup
    .number()
    .positive()
    .typeError('Error en id del producto.')
    .required('Id del producto es requerido.'),
  amount_product: yup
    .number()
    .positive()
    .typeError('Ingrese una cantidad del producto valida.')
    .required('Cantidad del producto es requerida.'),
  current_price_product: yup
    .number()
    .positive()
    .typeError('Ingrese el precio actual del producto.')
    .required('Precio actual del producto es requerido.'),
  total_payment: yup
    .number()
    .positive()
    .typeError('Ingrese total a pagar del producto.')
    .required('Total a pagar por producto es requerido.'),
});

module.exports.FormProductsSchema = {
  FormProductsSchema,
  FormOrdersProductsSchema,
  FormProductsOrders,
};
