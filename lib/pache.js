let Pache = function (){
	let setting = require('../setting.json');

	this.version = require('../package.json').version;
	this.mongo = setting['mongo'];

	this.listingLimit = setting['listingLimit'];

	this.defaultTitle = setting['defaultTitle'];

	this.adminPassword = setting['adminPassword'];
};

module.exports = new Pache;
