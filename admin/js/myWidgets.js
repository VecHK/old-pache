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
			this.append('div', function (contentEle){
				contentEle.className = 'content';
				this.css({
					'position': 'relative'
				});
				function applyContent(content){
					if ( typeof content === 'string' )
						this.text(content);
					else
						this.append(content(contentEle));
				}
				if ( conObj instanceof window.Node || conObj instanceof window.HTMLElement ){
					this.append(conObj);
				}else{
					applyContent.bind(this)( typeof conObj !== 'object' ? conObj : conObj.content );
				}
			});
			this.css({
				'position': 'relative'
			});
			this.append($c('div', function (closeTag){
				this.text('x');
				this.cssLine()
					.position('absolute')
					.right('0px')
					.top('0px')
					.cursor('pointer');
				closeTag.className = 'closeTag';
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
						return my.removeItem(ele);
					}
				}(ele, my.length), true);
			}));

			var obj = {
				cursor: my.length,
				value: conObj.value,
				content: conObj.content,
				ele: ele
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
