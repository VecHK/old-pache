let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');

let cookieParser = require('cookie-parser');
let session = require('express-session');
let bodyParser = require('body-parser');

let RedisStore = require('connect-redis')(session);
let redis = require('redis');

let article = require('./controller/article'),
	home = require('./controller/home');

let init = require('./lib/init');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

/* 静态文件位置 */
app.use(express.static(path.join(__dirname, 'static')));

app.use('/article/img', express.static(path.join(__dirname, 'static/img')));

app.use('/article/:id', article.get);

app.use('/tag/:tagArg', home.fetchTag);
app.use('/tags/:tagArg', home.fetchTag);

app.use('/tags/:tagArg/:pagecode', home.listing);
app.use('/tags/:tagArg/', home.listing);

app.use('/:pagecode', home.listing);
app.get('/', home.listing);

// 404
app.use(function(req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// 检查express是否开发者环境，是的话将输出错误信息在响应中
// 据说取消开发者模式会带来性能提升
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// 错误
// 并不会输出错误信息在响应里
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
