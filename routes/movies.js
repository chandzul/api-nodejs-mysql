const express = require('express');
const passport = require('passport');
const MoviesService = require('../services/movies');

// definimos los schemas que queremos validar
const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema
} = require('../utils/schemas/movies');

//  JWT strategy
require('../utils/auth/strategies/jwt');

// Middleware que lleva acabo la validacion de los schemes
const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

const cacheResponse = require('../utils/cacheResponse')
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS }= require('../utils/time');

function moviesApi(app) {
  
  const router = express.Router();
  app.use('/api/movies', router); // define el endpoint principal de la api eje: http://localhost:3000/api/movies

  const moviesService = new MoviesService();

  /**
   * Route GET para obtner toda la lista de peliculas
   */
  router.get(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['read:movies']),
    async function(req, res, next) {

    // agregamos cache
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);

    const { tags } = req.query; // se concantena con ?

    try {
      const movies = await moviesService.getMovies({ tags });

    //   throw new Error('Error getting movies');

      res.status(200).json({
        data: movies,
        message: 'movies listed'
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * Route GET para obtener una sola pelicula por ID
   */
  router.get(
    '/:movieId', 
    passport.authenticate('jwt', { session: false }), 
    validationHandler({ movieId: movieIdSchema }, 'params'), 
    scopesValidationHandler(['read:movies']),
    async function(req, res, next) {

    // agregamos cache
    cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);

    const { movieId } = req.params; // en la url

    try {
      const movies = await moviesService.getMovie({ movieId });

      res.status(200).json({
        data: movies,
        message: 'movie retrieved'
      });
    } catch (error) {
        next(error);
    }
  });

  /**
   * Route POST para crear una nueva pelicula pasandole un json en el request
   */
  router.post(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['create:movies']),
    validationHandler(createMovieSchema), async function(req, res, next) {

      const { body: movie } = req;

      try {
          const createdMovieId = await moviesService.createMovie({ movie });

          res.status(201).json({
              data: createdMovieId,
              message: 'movie created'
          });
      } catch (error) {
          next(error);
      }
  });

  /**
   * Route PUT para modificar una pelicula pasandole la id
   */
  router.put(
    '/:movieId', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['update:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'), 
    validationHandler(updateMovieSchema), 
    async function(req, res, next) {

      const { movieId } = req.params; // en la url
      const { body: movie } = req;

      try {
          const updatedMovieId = await moviesService.updateMovie({ movieId, movie });

          res.status(200).json({
              data: updatedMovieId,
              message: 'movie updated'
          });
      } catch (error) {
          next(error);
      }
  });

  /**
   * Route DELETE para eliminar una peliculando pasandole un ID
   */
  router.delete(
    '/:movieId', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['deleted:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'), 
    async function(req, res, next) {

      const { movieId } = req.params; // en la url

      try {
          const deletedMovieId = await moviesService.deletedMovie({ movieId });

          res.status(200).json({
              data: deletedMovieId,
              message: 'movie deleted'
          });
      } catch (error) {
          next(error);
      }
  });
}

module.exports = moviesApi;