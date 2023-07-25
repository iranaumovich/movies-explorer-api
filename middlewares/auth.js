const jwt = require('jsonwebtoken');
const InvalidCredentialsError = require('../errors/InvalidCredentialsError');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new InvalidCredentialsError('Необходима авторизация');
  }

  // извлекаем токен, выкидываем из заголовка Bearer
  const token = authorization.replace('Bearer ', '');
  let payload;
  // верифицируем токен, оборачиваем в try-catch, чтобы обработать ошибку если с токеном что-то не так
  try {
    payload = jwt.verify(
      token,
      process.env.NODE_ENV !== 'production'
        ? 'token-secret-key'
        : process.env.JWT_SECRET,
    );
  } catch (err) {
    throw new InvalidCredentialsError('Необходима авторизация');
  }

  // записываем пейлоуд в объект запроса, так следующий мидлвэр сможет определить, кем этот запрос был выполнен
  // в пейлоуде находится зашифрованный в строку объект пользователя(в нашем случае id юзера)

  req.user = payload;

  next();
};
