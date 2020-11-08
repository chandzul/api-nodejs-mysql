// const { internal } = require('@hapi/boom');
const assert = require('assert');
const proxyquire = require('proxyquire');

const { moviesMock, MoviesServiceMock } = require('../utils/mocks/movies');
const testServer = require('../utils/testServer');

describe('routes - movies', function() {

  // que rutas son las que se van a analizar - decimis que no valide el servicio pero si el mock
  const route = proxyquire('../routes/movies', {
    '../services/movies': MoviesServiceMock
  })

  const request = testServer(route);

  describe('GET /movies', function() {

    // validamos que la respuesta del get sea un status 200
    it('should respond with status 200', function(done) {
      request.get('/api/movies').expect(200, done)
    });

    it('should responde with the list of movies', function (done) {
      request.get('/api/movies').end((err,res) => {
        assert.deepStrictEqual(res.body, {
          data: moviesMock,
          message: 'movies listed'
        });

        done();
      });
    });

  });
});

/**
 * Se testean las siguientes cosas
 * 
 * 1.- rutas
 * 2.- conecciones a modelos de base de datos
 * 3.- utilidades, funciones de utilidad a todo el largo del codigo
 */
