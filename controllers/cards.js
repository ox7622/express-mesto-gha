/* eslint-disable no-console */
const Card = require('../models/card');

const status200 = 200;
const error400 = 400;
const error404 = 404;
const error500 = 500;

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(status200).json(cards);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(error500).json({ message: 'Произошла ошибка' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(status200).json(card);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(error400).json({ message: 'Произошла ошибка валидации данных места' });
    }
    return res.status(error500).json({ message: 'Произошла ошибка' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card) {
      return res.status(error404).json({ message: 'Карточка не найдена' });
    }
    await Card.findByIdAndRemove(id);
    return res.status(status200).json({ message: 'Карточка удалена' });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(error400).json({ message: 'Произошла ошибка валидации данных места' });
    }
    return res.status(error500).json({ message: 'Произошла ошибка' });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const setLike = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );

    if (!setLike) {
      return res.status(error404).json({ message: 'Такой карточки нет' });
    }
    return res.status(status200).json({ message: 'Лайк поставлен' });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(error400).json({ message: 'Произошла ошибка валидации id карточки' });
    }
    return res.status(error500).json({ message: 'Произошла ошибка' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const unlike = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!unlike) {
      return res.status(error404).json({ message: 'Такой карточки нет' });
    }
    return res.status(status200).json({ message: 'Лайк снят' });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(error400).json({ message: 'Произошла ошибка валидации id карточки' });
    }
    return res.status(error500).json({ message: 'Произошла ошибка' });
  }
};
