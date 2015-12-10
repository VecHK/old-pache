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
	this.createItem = function (text){
		return $c('div', function (ele){
			ele.append('div', function (contentEle){
				contentEle[0].className = 'content';
				if ( typeof text === 'string' ){
					contentEle.text(text);
				}else{
					contentEle.append(text);
				}
				contentEle.css({
					'position': 'relative'
				});
			});
			ele.css({
				'position': 'relative'
			});
			ele.append($c('div', function (closeTag){
				closeTag[0].className = 'closeTag';
				closeTag.text('x');
				closeTag.css({
					'position': 'absolute',
					'right': '0px',
					top: '0px',
					'cursor': 'pointer'
				});
			}))
		});
	};
	this.removeItem = function (){
		el.removeChild(child)
	};
	$(ele).css({
		'position': 'absolute',
		'height': '20px',
		'width': '64px',
		'top': '0px',
		'right': '0px',
		'color': '#fff'
	});
}
var tS = new tagSelector( $('#tag-selector')[0] );
