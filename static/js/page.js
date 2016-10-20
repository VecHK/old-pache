/*
	原pache.js

 - articleNoFound

*/
var isElement = function (ele){
	return ele instanceof HTMLElement;
};
var noFound = function (ele){
	var f =  $('#float');

	if (!isElement(f)) {
		return 0;
	}

	var sImg = $('img', f);

	var fImg = new Image;
	fImg.className = 'floatimg';
	fImg.src = sImg.src;

	fImg.onload = function (){
		f.style.width = fImg.width + 'px';
		f.style.height = fImg.height + 'px';
	};

	var
	M = Math,
	round = function (){ return M.round(M.random()); },
	getNumber = function(r){
		r = M.floor(M.random() * 12);
		return round() ? r : -r;
	},
	setStyle = function (left, top){
		this.left = left + 'px';
		this.top = top + 'px';
	}.bind(fImg.style);
	window.intervalFloat = setInterval(function (){
		if (round()) {
			setStyle(0, getNumber());
		} else {
			setStyle(getNumber(), 0);
		}
	}, 64);

	f.appendChild(fImg);
};

function escape2Html(str) {
	var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
	return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}

function processor(ele){
	ele.innerHTML = prettyPrintOne(ele.innerHTML);
	ele.parentElement.className = 'prettyprint';
	return ele;
}
function codeLight(elementArray){
	return elementArray.filter(function (item) {
		return (item.className !== '') && processor(item);
	});
}

window.addEventListener('load', function (){
	noFound();

	codeLight($$('#article code'));
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
	var pre = $$('sup[id]');

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
		if ( this.sup ){
			this.greyArea[0].style.height = (this.sup.offsetTop + this.sup.offsetHeight) + 'px';
			this.greyArea[1].style.height = (document.body.offsetHeight - this.ele.offsetHeight) + 'px';

			fadeIn(this.ele, cb, time);

			this.sup.style.lineHeight = (this.content.offsetHeight + this.sup.offsetHeight) + 'px';
		}else{
			fadeIn(this.ele, cb, time);
		}
	};
	CreateSplitLayer.prototype.hide = function (cb, time){
		if (this.sup){
			this.sup.style.lineHeight = '';
		}
		fadeOut(this.ele, cb, time);
	};
})();


/* 清除内容栏的箭头 */
var clearArrow = function (ele){
	var
	as = $$('[href].footnote-backref', ele),
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
	as.forEach(function (a){
		removeElement(a);
	});
};

var foontnoteExtend = function (){
	var splitLayer = new CreateSplitLayer(document.getElementById('article'));

	splitLayer.hide();

	footnotes = collectFootnote();

	footnotes.forEach(function (footnote){
		footnote.a.onclick = function () {
			splitLayer.sup = footnote.sup;

			var anthor = footnote.sup.id.replace('fnref-', 'fn-');
			anthor = document.getElementById(anthor);
			splitLayer.content.innerHTML = anthor.innerHTML;

			clearArrow(splitLayer.content);

			window.splitLayer = splitLayer;
			splitLayer.show();

			return false;
		};

	});

};

window.addEventListener('load', foontnoteExtend);


/* PPE level 2 */

var isMobile = function (){
	var
	手机的UA字段们 = ['Android', 'iPhone', 'iPod', 'iPad', 'Windows Phone'],
	浏览器UA = navigator.userAgent;

	手机的UA字段们.forEach(function (){

	});

};
var HPP = function (){

};
HPP.prototype

var EnableStreamPlayer = function () {
	return $$('audio[hiddenheart]').map(function (ele){
		return new HPP(ele);
	});
};
window.addEventListener('load', function (e){
	window.ArticlePlayers = EnableStreamPlayer();
});
