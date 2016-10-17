let path = require('path'),
	data = require(path.join(__dirname, '../model/data')),
	outinfo = require(path.join(__dirname, '/outinfo')),
	mongoskin = require('mongoskin'),
	Eventproxy = require('eventproxy');

let ep = new Eventproxy;

function forEachAsync(arr, func, allDone){
	let cursor = 0;
	let next = function (){
		if (cursor < arr.length) {
			++cursor;
			func(next, arr[cursor - 1], cursor - 1, arr);
		} else {
			allDone && allDone(arr, cursor);
		}
	};
	next();
}

let initList = [
	function backCount(cbObj){
		data.backCount(count => {
			data.count = count;
			cbObj.ok('文章计数: ', count);
		});
	}
];

let initDone = 0;
class Init {
	go(allDone){
		forEachAsync(this.initList, (next, initFunc) => {
			initFunc({
				ok(){
					outinfo.ok.apply(outinfo, arguments);
					++initDone;
					next();
				},
				warn(){
					outinfo.warn.apply(outinfo, arguments);
					next();
				},
				fail(msg, err){
					outinfo.fail(msg);
					throw err;
					process.exit(-1);
				},
			});
		}, function (arr, length){
			outinfo.ok(`${initDone} 项初始化操作完成`);
			allDone(arr, length);
		});
	}
	constructor(){
		/*
		ep.after('init', this.initList.length, function (info){
			outinfo.ok("Pache 初始化完成");
		});
		*/
	}
}
Init.prototype.initList = initList;

module.exports = new Init;
