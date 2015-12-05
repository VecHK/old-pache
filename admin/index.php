<?php
require('../article.php');

function comparedValue($value, $com){
	return $value == $com;
}
function checkArrayKeys($arr, $key){
	return isset($arr[$key]);
}

function checkArrayKeysAndComparedValue($arr, $key, $com){
	return checkArrayKeys($arr, $key) && comparedValue($arr[$key], $com);
}

function checkAdminPwCookie(){
	$pache = new pache;
	return checkArrayKeysAndComparedValue($_COOKIE, 'pw', $pache->admin);
}
function checkAdminPwPost(){
	$pache = new pache;
	return checkArrayKeysAndComparedValue($_POST, 'pw', $pache->admin);
}

if ( !checkAdminPwCookie() ){
	if ( !checkAdminPwPost() ){
		return require('pwinput.html');
	}
	setcookie('pw', $pache->admin, time()+604800);
}

if ( isset($_GET['page']) && (int)$_GET['page']>0 ){
	if ( isset($_GET['display']) ){
		$display = strtoupper($_GET['display']);
	}
	$page = (int) $_GET['page'];
}else{
	$page = 1;
}

?>
<!doctype HTML>
<html>
<head>
	<meta http-equiv="content-type" content="text/html" charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
	<meta name="HandheldFriendly" content="true" />
	<title>manageArticle</title>

	<link href="style/admin.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../js/remilia.js"></script>
	<script type="text/javascript" src="../js/taboverride.min.js"></script>
</head>
<body>
	<form id="articlemanagelist">
		<ul id="articlelist">

		</ul>
		<div id="control">
			<div id="pageselect">
				<div class='pagebutton'>上一页</div>
				<ul class="pagelink">
					<a>1</a> <a>2</a> <a>3</a>
				</ul>
				<div class='pagebutton'>下一页</div>
			</div>
			<button type="submit" id="delete">删除</button>
		</div>

	</form>
	<button id='create'>创建文章</button>
	<div id="editor">
		<form method="post">
			<input class="title" name="title" placeholder="标题" />
			<textarea name="article" placeholder="正文"></textarea>

			<input id="class_list_input" type="class" list="class_list" name="class" placeholder="class" />
			<datalist id="class_list" >
				<option label="N/A" value="" />
			</datalist>

			<input id="tag_list_input" name="tag" placeholder="Tag" />

			<select name="type" >
				<option value="markdown">Markdown</option>
				<option value="text">text</option>
				<option value="html">HTML</option>
			</select>
			<button type="submit">post</button>
			<div id="status">N/A</div>
		</form>
		<div id="editor_close">x</div>
	</div>
</body>
<script type="text/javascript" src="js/admin.js"></script>
</html>
