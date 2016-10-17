const utils = require('utility'),
	data = require('../model/data');

const setting = require('../setting.json');

const trueOrFalse = () => Math.round(Math.random()),
	backCode = () => 65 + Math.floor(Math.random() * 25),
	randomChar = (lower=0) => String.fromCharCode(backCode() + (lower && 32)),
	randomString = (length, lower=0) => randomChar(lower && trueOrFalse()) + (--length ? randomString(length, lower && trueOrFalse()) : '');

const auth = (randomString, authCode) => {
	console.log(randomString, utils.md5(randomString+setting.passwd), authCode);
	return authCode === utils.md5(randomString+setting.passwd);
};

const admin = {
	logined(req, res, next){
		res.render('admin/panel');
	},

	refresh(req, res, next){
		req.session.randomString = randomString(8, true);
		res.render('admin/login', {randomString: req.session.randomString});
	},

	login(req, res, next){
		if (req.session.admin) {
			admin.logined(req, res, next);
		} else {
			admin.refresh(req, res, next);
		}
	},

	auth(req, res, next){
		if (auth(req.session.randomString, req.body.passwd || '')){
			req.session.admin = {
				passwd: req.body.passwd,
			};
			res.end('logined');
		} else {
			res.end('passwd fail.');
		}
	},

	loginOut(req, res, next){
		delete req.session.admin;
		res.end('login-outed');
	}
};

module.exports = admin;
