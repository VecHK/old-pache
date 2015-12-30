var model = new function (){
	this.loadArticleList = function (conObj){
		var url = 'ad.php?' + $.stringifyRequest({
			pw: $.cookie('pw'),
			type: 'getindex',
			display: 'json',
			page: conObj.page,
			limit: conObj.limit
		});
		$.getJSON(url, conObj.ok, conObj.fail);
	};
	this.loadArticleById = function (conObj){
		var url = '../get.php?' + $.stringifyRequest({
			id: conObj.id,
			display: 'json'
		});
		$.getJSON(url, conObj.ok, conObj.fail);
	};
	this.updateArticle = function (conObj){
		var url = 'ad.php?' + $.stringifyRequest({
			pw: $.cookie('pw'),
			type: conObj.id ? 'update' : 'new'
		});
		$.post(
			url,
			conObj.article,
			conObj.ok,
			conObj.fail
		);
	};
	this.deleteArticles = function (conObj){
		var url = 'ad.php?' + $.stringifyRequest({
			'pw': $.cookie('pw'),
			'type': 'manage',
			'manage': 'del'
		});

		$.post(url, {'selid': conObj.select}, conObj.ok, conObj.fail);
	};
};

var viewer = new function (){
	var viewer = this;
	var articleListEle = $('#articlelist .list')[0];

	/* tagSelector */
	this.tS=[];
	tagSelector.apply( this.tS, [$('#editor .tag .tag-selector')[0]] );

	var ResizeTextarea = function (a,row){
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
	};
	this.eventResizeTextarea = function (){
		ResizeTextarea(this, 4);
	};
	var renderingArticleList = function (articleList){
		function row( articleInfo ){
			$(articleListEle).append('li', function(){

				var check = this.append('input', function (checkEle){
					checkEle.type = 'checkbox';
					checkEle.name = 'selid[]';
					checkEle.value = articleInfo.id;
				});

				var classEle = this.append('input', function ( classEle ){
					classEle.className = 'class';
					classEle.placeholder = '空';
					classEle.value = articleInfo.class;
				});

				var titleEle = this.append('div', function (titleEle){
					titleEle.className = 'title';

					var titleName = this.append('h1', function (titleName){
						titleName.className = 'title-name';

						this.addEvent(
							'click',
							function (id){
								return function (){
									control.openArticle(id);
								}
							}( articleInfo.id ),
							true
						);

						this.text(articleInfo.title);
					})
					var tagEle = this.append('ul', function (tagEle){
						tagEle.className = 'tag';
						var tagList = articleList.articlesTagList[ articleInfo.id ] || Array();
						tagList.forEach(function ( item ){
							var titleName = this.append('li', function (){
								this.text(item);
							});
						}.bind(this));
					});
				});


			});
		};
		$(articleListEle).html('');
		articleList.articles.forEach(row);
	};
	this.refreshArticleList = function (articleList){
		renderingArticleList(articleList);
	};

	var renderingEditor = function (article){
		function setValueByName( name, value){
			console.info($('#editor [name="'+ name +'"]')[0]);
			$('#editor [name="'+ name +'"]')[0].value = value;
		}
		setValueByName( 'title', article.title );
		setValueByName( 'content', article.article );
		setValueByName( 'class', article.class);

		function getEditorType(){
			function getSelected( ele ){
				return select.children[ select.selectedIndex ];
			}
			return getSelected( $('#editor .update select')[0] ).value;
		}
		function setEditorType( typeName ){
			var select = $('#editor .update select')[0];
			select.value = typeName;
		}
		setEditorType( article.type );

		article.tag.forEach(function ( tag ){
			viewer.tS.appendItem({
				'value': tag.tagname,
				'content': tag.tagname
			});
		});

		viewer.eventResizeTextarea.bind($('#editor .edit-area [name="content"]')[0])();
	};
	this.openEditor = function (article){
		console.info(article);
		renderingEditor(article);
		$('#editor').cssLine()
			.display('')
			.opacity('0');
		setTimeout(function (){
			$('#editor').cssLine()
				.opacity('1')
				.transform('scale(1)');
		},5);
		$('#articlelist').fadeOut();
	};
	this.closeEditor = function (){
		$('#articlelist').fadeIn();
		setTimeout(function (){
			$('#editor').cssLine()
				.opacity('0')
				.transform('scale(1.2)');
			setTimeout(function (){
				$('#editor').css('display', 'none');
			}, 618-5);
		}, 5);
	};
};

