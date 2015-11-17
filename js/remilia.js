var Remilia = function() {
	console.info('永远鲜红的幼月 v0.11');
} ();

var vjax = function(URL, method, pgdata, callback, fail) {
	method = method.toLowerCase();

	if (window.XMLHttpRequest) var vj = new XMLHttpRequest();

	vj.onreadystatechange = function() {
		if (vj.readyState == 4 && vj.status == 200) {
			if (method === 'get') {
				pgdata(vj.responseText, status);
			} else if (method === 'post') {
				callback(vj.responseText, status);
			}
		} else {
			fail && fail(status);
		}
	};
	if ( method.toLowerCase() === 'post' ) {
		console.warn('!!');
		vj.open("POST", URL, true);
		vj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

		if ( new RegExp(/\?/).test(URL) ){
			console.info('have ?');
			console.info(stringifyPostRequest(pgdata, '?'));
			console.info(Object.keys(pgdata));
			if ( typeof pgdata === 'object' ){
				console.info(stringifyPostRequest(pgdata, '?').length);
				vj.send( stringifyPostRequest(pgdata, '?') );
			}else{
				console.info('no object');
				console.error(pgdata);
				vj.send( pgdata );
			}
		}else{
			console.info('no ?');

			vj.send(pgdata);
		}
		console.warn('POST');

	} else if (method.toLowerCase() === 'get') {
		vj.open("GET", URL, true);
		vj.send();
	} else {
		console.error('Method is empty!')
	}
};

