let data = require('../model/data'),
	eventproxy = require('eventproxy');

let article = {
	backCategories(){
		data.categories;
	},
	setId(id){
		this.id = id;
	},
	get(req, res, next){
		let ep = new eventproxy;

		article.setId(req.params.id);
		data.getArticleById(article.id, item => {
			item = item || {
				title: '啊哦，出事了',
				article: `<div id="article-nofound">
				<div id="float" ><img class="floatimg" src="/img/articleNoFound.jpg"/></div>
				<ul>
					<li>文章因为一些不可抗力，boom了</li>
					<li>请求的文章可能是个未知数，提供不能orz</li>
					<li>也许这是一个bug</li>
				</ul>
				</div>`,
				type: 'html',
				tags: [],
			};
			res.render('article', {article: item});
		});
	},
	fail(req, res, next){
		res.send('好像找不到文章的样子');
	},
};

module.exports = article;
