let setting = require('../setting.json'),
	mongoskin = require('mongoskin');


let db = mongoskin.db(setting.mongoUrl, {native_parse: setting['native_parse']});
db.bind(setting.mongoCollection);

let backCollect = () => db[setting.mongoCollection];

let data = {
	articleRow: [
		'title',
		'type',
		'article',
		'format',
		'tags',
		'categories',
		'time',
		'mod',
	],
	insertArticle(article, cb){
		let set = {};
		this.articleRow.forEach(row => {
			if (article[row] !== undefined){
				set[row] = article[row];
			}
		});
		backCollect().insert(set, (err, ret) => {
			if (err){
				console.error('insertArticle error.');
				throw new Error(err);
			}
			cb(ret);
		});
	},
	getArticles(cb, get, condition){
		backCollect().findItems(
			get,
			condition,
			(err, items) => {
				if (err){
					console.error('getArticles error.');
					throw new Error(err);
				}
				cb(items);
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
				}
				cb(items);
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
