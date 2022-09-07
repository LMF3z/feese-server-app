const yup = require('yup');

const FormExpenditureSchema = yup.object().shape({
  description_expenditure: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü0-9 ]+$/, 'Ingresa una descripción valido.')
    .required('Descripción del gasto es requerido'),
  amount_article: yup
    .number('Ingresa una cantidad valida.')
    .integer('Debe ser un número entero')
    .required('Cantidad es requerida')
    .typeError('Ingrese una cantidad valida.'),
  cost_expenditure: yup
    .number('Costo debe ser númerico')
    .required('Un costo es requerido')
    .typeError('Ingrese un costo valido.'),
});

const validations = { FormExpenditureSchema };

module.exports = validations;
