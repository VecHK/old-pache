var $$ = function (sel, ele) {
	ele = ele || document;
	return Array.prototype.slice.call(ele.querySelectorAll(sel));
};
var $ = function (sel, ele){
	ele = ele || document;
	return ele.querySelector(sel);
};

const
parseJSON = (str) => JSON.parse(str)
fill = num => ((num / 10 < 1) ? '0' : 0) + num,
toStr = (t, s) => t.map(fill).join(s),
toSummaryTime = d => {
	let date = [
		d.getFullYear(),
		d.getMonth() + 1,
		d.getDate(),
	];
	let time = [
		d.getUTCHours(),
		d.getMinutes(),
		d.getSeconds(),
	];

	return toStr(date, '/') + ' ' + toStr(time, ':');
};
let rmEle = (arr, item, result = arr.indexOf(item)) => (result >= 0) && arr.splice(result, 1) && rmEle(arr, item);

function fadeIn(ele, cb, time) {
	time = time || 618;

	ele.style.opacity = 0;
	ele.style.transition = 'opacity '+ time +'ms';
	ele.style.webkitTransition = 'opacity '+ time +'ms';

	ele.style.display = '';
	ele.style.display = getComputedStyle(ele, null).getPropertyValue('display');

	setTimeout(function (){
		ele.style.opacity = 1;
		setTimeout(function (){
			cb && cb();
		}, time);
	}, 16.8);
}
function fadeOut(ele, cb, time) {
	time = time || 618;

	ele.style.opacity = 1;
	ele.style.transition = 'opacity '+ time +'ms';
	ele.style.webkitTransition = 'opacity '+ time +'ms';

	setTimeout(function (){
		ele.style.opacity = 0;
		setTimeout(function (){
			ele.style.display = 'none';
			console.warn(cb);
			cb && cb();
		}, time);
	}, 16.8);
}
function isArray(Arr){
	return Array.isArray(Arr);
}

let rjax = (() => {
	var stringifyRequest = (function (){
		const backValueKey = (key, value) => `${key}=` + encodeURIComponent(value);
		const stringifyArray = (key, arr) => arr.length ? arr.map(item => backValueKey(key, item)).join('&') : backValueKey(key, '');
		const fetcher = (data, key) => Array.isArray(data[key]) ? stringifyArray(key, data[key]) : backValueKey(key, data[key]);
		return data => Object.keys(data).map(key => fetcher(data, key)).join('&');
	})();
	return (url, args) => {
		const xhr = new XMLHttpRequest;

		xhr.onloadend = () => {
			args.success && args.success(xhr.responseText, xhr.status, xhr);
		};
		if (args.method === undefined) {
			throw new Error('请求方法未指定');
		}

		xhr.open(args.method.toUpperCase(), url, true);
		if (args.data !== undefined) {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			if (typeof args.data === 'object') {
				let formated = stringifyRequest(args.data);
				xhr.send(formated);
			} else {
				xhr.send(args.data);
			}
		} else {
			xhr.send();
		}
	};
})();

let removeElement = (ele) => {
	let parent = ele.parentNode;
	if (parent) {
		parent.removeChild(ele);
	}
};
