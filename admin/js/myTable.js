var myTable = function (table){
	this.table = table;
	var my = this;
	var tHeadFlag = false;
	this['default'] = 'N/A';
	this.ele;
	function createElementAndAddContent(eleName, str, h){
		var ele = document.createElement(eleName);
		({
			'object': function (){
				ele.appendChild(str);
			},
			'function': function (){
				ele.appendChild(str(ele));
			},
			'string': function (){
				ele [ h ? 'innerHTML' : ele.textContent ? 'textContent' : 'innerText' ] = str;
			},
			'number': function (){
				this.string();
			}
		})[typeof str]();
		return ele;
	}
	/* 接收一个数组或者arguments，选出其中最大值 */
	function max(arr){
		arr = arguments.length === 1 ? arr : Array.prototype.slice.apply(arguments);
		return arr.reduce(function (a,b){
  			return a > b ? a : b;
		});
	};

	this.toObj = function (){};
	/* 清除表，除了表头( <thead> ) */
	this.clear = function (){
		var trArr = this.tableEle.getElementsByTagName('tr');
		Array.prototype.slice.apply( trArr ).forEach(function (trEle){
			my.tableEle.removeChild( trEle );
		});
	};
	this.reload = function (newTable, conObj){
		if ( conObj ){
			if ( tHeadFlag ){
				newTable.unshift( this.table.slice(0, 1)[0] );
			}
		}else{
			conObj = {};
		}
		conObj.default = conObj.default || '';
		this.table = newTable;
		return this.render({
			'type': 'reload',
			'default': conObj.default,
			'thead': tHeadFlag
		});

	};
	/* 数组方式插入列 */
	this.insert = function (row){
		function rowEach(arr, callback){
			for ( var i=0; i<my.column; ++i )
				callback(arr[i]);
		}
		function c(name, func){
			var e = document.createElement(name);
			func.apply(e, [e]);
			return e;
		}
		this.tableEle.appendChild(
			c('tr', function (tr){
				rowEach(row, function (td){
					tr.appendChild(createElementAndAddContent('td', td === '' ? '' : (td !== undefined ? td : my['default']) ));
				});
			})
		);
		this.table.push( row );
	};

	function createTableHeadEle(theadArr){
		my.table[0].forEach(function (th){
			my.tableHeadEle.appendChild(createElementAndAddContent('th', th));
		});
		return my.tableHeadEle;
	}
	function createTableRow(conObj){
		function rowEach(arr, callback){
			for ( var i=0; i<my.column; ++i )
				callback(arr[i]);
		}
		if ( typeof conObj !== 'object' ){
			conObj = {};
		}
		conObj.default = conObj.default || '';
		my.table.slice( Number(Boolean( tHeadFlag )) ).forEach(function (tr){
			my.insert(tr);
		});

	}
	this.render = function (conObj){
		var table = this.table;

		if ( this.tableEle === undefined ){
			this.tableEle = document.createElement('table');
		}
		if ( this.tableHeadEle === undefined ){
			this.tableHeadEle = document.createElement('thead');
		}
		var tableEle = this.tableEle;
		var tableHeadEle = this.tableHeadEle;

		/* 列数以表头做基准，溢出的忽略不计 */
		this.column = table[0].length;

		/*
			如果有表头
		*/
		if ( conObj !== undefined && conObj.thead ){
			tHeadFlag = true;
			tableEle.appendChild( createTableHeadEle( table[0] ) );
		}
		createTableRow(conObj);

		return tableEle;
	};
	if ( Array.isArray(table) ){
		/* conObj:
		{
			(boolean)thead	表头
			(string)default	缺省字段
		}
		 */
		this.create = function (conObj){
			return this.render(conObj);
		};
	}else if ( typeof table === 'object' ){
		this.objTab = new function (){
			this.push = function (key, value){
				table[key].push(value);
			};
			this.pop = function (pop){
				table[key].pop();
			};
		};
		/*
			接收的是对象的建表方法
				表头即是对象键

			参数：
				conObj={
					default
						默认填充单元格
					extendEach
						是否遍历继承的对象
				}

				function collectObjectKeys
					收集对象键，也就是收集表头

				function collectMaxColumn
					获取最大的行数
		*/
		this.create = function (conObj, titleContent){
			this.table = Array();
			var rowCursor = 0;
			function collectObjectKeys(extend){
				/* 是否遍历原型链 */
				var keys = Array();
				if ( extend ){
					for ( var key in table )
						keys.push(key);
				}
				else{
					keys = Object.keys(table);
				}
				return keys;
			}
			var keys = collectObjectKeys( conObj.extendEach || false );
			this.table.push( keys );

			function collectMaxColumn(){
				return max(keys.map(function (d){
					return table[d].length;
				}));
			}
			function createRow(tab, i){
				return keys.map(function (d){
					return tab[d][i];
				});
			}

			function createTable(){
				var newTable = [];
				for ( var i=0; i< collectMaxColumn(); ++i){
					var newRow = createRow(table, i);
					newTable.push( newRow );
				}
				return newTable;
			}
			function createTable(){
				var newTable = [];
				for ( var i=0; i< collectMaxColumn(); ++i){
					var newRow = createRow(table, i);
					newTable.push( newRow );
				}
				return newTable;
			}

			var newTable = createTable();
			newTable.unshift(keys);
			this.table = newTable;
			console.warn(this.table);

			function collectTitleContent(tab){
				if ( titleContent ){
					tab[0] = tab[0].map(function ( item ){
						if ( titleContent[item] !== undefined ){
							if ( typeof titleContent[item] === 'function' )
								return titleContent[item]();
							else
								return titleContent[item];
						}else{
							return item;
						}
					});
				}
			}

			collectTitleContent(this.table);

			return this.render({
				'thead': true,
				'default': conObj.default,
			});
		};
	}else{
		this.toArray = function (ele){

		};
		this.setRowColor = function (){};
		this.setRowStyle;

		this.setColumnColor = function (){};
		this.setColumn = function (){};

	}
};
