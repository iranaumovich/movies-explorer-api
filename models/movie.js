const mongoose = require('mongoose');

// создаем схему фильма
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) =>
        /^[https?://(www.)?][\w\d-._~:/?#[\]@!$&'()*+,;=]{1,}#?$/.test(v),
      message: 'неверная ссылка',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) =>
        /^[https?://(www.)?][\w\d-._~:/?#[\]@!$&'()*+,;=]{1,}#?$/.test(v),
      message: 'неверная ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) =>
        /^[https?://(www.)?][\w\d-._~:/?#[\]@!$&'()*+,;=]{1,}#?$/.test(v),
      message: 'неверная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
