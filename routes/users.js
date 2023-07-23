const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, updateUser } = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email({ minDomainSegments: 2 }),
    }),
  }),
  updateUser,
);

module.exports = router;
