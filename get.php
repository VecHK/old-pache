<?php

require('config.php');
$pache = new pache;

require('./lib/Front.class.php');

class GetController{
	public static $id = null;
	private function setRequestId(){
		if ( isset($_GET['id']) ){
			self::$id = (int)$_GET['id'];
		}
	}
	private function router(){
		$this->setRequestId();

		if ( isset($_GET['display']) && strtolower($_GET['display']) === 'json' ){
			header('Content-Type: text/plain;charset=utf-8');
			$service = GetService::getInstance();
			$model = FrontData::getInstance();

			$tag = array(
				'tag' => $model->getTaglistById(self::$id)
			);

			$article = $service->getArticle(self::$id);
			die(json_encode( array_merge($article, $tag) ));
		}
		header('Content-Type: text/html;charset=utf-8');
	}

	public function __construct(){
		$this->router();
	}
}

class GetService{
	private function nofoundProgress(){
		if ( !is_null($this->article['id']) ){
			return 0;
		}
		$this->article = array(
			'id' => null,
			'categories' => '',
			'title' => '出现了点问题',
			'article' => '<div id="article-nofound"><div id="float" style="position:relative;margin: auto;" ><img class="floatimg" src="articleNoFound.jpg" style="display:block; margin:auto;" /></div>当你看到这个页面的时候，说明文章因为不可抗力被删除了。或者你请求的id是一个未知数，Pache无法提供</div><div></div>',
			'type' => 'html'
		);
		$this->comment = '';
	}

	public function getArticle(){
		$this->article = $this->model->getArticleById(GetController::$id);

		$this->nofoundProgress();

		return $this->article;
	}

	public function __construct(){
		$this->model = FrontData::getInstance();
	}

	private static $instance;
	public static function getInstance(){
		if ( !self::$instance instanceof self ){
			self::$instance = new self;
		}
		return self::$instance;
	}
}

class GetView{
	private $controller;
	public function __construct(){
		$this->controller = new GetController;
		$this->service = GetService::getInstance();
	}
}

require_once('./front/get.php');

?>
