import * as yup from 'yup';

const FormBranchesSchema = yup.object().shape({
  name_branch: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre valido.')
    .required(),
  address_branch: yup
    .string()
    .matches(/^[a-zA-Zá-üÁ-Ü ]+$/, 'Ingresa un nombre valido.')
    .required(),
  phone_branch: yup
    .string()
    .matches(/^[+0-9]+$/, 'Ingresa un teléfono valido.'),
});

const validations = { FormBranchesSchema };

export default validations;
