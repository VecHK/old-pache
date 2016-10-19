const pache = require('./setting.json');

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
	home = require('./controller/home'),
	admin = require('./controller/admin')
;

let app = express();

let init = require('./lib/init');

init.initList.push(function setViews(cbObj){
	// view engine setup
	app.set('views', path.join(__dirname, 'view'));
	app.set('view engine', 'ejs');
	cbObj.ok('已应用ejs模板引擎至Express');
});
init.initList.push(function dev(cbObj){
	// uncomment after placing your favicon in /public
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use(logger('dev'));
	cbObj.ok('已启用日志');
});
init.initList.push(function bodyAndCookie(cbObj){
	try {
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));

		app.use(cookieParser());
		cbObj.ok('bodyParser、cookie 已应用');
	} catch (e) {
		console.error(e);
		cbObj.fail('bodyParser、cookie 应用出错！');
	}
});
init.initList.push(function requestInit(cbObj){
	let redisHandle = new RedisStore({
		client: redis.createClient(6379, '127.0.0.1'),
		ttl: 3600 * 72,
		db: 2,
		prefix: 'pache-session:',
	});
	let sessinHandle = session({
		secret: '困惑的人不清醒',
		cookie: {domain: 'localhost'},
		key: 'express-session',
		resave: false,
		saveUninitialized: false,
		store: redisHandle,
	});
	app.use(sessinHandle);
	cbObj.ok('Redis、session应用成功');
});

init.go(function (){
	/* 静态文件位置 */
	app.use(express.static(path.join(__dirname, 'static')));
	app.use('/img', express.static(path.join(__dirname, 'static/img')));
	app.use('/article/img', express.static(path.join(__dirname, 'static/img')));
	app.use('/article/', express.static(path.join(__dirname, 'static')));
	app.use('/article/:id', article.get);

	app.use('/tags/', (req, res, next) => {
		if (req.tags === undefined) {
			req.tags = [];
		}
		next();
	});
	app.use('/tag/:tagArg', home.fetchTag);
	app.use('/tags/:tagArg', home.fetchTag);


	app.use('/tags/:tagArg/:pagecode', home.listing);
	app.use('/tags/:tagArg/', home.listing);

	app.use('/notags/:pagecode', (req, res, next) => {
		req.pagecode = parseInt(req.params.pagecode);
		req.tags = '';
		next();
	});
	app.get('/notags/', (req, res, next) => {
		req.pagecode = parseInt(req.params.pagecode);
		req.tags = '';
		home.listing(req, res, next);
	});
	app.get('/notags/*', (req, res, next) => {
		home.listing(req, res, next);
	});

	let login = require('./controller/login.js');
	let RESTful = require('./controller/restful.js');

	app.use('/auth', login.auth);
	app.use('/api/articles', RESTful.articles);
	app.use('/:pagecode', (req, res, next) => {
		req.pagecode = parseInt(req.params.pagecode);
		home.listing(req, res, next);
	});
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
});

module.exports = app;
