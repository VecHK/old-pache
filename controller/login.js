let express = require('express');
let api = require('./api');
let router = express.Router();
let auth = require('../lib/auth');

let backOutput = (res, info) => {
	/* res.status(info.status || 200); */
	info.code = info.code || 0;
	res.writeHead(info.status || 200, {
		"Content-Type": "text/plain",
	});
	return res.end(JSON.stringify(info));
};

let Login = new function (){
	this.auth = express.Router();
	/*
	this.auth.use((req, res, next) => {
		auth.tracert(req);
		next();
	});
	*/

	/* 查看登录状态 */
	this.auth.get('/', (req, res, next) => {
		backOutput(res, auth.isAuthed(req));
	});

	/* 获取随机码 */
	this.auth.propfind('/', (req, res, next) => {
		res.end(auth.refresh(req));
	});

	/* 登陆验证 */
	this.auth.post('/', (req, res, next) => {
		let requestPasswd = req.body.pw;
		if (requestPasswd !== undefined && auth.login(req, requestPasswd)) {
			backOutput(res, {
				code: 0,
				result: true,
				msg: 'ok',
			});
		} else {
			backOutput(res, {
				code: 1,
				status: 400,
				result: false,
				msg: 'password fail',
			});
		}
	});

	/* 登出 */
	this.auth.get('/logout', (req, res, next) => {
		backOutput(res, {
			result: auth.logout(req)
		});
	});
};

module.exports = Login;
