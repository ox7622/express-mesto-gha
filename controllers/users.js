const User = require('../models/user');


module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;

    const user = await User.create({ name, about, avatar });
    return res.status(200).json(user);
  }
  catch (err) {
    console.error(err.name);
    err.name == "ValidationError" ?
    res.status(400).json({ message: "Произошла ошибка валидации данных пользователя" }) :
    res.status(500).json({ message: "Произошла ошибка" });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Произошла ошибка" });
  }

};

module.exports.findUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    return res.status(200).json(user);
  }
  catch (err) {
    console.error(err);
    err.name == "ValidationError" || err.name == "CastError" ?
    res.status(400).json({ message: "Произошла ошибка валидации id" }) :
    res.status(500).json({ message: "Произошла ошибка" });
  }
};


module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;

    if (!User.findById(req.user._id)) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { name, about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      })

    return res.status(200).json(user);
  }
  catch (err) {
    console.error(err);
    err.name == "ValidationError" ?
    res.status(400).json({ message: "Произошла ошибка валидации данных пользователя" }) :
    res.status(500).json({ message: "Произошла ошибка" });
  }

};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!User.findById(req.user._id)) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      })

    return res.status(200).json(user);
  }
  catch (err) {
    console.error(err);
    err.name == "ValidationError" ?
    res.status(400).json({ message: "Произошла ошибка, проверьте ссылку на аватар" }) :
    res.status(500).json({ message: "Произошла ошибка" });
  }
}