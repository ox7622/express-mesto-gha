const routerUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser, getUsers, findUser, updateUser, updateAvatar, login, getProfile,
} = require('../controllers/users');
const { checkToken } = require('../middlewares/auth');

module.exports = routerUser;

routerUser.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), checkToken, getUsers);

routerUser.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), checkToken, getProfile);

routerUser.patch('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), checkToken, updateUser);

routerUser.patch('/me/avatar', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .regex(/^https?:\/\/(wwww.)?[-._~:/?#@!$&'()*+,;=a-zA-Z0-9]+$/),
  }).unknown(true),
}), checkToken, updateAvatar);

routerUser.get('/:id', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), checkToken, findUser);

routerUser.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);

routerUser.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex(/^https?:\/\/(wwww.)?[-._~:/?#@!$&'()*+,;=a-zA-Z0-9]+$/),
    email: Joi.string().required().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/),
    password: Joi.string().required(),
  }),
}), createUser);
