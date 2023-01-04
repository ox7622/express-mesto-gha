const routerUser = require('express').Router();
const {
  createUser, getUsers, findUser, updateUser, updateAvatar, login, getProfile,
} = require('../controllers/users');
const { checkToken } = require('../middlewares/auth');

module.exports = routerUser;

routerUser.get('/', checkToken, getUsers);
routerUser.get('/me', checkToken, getProfile);
routerUser.patch('/me', checkToken, updateUser);
routerUser.patch('/me/avatar', checkToken, updateAvatar);
routerUser.get('/:id', checkToken, findUser);
routerUser.post('/signin', login);
routerUser.post('/signup', createUser);
