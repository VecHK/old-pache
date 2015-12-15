tabOverride.set($('textarea'));
$('textarea')[0].spellcheck = false;
function eventResizeTextarea(){
	ResizeTextarea(this, 4);
}
$('textarea')
	.addEvent('click', eventResizeTextarea, true)
	.addEvent('focus', eventResizeTextarea, true)
	.addEvent('keydown', eventResizeTextarea, true);


var envir = {
	/* mode: 'new'(create Articcle), 'update'(edit Article) */
	'mode': null,
	'page': 0,
	'limit': 10,
	'article': null,
	'type': 'getindex'
};
var mEvent = new function(){
	var my = this;
	this.articleList = {
		click: function (){
			display.setWait();
			var id = $.getRequest('id', this.href );
			envir.mode = 'update';
			manager.getArticleById( id,
				function (article){
					display.loadEditor(article);
				},
				function (){

				}
			);
		}
	};

	this.create = function (e){
		envir.mode = 'new';
		display.loadEditor({
			'title': 'Hello, World',
			'article': '在这儿输入你的文章',
			'type': 'markdown'
		});
		display.loadClass();
	};

	this.closeEditor = function (e){
		display.animated.Editor.close.apply($('#editor')[0], []);
	};
	this.deleteArticles = function (e){
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
	};
	this.updateArticle = function (e){
		try{
			manager.updateArticle(new manager.collectEditorInfo(this));
		}catch(e){
			console.error(e);
		}
		return false;
	};
	this.addTag = function (e){
		if ( $('#tag input')[0].value === '' ){
			alert('tag不能为空');
			return 0;
		}
		if ( new RegExp(/ /g).test($('#tag input')[0].value) ){
			alert('tag不能有空格');
			return 0;
		}
		tS.appendItem({
			'value': $('#tag input')[0].value,
			'content': $('#tag input')[0].value,
		});
		$('#tag input')[0].value = '';
	};

	$('#tag .tag-add-button').addEvent('click', function (e){
		my.addTag.apply(this.parentNode);
	}, true);;

	$('#editor form')[0].onsubmit = this.updateArticle;
	$('#create')[0].onclick = this.create;
	$('#editor_close')[0].onclick = this.closeEditor;
	$('#delete')[0].onclick = this.deleteArticles;
};

