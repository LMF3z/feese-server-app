const {
  validateIsMembershipActive,
} = require('../../services/companies/companiesMembership.service');

const validateStateMembership = async (req, res, next) => {
  try {
    const { id_company } = req.body;
    const query = req.query;

    if (!id_company && !query.id_company) {
      return res.json({
        success: false,
        msg: 'Imposible encontrar empresa.',
        data: null,
      });
    }

    const isActive = await validateIsMembershipActive(
      id_company ? id_company : query.id_company
    );

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

module.exports = { validateStateMembership };
