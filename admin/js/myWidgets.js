/*

*/
function tagSelector(ele){
	if ( ele === undefined ){
		ele = querySelector(ele);
	}
	this.click = function (){};
	this.appendItem = function (text){
		return ele.appendChild(this.createItem(text));
	};
	this.clearAll = function (f){
		while( this.length ){
			var obj = this.pop();
			f && f( obj );
		}
		ele.innerHTML = '';
	};
	function curSorCalcList(){

	}
	this.createItem = function (conObj){
		var my = this;
		var tagSelectorEle = ele;
		return $c('li', function (ele){
			ele.append('div', function (contentEle){
				contentEle[0].className = 'content';
				contentEle.css({
					'position': 'relative'
				});
				function applyContent(content){
					if ( typeof content === 'string' )
						contentEle.text(content);
					else
						contentEle.append(content(contentEle));
				}
				if ( conObj instanceof window.Node || conObj instanceof window.HTMLElement ){
					contentEle.append(conObj);
				}else{
					applyContent( typeof conObj !== 'object' ? conObj : conObj.content );
				}
			});
			ele.css({
				'position': 'relative'
			});
			ele.append($c('div', function (closeTag){
				closeTag.text('x');
				closeTag.cssLine()
					.position('absolute')
					.right('0px')
					.top('0px')
					.cursor('pointer');
				closeTag[0].className = 'closeTag';
				this.addEvent('click', function (interEle, cursor){
					return function (){
						if ( typeof conObj === 'object' ){
							if ( typeof conObj.close !== 'undefined' ){
								if ( conObj.close.apply(tagSelectorEle, [interEle]) === false ){
									return ;
								}
							}
						}
						tagSelectorEle.removeChild(interEle);
						return my.removeItem(ele[0]);
					}
				}(ele[0], my.length), true);
			}));

			var obj = {
				cursor: my.length,
				value: conObj.value,
				content: conObj.content,
				ele: ele[0]
			};
			my.push( obj );
		});
	};
	this.removeItem = function (cursorEle){

		for ( var i=0; i<this.length; ++i ){
			if ( this[i].ele === cursorEle ){
				console.warn(cursorEle);
				this.splice(i, 1);
			}
		}
	};
}
var tS=[];
tagSelector.apply( tS, [$('#tag .tag-selector')[0]] );
