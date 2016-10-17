const pache = require('../setting.json');

let data = require('../model/data'),
	async = require('async');

const limit = pache.listingLimit;
let home = {
	limit: pache.listingLimit,
	listing(req, res, next){
		if (req.pagecode === undefined || Number.isNaN(req.pagecode)) {
			var page = 1;
		} else {
			var page = req.pagecode;
		}

		let
		get = {},
		condition = {
			sort: {time: -1},
			skip: (page - 1) * limit,
			limit,
		};
		if (req.tags !== undefined) {
			if (Array.isArray(req.tags) && req.tags.length) {
				get.tags = {'$all': req.tags};
			} else {
				get.tags = [];
			}
		}

		data.getArticles(items => {
			data.backCount(count => {
				res.render('home', {
					categories: pache.categories,
					tags: (function (){
						if (req.tags !== undefined) {
							if (Array.isArray(req.tags) && req.tags.length) {
								return req.tags;
							} else {
								return '';	//空标签
							}
						} else {
							return undefined;	//首页
						}
					})(),
					limit,
					page,
					count,
					items,
				});
			}, get);
		}, get, condition);
	},
	integerPage(pagecode){
		return parseInt(pagecode);
	},
	parseTags(tagsParams){
		let arr = [];
		if (tagsParams !== undefined) {
			tagsParams = tagsParams.replace(/ /g, '');

			arr = tagsParams.split(',');

			if (!arr[0].length) {
				outinfo.warn('isEmptyArray');
				arr = [];
			}
		}
		return arr;
	},
	fetchTag(req, res, next){
		req.tags = home.parseTags(req.params.tagArg);
		next();
	},
}

module.exports = home;
