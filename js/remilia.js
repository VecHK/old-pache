(function (win, doc){
	var ver = 0.35;
	console.info(
		'永远鲜红的',
		'幼月☾',
		'与',
		'bug',
		'\n\nver:'+ver
	);
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
			var cookieMethod = function (){
				this.parse = function (){
					if (!(this instanceof arguments.callee)) {
						return new arguments.callee();
					}
					var obj = this;
					var rawArr = cookieF().replace(/ /g, '').split(';');
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

			cookieF.__proto__ = new cookieMethod;
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
	};
	var domMethod = function (ele){
		var my = this;
		this.addEvent;
		this.rmEvent;
		this.css = function (cssobj){
			for ( var i in Object.keys(ele) ){
				for ( var key in cssobj ){
					ele[i].style[ key ] = cssobj[key];
				}
			}
			return this;
		};
		var myRequestAnimationFrame = function (f){
			var com = ['requestAnimationFrame', 'msRequestAnimationFrame','webkitRequestAnimationFrame','mozRequestAnimationFrame'];
			for ( var i in com ){
				if ( win[com[i]] ){
					return win[com[i]](f);
				}
			}
		};
		var setTransition = function (ele, set){
			var com = ['transition', 'webkitTransition','msTransition','mozTransition'];
			for ( var i in com ){
				if ( ele.style[ com[i] ] !== undefined ){
					return ele.style[ com[i] ] = set;
				}
			}
		};
		var removeTransition = function (ele){
			var com = ['transition', 'webkitTransition','msTransition','mozTransition'];
			for ( var i in com ){
				ele.style.removeProperty( com[i] );
			}
		}
		this.fadeIn = function (timeStr, callback){
			if ( typeof timeStr === 'function' ){
				callback = timeStr;
				timeStr = 0.618;
			}else if ( timeStr === undefined ){
				timeStr = 0.618;
			}
			timeStr = Number(timeStr);
			for ( var key in Object.keys(ele) ){
				for ( var key in Object.keys(ele) ){
					setTransition(ele[key], 'opacity '+ timeStr +'s');
//					ele[key].style.transition = 'opacity '+ timeStr +'s';
					ele[key].style.opacity = '0';
					ele[key].style.removeProperty('display');

					myRequestAnimationFrame(function (){
						ele[key].__proto__.RMfade && clearTimeout(ele[key].__proto__.RMfade.timeEvent);
						ele[key].__proto__.RMfade = {
							timeEvent: setTimeout(function (ele){/*暂时的解决方法*/
								return function (){
									ele.style.opacity = '1';
									setTimeout(function (){
										//ele.style.opacity = '';
										removeTransition(ele);
//										ele.style.webkitTransition = '';
										delete ele.__proto__.RMfade;
										callback && callback(ele);
									}, timeStr*1000);
								}
							}(ele[key]),0)
						};
					});

				}
			}

		};
		this.fadeOut = function (timeStr, callback){
			if ( typeof timeStr === 'function' ){
				callback = timeStr;
				timeStr = 0.618;
			}else if ( timeStr === undefined ){
				timeStr = 0.618;
			}
			timeStr = Number(timeStr);
			for ( var key in Object.keys(ele) ){
				ele[key].style.opacity = '0';
//				ele[key].style.transition = 'opacity '+ timeStr +'s';
				setTransition( ele[key], 'opacity '+ timeStr +'s' );
				ele[key].__proto__.RMfade && clearTimeout(ele[key].__proto__.RMfade.timeEvent);
				myRequestAnimationFrame(function (){

					ele[key].__proto__.RMfade = {
						timeEvent: setTimeout(function (ele){
							return function (){
								ele.style.display = 'none';
								//ele.style.webkitTransition = '';
								callback && callback(ele);

							}
						}(ele[key]), timeStr*1000)
					};
				});
			}
		};
		this.html = function (str){
			return str === undefined ? ele[0].innerHTML : ( ele[0].innerHTML = str );
		};
		this.text = function (str){
			var resultArr = [];
			for ( var key in ele ){
				if ( str === undefined ){
					return ele[key].textContent || ele[key].innerText;
				}else{
					ele[key].textContent ? (ele[key].innerText = str) : ( ele[key].textContent = str );
				}
			}
		};

		this.each = function (callback){
			for ( var i in ele )
				callback(ele[i]);
		};

		return this;
	};
	var publicMethod = function (){
		this.createEle = function (eleName){
			return doc.createElement(eleName);
		};
		this.extend = function(){
			Array.prototype.allEach =
			typeof Array.prototype.allEach !== 'undefined' ?
			Array.prototype.allEach :
			this.allEach;

			Object.prototype.checkObj =
			Object.prototype.checkObj !== undefined ?
			Array.prototype.checkObj :
			this.checkObj;
		};
		this.checkObj = function (obj, compared){
			var keys = Object.keys(obj);
			var comparedObjs = [];
			var comparedArr = Array.prototype.slice.apply(arguments, [1]).filter(function (item){
				return !(typeof item == 'object' && comparedObjs.push(item));
			});
			function comparedValueInArr (Arr, value){
				for ( var key in Arr )
					if ( Arr[key] === value )
						return true;
			}
			function eachKey (comparedArr){
				for ( var comKey in comparedArr )
					if ( !comparedValueInArr(keys, comparedArr[comKey]) )
						return false;
				return true;
			}
			function eachObj(comparedObjs){
				/*兼容不支持 for(of) 的浏览器*/
				for ( var comparedObjKey in comparedObjs ){
					var comObjKeys = Object.keys( comparedObjs[comparedObjKey] );
					for ( var comObjKey in comObjKeys ){
						if ( comparedValueInArr( keys, comObjKeys[comObjKey] ) ){
							if ( comparedObjs[comparedObjKey][comObjKeys[comObjKey]] !== obj[comObjKeys[comObjKey]] ){
								return false;
							}
						}else{
							return false
						}
					}
					return true;
				}
				/*
				for (var comparedObj of comparedObjs){	//解对象组
					for ( var comKey of Object.keys(comparedObj) ){	//解对象
						if ( comparedValueInArr(keys, comKey) ){
							if ( comparedObj[comKey] !== obj[comKey] ){
								return false;
							}
						}else{
							return false;
						}
					}
				}
				*/
				return true;
			}
			return !(eachKey(comparedArr) && eachObj(comparedObjs));
		};
		this.allEach = function (callback, total){
			var i = 0;
			total = Number.isFinite(total) ? total : 0;

			for ( var thisKey in this ){
				if ( Array.isArray( this[thisKey] ) )
					total = this[thisKey].allEach(callback, total);
				else
					++i && callback(this[thisKey], this, i, total);
				++total;
			}
			return --total;
		};
		this.wait = function (callback, timeStr){
			var my = this;
			return setTimeout(function (){
				callback && callback.apply(my instanceof domMethod ? my : f, [] );
			}, timeStr);
		};
		this.stradd = function (){
			var str='';
			for ( var k in arguments)
				str += String( arguments[k] );
			return str;
		};
		this.straddFunctional = function (){
			return function (a){
				return a.length ? String(a.shift()) + arguments.callee(a) : '';
			}(Array.prototype.slice.call(arguments));
		};
	};
	var f = function (str){
		if ( typeof str !== 'string' ){
			var domArr = Array(str);
		}else if ( Array.isArray(str) ){
			var domArr = str;
		}else{
			var domArr = Array.prototype.slice.apply(doc.querySelectorAll(str));
		}
		domArr.__proto__ = new domMethod(domArr);
		return domArr;
	};
	var f_All = function (s){
		var dom = doc.querySelectorAll(s);
		return dom;
	};
	myMethod.prototype = new publicMethod;
	domMethod.prototype = new publicMethod;
	f.__proto__ = new myMethod;
	f_All.__proto__ = new myMethod;

	if ( !win.$ ){
		win.$ = f;
	}
	if ( !win.$c ){
		win.$c = f.createEle;
	}
	if ( !win.$$ ){
		win.$$ = f_All;
	}

	win.Remilia = f;
	win.Remilia_f = f;
})(window, document);

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
