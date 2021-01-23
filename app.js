var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');

var indexRouter = require('./routes/index');

var app = express();

var schedule_aripaev = require('./service/aripaev-podcast')

app.engine('.hbs', exphbs({
    defaultLayout: 'aripaev',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views')
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

schedule_aripaev()

module.exports = app;
