const { Sequelize } = require('sequelize');

const sequelize =
  process.env.TYPE_CONNECTION === 'LOCAL'
    ? new Sequelize(
        process.env.LOCAL_DB,
        process.env.LOCAL_USER_DB,
        process.env.LOCAL_PASSWORD_DB,
        {
          host: process.env.LOCAL_HOST_DB,
          dialect: 'mysql',
          dialectOptions: {
            useUTC: false,
            dateStrings: true,
            typeCast: true,
          },
          timezone: 'America/Caracas',
        }
      )
    : new Sequelize(
        process.env.REMOTE_DB,
        process.env.REMOTE_USER_DB,
        process.env.REMOTE_PASSWORD_DB,
        {
          host: process.env.REMOTE_HOST_DB,
          dialect: 'mysql',
          dialectOptions: {
            useUTC: false,
            dateStrings: true,
            typeCast: true,
          },
          timezone: 'America/Caracas',
        }
      );

const connect = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ force: false });

    console.log(
      `db ${
        process.env.TYPE_CONNECTION === 'LOCAL'
          ? process.env.LOCAL_DB
          : process.env.REMOTE_DB
      } is connected`
    );
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.connectionDB = { connect, sequelize };
