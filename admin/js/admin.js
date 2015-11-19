var articleIdList = document.getElementById('articlelist').getElementsByTagName('a');
var envir = {
	/* mode: 'new'(create Articcle), 'update'(edit Article) */
	'mode': null
};
var mEvent = {
	articleList: {
		click: function (){
			var id = $.getRequest(this.href, 'id');
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
	'status': function (s){
		var ele = document.getElementById('status');
		if ( s.length ){
			ele.innerText = s;
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
			'pw':$.getRequest('pw'),
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
		this.constructForm.apply( this.editorForm, [article] );
		this.animated.Editor.open.apply( $('#editor')[0], [] );
	}
};
display.animated.Editor.close.apply($('#editor')[0], []);
display.status('');

var manager = {
	getArticleById: function (id, ok, fail){
		var url = '../'+'get.php?'+ $.stringifyPostRequest({'id': id, 'display':'json'});
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
	getArticleList: function (){

	},

};

/* listing ArticleList links */
for ( var i=0; i<articleIdList.length; ++i){
	articleIdList[i].onclick = function (){
		mEvent.articleList.click.apply(this, []);
		return false;
	}
}

document.getElementById('editor').getElementsByTagName('form')[0].onsubmit = function (e){
	var articleInfo = {
		'id': display.editorForm.articleObj.id,
		'title': this['title'].value,
		'article': this['article'].value,
		'type': this['type'].value,
		'class': this['class'].value,
	};
	var url = 'ad.php?pw='+ $.getRequest('pw') +'&type='+envir.mode;
	display.status('saving');
	$.vjax(url, 'POST', articleInfo,
		function (d){
			console.info(d);
			display.status('');
		},
		function (err){
			console.error(err);
		}
	);
//	console.info($.stringifyPostRequest(articleInfo));
	return false;

};
document.getElementById('create').onclick = mEvent.create;
