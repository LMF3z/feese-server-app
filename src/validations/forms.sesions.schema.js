const yup = require('yup');

const FormRegisterCompanySchema = yup.object().shape({
  name_company: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre valido.')
    .required(),
  address_company: yup.string().required('Dirección es requerida.'),
  // rif_company: yup.string().matches(),
  email_company: yup
    .string()
    .email('Ingresa un correo valido.')
    .required('Correo es requerido.'),
  type_company: yup
    .string('Ingrese tipo de empresa.')
    .required('Campo requerido.'),
  password_company: yup
    .string()
    .required('Contraseña es requerida.')
    .min(8, 'Debe contener, al menos, 8 caracteres.'),
  password_company_two: yup
    .string()
    .required('Confime contraseña.')
    .min(8, 'Debe contener, al menos, 8 caracteres.')
    .oneOf([yup.ref('password_company')], 'Contraseñas no coinciden'),
});

const FormLoginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Ingresa un correo valido.')
    .required('Correo es requerido.'),
  password: yup
    .string()
    .required('Contraseña es requerida.')
    .min(8, 'Debe contener, al menos, 8 caracteres.'),
});

const formsSesions = { FormRegisterCompanySchema, FormLoginSchema };

module.exports = formsSesions;
