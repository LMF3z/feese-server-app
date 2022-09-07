const yup = require('yup');

const FormClientSchema = yup.object().shape({
  name_client: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre valido.')
    .required('Nombre es requerido'),
  last_name_client: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un apellido valido.')
    .required('Apellido es requerido'),
  identification_client: yup
    .number('Identificación debe ser númerica')
    .required('Identificación es requerida')
    .typeError('Ingrese una identificación valida.'),
  phone_client: yup
    .string()
    .matches(/^[+0-9]+$/, 'Ingresa un teléfono valido.'),
});

const validations = { FormClientSchema };

module.exports = validations;
