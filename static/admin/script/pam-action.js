const model = new PAMModel;
const ui = new PAMUI;

/* 整个Pache的入口就在这个constructor里 */
class ActionInit {
	initAction(){
		this.initAuth();
		this.initArticles();
		this.initEditor();
		this.initMenu();
		this.initPageCode();
	}
	constructor(){
		let renderList = document.createElement('main');

		renderList.appendChild(ui.menu.ele);
		renderList.appendChild(ui.list.ele);
		renderList.appendChild(ui.pagecode.ele);

		renderList.appendChild(ui.editor.ele);
		renderList.appendChild(ui.auth.ele);

		document.body.appendChild(renderList);

		this.initAction();

		const autoLogin = () => {
			ui.auth.inputEle.value = 'pache';
			ui.auth.formEle.onsubmit();
		};
		autoLogin();
	}
}
class AuthAction extends ActionInit {
	initAuth(){
		const auth = ui.auth;
		auth.onSubmit = passWord => {
			model.login(passWord, result => {
				auth[result ? 'loginOk' : 'loginFail']();
			});
		};
		auth.loginOk = () => {
			auth.hide();
			this.loadArticles();
		};
	}
}
class MenuAction extends AuthAction {
	initMenu(){

	}
}
class EditorAction extends MenuAction {
	setWait(){

	}
	articleSubmit(article){
		/* 这个是有id的文章，所以使用patch方式 */
		// let id = ui.editor.raw._id;
		let id = article._id;
		if (id !== undefined) {
			console.info('patch Article');
			model.patchArticleById(id, article, (result) => {
				console.info(result);
				this.loadArticles();
				alert('ok');
			});
		} else {
			console.info('post Article');
			envir.page = 1;
			model.postArticle(article, (res) => {
				console.info(res);
				article._id = res.result.insertedIds[0];
				ui.editor.fill(article);
				this.loadArticles();
				alert('ok')
			});
		}
	}
	setArticleSubmit(){
		ui.editor.submitClick.push(article => {
			this.articleSubmit(article);
		});
	}
	initEditor(){
		ui.editor.helpClick = () => {
			alert(`
			Esc键退出编辑器
			左上角是标签编辑器`);
		};
		ui.editor.ele.style.display = 'none';
		ui.list.titleClick = (cursor) => {
			let article = this.list[cursor];
			ui.editor.raw = article;
			ui.editor.open();
			ui.editor.fill(article);
		};

		ui.menu.addItem({
			text: '创建文章',
			click(){
				let article = {
					type: 'markdown',
					title: '',
					article: '',
					tags: [],
				};
				ui.editor.raw = article;
				ui.editor.open();
				ui.editor.fill(article);
			},
		});

		this.setArticleSubmit();

		const aThis = this;
		window.onkeydown = function (e){
			console.warn(e.keyCode);
			if (e.ctrlKey && e.keyCode == 83) {
				aThis.articleSubmit(ui.editor.collect());
				return false;
			} else if (e.keyCode == 27) {
				ui.editor.close();
			}
		};
	}
}
class ArticlesAction extends EditorAction {
	getArticles(callback){
		model.getArticles(envir.page, (resObj) => {
			this.getArticlesCallback.forEach((func, cursor) => {
				func(resObj.result, cursor);
			});
			callback && callback(resObj.result);
		});
	}
	renderArticles(items){
		ui.list.render(items);
	}
	loadArticles(callback){
		this.getArticles();
	}
	bindArticlesRendering(){
		this.getArticlesCallback.push((result) => {
			this.count = result.count;
			this.list = result.items;
			this.renderArticles(result.items);
		});
	}
	/*
		TODO
		1.删除文章后可以试试把文章存到localStorage里
		2.提示是否删除
	*/
	deleteArticles(){
		let selectedItems = ui.list.getSelected().map((selected, cursor) => {
			if (selected) {
				return this.list[cursor]._id;
			} else {
				return null;
			}
		}).filter(item => item !== null);

		model.deleteArticlesById(selectedItems, (result, status, xhr) => {
			this.loadArticles();
		});
	}
	setHiddenMenu(){
		ui.menu.addHidden({
			text: '删除',
			click: this.deleteArticles.bind(this),
		});
	}
	setSelectAction(){
		ui.list.haveSelected.push((clickEle, selected) => {
			ui.menu.openHide();
		});
		ui.list.noneSelected.push((clickEle, selected) => {
			ui.menu.closeHide();
		});
	}
	initArticles(){
		this.count = 0;
		this.getArticlesCallback = [];

		this.bindArticlesRendering();
		this.setHiddenMenu();
		this.setSelectAction();
	}
}
class PageCodeAction extends ArticlesAction {
	bindPageCodeRendering(){
		this.getArticlesCallback.push(function (result){
			let countPage = Math.ceil(result.count / envir.articleLimit);
			ui.pagecode.renderPage(envir.page, countPage);
		});
	}
	initPageCode(){
		this.bindPageCodeRendering();
		ui.pagecode.clickCodePage = (code) => {
			envir.page = code;
			this.getArticles(()=>{});
		};
	}
}

class Action extends PageCodeAction {

}

const act = new Action;
