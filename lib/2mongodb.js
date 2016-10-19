let eventproxy = require('eventproxy'),
	async = require('async'),
	data = require('../model/data'),
	api = require('../controller/api.js');

let toMongodb = {
	fetchId(id, tags){
		for (let tag of tags){
			if (tag.articleid === id){
				return tag;
			}
		}
		return null;
	},
	setTag(article, tag){
		if (article.tags === undefined){
			article.tags = [];
		}
		article.tags.push(tag);
	},
	addTags(tags, article){
		if (article.tags === undefined){
			article.tags = [];
		}
		tags.forEach(field => {
			(field.articleid === article.id) && article.tags.push(field.tagname);
		});
	},
	toMongoDB(tags, articles){
		let count = 0;
		articles.forEach(article => {
			this.addTags(tags, article);
		});

		async.mapLimit(articles, 1, (article, cb) => {
			data.insertData({
				title: article.title,
				type: article.type,
				article: article.article,
				format: data.formatArticle(article.type, article.article),
				tags: article.tags,
				time: new Date(article.time),
				mod: new Date(article.ltime),
			}, (ok) => {
				++count;
				console.log(`inserted. article=${article.title}`);
				cb(null, {article, ok});
			});
		}, (err, result) => {
			console.log(`All done.(${count})`);
			process.exit(0);
		});
	}
};

module.exports = toMongodb;
