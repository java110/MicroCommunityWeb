var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const proxy  = require('express-http-proxy');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// 反向代理（这里把需要进行反代的路径配置到这里即可）
let opts = {
  preserveHostHdr: true,
  reqAsBuffer: true,
//转发之前触发该方法
  proxyReqPathResolver: function(req, res) {
    //这个代理会把匹配到的url（下面的 ‘/api’等）去掉，转发过去直接404，这里手动加回来，
    req.url = req.baseUrl+req.url;
    console.log(1,req,res)
    return require('url').parse(req.url).path;
  },

}

app.use('/callComponent',proxy('http://192.168.0.104:8012',opts));
//app.listen(3000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
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
