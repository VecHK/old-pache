let express = require('express');
let api = require('./api');
let router = express.Router();
let auth = require('../lib/auth');

let backOutput = (res, info) => {
	/* res.status(info.status || 200); */
	res.writeHead(info.status || 200, {
		"Content-Type": "text/plain",
	});
	return res.end(JSON.stringify(info));
};

let RESTful = new function (){
	this.articles = express.Router();
	this.articles.use((req, res, next) => {
		if (auth.isAuthed(req)){
			next();
		} else {
			backOutput(res, {
				code: 2,
				status: 403,
				msg: 'need auth',
			});
		}
	});
	this.articles.get('/offset/:offset/limit/:limit', (req, res, next) => {
		req.offset = parseInt(req.params.offset);
		req.limit = parseInt(req.params.limit);
		next();
	});
	this.articles.get('/*', (req, res, next) => {
		if (Number.isInteger(req.offset) && Number.isInteger(req.limit)) {
			api.getArticles({
				offset: req.offset,
				limit: req.limit,
			}, (result) => {
				backOutput(res, {
					code: 0,
					msg: 'ok',
					result: result,
				})
			});
		} else {
			backOutput(res, {
				code: 1,
				status: 400,
				msg: 'offset or limit is Not A Integer',
			});
		}
	});

	this.articles.post('/', (req, res, next) => {
		try {
			api.newArticle({
				title: req.body.title,
				type: req.body.type,
				article: req.body.article,
				tags: req.body['tags'],
			}, (result) => {
				backOutput(res, {
					code: 0,
					status: 200,
					msg: 'ok',
					result,
				});
			});
		} catch (e) {
			if (e.status === 400) {
				backOutput(res, {
					status: e.status,
					code: 1,
					msg: '文章数据不完整',
				});
			} else {
				outinfo.fail('newAritcle fail.');
				throw e;
			}
		}
	});

	this.articles.patch('/:id', (req, res, next) => {
		req.id = req.params.id;
		next();
	});
	this.articles.patch('/*', (req, res, next) => {
		if (req.id !== undefined) {
			api.patchArticleById(req.id, req.body, result => {
				backOutput(res, {
					code: 0,
					body: req.body,
					msg: 'ok',
					result,
				});
			});
		} else {
			backOutput(res, {
				code: 1,
				status: 400,
				body: req.body,
				msg: 'id no found',
			});
		}
	});

	this.articles.put('/:id', (req, res, next) => {
		req.id = req.params.id;
		next();
	});
	this.articles.put('/*', (req, res, next) => {
		if (req.id !== undefined) {
			try {
				api.updateArticleById(req.id, req.body, result => {
					backOutput(res, {
						code: 0,
						body: req.body,
						msg: 'ok',
						result,
					});
				});
			} catch (e){
				backOutput(res, {
					code: 1,
					status: 400,
					body: req.body,
					msg: 'articleData 不完整',
				});
			}
		} else {
			backOutput(res, {
				code: 1,
				status: 400,
				body: req.body,
				msg: 'id no found',
			});
		}
	});

	this.articles.delete('/*', (req, res, next) => {
		if (req.body.id !== undefined) {
			let idArr = Array.isArray(req.body.id) ? req.body.id : [req.body.id];
			api.deleteArticlesById(idArr, result => {
				backOutput(res, {
					code: 0,
					deleted: idArr,
					msg: 'ok',
					result,
				});
			});
		} else {
			backOutput(res, {
				code: 1,
				status: 400,
				msg: 'id no found',
			});
		}
	});


	/* this.articles.get('/:id'(req, res, next) => {

	});
	*/
	//this.articles.post();
	//this.articles.put();
	//this.articles.delete();
};

module.exports = RESTful;
