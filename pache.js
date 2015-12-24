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
					item.parentElement.insertBefore($c('button', function (ele){
						this.text('▶');
						this.addEvent('click', function (ele){
							var hCon = new htmlConsole(item.parentElement);
							return function (){
								$(hCon.conEle).css( {'max-height': '220px'} );
								eval( $(ele.parentElement.getElementsByClassName('javascript')[0]).text() );
							}
						}(ele),false);
					}), item.parentElement.firstChild );
				}
				return true;
			}
			return arr.length && light(arr.shift()) && arguments.callee(arr);
		}
		unit(Array.prototype.slice.call(arguments));
	}
	codeLight.apply(null, document.getElementById('article').getElementsByTagName('code'));

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
