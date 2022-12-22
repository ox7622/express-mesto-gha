const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');
const routerCard = require('express').Router();
module.exports = routerCard;

routerCard.get('/cards', getCards);
routerCard.post('/cards', createCard);
routerCard.delete('/cards/:id', deleteCard);
routerCard.put('/cards/:id/likes', likeCard);
routerCard.delete('/cards/:id/likes', dislikeCard);