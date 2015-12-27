<?php
header('Content-type: text/html;charset=utf-8');

//echo iconv("GB2312","UTF-8",'中文');

require('article.php');

if ( isset($_GET['id']) ){
	$id = (int)$_GET['id'];
	$display = 'HTML';
	if ( isset($_GET['display']) ){
		$display = strtoupper($_GET['display']);
	}
	switch($display){
		case 'JSON':
			//echo json_encode(getArticleBy($_GET['by'], $_GET['byarg'], $display));
			header('Content-Type: text/plain; charset=utf-8');
			echo json_encode(getArticleById( (int) $id ));
			return 0;
			break;

		case 'HTML':
		default:
			$article = getArticleById( (int) $id );
			//$article = getArticleBy($_GET['by'], $_GET['byarg'], $display);
//			echo var_dump($article);
	}

}else{
	$article = new stdClass;
	$article->id = null;
}

if ( is_null($article->id) ){
	$article = new stdClass;
	$article->title = "出现了点问题";
	$article->article = '<div id="fail"><div id="float" style="position:relative;margin: auto;" ><img class="floatimg" src="articleNoFound.jpg" style="display:block; margin:auto;" /></div>当你看到这个页面的时候，说明文章因为不可抗力被删除了。或者你请求的id是一个未知数，Pache无法提供</div><div></div>';
	$article->type = 'html';
	$nofound = true;
}

?>
<!DOCTYPE HTML>
<html>
<head>
	<title><?php echo $article->title; ?></title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1;" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
	<meta name="HandheldFriendly" content="true" />

	<link rel="stylesheet" href="style/global.css" type="text/css" />
	<link rel="stylesheet" href="style/normal.css" type="text/css" media="screen and (min-width: 851px)" />
	<link rel="stylesheet" href="style/min.css" type="text/css" media="screen and (max-width: 850px)" />
	<link rel="stylesheet" href="style/myprettify.css" type="text/css" />

<!--
	<script type="text/javascript" src="js/Markdown.Converter.min.js"></script>
	<script type="text/javascript" src="js/Markdown.Sanitizer.min.js"></script>
	<script type="text/javascript" src="js/Markdown.Extra.min.js"></script>
-->
	<script type="text/javascript" src="js/prettify.min.js"></script>
	<script type="text/javascript" src="js/remilia.js"></script>

	<!--<script type="text/javascript" src="js/prettify.min.js"></script>-->
</head>
<body>
		<?php
			echo outClassIndexHTML();
		?>
	<div id="main">
		<header>
		<?php
			echo "<h1>".$article->title."</h1>";
		?>
		<div id="time" <?php echo isset($nofound) ? 'style="display:none;"' : ''; ?> >
			创建时间：
			<time>
				<?php echo date("Y/m/d h:m:s", strtotime($article->time)); ?>
			</time>
			<br />
			修改时间：
			<time>
				<?php echo date("Y/m/d h:m:s", strtotime($article->ltime)); ?>
			</time>
		</div>
		</header>
		<article id="article" class="content">
<?php
	if ( $article->type == 'markdown' ){
/*
		require('Michelf/MarkdownExtra.inc.php');
		require_once 'Michelf/MarkdownExtra.inc.php';
		$parser = new Michelf\MarkdownExtra;
		$parser->fn_id_prefix = "mmd-";//Michelf markdown
		$my_html = $parser->transform($article->article);
		echo $my_html;
*/
		echo $article->format;
	}else if ( $article->type == 'html' ){
		echo $article->article;
	}else if ( $article->type == 'text' ){

		echo '<div class="text">'.$article->format.'</div>';
	}

?>
		</article>
			<?php
				isset($nofound) || new outTagById($_GET['id'], 'html');
			?>
	</div>
<?php
if ( !isset($nofound) ){
print <<<EOT
	<div id="duoshuo">
	<!-- 多说评论框 start -->
		<div class="ds-thread" data-thread-key="$article->id" data-title="$article->title" data-url="$pache->root/get.php?id=$article->id"></div>
	<!-- 多说评论框 end -->
	<!-- 多说公共JS代码 start (一个网页只需插入一次) -->
	<script type="text/javascript">
		var duoshuoQuery = {short_name:"$pache->duoshuo"};
			(function() {
				var ds = document.createElement('script');
				ds.type = 'text/javascript';ds.async = true;
				ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
				ds.charset = 'UTF-8';
				(document.getElementsByTagName('head')[0]
				 || document.getElementsByTagName('body')[0]).appendChild(ds);
			})();

		</script>
	<!-- 多说公共JS代码 end -->
	</div>
EOT;
}
 ?>
</body>
	<script type="text/javascript" src="pache.js"></script>
<!--
	<script type="text/javascript" src="js/iii.js"></script>
	<script type="text/javascript" src="js/ppp.js"></script>
-->
</html>
