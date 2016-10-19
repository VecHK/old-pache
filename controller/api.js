const utils = require('utility'),
	pache = require('../lib/pache.js'),
	data = require('../model/data');

let toObjectID = data.mongoskin.helper.toObjectID.bind(data.mongoskin.helper);

const api = {
	output(res, obj){
		res.end(JSON.stringify(obj));
	},
	checkUpdateArticleProperty(articleData){
		return data.articleRow.every(item => {
			return articleData[item] !== undefined;
		});
	},
	patchArticleById(id, patchContent, cb){
		let query = {
			_id: toObjectID(id),
		};
		if (typeof(patchContent.tags) === 'string' && !Array.isArray(patchContent.tags)) {
			patchContent.tags = patchContent.tags.replace(/ /g, '');
			if (patchContent.tags.length) {
				patchContent.tags = [patchContent.tags];
			} else {
				patchContent.tags = [];
			}
		}

		let patch = data.articleDataFilter.apply(data, [patchContent]);

		data.patch(query, patch, cb);
	},
	updateArticleById(id, upContent, cb){
		if (!this.checkUpdateArticleProperty(upContent)) {
			throw new Error('upContent 不完整');
		} else {
			let query = {
				_id: toObjectID(id),
			};

			let up = data.articleDataFilter.apply(data, [upContent]);

			if (!Array.isArray(up.tags)){
				up.tags = [up.tags];
			}

			data.patch(query, up, cb);
		}
	},
	deleteArticlesById(list, cb){
		let query = {};
		query._id = {
			'$in': list.map(toObjectID)
		};
		data.deleteArticles(cb, query, {});
	},
	/*
		过滤、填充允许缺省的项目以及检查文章的必填项
	*/
	filteAndFillAndCheckArticleProperty(article){
		article = data.articleDataFilter(article);

		if (!Array.isArray(article.tags)) {
			article.tags = [];
		}
		if (article.type === undefined || !article.article.length) {
			article.type = 'text';
		}

		return this.checkUpdateArticleProperty(article) ? article : false;
	},
	newArticle(articleData, callback){
		let filted = this.filteAndFillAndCheckArticleProperty(articleData);
		if (filted) {
			data.insertArticle(filted, callback);
		} else {
			let e = new Error('文章数据不完整');
			e.code = 1;
			e.status = 400;
			throw e;
		}
	},
	getArticles(info, callback){
		let offset = info.offset,
			limit = info.limit,
			tags = info.tags;
		let
		get = {},
		condition = {
			sort: {time: -1},
			skip: offset,
			limit: Number.isInteger(limit) ? limit : pache.listingLimit,
		};
		if (info.id) {
			get._id = data.mongoskin.helper.toObjectID(info.id);
		}
		if (Array.isArray(tags)) {
			get.tags = {'$all': tags};
		}

		data.getArticles(items => {
			data.backCount(count => {
				callback({
					count,
					items,
				});
			}, get);
		}, get, condition);
	},

};


module.exports = api;
