const express = require('express');
const app = express();

const { config } = require('./config/index');
const moviesApi = require('./routes/movies');
const authorsApi = require('./routes/authors');

// Cargamos - Middleware para el manejo de errores
const {
  logErrors,
  wrapErrors, 
  errorHandler } = require('./utils/middleware/errorHandlers');

const notFoundHandler = require('./utils/middleware/NotfoundHandler');

// Middleware Body parser, todo lo que llega lo convierte en formato JSON
app.use(express.json());

// Routes Middleware de los endpoints de la aplicacion
authorsApi(app);
// moviesApi(app);

// Catch 404
app.use(notFoundHandler);

app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`listen http://localhost:${config.port}`);
});