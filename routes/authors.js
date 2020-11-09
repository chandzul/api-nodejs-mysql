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

  /**
   * Route POST para crear dar de alta un nuevo author pasandole un json en el request
   */
  router.post('/', validationHandler( createAuthorSchema ), async function(req, res, next) {

    const { body: author } = req;

    try {
        const createdAuthorId = await authorsService.createAuthor({ author });

        res.status(201).json({
            data: createdAuthorId,
            message: 'author created'
        });
    } catch (error) {
        next(error);
    }
});

  /**
   * Route PUT para modificar un author pasandole la id y la data
   */
  router.put('/:authorId', validationHandler({ authorId: authorIdSchema }, 'params'), validationHandler(updateAuthorSchema), async function(req, res, next) {

    const { authorId } = req.params; // en la url
    const { body: author } = req; // en el body de la peticion

    try {
        const updatedAuthorId = await authorsService.updateAuthor({ authorId, author });

        res.status(200).json({
            data: updatedAuthorId,
            message: 'movie updated'
        });
    } catch (error) {
        next(error);
    }
});

  /**
   * Route DELETE para eliminar un author pasandole un ID
   */
  router.delete('/:authorId', validationHandler({ authorId: authorIdSchema }, 'params'), async function(req, res, next) {

    const { authorId } = req.params; // en la url

    try {
        const deletedAuthorId = await authorsService.deletedAuthor({ authorId });

        res.status(200).json({
            data: deletedAuthorId,
            message: 'author deleted'
        });
    } catch (error) {
        next(error);
    }
});
}

module.exports = authorsApi;