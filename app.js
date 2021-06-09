require('dotenv').config()
global.__basedir = __dirname;
var  express = require('express'),
    path = require('path'),
    cors = require('cors'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cron = require('node-cron'),
    mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mongouser:bdpcubVmJqy17whM@cluster0.k5nfc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).then(function(e){
  }).catch(err=>{
    console.log(err);
  });
mongoose.set('debug',true);
mongoose.Promise = global.Promise;
global.baseDir = path.resolve(__dirname);
let app = express();
//passport intialization
let passport = require('passport');
require('./config/passport')(passport); 
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

//cron job
let crons = require('./controllers/Admin/analy');
cron.schedule('0 * * * *',crons.calculatePopularCategoryAndTag);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));


/**
 * Server Routes
 */

app.get('/', function(req, res) {
    res.render('index');
});

// Calling routes
let api = require('./routes/api');
let adminApi  = require('./routes/adminApi');
// Using routes
app.use('/api',api);
app.use('/api/admin',adminApi);

/**
 * End Server Routes
 */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
