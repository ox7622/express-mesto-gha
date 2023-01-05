/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const LoginError = require('../errors/LoginError');

const tokenKey = 'mytokendonkey';

module.exports.createToken = (user) => {
  const token = jwt.sign({ _id: user._id }, tokenKey, { expiresIn: '7d' });
  return token;
};

module.exports.checkToken = (req, res, next) => {
  const authData = req.headers.authorization;
  const token = authData.replace('Bearer ', '');
  if (!authData || !authData.startsWith('Bearer ')) {
    throw new LoginError('Пользователь не авторизован');
  }
  try {
    jwt.verify(token, tokenKey);
  } catch (err) {
    return next(new LoginError('Пользователь не авторизован'));
  }
  req.user = token;
  next();
};

module.exports.decodeToken = (token, next) => {
  if (!token) {
    throw new LoginError('Пользователь не авторизован');
  }
  try {
    return jwt.decode(token);
  } catch (err) {
    return next(err);
  }
};
