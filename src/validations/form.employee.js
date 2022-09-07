const yup = require('yup');

const FormEmployeeSchema = yup.object().shape({
  name_employee: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre valido.')
    .required(),
  last_name_employee: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre valido.')
    .required(),
  identification_employee: yup
    .number('Identificación debe ser númerica')
    .required('Identificación es requerida')
    .typeError('Ingrese una identificación valida.'),
  phone_employee: yup
    .string()
    .matches(/^[+0-9]+$/, 'Ingresa un teléfono valido.'),
  // payment_type: yup
  //   .string()
  //   .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre valido.')
  //   .required(),
  payment_amount: yup
    .number()
    .positive()
    .typeError('El la cantidad/porcentaje de pago es requerido.'),
});

const FormUsersCompany = yup.object().shape({
  alias_user_company: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un alias valido.')
    .required(),
  email_user_company: yup
    .string()
    .email('Ingresa un correo valido.')
    .required('Correo es requerido.'),
  role_user_company: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un alias valido.')
    .required(),
  password_user_company: yup
    .string()
    .required('Contraseña es requerida.')
    .min(8, 'Debe contener, al menos, 8 caracteres.'),
  password_user_company_two: yup
    .string()
    .required('Confime contraseña.')
    .min(8, 'Debe contener, al menos, 8 caracteres.')
    .oneOf([yup.ref('password_user_company')], 'Contraseñas no coinciden'),
});

const validations = { FormEmployeeSchema, FormUsersCompany };

module.exports = validations;
