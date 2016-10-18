<?php
header('Content-type: text/html;charset=utf-8');

require_once('config.php');
$pache = new pache;

require('./lib/Front.class.php');

class HomeService{
	public function getArticles(){
		$pache = $GLOBALS['pache'];

		$page = $this->page - 1;
		$start = $page * $pache->pagelimit;

		$model = FrontData::getInstance();

		if ($this->listingType === 'categories'){
			$this->articles = $model->getArticlesByCategories($this->categories, $start, $pache->pagelimit);
		}
		else if ($this->listingType === 'tag'){
			$this->articles = $model->getArticlesByTag($this->tag, $start, $pache->pagelimit);
		}
		else {
			$this->articles = $model->getArticles($start, $pache->pagelimit);
		}
	}
}

class HomeController extends HomeService{
	private function router(){
		if (isset($_GET['page']) && (int)$_GET['page']>0){
			$this->page = (int) $_GET['page'];
		}else{
			$this->page = 1;
		}
		$page = $this->page - 1;

		/* 以分类遍历 */
		if ( isset($_GET['categories']) ){
			$this->categories = $_GET['categories'];
			$this->listingType = 'categories';
		}
		/* 以tag遍历 */
		else if ( isset($_GET['tag']) ){
			$this->tag = explode(' ', trim($_GET['tag']));;
			$this->listingType = 'tag';
		}else{
			$this->listingType = 'id';
		}
	}

	public function __construct(){
		$this->router();
		$this->getArticles();
	}


	private static $instance;
	public static function getInstance($params = array()){
		if ( !self::$instance instanceof self ){
			self::$instance = new self($params);
		}
		return self::$instance;
	}
}

$home = HomeController::getInstance();

require_once('./front/home.php');

?>
