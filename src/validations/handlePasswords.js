const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);

const encripPassword = (pass) => {
  const hash = bcrypt.hashSync(pass, salt);
  return hash;
};

const comparePassword = (password, hash) => {
  const isValidPasword = bcrypt.compareSync(password, hash);
  return isValidPasword;
};

const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const handlePasswords = {
  encripPassword,
  comparePassword,
  signToken,
  verifyToken,
};

module.exports = handlePasswords;
