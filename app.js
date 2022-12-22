const express = require('express');
const mongoose = require('mongoose');
const routerCard = require('./routes/cards');
const routerUser = require('./routes/users');

mongoose.set('strictQuery', true);
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '639d8e0d435e554694321501' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  console.log("Connected to Mongo db");
});

app.use(express.json());
app.use('/', routerUser, routerCard);


app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})