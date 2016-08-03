/*
	原pache.js

 - articleNoFound
 - dateQuery
 - htmlConsole

*/
/* 应废弃的项目 */
var htmlConsole = function (ele){
	var my = this;
	this.conEle = createHtmlConsoleEle();
	this.log = function (str){
		var li = $c('li', function (ele){
			this.text(str);
		});
		this.conEle.appendChild( li );
		return li;
	};
	function createHtmlConsoleEle(){
		return $c('div', function (ele){
			ele.className = "html-console";
			this.text('htmlConsole v0.01a');
			this.css({
				'display': 'block',
				'position': 'relative',
				'width': '100%',
				'max-height': '0px',
				'padding': '0px',
				'margin': '0px',
				'overflow': 'scroll',
				'background': 'rgba(27, 29, 82, 0.14)',
				'border-top-left-radius': '5px',
				'border-top-right-radius': '5px',

				'transition': 'max-height 0.618s'
			});
		})
	};
	console.log(ele.parentNode);
	ele.parentNode.insertBefore( this.conEle, ele );
	function inspect(){
/*
		this.logg = this.log;
		this.log = function (){
			this.logg.apply(this, arguments);
			//console.logg.apply(console, arguments);
		};
*/
	}
	inspect.apply(console);
}

var noFound = function (ele){
	var f =  document.getElementById('float');

		if ( f === undefined ){
			return 0;
		}
		if ( f.id !== 'float' ){

			return 0;
		}


	var sImg = f.getElementsByTagName('img');

	var fImg = new Image();
	fImg.src = 'articleNoFound.jpg';
	fImg.style.position = 'absolute';
	fImg.style.opacity = 0.1;
	fImg.style.top = 0;

	fImg.onload = function (){

		f.style.width = fImg.width + 'px';
		f.style.height = fImg.height + 'px';
		console.log(f);
	};

	var getNumber = function(l){
		var n= Math.floor(Math.random()*l);
		if ( Math.round(Math.random()) ){
			/* n不等于0 */
			if ( n != 0 ){
				n = '-'+n;
				n = Number.parseInt(n);
			}
		}
		return n;
	};
	var fi = setInterval(function (){
		if ( Math.round(Math.random()) ){
			fImg.style.left = 0+'px';
			fImg.style.top = getNumber(10)+'px';
		}else{
			fImg.style.top = 0+'px';
			fImg.style.left = getNumber(10)+'px';
		}
	}, 64);

	f.appendChild(fImg);


};

function escape2Html(str) {
	var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
	return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}
function codeLight(){
	function unit(arr){
		function light(item){
			if ( item.className !== '' ){
				console.warn(item);
				item.innerHTML = prettyPrintOne(item.innerHTML);
				item.parentElement.className = 'prettyprint';
				if ( item.className === 'javascript' ){
					item.parentElement.insertBefore($c('button', function (ele){
						this.text('▶');
						this.addEvent('click', function (ele){
							var console = new htmlConsole(item.parentElement);
							var hCon = console;	/* 兼容以前的文章 */
							return function (){
								$(console.conEle).css( {'max-height': '220px'} );
								eval( $(ele.parentElement.getElementsByClassName('javascript')[0]).text() );
							}
						}(ele),false);
					}), item.parentElement.firstChild );
				}
			}
			return true;
		}
		return arr.length && light(arr.shift()) && arguments.callee(arr);
	}
	unit(Array.prototype.slice.call(arguments));
}

var myDateFormat = function (d){
	var zeros = function (s){
		var s = s.toString();
		if ( s.length === 1 ){
			s = '0' + s;
		}
		return s;
	};
	var str = '';
	str +=zeros( (1900 + d.getYear()) ) + '/'
		+ zeros((d.getMonth())+1) + '/'
		+ zeros(d.getDate()) + ' '
		+ zeros(d.getHours()) + ':'
		+ zeros(d.getMinutes()) + ':'
		+ zeros(d.getSeconds())
	;
	return str;
};
function queryTime(){
	var articleTime = $( $('#time time')[0] ).text();
	var articleLtime = $( $('#time time')[1] ).text();
	(function (){
		console.log(articleTime);
		articleTime = new Date(articleTime);
		articleLtime = new Date(articleLtime);

		if ( articleLtime > articleTime ){
			document.getElementById('time').innerHTML = '<ins><time datetime="'+myDateFormat(articleTime)+'">'+myDateFormat(articleTime)+'</time></ins>'+'<time>'+myDateFormat(articleLtime)+'</time>';
			document.getElementById('time').title = "创建于 "+myDateFormat(articleTime);
		}else{
			document.getElementById('time').innerHTML = '<time datetime="'+myDateFormat(articleTime)+'">'+ myDateFormat(articleTime) +'</time>'
		}
	})();
}

window.addEventListener('load', function (){
	try{
		try{
			noFound();
		}catch(e){
			//queryTime();
		}
		codeLight.apply(null, document.getElementById('article').getElementsByTagName('code'));
	}catch(e){

	}
});



/*
	Pache 文章页增强插件集
	Pache Article Page Extend Collection

 - footnote Extend

 */
var objExt = function (source, newobj){
	return Object.keys(newobj).filter(function (key){
		source[key] = newobj[key];
		return true;
	}).length;
};

