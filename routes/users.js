const { createUser, getUsers, findUser, updateUser, updateAvatar } = require('../controllers/users');
const routerUser = require('express').Router();
module.exports = routerUser;

routerUser.get('/users', getUsers);
routerUser.get('/users/:id',findUser )
routerUser.post('/users', createUser);
routerUser.patch('/users/me', updateUser);
routerUser.patch('/users/me/avatar', updateAvatar);