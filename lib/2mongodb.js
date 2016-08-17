let eventproxy = require('eventproxy'),
	data = require('../model/data'),
	async = require('async');

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
			data.insertArticle({
				title: article.title,
				type: article.type,
				article: article.article,
				format: article.format,
				tags: article.tags,
				time: article.time,
				mod: article.ltime,
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