var control = new function (){
	/* Tipper */
	var tip = Tipper( $('#tipper') );

	var envir = new function (){
		this.page = 0;
		this.limit = 10;
		this.updateType = null;
		this.editorStatus = 'new';
		this.currentArticle;
	};

	this.collectArticleData = function (){
		var getEditorFormValueByName = function ( name ){
			return $('#editor [name="'+name+'"]')[0].value;
		};
		this['class'] = getEditorFormValueByName('class');

		this.title = getEditorFormValueByName('title');

		this.article = getEditorFormValueByName('content');

		this.type = getEditorFormValueByName('type');

		this.tag = viewer.tS.map(function (item){
			return item.value;
		});

		/* Extend */
		this.time;
		this.ltime;
	};

	this.refreshArticleList = function (){
		model.loadArticleList({
			page: envir.page,
			limit: envir.limit,
			ok: viewer.refreshArticleList,
			fail: function (err){
				console.error(err);
				alert('错误QAQ');
			}
		});
	};
	this.openArticle = function (id){
		model.loadArticleById({
			'id': id,
			ok: function (data){
				console.warn(data);
				viewer.openEditor(data);
				envir.currentArticle = data;
			},
			fail: function (err){
				console.error(err);
			}
		})
	};


	var mEventF = (function (){
		var control = this;
		var load = function (){
			viewer.closeEditor();
			control.refreshArticleList();
		};

		window.onload = load;
		$('#editor .close').addEvent('click', viewer.closeEditor, true)

		var addTag = function (e){
			var tagInputEle = $('#editor .tag .tag-add input')[0];
			if ( tagInputEle.value === '' ){
				alert('tag不能为空');
				return 0;
			}
			if ( new RegExp(/ /g).test( tagInputEle.value ) ){
				alert('tag不能有空格');
				return 0;
			}
			viewer.tS.appendItem({
				'value': tagInputEle.value,
				'content': tagInputEle.value,
			});
			tagInputEle.value = '';
		};
		$('#editor .tag .tag-add-button').addEvent('click', addTag, true);

		var EditorSubmit = function (){
			this.collectArticleData.apply( envir.currentArticle );
			model.updateArticle({
				'article': envir.currentArticle,
				'ok': function (data){
					var backInfo = JSON.parse(data);
					if ( backInfo.code == 0 ){
						envir.currentArticle = backInfo.info;

						this.refreshArticleList();
					}else{
						console.error('submit fail: '+backInfo.str);
					}
				}.bind(this),
				'fail': function (err){
					console.warn(err);
				}
			});
		};
		$('#editor .submit').addEvent('click', EditorSubmit.bind(control), true);

		var delArticles = function (){
			function collectSelected(){
				var select = Array.prototype.slice.apply( $('#articlelist [name="selid[]"]') );
				return select.filter(function (checkbox){
					return checkbox.checked && checkbox.value;
				});
			}
			function selected2Array( checked ){
				return checked.map(function (checked){
					return checked.value;
				});
			}
			model.deleteArticles({
				'select': selected2Array( collectSelected() ),
				'ok': function (data){
					var info = JSON.parse(data);
					if ( info.code ){
						console.error('delArticles: '+info.str);
					}
					this.refreshArticleList();
				}.bind(this),
				'fail': function (){

				}
			})

		}.bind(this);

		$('#articlelist .control .delete').addEvent('click', delArticles, true);


	}).apply(this);

	/* tab控制 */
	tabOverride.set($('textarea'));
	$('textarea')[0].spellcheck = false;

	/*
		textarea自动变长
		tanks http://www.aa25.cn/code/515.shtml
	*/
	$('#editor .edit-area [name="content"]')
		.addEvent('click', viewer.eventResizeTextarea, true)
		.addEvent('focus', viewer.eventResizeTextarea, true)
		.addEvent('keydown', viewer.eventResizeTextarea, true);

	$('#articlelist .control .create').addEvent('click', function (){
		envir.updateType = 'new';
		envir.currentArticle = {
			'title': 'Hello, World',
			'article': '',
			'class': '',
			'type': 'markdown',
			'tag': []
		};
		viewer.openEditor(envir.currentArticle);
	}, true);

};
