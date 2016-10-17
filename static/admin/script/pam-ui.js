
/*
	标签管理器的组件类
	TODO
		添加/删除 的 动画效果
		字符检查
*/
class Tager {
	render(){

	}
	pushEffect(){

	}
	removeTag(value){
		const cursor = this.tagArr.indexOf(value);
		if (cursor >= 0) {
			this.tagArr.splice(cursor, 1);
			this.removeTag.call(this, value);
		} else {
			this.render();
		}
	}
	checkArrayRepact(value){
		return this.tagArr.indexOf(value) >= 0;
	}
	addTag(value){
		if (!this.checkArrayRepact(value)) {
			this.tagArr.push(value);
			this.render();
		}
	}

	initTager(ele){
		this.ele = ele || document.createElement('div');
		this.ele.innerHTML = `
		<div class="tag-list"></div>
		<input placeholder="输入tag" />`;
		this.ele.classList.add('tager');

		this.tagListEle = $('.tag-list', this.ele);
		this.inputEle = $('input', this.ele);

		const tThis = this;
		this.inputEle.onchange = function (e){
			if (tThis.checkArrayRepact(this.value)) {
				alert('输入的tag有重复！');
			} else {
				tThis.tagPush(this.value);
				this.value = '';
			}
		};
	}
	tagPush(tagName){
		let newTagEle = document.createElement('div');
		newTagEle.classList.add('tag-item');

		newTagEle.innerHTML = `<span class=""></span>`;
		let newTagElelabel = $('span', newTagEle);
		newTagElelabel.innerText = tagName;

		this.tagArr.push(tagName);
		newTagEle.onclick = () => {
			removeElement(newTagEle);
			this.removeTag(tagName);
		};

		this.tagListEle.appendChild(newTagEle);
	}
	/* 重新渲染 */
	reloadTags(tagArr){
		this.tagArr = [];
		this.tagListEle.innerHTML = '';
		if (Array.isArray(tagArr)) {
			tagArr.forEach(this.tagPush.bind(this))
		} else {
			this.tagArr.forEach(this.tagPush.bind(this))
		}
	}
	constructor(ele){
		this.tagArr = [];
		this.initTager(ele);
	}
}
class Editor {
	textAreaResize(a, row){
		var agt = navigator.userAgent.toLowerCase();
		var is_op = (agt.indexOf("opera") != -1);
		var is_ie = (agt.indexOf("msie") != -1) && document.all && !is_op;
		if(!a){return}
		if(!row)
			row=5;
		var b=a.value.split("\n");
		var c=is_ie?1:0;
		c+=b.length;
		var d=a.cols;
		if(d<=20){d=40}
		for(var e=0;e<b.length;e++){
			if(b[e].length>=d){
				c+=Math.ceil(b[e].length/d)
			}
		}
		c=Math.max(c,row);
		if(c!=a.rows){
			a.rows=c + 1;
		}
	}
	open(){
		fadeIn(this.ele);
	}
	close(){
		fadeOut(this.ele);
	}
	helpClick(){
		console.info('this is editor help');
	}
	setSubmitClick(){
		this.submitClick = [];
	}
	getSelected(selectEle){
		return selectEle.children[ selectEle.selectedIndex ];
	}
	getEditorType(){
		return this.getSelected(this.selectEle).value;
	}
	setEditorType(typeName){
		this.selectEle.value = typeName.toLowerCase();
	}
	fill(data){
		$('[name="title"]', this.ele).value = data.title;
		$(`[name="article"]`, this.ele).value = data.article;

		this.tager.reloadTags(data.tags);

		this.textAreaResize($(`[name="article"]`, this.ele), 4);
		this.setEditorType(data.type || 'text');

		if (data._id !== undefined) {
			this.idEle.innerText = data._id;
		} else {
			this.idEle.innerText = '';
		}
	}
	collect(){
		return {
			_id: this.idEle.innerText.length ? this.idEle.innerText : undefined,
			title: $('[name="title"]', this.ele).value,
			article: $(`[name="article"]`, this.ele).value,
			type: this.getEditorType(),
			tags: this.tager.tagArr,
		};
	}
	initEditor(){
		this.ele = document.createElement('div');
		this.ele.classList.add('editor');
		this.ele.innerHTML = `
		<div class="top-shadow"></div>
		<div class="tager"></div>
		<select class="editor-type">
			<option value="markdown" selected >Markdown</option>
			<option value="html">HTML</option>
			<option value="text">Text</option>
		</select>
		<form>
			<input name="title" placeholder="标题" />
			<textarea  name="article" placeholder="千里之行始于足下"></textarea>
			<div class="side-line"></div>
		</form>
		<div class="editor-side">
			<div class="submit">↓</div>
			<div class="help-button">?</div>
		</div>
		<div class="article-id"></div>
		`;
		this.tagerEle = $('.tager', this.ele);
		this.tager = new Tager(this.tagerEle);

		this.selectEle = $('.editor-type', this.ele);

		this.submitEle = $('.submit', this.ele);
		this.setSubmitClick();
		this.submitEle.onclick = (e) => {
			let data = this.collect();
			this.submitClick.forEach((func, cursor, pool) => {
				func(data, cursor, pool);
			});
		};

		this.helpEle = $('.help-button', this.ele);
		this.helpEle.onclick = (e) => {
			this.helpClick(e, this);
		};

		this.idEle = $('.article-id', this.ele);
	}
	setEditorPlugin(){
		/* tab控制 */
		tabOverride.set($('textarea', this.ele));
		$('textarea', this.ele).spellcheck = false;

		/*
			textarea自动变长
			tanks http://www.aa25.cn/code/515.shtml
		*/
		let tThis = this;
		let textarea = $('[name="article"]', this.ele);
		let resize = function (e){
			tThis.textAreaResize(this, 4);
		};
		['keydown', 'focus', 'click'].forEach(
			eventName => textarea.addEventListener(eventName, resize)
		);
	}
	constructor(ele){
		this.initEditor(ele);
		this.setEditorPlugin();
	}
}
class ListUI {
	getSelected(){
		return $$('[name="select"]', this.ele).map(ele => ele.checked);
	}
	setSelectedEventPool(){
		this.haveSelected = [];
		this.noneSelected = [];
	}
	fetchSelect(ele, cursor){
		let selected = $$(':checked', this.ele);
		console.warn(arguments);
		this[selected.length ? 'haveSelected' : 'noneSelected'].forEach(f => {
			f(ele, selected, cursor);
		});
	}
	fetchTags(tags){
		let str = '';
		try {
			tags.forEach(tag => {
				str += `<li>${tag}</li>`
			});
		} catch (e) {
			console.error(e);
			console.error("警告： 标签遍历出错，请检查文章数据是否完整！（出错的标签已使用「ERROR_TAGS」标示");
			str = 'ERROR_TAGS';
		}
		return str;
	}
	titleClick(cursor){
		console.warn(cursor);
	}
	renderItem(article, cursor, articles){
		let ele = document.createElement('div');
		ele.classList.add('item');
		ele.innerHTML = `
		<input name="select" type="checkbox" />
		<div class="item-info">
			<span>${article.title}</span>
			<ul class="item-tag">
				${this.fetchTags(article.tags)}
			</ul>
		</div>
		`;

		$('span', ele).addEventListener('click', e => {
			this.titleClick(cursor);
		});

		$('[name="select"]', ele).addEventListener('click', e => {
			this.fetchSelect(ele, cursor);
		});

		this.ele.appendChild(ele);
	}
	render(articleData){
		this.ele.innerHTML = '';
		articleData.forEach(this.renderItem.bind(this));
	}
	initList(){
		this.ele = document.createElement('div');
		this.ele.classList.add('pam-list');

		this.setSelectedEventPool();
	}
	constructor(){
		this.initList();
	}
}
const smallCodePage = (arr, page) => arr.find(item => item <= 0);
const ArrayAllAdd = (arr) => arr.map(item => item += 1);

