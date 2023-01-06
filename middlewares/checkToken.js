/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { TOKEN = 'mytokendonkey' } = process.env;
const LoginError = require('../errors/LoginError');

module.exports.checkToken = (req, res, next) => {
  const authData = req.headers.authorization;
  const token = authData.replace('Bearer ', '');
  if (!authData || !authData.startsWith('Bearer ')) {
    throw new LoginError('Пользователь не авторизован');
  }
  try {
    jwt.verify(token, TOKEN);
  } catch (err) {
    return next(new LoginError('Пользователь не авторизован'));
  }
  req.user = token;
  next();
};
