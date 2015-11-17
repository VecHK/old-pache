<?php
header('Content-type: text/html;charset=utf-8');

require('article.php');

$display = 'HTML';
if ( isset($_GET['page']) && (int)$_GET['page']>0 ){
	if ( isset($_GET['display']) ){
		$display = strtoupper($_GET['display']);
	}
	$page = (int) $_GET['page'];
}else{
	$page = 1;
}
if ( isset($_GET['class']) ){
	switch($display){
		case 'JSON':
	//			echo json_encode(getArticleBy($_GET['by'], $_GET['byarg'], $display));
	//			return 0;
			break;

		case 'HTML':
		default:
			$list = getArticlesByClass($_GET['class'], ((int)$page - 1) * $pache->pagelimit, $pache->pagelimit);

	}
}
else if ( isset($_GET['tag']) ){
	$tag = Array();
	$current = "";
	for ( $i=0; $i<strlen( $_GET['tag'] ); ++$i){
		if ( $_GET['tag'][$i] == ' ' ){
			array_push($tag, $current);
			$current = "";
		}else{
			$current = $current . $_GET['tag'][$i];
		}
	}
	array_push($tag, $current);
//	echo var_dump($tag);

	$list = getArticlesByTag($tag, ((int)$page - 1) * $pache->pagelimit, $pache->pagelimit);

}else{
	switch($display){
		case 'JSON':
	//			echo json_encode(getArticleBy($_GET['by'], $_GET['byarg'], $display));
	//			return 0;
			break;

		case 'HTML':
		default:
			$list = getArticles(((int)$page - 1) * $pache->pagelimit, $pache->pagelimit);
	}
}

?>
<!doctype HTML>
<html>
<head>
	<title><?php echo $pache->title; ?></title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1;" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
	<meta name="HandheldFriendly" content="true" />

	<link rel="stylesheet" href="style/global.css" type="text/css" />
	<link rel="stylesheet" href="style/normal.css" type="text/css" media="screen and (min-width: 851px)" />
	<link rel="stylesheet" href="style/min.css" type="text/css" media="screen and (max-width: 850px)" />
<!--
	<link rel="stylesheet" href="style/myprettify.css" type="text/css" />

	<script type="text/javascript" src="js/Markdown.Converter.min.js"></script>
	<script type="text/javascript" src="js/Markdown.Sanitizer.min.js"></script>
	<script type="text/javascript" src="js/prettify.min.js"></script>
	<script type="text/javascript" src="js/Markdown.Extra.min.js"></script>
-->
	<script type="text/javascript" src="js/remilia.js"></script>

</head>
<body>
		<?php
			echo outClassIndexHTML();
		?>

	<ul id="list">
		<?php
			for ( $i=0; $i<count($list); ++$i){
				echo '<li><div class="link"><a href="get.php?id='. $list[$i]['id'] .'">'.$list[$i]['title'].'</a></div><div class="datetime">'.$list[$i]['time'].'</div></li>';
			}
		?>
	</ul>
	<div id="selectpage">
		<form method="get">
		<?php
			$countPage = ceil( articleCount('default')/$pache->pagelimit );

			$i=$page;
			if ( ($i-4)<1 ){
				$i = 5;
			}
			for ( $i=$i-4; $i<$page+5; ++$i){
				if ( $i > $countPage ){
					break;
				}
				if ( $page == $i ){
					echo $i.' ';
				}else{
					echo '<a href="?page='.$i.'">'.$i.'</a> ';
				}
			}
			/*
			echo '当前第'.$page.'页，';
			echo "一共". $countPage .'页，';
			echo '一共有'.articleCount('default').'篇文章';
			*/
		?>

			<input name="page" size="4" />
		</form>

	</div>
	<footer>
		Power by pache demo2
	</footer>
</body>
	<script type="text/javascript" src="js/home.js"></script>
</html>
