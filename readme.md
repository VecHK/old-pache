# Pache
个人用小博客

## How to do?
首先你需要准备好一些东西……

 - [Michelf Markdown](https://github.com/michelf/php-markdown)
 - [Google Prettify](https://github.com/google/code-prettify)

#### Google Prettify
在 code-prettify-mastery/src/ 里找到prettify.js，然后复制到 pache/js/ 里

关于 Michelf Markdown，具体，看get.php里如何调用

### 编辑 ./sql.php

```php
class sqlInfo{
	public $database = "pache";
	public $address = "localhost";	//MYSQL_DATABASE;
	public $account = "root"; 		//MYSQL_USERNAME;
	public $password = "root"; 		//MYSQL_PASSWORD;
	public $con;
}
```

### 配置config.php
```php

/* 后台密码 */
public $admin = 'pache';

/* 单页最大文章数 */
public $pagelimit = 10;

/* 标题 */
public $title = "myBlog";

/* 站点目录 */
public $root = "/pache";

/* 允许更新的项目 */
public $updateAble = Array(
	'title',
	'article',
	'type',
	'class',
);

/* 允许创建的项目 */
public $createAble = Array(
	'title',
	'article',
	'type',
	'class',
);

/* 多说名称 */
public $duoshuo = "vechk";

/* 自定义类别
	键名即类名
	键值即文章ID
 */
public $customClass = array(
	'about' => 999,
	'links' => 998
);

```

### 创建数据库
```SQL
	SET NAMES utf8;
	SET time_zone = '+00:00';
	SET foreign_key_checks = 0;
	SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

	DROP TABLE IF EXISTS `pache_article`;
	CREATE TABLE `pache_article` (
		`id` int(11) NOT NULL AUTO_INCREMENT,
		`title` varchar(64) COLLATE utf8_bin DEFAULT NULL,
		`type` varchar(16) COLLATE utf8_bin DEFAULT NULL,
		`permission` int(255) DEFAULT NULL,
		`article` longtext COLLATE utf8_bin,
		`format` longtext COLLATE utf8_bin,
		`class` varchar(32) COLLATE utf8_bin DEFAULT NULL,
		`time` datetime DEFAULT NULL,
		`ltime` datetime DEFAULT NULL,
	PRIMARY KEY (`id`)
	) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


	DROP TABLE IF EXISTS `pache_tag`;
	CREATE TABLE `pache_tag` (
		`tagname` varchar(64) COLLATE utf8_bin DEFAULT NULL,
		`articleid` varchar(64) COLLATE utf8_bin DEFAULT NULL
	) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

```
