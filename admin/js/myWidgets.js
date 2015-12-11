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
		if ( this.length ){
			f && f(this.pop());
			arguments.callee(f);
		}
		ele.innerHTML = '';
	};
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
				this.addEvent('click', function (ele, cursor){
					return function (){
						if ( typeof conObj === 'object' && typeof conObj.close === 'function' && conObj.close.apply(tagSelectorEle, [ele]) ){
							tagSelectorEle.removeChild(ele);
							return my.removeItem(cursor);
						}

					}
				}(ele[0], my.length), true);
			}));
			my.push(conObj[ conObj.value !== undefined ? 'value' : 'content' ]);
		});
	};
	this.removeItem = function (cursor){
		return this.splice(cursor, cursor);
	};
}
var tS=[];
tagSelector.apply( tS, [$('#tag .tag-selector')[0]] );
