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
<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="content-type" content="text/html" charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
	<meta name="HandheldFriendly" content="true" />
	<title>manageArticle</title>

	<link href="style/global.css" rel="stylesheet" type="text/css" />
	<link href="../style/tipper.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../js/remilia.js"></script>
	<script type="text/javascript" src="js/ttt.js"></script>
	<script type="text/javascript" src="../js/taboverride.min.js"></script>
</head>
<body>
	<div id="articlelist">
		<div class="control">
			<div class="pageselect">
				<div class='pagebutton last' style="display:none;">上一页</div>
				<ul class="pagelink">
					loading
				</ul>
				<div class='pagebutton next' style="display:none;">下一页</div>
			</div>
			<button class="delete">删除</button>
			<button class="create">创建文章</button>
			<button class="draft">草稿</button>
		</div>
		<ul class="list">

		</ul>

	</div>

	<div id="editor">
		<div class="update">
			<div class="tag">
				<ul class="tag-selector"></ul>
				<div class="tag-add">
					<button class="tag-add-button">+</button>
					<input />
				</div>
			</div>

			<div class="class">
				<input name="class" placeholder="分类" />
			</div>

			<select name="type">
				<option value="markdown">Markdown</option>
				<option value="text">text</option>
				<option value="html">HTML</option>
			</select>

			<div class="control">
				<button class="preview">预览</button>
				<button class="save">保存</button>
				<button class="submit">发布</button>
				<button class="close">取消</button>
			</div>
		</div>

		<div class="edit-area">
			<input name="title" placeholder="标题" />
			<hr />
			<textarea name="content" placeholder="正文"></textarea>
		</div>
	</div>

	<div id="tipper">
		<div class="cursor">
		</div>
		<div class="confirm">
			<div class="label"></div>
			<div class="control">
				<button class="ok">ok</button>
				<button class="cancel">no</button>
			</div>
		</div>
		<div class="progress">

		</div>
		<div class="warn"></div>
		<div class="error">
			<div class="error-logo">
				<div class="left"></div>
				<div class="right"></div>
			</div>
			<div class="content">
				<div class="label"></div>
				<div class="control">
					<button class="ok">ok</button>
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="js/tipper.js"></script>
</body>
<script type="text/javascript" src="js/myWidgets.js"></script>
<script type="text/javascript" src="js/newadmin.js"></script>
</html>
