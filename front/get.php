<?php
$getView = new GetView;

require('./component/CategoriesComponent.class.php');
require('./component/ArticleComponent.class.php');
require('./component/CommentComponent.class.php');
require('./component/TopShadowComponent.class.php');

$categoriesComponent = new CategoriesComponent;
$articleComponent = new ArticleComponent;
$commentComponent = new CommentComponent;

$topShadowComponent = TopShadowComponent::out();

print <<<EOT
<!DOCTYPE HTML>
<html>
<head>
	<title>{$articleComponent->article['title']}</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1;" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
	<meta name="HandheldFriendly" content="true" />

	<link rel="stylesheet" href="style/global.css" type="text/css" />
	<link rel="stylesheet" href="style/article.css" type="text/css" />
	<link rel="stylesheet" href="style/myprettify.css" type="text/css" />
	<link rel="stylesheet" href="style/normal.css" type="text/css" media="screen and (min-width: 800px)" />
	<link rel="stylesheet" href="style/min.css" type="text/css" media="screen and (max-width: 799px)" />

<!--
	<script type="text/javascript" src="js/Markdown.Converter.min.js"></script>
	<script type="text/javascript" src="js/Markdown.Sanitizer.min.js"></script>
	<script type="text/javascript" src="js/Markdown.Extra.min.js"></script>
-->
	<script type="text/javascript" src="js/prettify.min.js"></script>
	<script type="text/javascript" src="js/remilia.js"></script>

	<script type="application/javascript" src="js/page.js" def></script>
	<script type="text/javascript" src="js/page-scroll.js" def></script>
<!--

	<script type="text/javascript" src="js/dotBG.js" def></script>
	<script type="text/javascript" src="js/iii.js"></script>
	<script type="text/javascript" src="js/ppp.js"></script>
-->

</head>
<body>
	{$topShadowComponent}
	{$categoriesComponent}
	<div id="main">
		<header>
			<h1>{$articleComponent->article['title']}</h1>
			{$articleComponent->outTime()}
		</header>
		<article id="article" class="content">
			{$articleComponent->outArticle()}
		</article>

		{$articleComponent->outTagList()}
	</div>
		{$commentComponent->out()}

	<div id="ppep">
		<div class="ppep-control">
			<div class="play-status"></div>
		</div>
	</div>
</body>
</html>
EOT;

?>