var getRequest = function(name) {
	/* thanks jiekk:  http://www.cnblogs.com/jiekk/archive/2011/06/28/2092444.html */
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

var getRequest = function(name) {
	/* thanks jiekk:  http://www.cnblogs.com/jiekk/archive/2011/06/28/2092444.html */
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
};

var myTransition = function(ele, css, time, callback) {
	var browserPrefix = ['-moz-', '-webkit-', ''];
	var transitionEnd = ['webkitTransitionEnd', 'transitionend', 'TransitionEnd'];
	var cssstr = '';
	var callbackok = false;

	Object.keys(css).forEach(function(d) {
		cssstr += d + ' ' + time + 's,';
	});
	cssstr = cssstr.substr(0, cssstr.length - 1);

/*	setTimeout(callback, time*1000);*/


	transitionEnd.forEach(function (d){
		ele.addEventListener(d, function (){
			callbackok || callback(ele);
			callbackok = true;
		});
	});

	browserPrefix.forEach(function(b) {
		ele.style[b + 'transition'] = cssstr;
	});

	Object.keys(css).forEach(function(d) {
		ele.style[d] = css[d];
	});

	return ele;
};
var myTransitionEvent = function(ele, css, time, callback){
	var browserPrefix = ['-moz-', '-webkit-', ''];
	var transitionEnd = ['webkitTransitionEnd', 'transitionend', 'TransitionEnd'];
	var cssstr = '';
	var callbackok = false;

	css.forEach(function(d) {
		cssstr += d + ' ' + time + 's,';
	});
	cssstr = cssstr.substr(0, cssstr.length - 1);

	function cb(){
		callbackok || callback(ele);
		callbackok = true;
	}

	setTimeout(cb, time*1000);

	transitionEnd.forEach(function (d){
		ele.addEventListener(d, function (){
			cb();
		});
	});

	browserPrefix.forEach(function(b) {
		ele.style[b + 'transition'] = cssstr;
	});

	return ele;
};

var myImg = function (ele, action){
	ele.style.display = 'block';
	ele.myImgAction = action;
	ele.changeSrc = function (src){
		this.myAnimated = function (callback){
			myTransitionEvent(
				ele,
				[
					'opacity'
				],
				0.618,
				callback
			);
		};

		var _changeSrc = function (){

			ele.src = src;

			ele.onload = function (d){
				this.myAnimated(function (){
					action.ok && action.ok();
				});
				this['style'].opacity = 1;
			};
		};
		this.myAnimated(_changeSrc);

		ele['style'].opacity = 0;

		ele.onerror = function (d){
			action.fail && action.fail(d);
		};
	};

};

var SS = (function (){
	var myMethod = function (){
		this.vjax = function(URL, method, pgdata, callback, fail) {
			method = method.toLowerCase();

			if (window.XMLHttpRequest)
				var vj = new XMLHttpRequest();

			vj.onreadystatechange = function() {
				if (vj.readyState == 4 && vj.status == 200) {
					if (method === 'get') {
						pgdata(vj.responseText, status);
					} else if (method === 'post') {
						callback(vj.responseText, status);
					}
				} else {
					fail && fail(status);
				}
			};
			if ( method.toLowerCase() === 'post' ) {
				console.warn('!!');
				vj.open("POST", URL, true);
				vj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

				if ( new RegExp(/\?/).test(URL) ){
					console.info('have ?');
					console.info(stringifyPostRequest(pgdata, '?'));
					console.info(Object.keys(pgdata));
					if ( typeof pgdata === 'object' ){
						console.info(stringifyPostRequest(pgdata, '?').length);
						vj.send( stringifyPostRequest(pgdata, '?') );
					}else{
						console.info('no object');
						console.error(pgdata);
						vj.send( pgdata );
					}
				}else{
					console.info('no ?');

					vj.send(pgdata);
				}
			} else if (method.toLowerCase() === 'get') {
				vj.open("GET", URL, true);
				vj.send();
			} else {
				console.error('Method is empty!')
			}

		};
		this.sendJSON = function(URL, obj, callback) {
			/*	console.warn(encodeURIComponent('json='+json));*/
			this.vjax(URL, 'POST', 'json=' + obj,
				function(d, s) {
					callback(d, s);
				});
		};
		this.getRequest = function(name) {
			/* thanks jiekk:  http://www.cnblogs.com/jiekk/archive/2011/06/28/2092444.html */
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		};
		this.listingStyleSheet = function(s, callback, end) {
			for (var i = 0; i < document.styleSheets.length; ++i) {
				var cssRules = document.styleSheets[i].rules;
				for (var ii = 0; ii < cssRules.length; ++ii)
					if (new RegExp(',').test(cssRules[ii].selectorText))
						cssRules[ii].selectorText.replace(/\s/g, '').split(',').forEach(
							function(d, iii) {
								if (d === s)
									callback && callback(cssRules[ii], i, ii);
							}
						);
					else
						if (cssRules[ii].selectorText === s){
							callback && callback(cssRules[ii], i, ii);
						}
			}
			return end === undefined ? undefined : end();
		};
		this.stringifyPostRequest = function (){
			return function (postObj){
				return function (str){
					return str.substr(0, str.length-1);
				}( function (objKeys){
					return objKeys.length ?
						(function (){
							return objKeys[0] + '=' + encodeURIComponent( (
								function (obj, key){
									return obj[key];
								}
								)(postObj, objKeys.shift())
							) + '&';
						})()
						+ arguments.callee(objKeys)
						: '';
				}( Object.keys(postObj)) );
			}(arguments[0]);
		};
	};
	var domMethod = function (ele){
		var interArguments = arguments;

		var domArguments = arguments;
		var lthis = this;
		this.toHTML= function (str){
			var ff = f;
			domArguments.callee.apply(ff,[]);
			if ( str === undefined )
				return lthis[0].innerHTML;
			else
				return function (){
					lthis[0].innerHTML = str;
					console.warn(lthis[0].innerHTML );
					var iHTML = lthis[0].innerHTML;

					return ff;
				}();
		};

		this.SS = f;
		this.$ = f;
	};
	function f(s){
		var dom = document.querySelectorAll(s);
		domMethod.apply(dom,[dom]);
		return dom;
	};
	myMethod.apply(f, []);
	return f;
})();
if ( $ === undefined ){
	var $ = SS;
}

var o = {};for( var i=0; i<9999; ++i ){ o[i] = i; }

function bechMark(testCount, count, func, canshu){
	var testUnitArr = [];
	var start = performance.now();
	function testUnit(count, func, canshu){
		this.start = performance.now();

		for ( var i=0; i<count; ++i )
			func.apply(null, canshu);

		this.end = performance.now();
		this.interval = this.end - this.start;
	}

	for ( var i=0; i<testCount; ++i )
		testUnitArr.push( new testUnit(count, func, canshu) );

	var end = performance.now();
	var totalTime = end - start;

	var he = 0;
	testUnitArr.forEach(function (d,i){
		he += d.interval;
	});
	return {
		'totalTime': totalTime,
		'unit': testUnitArr,
		'average': he/testUnitArr.length
	}
}

var stringifyPostRequest = function (obj, p){
	var keys = Object.keys(obj);
	var str = '';

	for (var i=0; i<keys.length; ++i){
		str += keys[i] + '=' + encodeURIComponent(obj[keys[i]]) + '&';
	}

	return str.substr(0,str.length- 1 );
};

var testArr = [];
for ( var i=0; i<9999; ++i ) testArr[i] = i;


var straddFunctional = function (){
	return function (a){
		return a.length ? String(a.shift()) + arguments.callee(a) : '';
	}(Array.prototype.slice.call(arguments));
};
var stradd = function (){
	var str = '';
	for(var i=0; i<arguments.length; i++){
		str += String(arguments[i]);
	}
	return str;
};

var straddFunctionalArray = function (a){
	return function (a){
		return a.length ? String(a.shift()) + arguments.callee(a) : '';
	}(a);
};
var straddArray = function (a){
	var str = '';
	for(var i=0; i<a.length; i++){
		str += String(a[i]);
	}
	return str;
};
