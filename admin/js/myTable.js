var myTable = function (table){
	this.table = table;
	var my = this;
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
	function max(arr){
		arr = arguments.length === 1 ? arr : Array.prototype.slice.apply(arguments);
		return arr.reduce(function (a,b){
  			return a > b ? a : b;
		});
	};
	this.insert = function (){

	};
	this.render = function (conObj){
		function rowEach(arr, callback){
			for ( var i=0; i<my.column; ++i )
				callback(arr[i]);
		}
		var table = this.table;
		var tableEle = document.createElement('table'),
			tableHeadEle = document.createElement('thead');
		this.column = table[0].length;

		if ( conObj !== undefined && conObj.thead ){
			table[0].forEach(function (th){
				tableHeadEle.appendChild(createElementAndAddContent('th', th));
			});
			tableEle.appendChild(tableHeadEle);
		}

		conObj.default = conObj.default || '';
		table.slice( Number(Boolean(conObj.thead)) ).forEach(function (tr){
			var tableTrEle = document.createElement('tr');
			rowEach(tr, function (td){
				tableTrEle.appendChild(createElementAndAddContent('td', td || conObj.default ));
			});
			tableEle.appendChild(tableTrEle);
		});
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
		this.getHTML = function (eleInfo){
			return this.render(eleInfo).outerHTML;
		};
	}else if ( typeof table === 'object' ){
		/*
			对象建表
				表头即是对象键
			conObj:
				default
			extendEach
				是否遍历继承的对象
		*/
		this.create = function (conObj){
			var keys = [];
			this.table = [];
			var rowCursor = 0;
			if ( conObj.extendEach )
				for ( var key in table )
					keys.push(key);
			else
				keys = Object.keys(table);
			this.table.push(keys);

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
			for ( var i=0, maxCol=collectMaxColumn(); i<maxCol ; ++i)
				my.table.push(createRow(table, i));

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
