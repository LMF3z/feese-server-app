const axios = require('axios');
const cheerio = require('cheerio');
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
        msg: 'Usted tiene una membresía activa. Por lo cual no se puede registrar un buevo pago hasta que su membresía caduque.',
        data: [],
      };
    }

    const totalPayment = data.dollar_value * membershipData.valor;

    console.log('totalPayment --------------------------->', totalPayment);

    if (totalPayment !== data.amount_payment_membership) {
      return {
        success: false,
        msg: 'Cantidad pagada no es la correcta. Por favor verifique y vuelva a intentar.',
        data: [],
      };
    }

    const newRegister = new ModelCompanyMembership(data);
    const registered = await newRegister.save();

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

    const lastDatePayment = await ModelCompanyMembership.findOne({
      where: {
        id_company,
      },
      order: [['id', 'DESC']],
    });

    const parsedRateDollar = Number(
      rateDollar?.data?.slice(1, 5).replace(',', '.')
    );

    // * total a pagar
    const totalToPayment = parsedRateDollar * membershipData.valor;

    return {
      success: true,
      msg: !lastDatePayment?.createdAt
        ? 'No tienes pagos aún'
        : `Ultimo pago: ${lastDatePayment.createdAt}`,
      data: {
        lastDatePayment: lastDatePayment?.createdAt
          ? lastDatePayment?.createdAt
          : null,
        rateDollar: parsedRateDollar,
        priceMembership: membershipData.valor,
        totalToPayment,
        stateMembership: lastDatePayment?.state_payment
          ? lastDatePayment?.state_payment
          : 'inactiva',
      },
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
      data.lastDatePayment,
      getLocalDateTime()
    );

    const result = Number.isNaN(elapsedDays)
      ? false
      : elapsedDays > 31
      ? false
      : true;

    return {
      success: true,
      msg: 'Estado de la membresía.',
      data: result,
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
    const rateBCV = await axios.get('http://www.bcv.org.ve/');

    const html = rateBCV.data;
    const $ = cheerio.load(html);
    const base = $('#dolar', html).children().children().html();
    const bcvRateDollar = $('strong', base).html();

    return {
      success: true,
      msg: 'Dolar BCV',
      data: bcvRateDollar,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al buscar tasa del dolar. Intente más tarde.',
      data: [],
    };
  }
};

module.exports.saveNewPaymentCompanyMembership =
  saveNewPaymentCompanyMembership;
module.exports.getLastDatePaymentMembership = getLastDatePaymentMembership;
module.exports.updateStateMembership = updateStateMembership;
module.exports.validateIsMembershipActive = validateIsMembershipActive;
