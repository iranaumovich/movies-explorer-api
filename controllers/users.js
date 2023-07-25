// модуль для хеширования пароля
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const InvalidUserDataError = require('../errors/InvalidUserDataError');
const NotFoundError = require('../errors/NotFoundError');
const InvalidCredentialsError = require('../errors/InvalidCredentialsError');
const ConflictingRequestError = require('../errors/ConflictingRequestError');

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  // выбрасываем ошибку, если email не по форме
  if (!validator.isEmail(email)) {
    next(
      new InvalidUserDataError(
        'Переданы некорректные данные при создании пользователя',
      ),
    );
  }

  // хешируем пароль с помощью метода hash (на вход принимает пароль и длину "соли")
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      }),
    )
    .then((user) =>
      res.status(201).send({
        id: user._id,
        name: user.name,
        email: user.email,
      }),
    )
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictingRequestError(
          'Пользователь с таким email уже зарегистрирован',
        );
      }

      if (err.name === 'ValidationError') {
        throw new InvalidUserDataError(
          'Переданы некорректные данные при создании пользователя',
        );
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) =>
      res.send({
        name: user.name,
        email: user.email,
      }),
    )
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(`Пользователь с id ${req.user._id} не найден`);
      } else {
        res.send({
          name: user.name,
          email: user.email,
        });
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictingRequestError(
          'Пользователь с таким email уже зарегистрирован',
        );
      }

      if (err.name === 'ValidationError') {
        throw new InvalidUserDataError(
          'Переданы некорректные данные при обновлении профиля',
        );
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // контроллер ищет пользователя с полученной почтой в базе
  // Если пользователь нашёлся, высчитываем хеш пароля и сравниваем его с хешем в базе
  User.findOne({ email })
    // чтобы юзер из базы возвращался с паролем
    .select('+password')
    .then((user) => {
      // если пользователя нет в базе возвращаем ошибку
      if (!user) {
        return Promise.reject(
          new InvalidCredentialsError('Введен некорректный email'),
        );
      }

      // Если пользователь найден, проверим пароль: захешируем его и сравним с хешем в базе
      // это делает метод bcrypt.compare, принимает на вход пароль и его хеш
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // хеши не совпали — отклоняем промис
          return Promise.reject(
            new InvalidCredentialsError('Неправильные почта или пароль'),
          );
        }
        // аутентификация успешна, возвращаем токен
        const token = jwt.sign(
          // передаем методу sign пейлоуд токена (зашифрованный объект пользователя)
          // можно любую информацию, в нашем случае id, и секретный ключ
          { _id: user._id },
          process.env.NODE_ENV !== 'production'
            ? 'token-secret-key'
            : process.env.JWT_SECRET,
          {
            // время в течение которого токен действителен
            expiresIn: '7d',
          },
        );

        return res.send({ token });
      });
    })
    .catch(next);
};
