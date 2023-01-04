const { isObjectIdOrHexString } = require('mongoose');
const Card = require('../models/card');
const errorHadler = require('../middlewares/errors');

const {
  status200, error400, error404, error403,
} = require('../constants/status');
const { decodeToken } = require('../middlewares/auth');
const { linkValidation } = require('../utils/regexValidation');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(status200).json(cards);
  } catch (err) {
    return errorHadler(req, res, err, 'данных карточек');
  }
};

module.exports.createCard = async (req, res) => {
  const ownerId = decodeToken(req.user);
  const { name, link } = req.body;
  if (linkValidation(link)) {
    try {
      const card = await Card.create({ name, link, owner: ownerId });
      return res.status(status200).json(card);
    } catch (err) {
      return errorHadler(req, res, err, 'данных карточек');
    }
  } return res.status(error400).json({ message: 'Ссылка не валидна' });
};

module.exports.deleteCard = async (req, res) => {
  const ownerId = decodeToken(req.user);
  const { id } = req.params;
  if (isObjectIdOrHexString(id) && isObjectIdOrHexString(ownerId)) {
    try {
      const card = await Card.findById(id);
      if (!card) {
        return res.status(error404).json({ message: 'Карточка не найдена' });
      }
      if (card.owner.toString() === ownerId._id.toString()) {
        await Card.findByIdAndRemove(id);
        return res.status(status200).json({ message: 'Карточка удалена' });
      }
      return res.status(error403).json({ message: 'У вас нет права удалять эту карточку' });
    } catch (err) {
      return errorHadler(req, res, err, 'данных ссылки карточки');
    }
  }
  return res.status(error400).json({ message: 'Невалидный id карточки' });
};

module.exports.likeCard = async (req, res) => {
  const ownerId = decodeToken(req.user);
  const { id } = req.params.id;
  if (isObjectIdOrHexString(id) && isObjectIdOrHexString(ownerId)) {
    try {
      const setLike = await Card.findByIdAndUpdate(
        id,
        { $addToSet: { likes: ownerId } }, // добавить _id в массив, если его там нет
        { new: true },
      );

      if (!setLike) {
        return res.status(error404).json({ message: 'Такой карточки нет' });
      }
      return res.status(status200).json({ message: 'Лайк поставлен' });
    } catch (err) {
      return errorHadler(req, res, err, 'id карточки');
    }
  } return res.status(error400).json({ message: 'Невалидный id карточки' });
};

module.exports.dislikeCard = async (req, res) => {
  const ownerId = decodeToken(req.user);
  const { id } = req.params.id;
  if (isObjectIdOrHexString(id) && isObjectIdOrHexString(ownerId)) {
    try {
      const unlike = await Card.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: ownerId } },
        { new: true },
      );

      if (!unlike) {
        return res.status(error404).json({ message: 'Такой карточки нет' });
      }
      return res.status(status200).json({ message: 'Лайк снят' });
    } catch (err) {
      return errorHadler(req, res, err, 'id карточки');
    }
  } return res.status(error400).json({ message: 'Невалидный id карточки' });
};
