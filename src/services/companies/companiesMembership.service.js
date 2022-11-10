const axios = require('axios');
const add = require('date-fns/add');
const { membershipData } = require('../../constants/globalsConstants');
const ModelCompanyMembership = require('../../models/companies-memberships/companiesMemberships.model');
const {
  getLocalDateTime,
  getElapseDaysBetweenTwoDates,
} = require('../../utils/datesUtils');

const saveNewPaymentCompanyMembership = async (data) => {
  try {
    const isNotActiveMembership = await validateIsMembershipActive(
      data.id_company
    );

    if (isNotActiveMembership.data) {
      return {
        success: false,
        msg: 'Usted tiene una membresía activa. Por lo cual no se puede registrar un nuevo pago hasta que su membresía caduque.',
        data: [],
      };
    }

    const totalPayment = data.dollar_value * membershipData.valor;

    if (Number(totalPayment.toFixed(2)) !== data.amount_payment_membership) {
      return {
        success: false,
        msg: 'Cantidad pagada no es la correcta. Por favor verifique y vuelva a intentar.',
        data: [],
      };
    }

    const newRegister = new ModelCompanyMembership(data);
    const registered = await newRegister.save();

    await updateStateMembership(data.id_company, 'procesando');

    return {
      success: true,
      msg: 'Pago registrado exitosamente.',
      data: registered,
    };
  } catch (error) {
    console.log('Error al registrar pago --------------------------->', error);
    return {
      success: false,
      msg: 'Error al registrar pago.',
      data: [],
    };
  }
};

const getLastDatePaymentMembership = async (id_company) => {
  try {
    const rateDollar = await getDollarRate();

    if (!rateDollar.success) {
      return rateDollar;
    }

    const lastDatePayment = await getLastPayment(id_company);

    const parsedRateDollar = Number(rateDollar?.data);

    // * total a pagar
    const totalToPayment = parsedRateDollar * membershipData.valor;

    // * proxima fecha a pagar
    const nextPaymentDate = add(new Date(lastDatePayment?.data?.createdAt), {
      months: 1,
    });

    const responseData = {
      lastDatePayment: lastDatePayment?.data?.createdAt ?? null,
      rateDollar: parsedRateDollar,
      priceMembership: membershipData.valor,
      totalToPayment,
      stateMembership: lastDatePayment?.data?.state_payment
        ? lastDatePayment?.data?.state_payment
        : 'inactiva',
      nextPaymentDate: nextPaymentDate ?? '',
    };

    return {
      success: true,
      msg: !lastDatePayment?.createdAt
        ? 'No tienes pagos aún'
        : `Ultimo pago: ${lastDatePayment.createdAt}`,
      data: responseData,
    };
  } catch (error) {
    console.log('Error al buscar ultimo pago.', error);
    return {
      success: false,
      msg: 'Error al buscar ultimo pago.',
      data: [],
    };
  }
};

const validateIsMembershipActive = async (id_company) => {
  try {
    const { data } = await getLastDatePaymentMembership(id_company);

    const elapsedDays = getElapseDaysBetweenTwoDates(
      data?.lastDatePayment,
      getLocalDateTime()
    );

    const isActive = Number.isNaN(elapsedDays)
      ? false
      : elapsedDays > 31
      ? false
      : true;

    return {
      success: true,
      msg: 'Estado de la membresía.',
      data: isActive,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al verificar fecha de ultimo pago.',
      data: [],
    };
  }
};

const updateStateMembership = async (id_company, newState) => {
  try {
    const updated = await ModelCompanyMembership.update(
      { state_payment: newState },
      {
        where: {
          id_company,
        },
      }
    );

    return {
      success: true,
      msg: 'Estado de la membresía actualizado correctamente.',
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al verificar actualizar estado de la membresía.',
      data: [],
    };
  }
};

const getDollarRate = async () => {
  try {
    const { data } = await axios.get(
      'https://s3.amazonaws.com/dolartoday/data.json'
    );

    return {
      success: true,
      msg: 'Dolar BCV',
      data: data?.USD?.dolartoday,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al buscar tasa del dolar. Intente más tarde.',
      data: [],
    };
  }
};

const getLastPayment = async (id_company) => {
  try {
    const lastDatePayment = await ModelCompanyMembership.findOne({
      where: {
        id_company,
      },
      order: [['id', 'DESC']],
    });

    return {
      success: true,
      msg: 'Ultimo pago de membresía',
      data: lastDatePayment.dataValues,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al obtener último pago de membresía',
      data: [],
    };
  }
};

module.exports.saveNewPaymentCompanyMembership =
  saveNewPaymentCompanyMembership;
module.exports.getLastDatePaymentMembership = getLastDatePaymentMembership;
module.exports.updateStateMembership = updateStateMembership;
module.exports.validateIsMembershipActive = validateIsMembershipActive;
module.exports.getLastPayment = getLastPayment;
