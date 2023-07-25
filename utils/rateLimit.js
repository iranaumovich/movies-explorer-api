const rateLimit = require('express-rate-limit');

// ограничиваем количество запросов с одного IP-адреса в единицу времени.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { limiter };
