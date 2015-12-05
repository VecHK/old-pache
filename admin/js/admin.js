tabOverride.set(document.getElementsByTagName('textarea'));
$('textarea')[0].spellcheck = false;
var envir = {
	/* mode: 'new'(create Articcle), 'update'(edit Article) */
	'mode': null,
	'page': 1,
	'limit': 10,
	'article': null
};
var mEvent = {
	articleList: {
		click: function (){
			var id = $.getRequest('id', this.href );
			envir.mode = 'update';
			manager.getArticleById( id,
				function (){

				},
				function (){

				}
			);
		}
	},
	create: function (e){
		envir.mode = 'new';
		display.loadEditor({
			'title': 'Hello, World',
			'article': '在这儿输入你的文章',
			'type': 'text'
		});
	},
	closeEditor: function (e){
		display.animated.Editor.close.apply($('#editor')[0], []);
	},
	deleteArticles: function (e){
		var selected = new manager.collectSelected(  $('#articlelist input') );

		if ( !selected.checkedArr.length ){
			alert('至少选一个啊Baka');
			return false;
		}
		if ( !confirm('你确定你要删除选中项吗？') ){
			return false;
		}
		console.log(selected);

		var url = 'ad.php?'+$.stringifyRequest({
			'pw': $.cookie('pw'),
			'type': 'manage',
			'manage': 'del'
		});
		$.post(url,
			{'selid': selected['selid[]']},
			function (data){
				$.json2obj(data, function (d){
					display.loadArticleList(envir.page, envir.limit);
				},function (err){
					alert('删除似乎失败了');
					throw new Error(err);
				});
			},
			function (err){throw new Error(err);}
		);

		return false;
	}
};
var display = {
	'editorForm': {},
	'displayEditorClass': function (classArr){
		var classList = document.getElementById('class_list');
		classList.innerHTML = '';
		classArr.forEach(function (classItem){
			var option = document.createElement('option');
			option.value = classItem;
			classList.appendChild(option);
		});
	},
	'displayEditorTag': function (tag){
		console.info(tag);
		var tagListEle = document.getElementById('tag_list_input');
		tagListEle.value = '';
		var str = '';
		tag.tagList.forEach(function (d){
			str += d.tagname + ',';
		});

		tagListEle.value = str.substr(0, str.length-1);
	},
	'status': function (s){
		var ele = document.getElementById('status');
		if ( s.length ){
			$(ele).text(s);
				ele.style.opacity = '1';
		}else{
			ele.style.opacity = '0.01';
		}
	},
	animated: {
		'Editor':{
			'status': false,
			'open': function (){
				this.style.display = '';
			},
			'close': function (){
				this.style.display = 'none';
			},
			'Toggle': function (){
				console.info(this);
				if ( this.style.display === undefined || this.style.display === '' ){
					this.style.display = 'none';
				}else{
					this.style.display = '';
				}
			}
		}
	},
	'constructForm': function (article){
		var editor = $('#editor')[0];
		var form = editor.getElementsByTagName('form');
		this.articleObj = article;

		this.form	= editor.getElementsByTagName('form')[0];
		this.title	= document.getElementsByName('title')[0];
		this.type = document.getElementsByName('type')[0];
		this.article = document.getElementsByName('article')[0];

		this.title.value = article.title;
		this.article.value = article.article;
		this.type.value = article.type;

		this['class'] = document.getElementsByName('class')[0];

		console.log('constructForm ok.');
	},
	loadEditor: function (article){
		var url = 'ad.php?' + $.stringifyRequest({
			'type': 'getclass',
			'pw':$.cookie('pw'),
			'display': 'json'
		});
		var classListInput = $('#class_list_input')[0];
		var placeholderTemp = classListInput.placeholder;
		classListInput.placeholder = 'loading';

		$.vjax(url, 'GET',
			function (d){
				$.json2obj(d,
					function (obj){
						classListInput.placeholder = 'class';
						if ( envir.mode !== 'new' )
							if ( article.class.length !== 0 )
								classListInput.value = article.class;

						display.displayEditorClass(obj);
					},
					function (err, json){
						console.error('get class fail.');
						console.error(json);
						//throw new Error(err);
					}
				);
			},
			function (err){
				throw new Error(err);
			}
		);

		var url = 'ad.php?'+ $.stringifyRequest({
			'pw': $.cookie('pw'),
			'type': 'gettag',
			'id': article.id,
			'display': 'json'
		});
		$.get(url,
			function (d){
				$.json2obj(d,
					display.displayEditorTag,
					function (err){
						alert('tag读取失败');
						throw new Error(err);
					}
				);
			},
			function (err){
				alert('tag读取失败');
				throw new Error(err);
			}
		);

		this.constructForm.apply( this.editorForm, [article] );
		this.animated.Editor.open.apply( $('#editor')[0], [] );
	},
	RenderingArticleList: function (article){

		var articleEle = $('#articlelist')[0];
		articleEle.innerHTML = '';

		article.article.forEach(function (item){
			var li = document.createElement('li');

			var divLink = document.createElement('div');
			divLink.className = 'link';
			var input = document.createElement('input');
			input.type = 'checkbox';
			input.name = 'selid[]';
			input.value = item.id;
			var a = document.createElement('a');
			a.href = '../pache?id='+item.id;

			$(a).text(item.title);

			divLink.appendChild(input);
			divLink.appendChild(a);

			li.appendChild(divLink);

			var datetime = document.createElement('div');
			datetime.className = 'datetime';
			$(datetime).text(item.time);

			li.appendChild(datetime);

			articleEle.appendChild(li);
		});

		listenArticleList();
	},
	loadArticleList: function (page, limit){
		var my = this;
		manager.getArticleList(
			function (article){
				envir.article = article;
				my.RenderingArticleList(article);
				manager.renderingPageSelect();
			},
			function (err){
				alert('loadArticleList fail!');
				throw new Error(err);
			},
			page, limit
		);
	}
};
display.animated.Editor.close.apply($('#editor')[0], []);
display.status('');

