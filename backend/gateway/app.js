var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Sequelize = require('sequelize');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(
  "mysql://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME + "",
  {
    dialect: 'mysql',
    logging: false,
  }
);

// Sync the database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api/v1');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors()); // Enable CORS

app.use('/', indexRouter);
app.use('/api/v1', apiRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

var port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log('Server is running on port', port);
});

module.exports = app;
