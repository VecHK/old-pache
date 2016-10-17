# node-Pache

node.js版本的Pache

# 配置

我建议还是用linux来配置数据库……也不是说windows不行，就是有点麻烦。。。

## 数据库

你需要准备这几个东西：

 - ### Redis

	存储Session

 - ### mongoDB

	存储文章用

如果你还想迁移数据的话，还可能要使用MySQL来访问PHP版Pache的数据库。

## Pache后端参数

都在`setting.json`里……

```JSON
{
	"mongo": {
		"mongoUrl": "mongodb://127.0.0.1:27017/test",
		"mongoCollection": "pache",
		"native_parse": false,
		"passwd": "pache"
	},
	"listingLimit": 10,
	"defaultTitle": "myBlog",
	"adminPassword": "pache"
}
```

这些参数的意思是：

 - ### mongo

	`mongoDB`数据库配置，包括数据库地址，集合的名称以及数据库密码等等
 - ### listingLimit

	每页最大文章数

 - ### defaultTitle

	主页的标题

 - ### adminPassword

	后台密码

