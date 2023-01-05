var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const proxy = require('express-http-proxy');
const { createProxyMiddleware } = require('http-proxy-middleware');

var app = express();
//在传输内容或者上传文件时，系统默认大小为100kb，这时，我们需要修改系统限制
//感谢 HC141221 兄弟 贡献 http://bbs.homecommunity.cn/pages/bbs/topic.html?topicId=102022101723500172
// 这里会影响文件上传
// var bodyParser = require('body-parser');
// app.use(bodyParser.json({
//     limit: '50mb'
// }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
        req.url = req.baseUrl + req.url;
        //console.log(1,req,res)
        return require('url').parse(req.url).path;
    },

}


app.use('/callComponent', proxy('http://127.0.0.1:8088', opts));
app.use('/app', proxy('http://127.0.0.1:8088', opts));
app.use('/ws', createProxyMiddleware({
    target: 'http://127.0.0.1:8008',
    changeOrigin: true,
    ws: true
}));


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