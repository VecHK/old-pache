"use strict";

const processResponse = (res, status, xhr) => {
	try {
		let result = JSON.parse(res);
		return result;
	} catch (e) {
		console.error(`res: `, res);
		console.error(`status: `, res);
		console.error(`xhr: `, res);
		throw new Error('请求的响应的不是一个有效的JSON实体');
	}
};
class AuthModel {
	login(inputPassword, callback){
		const aThis = this;
		this.getRandomCode(randomCode => {
			rjax('/auth', {
				method: 'post',
				data: {
					pw: md5(randomCode + inputPassword),
				},
				success(res, status, xhr){
					let info = processResponse.apply(this, arguments);
					callback(info.result, info);
				},
			})
		});
	}
	getRandomCode(callback){
		rjax('/auth', {
			method: 'propfind',
			success(res, status, xhr){
				if (status == 200) {
					callback(res);
				} else {
					console.error(res, status, xhr)
					throw new Error('获取随机码时出错！');
				}
			},
		});
	}
	isLogined(callback){
		let aThis = this;
		rjax('/auth', {
			method: 'get',
			success(res, status, xhr){
				let result = processResponse.apply(this, arguments);
				callback(result, res, status, xhr);
			},
		});
	}
	logOut(callback){
		let aThis = this;
		rjax('/auth/logout', {
			method: 'get',
			success(res, status, xhr){
				let info = processResponse.apply(this, arguments);
				callback(info, res, status, xhr);
			},
		});
	}
}

class TagModel extends AuthModel {

}

class PAMModel extends TagModel {
	deleteArticlesById(list, callback){
		rjax('/api/articles', {
			method: 'DELETE',
			data: {
				id: list,
			},
			success(res, status, xhr){
				let result = processResponse(res, status, xhr);
				if (result.code !== 0 || !Number.isInteger(result.code)) {
					console.error(result, res, status, xhr);
					throw new Error('文章集的返回码似乎有问题');
				} else {
					callback(result, status, xhr);
				}
			},
		});
	}
	postArticle(data, callback){
		rjax(`/api/articles`, {
			method: 'POST',
			data: data,
			success(res, status, xhr){
				let result = processResponse(res, status, xhr);
				if (result.code !== 0 || !Number.isInteger(result.code)) {
					console.error(result, res, status, xhr);
					throw new Error('文章集的返回码似乎有问题');
				} else {
					callback(result, status, xhr);
				}
			},
		});
	}

	patchArticleById(id, data, callback){
		rjax(`/api/articles/${id}`, {
			method: 'PATCH',
			data: data,
			success(res, status, xhr){
				let result = processResponse(res, status, xhr);
				if (result.code !== 0 || !Number.isInteger(result.code)) {
					console.error(result, res, status, xhr);
					throw new Error('文章集的返回码似乎有问题');
				} else {
					callback(result, status, xhr);
				}
			}
		});
	}

	getArticles(page, callback){
		let offset = envir.articleLimit * (envir.page-1);
		let limit = envir.articleLimit;
		let mthis = this;

		rjax(`/api/articles/offset/${offset}/limit/${limit}`, {
			method: 'GET',
			success(res, status, xhr){
				let result = processResponse(res, status, xhr);
				if (result.code !== 0 || !Number.isInteger(result.code)) {
					console.error(result, res, status, xhr);
					throw new Error('文章集的返回码似乎有问题');
				} else {
					callback(result, status, xhr);
				}
			},
		});
	}
}
