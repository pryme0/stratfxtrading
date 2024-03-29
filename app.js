var createError = require('http-errors');
const fileUpload = require('express-fileupload');
var express = require('express');
var path = require('path');
const mongoose = require('mongoose')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config= require('./config/index')
const bodyParser = require('body-parser');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());
//connect mongodb
mongoose.connect(config.mongodb.dsn, config.mongodb.options).then((con) => {
  console.log('MongoDb connected successfully');
}).catch((error) => {
  console.log(error)
  console.log(`${error} app----`);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(fileUpload());
// app.use(fileUpload({
//   limits: { fileSize: 50 * 1024 * 1024 },
// }))
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
