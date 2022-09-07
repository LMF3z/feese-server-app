const {
  updateStateMembership,
  validateIsMembershipActive,
} = require('../../services/companies/companiesMembership.service');

const validateStateMembership = async (req, res, next) => {
  try {
    const isActive = await validateIsMembershipActive(req.body.id_company);

    if (!isActive.data) {
      // await updateStateMembership(req.body.id_company, 'inactiva');

      return res.json({
        success: false,
        msg: 'Tu membresía ha exipirado. Por favor, renuevala y vuelvelo a intentar.',
        data: null,
      });
    }

    next();
  } catch (error) {
    res.json({
      success: false,
      msg: 'Error al verificar estado de la membresía.',
      data: null,
    });
  }
};

module.exports.validateStateMembership = validateStateMembership;
