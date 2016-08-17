let path = require('path'),
	data = require(path.join(__dirname, '../model/data')),
	outinfo = require(path.join(__dirname, '/outinfo')),
	mongoskin = require('mongoskin');

data.backCount(count => {
	data.count = count;
	outinfo.ok('articles count: ', count);
});

data.getCategories(distinct => {
	if (distinct.length){
		outinfo.ok(`have categories: `, distinct);
	}else{
		outinfo.warn(`no categories.`);
	}
});
