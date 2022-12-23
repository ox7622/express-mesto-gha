const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Произошла ошибка" });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(200).json(card);
  }
  catch (err) {
    console.error(err);
    err.name == "ValidationError" ?
      res.status(400).json({ message: "Произошла ошибка валидации данных места" }) :
      res.status(500).json({ message: "Произошла ошибка" });
  }

};

module.exports.deleteCard = async (req, res) => {
  try {
    const {id} = req.params;
    if (!Card.find(id)) {
      return res.status(404).json({message: "Карточка не найдена"});
    }
    await Card.findByIdAndRemove(id);
    return res.status(200).json({message: "Карточка удалена"});
  }
  catch (err) {
    console.error(err);
    err.name == "ValidationError" ?
      res.status(400).json({ message: "Произошла ошибка валидации данных места" }) :
      res.status(500).json({ message: "Произошла ошибка" });
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
      return res.status(404).json({ message: "Такой карточки нет" });
    }

    return res.status(200).json({message: "Лайк поставлен"});
  }
  catch (err) {
    console.error(err);
    err.name == "ValidationError" ?
      res.status(400).json({ message: "Произошла ошибка валидации id карточки" }) :
      res.status(500).json({ message: "Произошла ошибка" });
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
      return res.status(404).json({ message: "Такой карточки нет" })
    };

    return res.status(200).json({message: "Лайк снят"});
  }

  catch (err) {
    console.error(err);
    err.name == "ValidationError" ?
      res.status(400).json({ message: "Произошла ошибка валидации id карточки" }) :
      res.status(500).json({ message: "Произошла ошибка" });
  }

}
