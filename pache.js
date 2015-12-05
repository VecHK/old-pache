var innerText = function (ele, str){
	if (str===undefined){
		return ele.textContent || ele.innerText;
	}else{
		ele.textContent ? (ele.innerText = str) : ( ele.textContent = str );
	}
};

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
	var articleContent = document.getElementById('article').innerHTML;

	console.info(articleContent);
/*

	articleContent = escape2Html(articleContent);	//HTMl转义字符转换

	var converter = new Markdown.Converter();
	Markdown.Extra.init(converter, {highlighter: "prettify"});//代码高亮支持
	document.getElementById('article').innerHTML = converter.makeHtml(articleContent); //Markdown 转HTML

	document.getElementById('article').onload = prettyPrint();

*/
	try{
		noFound();
	}catch(e){

	}

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
				}
				return true;
			}
			return arr.length && light(arr.shift()) && arguments.callee(arr);
		}
		unit(Array.prototype.slice.call(arguments));
	}
	codeLight.apply(null, document.getElementById('article').getElementsByTagName('code'));

try{
	var articleTime = innerText(document.getElementById('time').getElementsByTagName('time')[0]);
	var articleLtime = innerText(document.getElementById('time').getElementsByTagName('time')[1]);
	-function (){
		console.log(articleTime);
		articleTime = new Date(articleTime);
		articleLtime = new Date(articleLtime);

		if ( articleLtime > articleTime ){
			document.getElementById('time').innerHTML = '<ins><time datetime="'+myDateFormat(articleTime)+'">'+myDateFormat(articleTime)+'</time></ins>'+'<time>'+myDateFormat(articleLtime)+'</time>';
			document.getElementById('time').title = "创建于 "+myDateFormat(articleTime);
		}else{
			document.getElementById('time').innerHTML = '<time datetime="'+myDateFormat(articleTime)+'">'+ myDateFormat(articleTime) +'</time>'
		}
	}();
}catch(e){
	console.error(e);
}

var obj = new function (){
	var stradd = function (){
		return function (a){
			return a.length ? String(a.shift()) + arguments.callee(a) : '';
		}(Array.prototype.slice.call(arguments));
	};
	this.pache = stradd('hey, ', 'i am Pache.');
	this.vec = stradd('hey, ', 'i am vec^ ^');
};
