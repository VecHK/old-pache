/*
	ttt.js
	然并卵的表生成器
*/

/*
	dom 为绑定元素
	input只接受 数组、对象

	conObj 为参数对象，包括：
		defaultCell: 填充单元，如果不存在则使用缺省的 Default Unit
		thead: 表头设定，如果为true则在渲染表格式第一行用 <thead> 元素替代
*/
var ttt = function (dom, input, conObj){

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
	*/
	function cell( input, conObj ){
		function WriteElementText( ele, text){
			ele[ ele.textContent ? 'textContent' : 'innerText' ] = text;
		}
		var td = document.createElement('td');
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
				console.warn( 'the cell is undefined' );
				//td = cell( my.defaultCell );
				break;

			default:
		}
		return td;
	}

	if ( conObj ){
		if ( conObj.defaultCell ){
			this.defaultCell = cell( conObj.defaultCell );
		}
		else{
			this.defaultCell = cell(function (ele){
				ele.innerHTML = 'N/A';
			});
		}
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
		/* 插入行 接收一个 rowArray */
		/* 插入时一般采用 最大列数溢出/填充 策略 */
		headColumn = input[0].length;
		this.insert = function (row){
			var tr = document.createElement('tr');

			function appendTr(rowUnit){
				tr.appendChild( cell( rowUnit ) );
			}
			function rowEach(row, callback){
				for ( var cursor = 0; cursor < headColumn; ++cursor )
					callback( row[cursor] );
			}
			rowEach( row, appendTr );

			dom.appendChild( tr );
		};
		input.forEach( this.insert.bind(this) );
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
		/*
			列模式要求 input 的数据结构大概是这样的
			{
				"列1": [A],
				"列2": [B],
				"列3": [C],
				"列4": [D]
			}
			一般来说input对象中的键名为表头，input对象中每个属性数组即 列( column, col )
		*/
		function columnMode(input){

		}
		if ( Array.isArray(input) ){
			return rowMode.apply(this, [input]);
		}else if ( typeof input === 'object' ){
			return columnMode.apply(this, [input]);
		}
	}

	/*
		this.table 可以是对象也可以是数组
	*/
	this.table = collectInput.apply(this, [input]);

	this.tableEle = dom;

};
