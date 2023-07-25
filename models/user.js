const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

// создаем схему пользователя
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: [isEmail, 'Неправильный email'],
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'NoName',
  },
});

module.exports = mongoose.model('user', userSchema);
