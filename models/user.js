const mongoose = require('mongoose');

// создаем схему пользователя
const userSchema = new mongoose.Schema({
  email: {
    type: String,
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
