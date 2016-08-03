<?php

class CategoriesComponent{
	private static function outCustomClassHTML(){
		$pache = $GLOBALS['pache'];
		$str = '';
		foreach($pache->customClass as $key => $value){
			$str .= "<li><a href=\"{$pache->root}/get.php?id={$value}\">{$key}</a></li>";
		}
		return $str;
	}

	private static function noCategories($currentCategories=false){
		$pache = $GLOBALS['pache'];
		$str = '';

		if ( is_null($currentCategories) ){
			$li = '<li id="current-class">';
		}else{
			$li = '<li>';
		}

		$str = $li.'<a href="'.$pache->root.'">首页</a>'.'</li>';

		return $str;
	}

	public static function createLi($cate, $current, $href, $name){
		$li = ($cate === $current) ? '<li id="current-class">' : '<li>';

		$href = $GLOBALS['pache']->root.'?class='.$href;
		return $li."<a href=\"{$href}\">$name</a></li>";
	}

	public function backHTML(){
		$pache = $GLOBALS['pache'];

		/* 检查当前的位置（是get.php还是index.php） */
		if ( isset($GLOBALS['getView']) ){
			$service = GetService::getInstance();
			$currentCategories = $service->article['class'];
		}
		else if( isset($_GET['class']) ){
			$currentCategories = $_GET['class'];
		}else{
			$currentCategories = NULL;
		}

		$str = '';
		foreach( $this->categories as $value ){
			if (strlen($value)){
				$str .= self::createLi($value, $currentCategories, $value, $value);
			}
		}
		$str = $str.self::outCustomClassHTML().self::createLi('', $currentCategories, '', '其它');

		$str = '<nav id="class">'.self::noCategories($currentCategories).$str.'</nav>';
		return $str;
	}

	public function out(){
		$model = FrontData::getInstance();

		$this->categories = $model->getCategories();
		return $this->backHTML();
	}

	function __tostring(){
		return $this->out();
	}
}


?>
