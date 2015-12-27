var model = new function (){
	this.loadArticleList = function ( conObj ){
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
		var url = '../get.php?' + $.stringify({
			id: conObj.id,
			display: 'json'
		});
		$.getJSON(url, conObj.ok, conObj.fail);
	};
};

var viewer = new function (){
	var renderingArticleList = function (articleList){
		function row( articleInfo ){
			console.info(articleInfo);
		};
		articleList.articles.forEach(row);
	};
	this.showArticleList = function (articleList){
		renderingArticleList(articleList);
	};
};

var control = new function (){
	var control = this;
	/* Tipper */
	var tip = Tipper( $('#tipper') );

	var envir = new function (){
		this.page = 0;
		this.limit = 10;
		this.updateType = null;
	};
	this.page = 0;
	this.limit = 10;

	this.status = 0;

	this.editorStatus = null;

	this.showArticleList = function (){
		model.loadArticleList({
			page: envir.page,
			limit: envir.limit,
			ok: viewer.showArticleList,
			fail: function (err){
				console.error(err);
				alert('错误QAQ');
			}
		});
	};


	var mEventF = (function (){
		var load = function (){
			//$('#editor').fadeOut();
			control.showArticleList();
		};

		window.onload = load;
	}).bind(this);
	var mEvent = new mEventF;

	/* tab控制 */
	tabOverride.set($('textarea'));
	$('textarea')[0].spellcheck = false;

	/* tagSelector */
	var tS=[];
	tagSelector.apply( tS, [$('#editor .tag .tag-selector')[0]] );
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
		tS.appendItem({
			'value': tagInputEle.value,
			'content': tagInputEle.value,
		});
		tagInputEle.value = '';
	};
	$('#editor .tag .tag-add-button').addEvent('click', addTag, true);

	/*
		textarea自动变长
		tanks http://www.aa25.cn/code/515.shtml
	*/
	function eventResizeTextarea(){
		ResizeTextarea(this, 4);
	}
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
	$('#editor .edit-area [name="content"]')
		.addEvent('click', eventResizeTextarea, true)
		.addEvent('focus', eventResizeTextarea, true)
		.addEvent('keydown', eventResizeTextarea, true);

};
