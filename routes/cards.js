const routerCard = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

module.exports = routerCard;

routerCard.get('/', getCards);
routerCard.post('/', createCard);
routerCard.delete('/:id', deleteCard);
routerCard.put('/:id/likes', likeCard);
routerCard.delete('/:id/likes', dislikeCard);
