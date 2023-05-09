require('dotenv').config()

const express = require('express');
const path = require('path');
const logger = require("morgan");
const methodOverride = require("method-override");
const createError = require("http-errors");
const app = express();

//Ejecuto el llamado a mis rutas
const indexRouter = require('./routes/index');
const moviesRoutes = require('./routes/moviesRoutes');
const genresRoutes = require('./routes/genresRoutes');


//Aquí pueden colocar las rutas de las APIs
const genresApiRoutes = require('./routes/api/genresRoutes');
const moviesApiRoutes = require('./routes/api/moviesRoutes');

const createResponseError = require('./helpers/createResponseError');

// view engine setup
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(methodOverride("_method"));

//URL encode  - Para que nos pueda llegar la información desde el formulario al req.body
app.use(express.urlencoded({ extended: false }));


app.use('/', indexRouter);
app.use(moviesRoutes);
app.use(genresRoutes);
app.use('/api',genresApiRoutes);
app.use('/api',moviesApiRoutes);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404, "Error, no se encontro la paguina"));
  });
  
  // error handler
  app.use(function(error, req, res, next) {
    return createResponseError(res, error)
  });


app.listen('3001', () => console.log('Servidor corriendo en el puerto 3001'));
