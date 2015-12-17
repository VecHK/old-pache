/*
	ttt.js
	然并卵的表生成器
*/

/*
	dom 为绑定元素
	input只接受 数组、对象

	conObj 为参数对象，包括：
		defaultUnit: 填充单元，如果不存在则使用缺省的 Default Unit
		thead: 表头设定，如果为true则在渲染表格式第一行用 <thead> 元素替代
*/
var ttt = function (dom, input, conObj){

	/*	collectInput
		将input转为 this.table
		一般来说 this.table 只有两种模式： 行(数组)模式 和 列(对象)模式

		溢出策略
			行模式时，input中其它的数组可能会比第一个数组多，此时一般忽略

			列模式并没有这种情况

		填充策略
			行模式时，如果 input 中其它的数组的元素比第一个数组少，此时一般采用 缺省填充(Default Unit) 的方式

			列模式时, input中其它的数组的元素可能会比其它数组要少，此时也采用上面 缺省填充 的方式

	*/
	function collectInput( input ){
		/*	unit
			单元格
		*/
		function unit(content){

		}
		/*
			行模式要求 input 的数据结构大概是这样的
			[
				[列1, 列2, 列3, 列4],
				[A, B, C, D]
			]
			input的第一个元素为表头(thead), input数组中每个 数组元素 为 行( row )
		*/
		function rowMode(input){

		}

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
