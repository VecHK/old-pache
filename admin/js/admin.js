var articleIdList = document.getElementById('articlelist').getElementsByTagName('a');
var mEvent = {
	articleList: {
		click: function (){
			var id = $.getRequest(this.href, 'id');
			manager.getArticleById( id,
				function (){

				},
				function (){

				}
			);
		}
	}
};
var display = {
	'editorForm': {},
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
		this.form	= editor.getElementsByTagName('form')[0];
		this.title	= document.getElementsByName('title')[0];
		this.type = document.getElementsByName('type')[0];
		this.article = document.getElementsByName('article')[0];

		this.title.value = article.title;
		this.article.value = article.article;


		console.log('constructForm ok.');
	},
	loadEditor: function (article){
		this.constructForm.apply( this.editorForm, [article] );
		this.animated.Editor.open.apply( $('#editor')[0], [] );
	}
};
display.animated.Editor.close.apply($('#editor')[0], []);

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