var manager = {
	getArticleById: function (id, ok, fail){
		var url = '../'+'get.php?'+ $.stringifyRequest({'id': id, 'display':'json'});
		$.vjax( url, 'GET',
			function (data){
				try{
					var article = JSON.parse(data);
				}catch(e){
					throw new Error(e);
				}
				display.loadEditor(article);
			},
			function (err){}
		);
	},
	collectSelected: function (checkBox, empty){
		var checkedArr = [];
		try{
			for ( var i = 0; i<checkBox.length; ++i ){
				if ( checkBox[i].checked === true ){
					checkedArr.push(checkBox[i]);
					!this[checkBox[i].name] && (this[checkBox[i].name] = Array());
					this[checkBox[i].name].push( checkBox[i].value );
				}
			}
			!checkedArr.length && empty && empty();
			this['checkedArr'] = checkedArr;
		}catch(e){
			alert(e);
			throw new Error(e);
		}
	},
	getArticleList: function (ok, fail, page, limit){
		var display = arguments.length > 4 ? arguments[5] : "json";
		var tmp;
		if ( typeof fail !== 'function' ){
			tmp = page;
			limit = page;
			page = fail;
		}
		if ( limit === undefined ){
			limit = envir.limit;
		}

		var getObj = {};
		(function (){
			function isUndefined(obj){
				return obj === undefined ? true : false;
			}
			this.pw = $.cookie('pw');
			this.type = 'getindex';
			this.display = display;
			isUndefined(page) || (this.page = page);
			isUndefined(limit) || (this.limit = limit);
		}).apply(getObj,[]);
		var url = 'ad.php?'+$.stringifyRequest(getObj);
		$.get(url,
			function (data){
				if ( getObj.display === 'json' ){
					var obj = $.json2obj(data);
					if ( obj !== null ){
						ok(obj);
					}else{
						throw new Error('getArticleList/$.get/json2obj: json fail.');
					}
				}else{
					ok(data);
				}

			},
			fail
		);
	},
	renderingPageSelect: function (){
		var pagelink = $("#pageselect .pagelink")[0];
		var page = envir.article.page;
		var countPage = envir.article.countPage;
		var i = page;
		var str = "";
		if ( i-4 < 1 ){
			$i = 5;
		}
		for ( i=i-4; i<page+5; ++i ){
			if ( i>countPage ){
				break;
			}else if ( i < 1 ){
				continue;
			}else{
				if ( i === page ){
					str += '<div class="selected">'+i+'</div>';
				}else{
					str += '<div class="selectable">'+i+'</div>';
				}
			}
		}
		pagelink.innerHTML = str;
		var lthis = this;
		var div = $('#pageselect .pagelink div');
		for (var i=0; i<div.length; ++i){
			div[i].onclick = function (){
				lthis.page( $(this).text() );
			};
		}
	},
	'nextPage': function (){
		++envir.page;
		this.renderingPageSelect();
		display.loadArticleList(envir.page, envir.limit);
	},
	'lastPage': function (){
		if ( envir.page>1 ){
			--envir.page;
			this.renderingPageSelect();
		}
		display.loadArticleList(envir.page, envir.limit);
	},
	'page': function (page){
		envir.page = Number.parseInt(page);
		this.renderingPageSelect();
		display.loadArticleList(envir.page, envir.limit);
	}
};
var pageButton = $('#pageselect .pagebutton');
pageButton[0].onclick = function (){
	manager.lastPage();
};
pageButton[1].onclick = function (){
	manager.nextPage();
};

/* listing ArticleList links */
function listenArticleList(){
	var articleIdList = document.getElementById('articlelist').getElementsByTagName('a');
	for ( var i=0; i<articleIdList.length; ++i){
		articleIdList[i].onclick = function (){
			mEvent.articleList.click.apply(this, []);
			return false;
		};
	}
}

document.getElementById('editor').getElementsByTagName('form')[0].onsubmit = function (e){
	var articleInfo = {
		'id': display.editorForm.articleObj.id,
		'title': this['title'].value,
		'article': this['article'].value,
		'type': this['type'].value,
		'class': this['class'].value,
		'tag': this['tag'].value.replace(/ /g, '').split(',')
	};
	var url = 'ad.php?pw='+ $.cookie('pw') +'&type='+envir.mode;
	display.status('saving');
	$.vjax(url, 'POST', articleInfo,
		function (d){
			$.json2obj(d,
				function (obj){
					console.info(obj);
				},
				function (){

				}
			);
			display.status('');

			display.loadArticleList(envir.page, envir.limit);
		},
		function (err){
			console.error(err);
		}
	);
//	console.info($.stringifyRequest(articleInfo));
	return false;

};
document.getElementById('create').onclick = mEvent.create;
document.getElementById('editor_close'). onclick = mEvent.closeEditor;
$('#articlemanagelist')[0].onsubmit = mEvent.deleteArticles;

display.loadArticleList(envir.page, envir.limit);
