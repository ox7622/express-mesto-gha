/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { error401 } = require('../constants/status');
const { errorHadler } = require('./errors');

const tokenKey = 'mytokendonkey';

module.exports.createToken = (user) => {
  const token = jwt.sign({ _id: user._id }, tokenKey, { expiresIn: '7d' });
  return token;
};

module.exports.checkToken = (req, res, next) => {
  const authData = req.headers.authorization;
  const token = authData.replace('Bearer ', '');
  if (!authData || !authData.startsWith('Bearer ')) {
    return res.status(error401).json({ message: 'Пользователь не авторизован' });
  }
  try {
    jwt.verify(token, tokenKey);
  } catch (err) {
    errorHadler(err, '');
  }
  req.user = token;
  next();
};
module.exports.decodeToken = (token) => {
  if (!token) {
    return false;
  }
  try {
    return jwt.decode(token);
  } catch (err) {
    errorHadler(err, '');
  }
};
