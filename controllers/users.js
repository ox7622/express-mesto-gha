const bcrypt = require('bcrypt');
const { isObjectIdOrHexString } = require('mongoose');
const User = require('../models/user');
const {
  status200, error400, error401, error404,
} = require('../constants/status');
const { createToken, decodeToken } = require('../middlewares/auth');
const { errorHadler } = require('../middlewares/errors');
const { emailValidation, linkValidation } = require('../utils/regexValidation');

module.exports.createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (emailValidation(email)) {
    try {
      await User.init();
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name, about, avatar, email, password: hash,
      });
      return res.status(status200).json(user);
    } catch (err) {
      return errorHadler(req, res, err, 'данных пользователя');
    }
  } return res.status(error400).json({ message: 'Формат email не валидный' });
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(status200).json(users);
  } catch (err) {
    return errorHadler(req, res, err, '');
  }
};

module.exports.findUser = async (req, res) => {
  const { id } = req.params;
  if (isObjectIdOrHexString(id)) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(error404).json({ message: 'Пользователь не найден' });
      }
      return res.status(status200).json(user);
    } catch (err) {
      return errorHadler(req, res, err, 'id');
    }
  } return res.status(error400).json({ message: 'Id не соответствует типу ObjectId' });
};

module.exports.updateUser = async (req, res) => {
  const userId = decodeToken(req.user);
  if (!User.findById(userId._id)) {
    return res.status(error404).json({ message: 'Пользователь не найден' });
  }
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(error400).json({ message: 'Заполните оба поля с данными пользователя' });
  }
  try {
    const user = await User.findByIdAndUpdate(
      userId._id,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );
    return res.status(status200).json(user);
  } catch (err) {
    return errorHadler(req, res, err, 'данных пользователя');
  }
};

module.exports.updateAvatar = async (req, res) => {
  const userId = decodeToken(req.user);
  const { avatar } = req.body;
  if (linkValidation(avatar)) {
    try {
      if (!User.findById(userId._id)) {
        return res.status(error404).json({ message: 'Пользователь не найден' });
      }
      const user = await User.findByIdAndUpdate(
        userId._id,
        { avatar },
        {
          new: true, // обработчик then получит на вход обновлённую запись
          runValidators: true, // данные будут валидированы перед изменением
        },
      );

      return res.status(status200).json(user);
    } catch (err) {
      return errorHadler(req, res, err, 'данных ссылки на аватар пользователя');
    }
  } return res.status(error400).json({ message: 'Ссылка не валидна' });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (emailValidation(email)) {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(error404).json({ message: 'Пользователь не найден' });
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const token = createToken(user);
        return res.cookie('token', token, {
          httpOnly: true,
        }).status(status200).json({ message: 'Вы успешно вошли' });
      }
      return res.status(error401).json({ message: 'Неправильный логин или пароль' });
    } catch (err) {
      return errorHadler(req, res, err, 'данных пользователя');
    }
  } return res.status(error400).json({ message: 'Формат email не валидный ' });
};

module.exports.getProfile = async (req, res) => {
  const userId = decodeToken(req.user);
  try {
    const user = await User.findById(userId._id);
    return res.status(status200).json(user);
  } catch (err) {
    return errorHadler(req, res, err, 'данных пользователя');
  }
};
