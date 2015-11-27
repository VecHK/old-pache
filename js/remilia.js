var Remilia = function() {
	console.info('永远鲜红的幼月 v0.25');
}();

var innerText = function (ele, str){
	if (str===undefined){
		return ele.textContent || ele.innerText;
	}else{
		ele.textContent ? (ele.innerText = str) : ( ele.textContent = str );
	}
};

var SS = (function (win, doc){
	var myMethod = function (){
		var my = this;
		this.localStorage = function (){
			if ( !win.localStorage ){
				console.warn('this Browser cannot support localStorage.');
				return ;
			}
			var localStorageMethod = function (){
				var my = this;
				this.getlength = function (){
					return localStorage.length
				};
				this.each = function (callback){
					function createObj(key, value){
						this[key] = value;
					}
					this.toKeyArray().forEach(function (d, i){
						callback(
							new createObj(d, my.get(d)),
							d,
							i
						);
					});
				};
				this.rm = function (key){
					return localStorage.removeItem(key);
				};
				this.clear = function (){
					return localStorage.clear();
				};
				this.key = function (i){
					return localStorage.key(i);
				};
				this.set = function (key, value){
					this.rm(key);
					return localStorage.setItem(key, value);
				};
				this.get = function (key){
					return localStorage.getItem(key);
				};
				this.listen = function (callback){
					if(win.addEventListener){
						win.addEventListener("storage",callback,false);
					}else if(win.attachEvent){
						win.attachEvent("onstorage",callback);
					}
				};
				this.rmlisten = function (){};
				this.toKeyArray = function (){
					var arr = [];
					var value;
					for (var i=0; i<this.getlength(); ++i){
						value = this.key(i);
						value !== null && arr.push(value);
					}
					return arr;
				};
				this.toObj = function (){
					if (!(this instanceof arguments.callee)) {
						return new arguments.callee();
					}
					var keyArr = my.toKeyArray();
					for ( var i=0; i<keyArr.length; i++ ){
						this[keyArr[i]] = my.get(keyArr[i]);
					}
				};
			};
			var ls = function (){
				function type(obj){
					return typeof obj;
				}
				var lthis = this;
				var my = arguments.callee;
				var handle = {
					'set': function (obj){
						var keys = Object.keys(obj);
						for ( var i=0; i<keys.length; i++ ){
							my.set(keys[i], obj[keys[i]]);
						}
					},
					'get': function (key){
						win.localStorage.getItem(key);
					}
				};
				var first = arguments[0];
				switch(type(first)){
					case 'object':
						handle.set(first);
						break;
					case 'string':
						if ( type(arguments[1]) !== 'undefined' ){
							return my.set(first, arguments[1]);
						}else{
							return my.get(first);
						}
						break;
					default:

				}
			};
			localStorageMethod.apply(ls);
			return ls;
		}();
		this.ls = this.localStorage;
		this.cookie = function (){
			var my = this;
			var cookieMethod = function (){
				this.parse = function (){
					if (!(this instanceof arguments.callee)) {
						return new arguments.callee();
					}
					var obj = this;
					var rawArr = cookieF.arguments.callee().replace(/ /g, '').split(';');
					function pRaw(item){
						var keyObjArr = item.split('=');
						obj[keyObjArr[0]] = decodeURIComponent(keyObjArr[1]);
					}
					rawArr.forEach(pRaw);
					return obj;
				};
				this.stringify = function(){
					var obj = this.parse();
					var str = '';
					for (var key in obj){
						str += key + '=' + encodeURIComponent(obj[key]) + '; ';
					}
					return str.substr(0, str.length-2);
				};
				this.set = function (key, value, time){
					var set = new Date();
					set.setDate( set.getDate() + time );
					doc.cookie = key + ' = ' + escape(value) + ((time !== undefined) ? ';expires='+exdate.toGMTString() : '');
				};
				this.empty = function (key){
					this.setCookie(key, '');
				};
				this.remove = function (){};

			};
			var cookieF = function(){
				if ( arguments.length === 0 ){
					return document.cookie;
				}
				if ( typeof arguments[0] === 'string' ){
					var key = arguments[0];
					return arguments[1] == undefined ? this.cookie.parse()[key] : this.cookie.set(key, arguments[1]);
				}else if (typeof arguments[0] === 'object'){

				}
			};
			cookieMethod.apply(cookieF);
			return cookieF;
		}();

		this.getRequest = function() {
			/* thanks jiekk:  http://www.cnblogs.com/jiekk/archive/2011/06/28/2092444.html */
			function getStrRequest(str){
				return new RegExp(/\?/g).test(str) ? str.split(/\?/)[1] : str;
			}
			var name = arguments[0];
			var request = win.location.search.substr(1);
			if ( arguments[1] !== undefined ){
				name = arguments[0];
				request = getStrRequest(arguments[1]);
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
					str += key + '[]=' + encodeURIComponent(this[key][i]) + '&';
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
		this.checkObj = function (obj, compared){
			"use strict";
			var keys = Object.keys(obj);
			var comparedObjs = [];
			var comparedArr = Array.prototype.slice.apply(arguments, [1]).filter(function (item){
				return !(typeof item == 'object' && comparedObjs.push(item));
			});
			function comparedValueInArr(Arr, value){
				for ( let key of Arr )
					if ( key === value)
						return true;
			}
			function eachKey(comparedArr){
				for ( let com of comparedArr )
					if ( !comparedValueInArr(keys, com) )
						return false;
				return true;
			}
			function eachObj(comparedObjs){
				for (let comparedObj of comparedObjs){	//解对象组
					for ( let comKey of Object.keys(comparedObj) ){	//解对象
						if ( comparedValueInArr(keys, comKey) ){
							if ( comparedObj[comKey] !== obj[comKey] ){
								return false;
							}
						}else{
							return false;
						}
					}
				}
				return true;
			}
			return !(eachKey(comparedArr) && eachObj(comparedObjs));
		};
		this.vjax2 = function (controlObj){

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
		this.encodeJson = function (jsonStr){

		};
		this.json2obj = function (jsonStr, ok, fail){
			try{
				var obj = JSON.parse(jsonStr);
			}catch(e){
				console.warn(jsonStr);
				fail && fail(e, jsonStr);
				return null;
			}
			ok && ok(obj);
			return obj;
		};
		this.jsonp = function (url, jsonpCallback, callback){
			var tmp = win[jsonpCallback];
			win[jsonpCallback] = function (json){
				callback && callback(json);
			};
			var script = document.createElement('script');
			script.src = url;
			script.addEventListener('load', function (){
				win[jsonpCallback] = tmp;
			});
			$('head')[0].appendChild(script);
		};
		this.sendJSON = function(URL, jsonStr, ok, fail) {
			jsonStr = typeof jsonStr !== 'string' ? JSON.stringify(jsonStr) : jsonStr;
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
		this.vecExtent = function (){
			Array.prototype.allEach =
			typeof Array.prototype.allEach !== 'undefined' ?
			Array.prototype.allEach :
			function (callback, total){
				"use strict";
				let i = 0;
				total = Number.isFinite(total) ? total : 0;
				for ( let item of this ){
					if ( Array.isArray(item) )
						total = item.allEach(callback, total);
					else
						++i && callback(item, this, i, total);
					++total;
				}
				return --total;
			};

			Object.prototype.myCheck = function (compared){
				"use strict";
				var obj = this;
				var keys = Object.keys(this);
				var comparedObjs = [];
				var comparedArr = Array.prototype.slice.apply(arguments, [0]).filter(function (item){
					return !(typeof item == 'object' && comparedObjs.push(item));
				});
				function comparedValueInArr(Arr, value){
					for ( let key of Arr )
						if ( key === value)
							return true;
				}
				function eachKey(comparedArr){
					for ( let com of comparedArr )
						if ( !comparedValueInArr(keys, com) )
							return false;
					return true;
				}
				function eachObj(comparedObjs){
					for (let comparedObj of comparedObjs){	//解对象组
						for ( let comKey of Object.keys(comparedObj) ){	//解对象
							if ( comparedValueInArr(keys, comKey) ){
								if ( comparedObj[comKey] !== obj[comKey] ){
									return false;
								}
							}else{
								return false;
							}
						}
					}
					return true;
				}
				return !(eachKey(comparedArr) && eachObj(comparedObjs));
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
		this.text = function (str){
			var ele = this[0];
			if ( typeof str !== 'string' ){
				ele = str;
				str = arguments[1];
			}
			if (str===undefined){
				return ele.textContent || ele.innerText;
			}else{
				ele.textContent ? (ele.innerText = str) : ( ele.textContent = str );
			}
		};

		this.SS = f;
		this.$ = f;
	};
	function f(s){
		var dom = document.querySelectorAll(s);
		domMethod.apply(dom,[dom]);
		return dom;
	}

	myMethod.apply(f, []);

	if ( !win.$ ){
		win.$ = f;
	}

	return f;
})(window, document);

var o = {};for( var i=0; i<9999; ++i ){ o[i] = i; }

function bechMark(testCount, count, func, arg){
	var testUnitArr = [];
	var start = performance.now();
	function testUnit(count, func, arg){
		this.start = performance.now();

		for ( var i=0; i<count; ++i )
			func.apply(null, arg);

		this.end = performance.now();
		this.interval = this.end - this.start;
	}

	for ( var i=0; i<testCount; ++i )
		testUnitArr.push( new testUnit(count, func, arg) );

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