var collectFootnote = function (){
	var pre = $('sup[id]');

	return Array.prototype.map.call(pre, function (ele){
		var a = ele.getElementsByTagName('a');
		if ( a.length ){
			a = a[0];
		}else{
			return undefined;
		}

		if ( a.href.indexOf('#') !== -1 ){
			return {sup: ele, a: a};
		}else{
			return false;
		}
	}).filter(function (item){
		return item !== undefined;
	});
};
var CreateSplitLayer = function (parentEle){
	var
	splitLayer = document.createElement('div'),
	content = document.createElement('div'),
	greyArea = [document.createElement('div'), document.createElement('div')];

	window.addEventListener('resize', function (){
		this.sup && this.hide(function (){
			setTimeout(this.show.bind(this), 16.7);
		}.bind(this));
	}.bind(this));

	var closeSplitLayer = function (){
		this.hide();
		if ( this.sup ){
			this.sup = undefined;
		}
	}.bind(this);

	window.addEventListener('keydown', function (e){
		if ( this.sup && e.keyCode === 27 ){
			closeSplitLayer();
		}
	});
	splitLayer.className = 'split-layer';

	greyArea.forEach(function (ele){
		ele.className = 'grey-area';
		ele.addEventListener('click', closeSplitLayer, true);
	});

	content.className = 'split-content';

	splitLayer.appendChild(greyArea[0]);
	splitLayer.appendChild(content);
	splitLayer.appendChild(greyArea[1]);

	objExt(content.style, {
		width: parentEle.offsetWidth + 'px',
	});

	objExt(splitLayer.style, {
		display: 'flex',
		justifyContent: 'center',
		position: 'absolute',
		width: '100%',
		left: '0px',
		top: '0px',
		border: '0',
	});

	document.body.appendChild(splitLayer);

	objExt(this, {
		parent: parentEle,
		ele: splitLayer,
		greyArea: greyArea,
		content: content,
	});
};
/* 设定 CreateSplitLayer.prototype 属性行为，以及一些公有方法*/
(function (){
	var
	xy = {
		x: 'left',
		y: 'top',
		h: 'height',
		bt: 'borderTop',
		bb: 'borderBottom',
	},
	posGet = function (d){
		return function (){
			return this.ele.style[xy[d]];
		};
	},
	posSet = function (d){
		return function (value){
			this.ele.style[xy[d]] = value + 'px';
		};
	},
	createGetOrSet = function (d){
		return {
			get: posGet(d),
			set: posSet(d),
		};
	};

	Object.defineProperties(CreateSplitLayer.prototype, {
		posX: createGetOrSet('x'),
		posY: createGetOrSet('y'),
		height: createGetOrSet('h'),
	});

	CreateSplitLayer.prototype.resize = function (){

	};
	CreateSplitLayer.prototype.show = function (cb, time){
		var thisEleR = $(this.ele);
		if ( this.sup ){
			this.greyArea[0].style.height = (this.sup.offsetTop + this.sup.offsetHeight) + 'px';
			this.greyArea[1].style.height = (document.body.offsetHeight - this.ele.offsetHeight) + 'px';

			thisEleR.fadeIn(cb, time);

			this.sup.style.lineHeight = (this.content.offsetHeight + this.sup.offsetHeight) + 'px';
		}else{
			thisEleR.fadeIn(cb, time);
		}
	};
	CreateSplitLayer.prototype.hide = function (cb, time){
		if (this.sup){
			this.sup.style.lineHeight = '';
		}
		$(this.ele).fadeOut(cb, time);
	};
})();


/* 清除内容栏的箭头 */
var clearArrow = function (ele){
	var
	as = ele.querySelectorAll('[href].footnote-backref'),
	clearEmptyNode = function (e){
		var parent = e.parentNode;
		if ( parent === ele ){
			return false;
		}
		else if ( parent.innerHTML.length ){
			return parent.removeChild(e);
		}
		else{
			return clearEmpty(parent);
		}
	};
	Array.prototype.forEach.call(as, function (a){
		var parent = a.parentNode;
		parent.removeChild(a);

		clearEmptyNode(parent);
	});
};

var foontnoteExtend = function (){
	var splitLayer = new CreateSplitLayer(document.getElementById('article'));

	splitLayer.hide();

	footnotes = collectFootnote();

	footnotes.forEach(function (footnote){
		footnote.a.onclick = function (){
			splitLayer.sup = footnote.sup;

			var anthor = footnote.sup.id.replace('fnref:', 'fn:');
			anthor = document.getElementById(anthor);

			splitLayer.content.innerHTML = anthor.innerHTML;
			clearArrow(splitLayer.content);


			window.splitLayer = splitLayer;
			/*
			splitLayer.greyArea[0].style.height = (footnote.sup.offsetTop + footnote.sup.offsetHeight) + 'px';
			splitLayer.greyArea[1].style.height = (document.body.offsetHeight - splitLayer.ele.offsetHeight) + 'px';

			splitLayer.fadeIn(footnote.sup);

			footnote.sup.style.lineHeight = (splitLayer.content.offsetHeight + footnote.sup.offsetHeight) + 'px';
			*/
			splitLayer.show();

			return false;
		};
	});

};

window.addEventListener('load', foontnoteExtend);


/* PPE level 2 */
/*
var isMobile = function (){
	var
	手机的UA字段们 = ['Android', 'iPhone', 'iPod', 'iPad', 'Windows Phone'],
	浏览器UA = navigator.userAgent;

	手机的UA字段们.forEach(function (){

	});

};
*/
/*
au = new Audio;
au.src = '../t.mp3'
window.ontouchend = function (){ au.load();au.play(); }
*/
