const express = require('express');
const AuthorsService = require('../services/authors');

// Estructura de los Schemas a validar
const {
  authorIdSchema,
  createAuthorSchema,
  updateAuthorSchema
} = require('../utils/schemas/authors');

// Middleware que lleva acabo la validacion de los schemes
const validationHandler = require('../utils/middleware/validationHandler');

function authorsApi(app) {
  const router = express.Router();
  app.use('/api/authors', router);

  const authorsService = new AuthorsService();

  /**
   * Ruta GET para obtner toda la lista de autores
   */
  router.get('/', async function(req, res, next) {

    // const { query } = req.query;

    try {
      const authors = await authorsService.getAuthors();

      res.status(200).json({
        data: authors,
        message: 'authors listed'
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * Ruta GET para obtener un solo author por ID
   */
  router.get('/:authorId', validationHandler({ authorId: authorIdSchema }, 'params'), async function(req, res, next) {

    // agregamos cache
    // cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);

    const { authorId } = req.params; // en la url

    try {
      const author = await authorsService.getAuthor({ authorId });

      res.status(200).json({
        data: author,
        message: 'author retrieved'
      });
    } catch (error) {
        next(error);
    }
  });

}

module.exports = authorsApi;