/*
	ttt.js
	然并卵的表生成器
*/

/*
	dom 为绑定元素


	conObj 为参数对象，包括：
		input只接受 数组、对象

		defaultCell: 填充单元，如果不存在则使用缺省的 Default Unit
		thead: 行模式表头设定
			一般是第一行作为 thead
			如果为 true ，则 input中第一个 rowArr 作为 <thead>
			如果为数组，则这个数组作为 <thead>

		thead: 列模式表头设定
			如果为 true，则 input中的 columnKey 作为 <thad> （也就是对象键名）
			如果为 对象，则对象中与input中相同键名的值作为 <thead>
			* 如果为 数组，则按照行模式的套路输出
				这个数组表头的功能暂时不开发

		列模式
			eachAll		是否遍历原型链
*/
var ttt = function (dom, conObj){

	var my = this;

	/*	cell
		生成单元格
		content接受 字符串/数字、函数、HTML元素(HTML Element) 等等
			字符串/数字
				返回 td，并且 td 的文本为设定的值
			函数
				执行传递td，然后返回td，如果有 Remilia.js，则绑定 domMethod
				如果函数有返回值,则这个返回值将会 append 到 td
			HTML元素
				直接 td.appendChild
			undefined
				采用填充策略
		当 input 为 HTMLTableCellElement （也就是 <td>元素）的时候，conObj为input，arguments[2]为conObj
	*/
	function cell( input, conObj ){
		function WriteElementText( ele, text){
			ele[ ele.textContent ? 'textContent' : 'innerText' ] = text;
		}
		function defaultCell( conObj ){
			var td = document.createElement('td');
			if ( conObj ){
				if ( conObj.defaultCell ){
					return cell(conObj.defaultCell);
				}
			}
			return cell('');
		}
		if ( input instanceof HTMLTableCellElement ){
			var td = input;
			input = conObj;
			conObj = arguments[2];
		}else{
			var td = document.createElement('td');
		}
		switch ( typeof input ){
			case 'string':
			case 'number':
				WriteElementText(td, String(input));
				break;

			case 'function':
				var result = input.apply( Remilia ? Remilia(td) : null, [td] );

				result && td.appendChild(result);

				break;

			case 'object':
				if ( !(input instanceof HTMLElement) ){
					console.warn('this input Probably not HTML Element');
					console.warn(input);
				}
				td.appendChild( input );
				break;

			case 'undefined':
				td = defaultCell( conObj );
				break;

			default:
		}
		return td;
	}

	/*
		行模式要求 input 的数据结构大概是这样的
		[
			[列1, 列2, 列3, 列4],
			[A, B, C, D]
		]
		* input的第一个元素为表头(thead), input数组中每个 数组元素 为 行( row )
		* 一般情况下都是以表头列数作为最大列数(headColumn)。超过 最大列数 则采用 溢出策略 忽略
	*/
	var headColumn = 0;
	function rowMode(input){
		this.insert = function (row, exEleName){
			var eleName = 'tr';
			if ( typeof exEleName === 'string' ){
				eleName = exEleName;
			}

			var tr = document.createElement( eleName );

			function appendTr(rowUnit){
				tr.appendChild( cell( rowUnit ) );
			}
			function rowEach(row, callback){
				for ( var cursor = 0; cursor < headColumn; ++cursor )
					callback( row[cursor] );
			}
			rowEach( row, appendTr );

			return dom.appendChild( tr );
		};
		/* 插入行 接收一个 rowArray */
		/* 插入时一般采用 最大列数溢出/填充 策略 */
		headColumn = input[0].length;
		var thFlag = false;
		if ( conObj.thead ){
			if ( conObj.thead === true ){
				this.insert( input[0], 'thead' );
				thFlag = true;
			}else{
				this.insert( conObj.thead, 'thead' );
//				headColumn = conObj.thead.length;
			}
		}

		input.slice( Number( thFlag ) ).forEach( this.insert.bind(this) );

		return input;
	}
	/*
		列模式要求 input 的数据结构大概是这样的
		{
			"列1": [A],
			"列2": [B],
			"列3": [C],
			"列4": [D]
		}
		*	一般来说input对象中的键名为表头，input对象中每个属性数组即 列( column, col )
		*	由于input中每个 元素数组 都是固定的，表的列数是固定的
			但有可能会出现一些列小于 最大元素数目列(maxColumnLength)，此时一般采用填充策略

	*/
	var maxColumnLength = 0;
	function columnMode(input){
		function collectObjectKeys( input ){
			var keys = Array();
			if ( conObj ){
				if ( conObj.eachAll ){
					for ( key in input )
						keys.push(key);
					return arr;
				}
			}
			keys = Object.keys( input );
			return keys;
		}

		var eleMapping = Array();
		var columnKeys = new function (){
			collectObjectKeys( input ).forEach(
				(function (item, i){
					this[ item ] = {
						col: i,
						length: 0
					}
				}).bind(this)
			);
		};
		var keys = collectObjectKeys( input );
		var table = new Object;

		function newRow( row, exEleName){
			var eleName = 'tr';
			if ( typeof exEleName === 'string' ){
				eleName = exEleName;
			}
			var tr = document.createElement(eleName);
			var tdEleMapping = Array();

			row.forEach(function (unit){
				var td = cell( unit, conObj );

				tdEleMapping.push( td );

				tr.appendChild(td);
			});
			++maxColumnLength;

			eleMapping.push( tdEleMapping );
			dom.appendChild( tr );
		}
		this.append = function (key, value){
			if ( eleMapping[ columnKeys[key].length ] === undefined ){
				var row = keys.map(function (colKey){
					if ( colKey === key ){
						return value;
					}else{
						return undefined;
					}
				});
				newRow(row);
			}
			else if ( columnKeys[key] !== undefined && input[key] !== undefined ){
				cell( eleMapping[ columnKeys[key].length ][ columnKeys[key].col ], value );
			}
		}
		this.add = function (key, value){
			this.append(key, value);
			table[key] || ( table[key] = Array() );
			table[ key ].push(value);

			++columnKeys[key].length;
		};
		if ( conObj.thead ){
			var thead = document.createElement('thead');

			if ( conObj.thead === true ){
				keys.forEach(function (item){
					thead.appendChild( cell(item) );
				});
			}
			else if ( Array.isArray(conObj.thead) ){

			}
			else if ( typeof conObj.thead === 'object' ){
				var theadArr = Array();

				Object.keys( conObj.thead ).forEach(function (comKey){
					if ( input[comKey] !== undefined ){
						var td = cell( conObj.thead[comKey] );
						thead.appendChild(td);

						theadArr.push( conObj.thead[comKey] );
					}
				});
			}
			dom.appendChild(thead);

		}

		keys.forEach(function (key){
			input[key].forEach(function (value){
				my.add(key, value);
			});
		});
		return table;
	}
	/*	collectInput
		将input转为 this.table
		一般来说 this.table 只有两种模式： 行(数组)模式 和 列(对象)模式

		溢出策略
			行模式时，input中其它的数组可能会比第一个数组多，此时一般忽略

			列模式并没有这种情况

		填充策略
			行模式时，如果 input 中其它的数组的元素比第一个数组少，此时一般采用 缺省填充(Default Cell) 的方式

			列模式时, input中其它的数组的元素可能会比其它数组要少，此时也采用上面 缺省填充 的方式

	*/
	function collectInput( input ){
		if ( Array.isArray(input) ){
			return rowMode.apply(this, [input]);
		}else if ( typeof input === 'object' ){
			return columnMode.apply(this, [input]);
		}
	}

	/*
		this.table 可以是对象也可以是数组
	*/
	this.table = collectInput.apply(this, [ conObj.input ]);

	this.tableEle = dom;

};
