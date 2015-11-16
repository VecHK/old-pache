
var myBlogS = {
	'article': {},
	'tag': {},
	'class': {},
	getJSON: function (address, ok, fail){
		vjax(address, 'GET',
			function(data){
				new transferJSON(data, ok, fail);
			}
		);
	},
	getIndex: function (address, ok, fail){},
	getArticleList: function (){},
	getTagList: function (){},
	getClassList: function (){},
	getArticleById: function (id, ok, fail){
		vjax(
			'export/myBlog-Static/article/'+id,
			'GET',
			ok,
			fail
		);
	},
	getArticlesByTagName: function ( tagName ){},
	getArticlesByClassName: function ( className ){
		return this['class'][className];
	},
	listingArticlesByClass: function ( className, current, limit){

	},

	ini: function (option, allReady){
		var fail = function (){

		};
		var get = function (path, ok){
			myBlogS.getJSON(
				path,
				function (data){
					ok && ok(data);
				},
				fail
			);
		};
		var flist = [
			function (){
				get(
					option.path+'index/class',
					function (obj){
						myBlogS['class'] = obj;
						get(
							option.path + ( option.defaultClass ? 'class/'+ encodeURIComponent(encodeURIComponent(option.defaultClass)) : 'index/article' ),
							function (obj){
								myBlogS['currentList'] = obj;
								allDone();
							}
						);
					}
				)
			},
			function (){
				get(
					option.path+'index/article',
					function (obj){
						myBlogS.article = obj;
						allDone();
					}
				);
			},
		];
		function allDone(){
			if ( arguments.callee.count !== undefined ){
				++arguments.callee.count;

				if ( arguments.callee.count >= (flist.length-1) ){
					allReady && allReady();
				}
			}else{
				arguments.callee.count=0;
			}

		}
		flist.forEach(function (d){
			d();
		});

	}
};
