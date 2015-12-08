var myTable = function (table){
	this.table = table;
	var my = this;
	function createElementAndAddContent(eleName, str, h){
		var ele = document.createElement(eleName);
		typeof str === 'function' ? ele.appendChild(str(ele)) :
			h ? (ele.innerHTML = str) : (ele.textContent ? (ele.innerText = str) : ( ele.textContent = str ));
		return ele;
	};
	this.insert = function (){

	};
	if ( Array.isArray(table) ){
		/* conObj:
		{
			(boolean)thead	表头
			(string)default	缺省字段
		}
		 */
		this.create = function (conObj){
			function rowEach(arr, callback){
				for ( var i=0; i<my.column; ++i )
					callback(arr[i]);
			}
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
		this.getHTML = function (eleInfo){
			return this.getEle(eleInfo).outerHTML;
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
