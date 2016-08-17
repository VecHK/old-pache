let data = require('../model/data'),
	async = require('async');

let limit = 5;
let home = {
	page: 1,
	listing(req, res, next){
		home.setPage(req.params.pagecode);

		let
		get = {},
		condition = {
			sort: {time: -1},
			skip: (home.page - 1) * limit,
			limit,
		};
		if (req.tags.length){
			get.tags = {'$all': req.tags};
		}

		data.getArticles(items => {
			data.backCount(count => {
				res.render('home', {
					page: home.page,
					tags: req.tags,
					count,
					limit,
					items,
				});
			}, get);
		}, get, condition);
	},
	setPage(pagecode){
		if(pagecode){
			home.page = parseInt(pagecode);
		}else{
			home.page = 1;
		}
	},
	parseTags(tagsParams){
		let arr = [];
		if (tagsParams !== undefined){
			arr = tagsParams.split(',');
		}
		return arr;
	},
	fetchTag(req, res, next){
		req.tags = home.parseTags(req.params.tagArg);
		next();
	},
}

module.exports = home;
