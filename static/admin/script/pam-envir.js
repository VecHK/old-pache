class Envir {
	set(key, value){
		window.localStorage.setItem(key, value);
	}
	save(){
		this.backSaveItems().forEach(saveItem => {
			this.set(saveItem, this[saveItem]);
		})
	}

	backSaveItems(){
		let objectArr = Object.keys(this);
		return objectArr.filter(item => this.saveAble.indexOf(item) >= 0);
	}

	get(key){
		let value = window.localStorage.getItem(key);
		if (value === null || value === undefined) {
			return this[key];
		} else {
			return value;
		}
	}
	load(){
		this.backSaveItems().forEach(loadItem => {
			this[loadItem] = this.get(loadItem);
		});
	}

	constructor(){
		this.page = 1;
		this.articleLimit = 10;
	}
}
Envir.prototype.saveAble = [
	'articleLimit',	//单页最大文章数
];
var envir = new Envir;
console.log('envir loaded');
