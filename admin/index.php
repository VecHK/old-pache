<?php
require('../article.php');

if ( !( isset($_GET['pw']) && $_GET['pw'] == 'pache' ) ){
	echo 'pw';
	return 0;
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
</head>
<body>
	<ul id="articlelist">
		<?php

		$list = getArticles(((int)$page - 1) * $pache->pagelimit, $pache->pagelimit);
		for ( $i=0; $i<count($list); ++$i){
			echo '<li><div class="link"><a href="get.php?id='. $list[$i]['id'] .'">'.$list[$i]['title'].'</a></div><div class="datetime">'.$list[$i]['time'].'</div></li>';
		}
		?>
	</ul>
	<button id='create'>创建文章</button>
	<button id="delete">删除</button>
	<div id="editor">
		<form method="post">
			<input name="title" placeholder="标题" />
			<textarea name="article" placeholder="正文"></textarea>
			<select name="type">
				<option value="markdown">Markdown</option>
				<option value="text">text</option>
			</select>
			<button type="submit">post</button>
			<div id="status">N/A</div>
		</form>
	</div>
</body>
<script type="text/javascript" src="js/admin.js"></script>
</html>
