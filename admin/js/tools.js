var $$ = function (sel, ele) {
	ele = ele || document;
	return Array.prototype.slice.call(ele.querySelectorAll(sel));
};
var $ = function (sel, ele){
	ele = ele || document;
	return ele.querySelector(sel);
};

function fadeIn(ele, cb, time) {
	time = time || 618;

	ele.style.opacity = 0;
	ele.style.transition = 'opacity '+ time +'ms';

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

	setTimeout(function (){
		ele.style.opacity = 0;
		setTimeout(function (){
			ele.style.display = 'none';
			console.warn(cb);
			cb && cb();
		}, time);
	}, 16.8);
}
