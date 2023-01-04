/* eslint-disable no-console */
const {
  error400, error409, error500,
} = require('../constants/status');

module.exports.errorHadler = (req, res, err, text) => {
  console.error(err);
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(error400).json({ message: `Произошла ошибка валидации ${text}` });
  } if (err.code === 11000) {
    return res.status(error409).json({ message: 'Пользователь с такими данными уже есть в базе' });
  }
  return res.status(error500).json({ message: 'Произошла ошибка' });
};
