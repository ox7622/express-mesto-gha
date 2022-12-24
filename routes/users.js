const routerUser = require('express').Router();
const {
  createUser, getUsers, findUser, updateUser, updateAvatar,
} = require('../controllers/users');

module.exports = routerUser;

routerUser.get('/', getUsers);
routerUser.get('/:id', findUser);
routerUser.post('/', createUser);
routerUser.patch('/me', updateUser);
routerUser.patch('/me/avatar', updateAvatar);
