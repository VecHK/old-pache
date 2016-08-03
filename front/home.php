<?php
require('./component/TopShadowComponent.class.php');
require('./component/CategoriesComponent.class.php');
require('./component/HomeComponent.class.php');

$pache = new pache;
$topShadowComponent = TopShadowComponent::out();
$categoriesComponent = new CategoriesComponent;
$homeComponent = new HomeComponent;

print <<<EOT
<!DOCTYPE HTML>
<html>
<head>
	<title>{$pache->title}</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1;" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
	<meta name="HandheldFriendly" content="true" />

	<link rel="stylesheet" href="style/global.css" type="text/css" />
	<link rel="stylesheet" href="style/home.css" type="text/css" />
	<link rel="stylesheet" href="style/normal.css" type="text/css" media="screen and (min-width: 800px)" />
	<link rel="stylesheet" href="style/min.css" type="text/css" media="screen and (max-width: 799px)" />
</head>
<body>
	{$topShadowComponent}
	{$categoriesComponent}
	{$homeComponent->listingArticle()}
	{$homeComponent->pageCode()}

	<footer id="pachefooter">
		Hello, Pache
	</footer>
</body>
</html>
EOT;
?>
