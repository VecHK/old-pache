var Remilia = function() {
	console.info('永远鲜红的幼月 v0.21');
} ();

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
		this.getRequest = function() {
			/* thanks jiekk:  http://www.cnblogs.com/jiekk/archive/2011/06/28/2092444.html */
			function getStrRequest(str){
				return str.split('?')[1];
			}
			var name = arguments[0];
			var request = window.location.search.substr(1);
			if ( arguments[1] !== undefined ){
				request = getStrRequest(arguments[0]);
				name = arguments[1];
			}
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = request.match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		};
		this.stringifyRequest = function (requestObj){
			function isArray(Arr){
				return Array.isArray(Arr);
			}
			function stringifyArray(key){
				var arr = this[key];
				var str = '' ;
				for ( var i=0; i<arr.length; ++i ){
					str += key + '[]=' + this[key][i] + '&';
				}
				return str;
			}
			function strSubLast(str){
				return str.substr(0, str.length-1);
			}
			function stringify(obj, keys){
				return isArray(obj[keys[0]]) ?
				stringifyArray.apply(obj, [keys.shift()]) :
				keys[0] + '=' + encodeURIComponent( obj[keys.shift()] ) + '&';
			}
			function objKeysMap(postObj, objKeys){
					return objKeys.length ? stringify(postObj, objKeys) + arguments.callee(postObj, objKeys) : '';
			}
			return strSubLast( objKeysMap( requestObj, Object.keys(requestObj) ));
		};
		this.vjax = function(URL, method, pgdata, callback, fail) {
			method = method.toLowerCase();

			if (window.XMLHttpRequest)
				var vj = new XMLHttpRequest();

			vj.onreadystatechange = function() {
				if (vj.readyState == 4 && vj.status == 200) {
					if (method === 'get') {
						pgdata(vj.responseText, status);
					} else if (method === 'post') {
						callback && callback(vj.responseText, status);
					}
				} else if ( vj.readyState === 500 && vj.status === 404 && vj.readyState === 403){
					fail && fail(status);
				}
			};
			if ( method.toLowerCase() === 'post' ) {
				console.warn('!!');
				vj.open("POST", URL, true);
				vj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

				if ( typeof pgdata === 'object' ){
					if ( new RegExp(/\?/).test(URL) ){
						vj.send( this.stringifyRequest(pgdata) );
					}else{
						vj.send( this.stringifyRequest(pgdata) );
					}
				}else{
					vj.send( pgdata );
				}
			} else if (method.toLowerCase() === 'get') {
				vj.open("GET", URL, true);
				vj.send();
			} else {
				throw new Error('Method is empty!')
			}
		};
		this.post = function (URLstr, obj, ok, fail){
			this.vjax(URLstr, 'POST', obj, ok, fail);
		};
		this.get = function (URLstr, ok, fail){
			this.vjax(URLstr, 'GET', ok, fail);
		};
		this.json2obj = function (jsonStr, ok, fail){
			try{
				var obj = JSON.parse(jsonStr);
			}catch(e){
				fail && fail(e, jsonStr);
				return null;
			}
			ok && ok(obj);
			return obj;
		};
		this.sendJSON = function(URL, jsonStr, ok, fail) {
			if ( typeof jsonStr !== 'string' ){
					jsonStr = JSON.stringify(jsonStr);
			}
			console.info(jsonStr);
			this.post(URL, 'json='+jsonStr, ok, fail);
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
		this.myCheckObj = function (){
			Object.prototype.myCheckObj = function (){
				var keys = Array.prototype.slice.apply(arguments);
				/* obj */
				if ( keys.length === 1 && typeof keys[0] === 'object' && !Array.isArray(keys[0]) ){
					var obj = keys[0];
					var keys = Object.keys(keys[0]);
					for ( var i=0; i<keys.length; ++i ){
						if ( typeof this[keys[i]] !== obj[keys[i]] ){
							return false;
						}
					}
				}
				for ( var i=0; i<keys.length; ++i ){
					if ( this[keys[i]] === undefined ){
						return false;
					}
				}
				return true;
			};
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
