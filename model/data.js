const pache = require('../lib/pache.js'),
	cheerio = require('cheerio'),
	HyperDown = require('../static/Parser.js'),
	markdownParser = new HyperDown;

let setting = pache.mongo,
	mongoskin = require('mongoskin');

let db = mongoskin.db(setting.mongoUrl, {native_parse: setting['native_parse']});
db.bind(setting.mongoCollection);

let collection = db[setting.mongoCollection];
let backCollect = () => db[setting.mongoCollection];

let data = {
	mongoskin,
	articleRow: [
		'title',
		'type',
		'article',
		'tags',
	],
	articleDataFilter(articleData){
		let set = {};
		this.articleRow.forEach(row => {
			if (articleData[row] !== undefined){
				set[row] = articleData[row];
			}
		});
		return set;
	},
	backHTML(article) {
		return article;
	},
	backMarkdown(article) {
		return markdownParser.makeHtml(article);
	},
	/*
		XXX ejs也是可以处理纯文本，但是每次输出都这样恐怕吃不消
	*/
	backText(article) {
		let brArticle = article.replace(/\n/g, '<br />\n');
		const $ = cheerio.load(brArticle);
		return $.html();
	},
	formatArticle(type, article) {
		type = type.toLowerCase();
		if (type === 'html') {
			return this.backHTML(article);
		} else if (type === 'markdown') {
			return this.backMarkdown(article);
		} else if (type === 'text') {
			return this.backText(article);
		} else {
			return this.backText(article);
		}
	},
	patch(query, patch, cb){
		let set = this.articleDataFilter(patch);
		set.mod = new Date;
		if (set.type !== undefined && set.article !== undefined) {
			set.format = this.formatArticle(set.type, set.article);
		}
		collection.update(query, {'$set': set}, (err, result) => {
			if (err) {
				outinfo.fail('data.patch Error.', query, upModel);
				throw err;
			} else {
				cb(result);
			}
		})
	},
	updateArticle(query, upModel, cb){
		upModel.time = new Date;
		upModel.mod = new Date;
		collection.update(query, upModel, (err, result) => {
			if (err) {
				console.error('upArticle Error.', query, upModel);
				throw err;
			} else {
				cb(result);
			}
		});
	},
	deleteArticles(cb, query, condition){
		backCollect().remove(
			query,
			condition,
			(err, result) => {
				if (err) {
					console.error('deleteArticles error.', query, condition);
					throw new Error(err);
				} else {
					cb(result);
				}
			}
		);
	},
	insertArticle(articleData, cb){
		let set = this.articleDataFilter(articleData);

		set.format = this.formatArticle(set.type, set.article);
		set.time = new Date();
		set.mod = new Date();

		backCollect().insert(set, (err, ret) => {
			if (err) {
				outinfo.fail('insertArticle error.');
				throw new Error(err);
			} else {
				cb(ret);
			}
		});
	},
	getArticles(cb, get, condition){
		backCollect().findItems(
			get,
			condition,
			(err, items) => {
				if (err) {
					console.error('getArticles error.', get, condition);
					throw new Error(err);
				} else {
					cb(items);
				}
			}
		);
	},
	getArticle(cb, get){
		backCollect().findOne(
			get,
			(err, items) => {
				if (err){
					console.error('getArticles error.');
					throw new Error(err);
				} else {
					cb(items);
				}
			}
		);
	},
	getArticleById(id, cb){
		this.getArticle(cb, {
			_id: mongoskin.helper.toObjectID(id)
		});
	},
	listingArticlesByTime(cb, page, limit){
		this.getArticles(items => {
			cb(items);
		}, {},
		{
			sort: {time: -1},
			skip: page*limit,
			limit,
		});
	},
	backCount(cb, get){
		get = get || {};
		backCollect().count(get, (err, count) => {
			if (err){
				console.error('backCount error.');
				throw new Error(err);
				process.exit(0);
			}
			cb(count);
		});
	},
	distinct(row, cb){
		backCollect().distinct(row, (err, count) => {
			if (err){
				console.error('distinct error.');
				throw new Error(err);
				process.exit(0);
			}
			cb(count);
		});
	},
	getCategories(cb){
		this.distinct('categories', cb);
	},

};

module.exports = data;