var display = new function (){
	var my = this;
	var processEle;
	this.setCursor = function (str){
		$('body').css({
			'cursor': str
		});
	};
	this.setWait = function (){
		this.setCursor('wait');
	}
	this.setProcess = function (){
		this.setCursor('progress');
	}
	this.removeProcess = function (){
		this.setCursor('');
	}
	this.editorForm = {};
	this.displayEditorClass = function (classArr){
		var classList = document.getElementById('class_list');
		classList.innerHTML = '';
		classArr.forEach(function (classItem){
			var option = document.createElement('option');
			option.value = classItem;
			classList.appendChild(option);
		});
	};
	this.displayEditorTag = function (tag){
		console.info(tag);
		tS.clearAll();
		tag.tagList.forEach(function (tag){
			tS.appendItem({
				'value': tag.tagname,
				'content': tag.tagname,
				'click': function (){
					console.log('tag on click')
				},
				'close': function (){
					console.log('tag on close')
					return true;
				}
			});
		});
	};
	this.status = function (s){
		var ele = document.getElementById('status');
		if ( s.length ){
			$(ele).text(s);
				ele.style.opacity = '1';
		}else{
			ele.style.opacity = '0.01';
		}
	};
	this.animated = {
		'Editor':{
			'status': false,
			'open': function (){
				$('#first').fadeOut(function (){
					$('#editor').fadeIn();
				});
			},
			'close': function (){
				$('#editor').fadeOut(function (){
					$('#first').fadeIn();
				});

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
	};
	$('#editor').fadeOut(function (){

	});
	//this.animated.Editor.close.apply($('#editor')[0], []);
//	display.status('');
	this.constructForm = function (article){
		var editor = $('#editor')[0];
		var form = editor.getElementsByTagName('form');
		this.articleObj = article;

		this.form	= editor.getElementsByTagName('form')[0];
		this.title	= $('[name=title]')[0];
		this.type = $('[name=type]')[0];
		this.article = $('[name=article]')[0];

		this.title.value = article.title;
		this.article.value = article.article;
		this.type.value = article.type;

		this['class'] = document.getElementsByName('class')[0];

		console.log('constructForm ok.');
	};
	this.loadClass = function (ok, fail){
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

						display.displayEditorClass(obj);
						my.removeProcess();
						ok && ok(obj);
					},
					fail
				);
			},
			function (err){
				throw new Error(err);
			}
		);
	};
	this.loadEditor = function (article){
		my.setProcess();
		var classListInput = $('#class_list_input')[0];
		this.loadClass(
			function (obj){
				if ( envir.mode !== 'new' ){
					if ( article.class.length !== 0 )
						classListInput.value = article.class;
				}

			},
			function (err, json){
				console.error('get class fail.');
				console.error(json);
				//throw new Error(err);
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
	};

	/* listing ArticleList links */
	function listenArticleList(){
		var articleIdList = $('#articlelist .article-link a');
		for ( var i=0; i<articleIdList.length; ++i){
			articleIdList[i].onclick = function (){
				mEvent.articleList.click.apply(this, []);
				return false;
			};
		}
	}
	this.RenderingArticleList = function (article){
		var articleEle = $('#articlelist')[0];
		articleEle.innerHTML = '';

		var tableList = {
			'标题': [],
			'分类': [],
			'创建时间': [],
			'修改时间': []
		};
		function formatTime(da){
			function fillZero(str){
				if ( str.__proto__ !== String.prototype ){
					str = String(str);
				}
				return (str.length === 1 ? '0' : '') + str;
			}
			da = new Date(da.replace(/-/g, '/'));//IE
			return 	da.getFullYear() +'/'+ fillZero(da.getMonth()+1) +'/'+ fillZero(da.getDate()) +' '+
					fillZero(da.getHours()) +':'+
					fillZero(da.getMinutes());
		}
		//console.log(article);
		article.articles.forEach(function (item){
			var li = document.createElement('li');

			var divLink = document.createElement('div');
			divLink.className = 'article-link';
			var input = document.createElement('input');
			input.type = 'checkbox';
			input.name = 'selid[]';
			input.value = item.id;
			var a = document.createElement('a');
			a.href = '../get.php?id='+item.id;

			$(a).text(item.title);

			divLink.appendChild(input);
			divLink.appendChild(a);

			li.appendChild(divLink);

			var tag = document.createElement('div');
			tag.className = 'tag';
			$(tag).text(function (){//构建tag，demo
				var text = '';
				if ( Array.isArray(article.articlesTagList[item.id]) )
					article.articlesTagList[item.id].map(function (d){
						text += d +',';
					});
				return text.substr(0, text.length-1);
			}());

			li.appendChild(tag);
			tableList['标题'].push(li);
			tableList['分类'].push( $c('a',
				function (ele){
					this.text(item.class);
					this[0].href = '../?class='+item.class;
					this[0].onclick = function (){
						envir.page = 0;
						my.loadArticleList(envir.page, envir.limit, {
							'class': [item.class]
						});
						//mEvent.getArticlesByClass( item.class );
						return false;
					};
				})
			);
			tableList['创建时间'].push( formatTime(item.time) );
			tableList['修改时间'].push( formatTime(item.ltime) );

			//articleEle.appendChild(li);
		});
		var table = new myTable(tableList);
		articleEle.appendChild(
			table.create(
				{'default': 'N/A'},
				{
					'分类': $c('div', function (){
						this.text('分类');
					})
				}
			)
		);


		listenArticleList();
	};

	this.loadArticleList = function (page, limit, conObj){
		var my = this;
		manager.getArticleList(new function (){
			if ( conObj ){
				this.class = conObj.class || [];
				this.tag = conObj.tag || [];
			}
			this.type = envir.type;
			this.ok = function (article){
				envir.article = article;
				my.RenderingArticleList(article);
				manager.renderingPageSelect();
			}
			this.fail = function (err){
				alert('loadArticleList fail!');
				throw new Error(err);
			};
			this.page = page;
			this.limit = limit;
		});
	};
};


var manager = new function(){
	var my = this;
	this.getArticleById = function (id, ok, fail){
		var url = '../'+'get.php?'+ $.stringifyRequest({'id': id, 'display':'json'});
		$.vjax( url, 'GET',
			function (data){
				try{
					var article = JSON.parse(data);
					ok && ok(article);
				}catch(e){
					throw new Error(e);
				}
			},
			function (err){
				console.error(err);
				fail && fail(err);
			}
		);
	};
	this.collectSelected = function (checkBox, empty){
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
	};
	this.getArticleList = function (conObj){
		$.check(conObj, {
			'display': function (v, k){
				if ( v === undefined )
					this[k] = 'json';
			},
			'page': function (v, k){
				if ( v === undefined )
					this[k] = envir.page;
			},
			'limit':function (v, k){
				if ( v === undefined )
					this[k] = envir.limit;
			},
			'type': function (v, k){
				if ( v === undefined)
					this[k] = envir.type;
			}
		});
		console.warn( conObj );
		var url = 'ad.php?'+$.stringifyRequest({
			pw: $.cookie('pw'),
			type: conObj.type,
			display: conObj.display,
			page: conObj.page,
			limit: conObj.limit,
			class: conObj.class
		});
		$.get(url,
			function (data){
				if ( conObj.display === 'json' ){
					var obj = $.json2obj(data);
					if ( obj !== null ){
						conObj.ok(obj);
					}else{
						throw new Error('getArticleList/$.get/json2obj: json fail.');
					}
				}else{
					conObj.ok(data);
				}

			},
			conObj.fail
		);
	};
	this.updateArticle = function (articleInfo){
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

	};
	this.collectEditorInfo = function (editorForm){
		if ( !(this instanceof arguments.callee) ){
			console.warn('collectEditorInfo: This is constructor Function.');
			return new arguments.callee(editorForm);
		}
		if ( envir.mode !== 'new' )
			this.id = display.editorForm.articleObj.id;

		this.title = editorForm['title'].value;
		this.article = editorForm['article'].value;
		this.type = editorForm['type'].value;
		this.class = editorForm['class'].value;

		this.tag = [];
		var my = this;
		tS.forEach(function (item){
			if ( typeof item.value === 'string' ){
				my.tag.push(item.value);
			}
		});
		return false;
	};

	/* 换页 */
	var pageButton = $('#pageselect .pagebutton');
	this.renderingPageSelect = function (){
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
	};
	this.nextPage = function (){
		++envir.page;
		my.renderingPageSelect();
		display.loadArticleList(envir.page, envir.limit);
	};
	pageButton[1].onclick = this.nextPage;

	this.lastPage = function (){
		if ( envir.page>1 ){
			--envir.page;
			my.renderingPageSelect();
		}
		display.loadArticleList(envir.page, envir.limit);
	};
	pageButton[0].onclick = this.lastPage;

	this.page = function (page){
		envir.page = Number.parseInt(page);
		this.renderingPageSelect();
		display.loadArticleList(envir.page, envir.limit);
	};

};

display.loadArticleList(envir.page, envir.limit);

/* tanks http://www.aa25.cn/code/515.shtml */
function ResizeTextarea(a,row){
	var agt = navigator.userAgent.toLowerCase();
	var is_op = (agt.indexOf("opera") != -1);
	var is_ie = (agt.indexOf("msie") != -1) && document.all && !is_op;
	if(!a){return}
	if(!row)
		row=5;
	var b=a.value.split("\n");
	var c=is_ie?1:0;
	c+=b.length;
	var d=a.cols;
	if(d<=20){d=40}
	for(var e=0;e<b.length;e++){
		if(b[e].length>=d){
			c+=Math.ceil(b[e].length/d)
		}
	}
	c=Math.max(c,row);
	if(c!=a.rows){
		a.rows=c;
	}
}