class PageCode {
	/* 当前页码，总页码 */
	renderPage(page, countPage){
		const toCenter = Math.floor(this.length / 2);
		let cursor = page - toCenter,
			right = page + toCenter;

		if (cursor <= 0){
			right += Math.abs(cursor) + 1;
			cursor = 1;
		}

		if (right > countPage){
			cursor -= Math.abs(right-countPage);
			if (cursor <= 0){
				cursor = 1;
			}
			right = countPage;
		}

		let codeEle = $$('div', this.ele);
		let eleCursor = 0;

		for (; cursor<=right; ++cursor){
			if (page === cursor){
				codeEle[eleCursor].classList.add('current-pagecode');
			} else {
				codeEle[eleCursor].classList.remove('current-pagecode');
			}
			codeEle[eleCursor].innerText = cursor;
			++eleCursor;
		}
	}
	clickCodePage(e){
		console.warn(this);
		console.info(e);
	}
	initElement(){
		for (let i=0; i<this.length; i++) {
			this.ele.innerHTML += `<div></div>`;
		}
		$$('div', this.ele).forEach((ele, cursor) => {
			ele.addEventListener('click', e => {
				this.clickCodePage(parseInt(ele.innerText), cursor, e);
			});
		});
	}
	initPageCode(){
		this.ele = document.createElement('div');
		this.ele.classList.add('pagecode');
		this.length = 5;
		this.initElement();
	}
	constructor(){
		this.initPageCode();
	}
}

