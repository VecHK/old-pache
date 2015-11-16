var $ = function (str){
	return document.querySelector(str);
};
var $$ = function (str){
	return document.querySelectorAll(str);
};

var myAnimate = {
	'close': function (ele, c){
		//ele.style.top = '300px';
		myFade(ele, 'close', function (){
			c && c(ele);
		});
	},
	'open': function (ele, c){
		//ele.style.top = '0px';
		myFade(ele, 'open', function (){
			c && c(ele);
		});
	},
	ini: function (o){
		/*
		myTransitionEvent(
			$('#list'),
			[
				'top'
			],
			0.618
		);
		$('#list').style.top = '0px';

		myTransitionEvent(
			$('#article'),
			[
				'top'
			],
			0.618
		);
		myFade($('#article'), 'close');
		*/
	}
};
//myAnimate.ini();

var checkUrl = function (e){
	console.log("state: " + JSON.stringify(event.state));
	var state = JSON.stringify(event.state);

	if ( state.articleId ){

	}
};
var changeUrl = function (stateObj, url){
	history.pushState(stateObj, "page", url);
};
window.addEventListener('popstate', checkUrl);

var createTimeIns_day = function (time, ltime){
	var ce = function (tagName){
		return document.createElement(tagName);
	};
	var timeDay = new Date(time).toLocaleDateString();
	var ltimeDay = new Date(ltime).toLocaleDateString();

	time.myTime =  new Date(time);
	time.myLtime = new Date(ltime);

	var time = ce('time');

	if ( timeDay === ltimeDay ){
		innerText(time, timeDay);
		time.dateTime = new Date(time);
	}else{
		var ins = innerText(ce('ins'), timeDay);
		time.dateTime = new Date(ltime);
		ins.dateTime = new Date(ltime);
		time.appendChild(ins);
		time.innerHTML += ltimeDay;
		time.title = '创建于 '+timeDay+' 修改于 '+ltimeDay;
	}
	return time;
};
var displayArticle = function (articleContent, summary){
	var body = $('#article');
	body.innerHTML = '';

	var ce = function (tagName){
		return document.createElement(tagName);
	};
	var header = ce('header');
	var title = innerText(ce('h1'), summary.title);
	header.appendChild(title);

	body.appendChild(header);

	var content = ce('div');
	content.className='content';

	var converter = new Markdown.Converter();
	Markdown.Extra.init(converter, {highlighter: "prettify"});//代码高亮支持
	content.innerHTML = converter.makeHtml(articleContent); //Markdown 转HTML

	body.appendChild(content);
	content.onload = prettyPrint();



	var footer = ce('footer');

	var time = createTimeIns_day(summary.time, summary.ltime);

	footer.appendChild(time);

	body.appendChild(footer);
};
var XHRArticleById = function (id){
	var listKeys = Object.keys(myBlogS.article);
	for ( var i=0; i<listKeys.length; ++i ){
		if ( id == myBlogS.article[listKeys[i]].id ){
			myBlogS.getArticleById(
				id,
				function (data){
					displayArticle(data, myBlogS.article[listKeys[i]]);
					//myFade($('#list'), 'close');
					//myFade($('#article'), 'open');

					$('#list').style.display = 'none';
					$('#article').style.display = 'block';

					},
				function (){}
			);
			return myBlogS.article[listKeys[i]];
		}
	}
};

var displayArticleList = function (list){
	$('#article').style.display = 'none'
	$('#list').style.removeProperty('display');

	console.info(list);
	var body = $('#list');
	body.innerHTML = '';
	list.forEach(function (item){
		var li = document.createElement('li');
		var titleContent = document.createElement('a');
		var title = document.createElement('h1');
		title.appendChild( innerText(titleContent, item.title) );

		titleContent.href = '?a='+item.id;
		titleContent.articleSummary = item;

		titleContent.onclick = function (){
			console.info(this)

			changeUrl();
			XHRArticleById(this.articleSummary.id);

			return false;
		};

		var footer = document.createElement('footer');
		var time = createTimeIns_day(item.time, item.ltime);
		footer.appendChild(time);

		li.appendChild(title);
		li.appendChild(footer);

		body.appendChild(li);
	});
};

myBlogS.ini(
	{
		path: 'export/myBlog-Static/'
	},
	function (){
		displayArticleList(myBlogS['currentList']);


		var newNavClassEle = function (className){
			var ce = function (str){ return document.createElement(str); }
			var li = ce('li');
			var a = innerText(ce('a'), className);
			a.href= '?c='+encodeURIComponent(className);
			a.onclick = function (){
				return false;
			};

			li.appendChild( a )

			return li;
		};

		$('#classnav').appendChild(
			newNavClassEle('首页')
		).onclick = function (){
			displayArticleList(myBlogS['currentList']);
		};

		Object.keys(myBlogS.class).forEach(function (classItem){

			var li = $('#classnav').appendChild( newNavClassEle(classItem) );
			li.onclick = function (){
				displayArticleList(myBlogS.getArticlesByClassName(innerText(this)));
			};

		});

		}

);
