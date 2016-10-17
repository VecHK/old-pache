const utils = require('utility');
const pache = require('./pache');

const trueOrFalse = () => Math.round(Math.random()),
	backCode = () => 65 + Math.floor(Math.random() * 25),
	randomChar = (lower=0) => String.fromCharCode(backCode() + (lower && 32)),
	randomString = (length, lower=0) => randomChar(lower && trueOrFalse()) + (--length ? randomString(length, lower && trueOrFalse()) : '');

const codeCheck = (randomCode, authCode) => authCode === utils.md5(randomCode + pache.adminPassword);

/* 这里的方法都需要Express req参数 */
class Auth {
	/* 刷新哈希码 */
	refresh(req){
		req.session.randomCode = randomString(8, true);
		return req.session.randomCode;
	}
	tracert(req){
		outinfo.warn('auth result: ' + codeCheck(req.session.randomCode, req.body.pw || ''));
		outinfo.warn('session randomCode: ' + req.session.randomCode);
		outinfo.warn('input HashedPw', req.body.pw);
		outinfo.warn('pache adminpw: ', pache.adminPassword);
		outinfo.warn('true code: ', utils.md5(req.session.randomCode + pache.adminPassword));
	}
	login(req, hashedPw){
		if (codeCheck(req.session.randomCode, hashedPw || '')){
			req.session.admin = {
				passwd: hashedPw,
			};
			return true;
		} else {
			return false;
		}
	}
	isAuthed(req){
		if (req.session.admin !== undefined){
			return true;
		} else {
			return false;
		}
	}
	logout(req){
		req.session.admin === undefined;
		delete req.session.admin;
	}
	constructor(){
		Object.defineProperty(this, 'authed', {
			get(){
				if (this.session.admin !== undefined) {
					return true;
				} else {
					return false;
				}
			},
		});
	}
}
module.exports = new Auth;