class Menu {
	removeMenuItem(item){

	}
	addMenuItem(item, saver, parentEle){
		const itemEle = document.createElement('div');
		itemEle.classList.add('menu-item');

		itemEle.innerText = item.text;

		itemEle.onclick = (e) => {
			item.click(this, e);
		};

		parentEle.appendChild(itemEle);

		let saveItem = {
			ele: itemEle,
			item,
		};
		saver.push(saveItem)
		return saveItem;
	}
	addItem(item){
		return this.addMenuItem(item, this.menu, this.menuEle);
	}
	addHidden(item){
		return this.addMenuItem(item, this.hide, this.hideEle);
	}

	openHide(){
		fadeIn(this.hideEle);
	}
	closeHide(){
		fadeOut(this.hideEle);
	}

	initMenu(){
		this.ele = document.createElement('div');
		this.ele.classList.add('pam-menu');

		this.ele.innerHTML = `
		<div class="menu-items"></div>
		<div class="menu-hidden-items"></div>
		`;

		this.menu = [];
		this.menuEle = $('.menu-items', this.ele);

		this.hide = [];
		this.hideEle = $('.menu-hidden-items', this.ele);
		this.hideEle.style.display = 'none';
	}
	constructor(menuSet){
		this.initMenu();
	}
}

class AuthUI {
	initEvent(){

	}
	show(){
		fadeIn(this.ele);
	}
	hide(){
		fadeOut(this.ele);
	}
	loginOk(){
		this.hide();
	}
	loginFail(){
		alert("登陆失败，请检查账号密码是否正确！");
	}
	onSubmit(pw){

	}
	initAuth(){
		this.ele = document.createElement('div');
		this.ele.classList.add('auth-frame');
		this.ele.innerHTML = `
		<div class="auth-label">输入账号密码以继续</div>
		<form>
			<input class="auth-pw" type="password" name="pw" placeholder="密码" />
		</form>`;

		this.formEle = $('form', this.ele);
		this.inputEle = $('input', this.ele);

		$('form', this.ele).onsubmit = (e) => {
			this.onSubmit(this.formEle.pw.value, this);
			return false;
		};
	}
	constructor(){
		this.initAuth();
	}
}

class PAMUI{
	constructor(){
		this.menu = new Menu;
		this.list = new ListUI;

		this.editor = new Editor;
		this.tager = this.editor.tager;

		this.pagecode = new PageCode;
		this.auth = new AuthUI;
	}
}
