/* eslint-disable no-console */
const User = require('../models/user');

const status200 = 200;
const error400 = 400;
const error404 = 404;
const error500 = 500;

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;

    const user = await User.create({ name, about, avatar });
    return res.status(status200).json(user);
  } catch (err) {
    console.error(err.name);
    if (err.name === 'ValidationError') {
      res.status(error400).json({ message: 'Произошла ошибка валидации данных пользователя' });
    }
    return res.status(error500).json({ message: 'Произошла ошибка' });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(status200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(error500).json({ message: 'Произошла ошибка' });
  }
};

module.exports.findUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(error404).json({ message: 'Пользователь не найден' });
    }
    return res.status(status200).json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(error400).json({ message: 'Произошла ошибка валидации id' });
    }
    return res.status(error500).json({ message: 'Произошла ошибка' });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    if (!name || !about) {
      return res.status(error400).json({ message: 'Заполните оба поля с данными пользователя' });
    }
    if (!User.findById(req.user._id)) {
      return res.status(error404).json({ message: 'Пользователь не найден' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );
    return res.status(status200).json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(error400).json({ message: 'Произошла ошибка валидации данных пользователя' });
    }
    return res.status(error500).json({ message: 'Произошла ошибка' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!User.findById(req.user._id)) {
      return res.status(error404).json({ message: 'Пользователь не найден' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    return res.status(status200).json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(error400).json({ message: 'Произошла ошибка, проверьте ссылку на аватар' });
    }
    return res.status(error500).json({ message: 'Произошла ошибка' });
  }
};
