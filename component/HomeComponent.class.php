<?php

class HomeComponent{
	public function listingArticle(){
		$home = HomeController::getInstance();
		$html = '';
		foreach($home->articles as $article){
			$html .= "
			<li>
			<div class=\"link\">
				<a href=\"get.php?id={$article['id']}\">{$article['title']}</a>
			</div>
			<div class=\"datetime\">{$article['time']}</div>
			</li>";
		}

		$html = '<ul id="list">'.$html.'</ul>';
		return $html;
	}

	public function pageCode(){
		$html = '';

		$model = FrontData::getInstance();
		$home = HomeController::getInstance();
		$pache = $GLOBALS['pache'];

		$page = $home->page;

		if ( isset($home->tag) ){
			$listingType = 'tag';
			$listingTypeValue = $home->tag;
		}
		else if ( isset($home->categories) ){
			$listingType = 'class';
			$listingTypeValue = $home->categories;
		}else{
			$listingType = '';
			$listingTypeValue = NULL;
		}

		$countPage = ceil($model->articleCount($listingType,$listingTypeValue) / $pache->pagelimit);

		$i=$page;
		if ( ($i-4)<1 ){
			$i = 5;
		}
		for ( $i=$i-4; $i<$page+5; ++$i){
			if ( $i > $countPage ){
				break;
			}
			$url = '?';
			if ( isset($_GET[$listingType]) ){
				$url .= $listingType.'='.urlencode($_GET[$listingType]).'&';
			}

			if ( $page == $i ){
				$html .= '<a class="pagecode current"><div class="code">'.$i.'</div><div class="bg"></div></a>';
			}else{
				$html .= '<a class="pagecode" href="'.$url.'page='.$i.'">'.$i.'</a> ';
			}
		}

		$form = '<form method="get" style="display:none;"><input name="page" size="4" /></form>';
		$html = '<div id="page">'.$html.$form.'</div>';
		return $html;
	}
}

?>
