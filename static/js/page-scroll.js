function minAudio(src){
	this.audio = new Audio;
	(typeof(src) == 'string') && this.audio.setSrc(src);
}
minAudio.prototype.play = function (){ this.audio.play() };
minAudio.prototype.pause = function (){ this.audio.pause() };
minAudio.prototype.setSrc = function (value){
	this.src = value;
	this.audio.src = this.src;
	this.audio.load();
	this.audio.play();
};

function attr(ele, named){
	var att = ele.attributes.getNamedItem(named);
	return att && att.value;
}

function setScrollAudio(ele){
	var au = new minAudio();
	window.addEventListener('scroll', function (e){
		console.log('asd');
		if ( window.scrollY >= ele.offsetTop - window.innerHeight + ele.offsetHeight ){
			au.src || au.setSrc( attr(ele, 'src') );
			au.play();
		}
		else{
			au.pause();
		}
	});
}

function queryPage(pageEle){
	Array.prototype.slice.call(pageEle.querySelectorAll('[scroll]')).forEach(function (ele){
		switch( attr(ele, 'scroll').toLowerCase() ){
			case 'audio':
				setScrollAudio(ele);
			break;

			default:
		}
	});
}

window.addEventListener('load', function (){
	queryPage( document.getElementById('article') );
});

function PPEPlayer(){
	this.audio = new Audio;
	this.ele = document.getElementById('ppep');

}
