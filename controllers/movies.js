const Movie = require('../models/movie');
const InvalidUserDataError = require('../errors/InvalidUserDataError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const id = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidUserDataError(
          'Переданы некорректные данные для создания фильма',
        );
      }

      throw err;
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError(`Фильм с id ${req.params.movieId} не найден`);
      }

      if (movie.owner.equals(req.user._id)) {
        Movie.deleteOne(movie)
          .then((deletedMovie) => {
            res.send(deletedMovie);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new InvalidUserDataError(
                'Переданы некорректные данные для удаления фильма',
              );
            }

            throw err;
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Нет прав для удаления фильма');
      }
    })
    .catch(next);
};
