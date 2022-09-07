import formBranches from '../../validations/form.branches';
const validateRegisterBranch = (data) =>
  formBranches.FormBranchesSchema.isValidSync(data);

const validate = { validateRegisterBranch };

export default validate;
