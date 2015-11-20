<?php

require('sqlmethod.php');
class pache{
	public $pagelimit = 10;
	public $title = "myBlog";
	public $root = "/pache";
	public $updateAble = Array(
		'title',
		'article',
		'type',
		'class'
	);
	public $createAble = Array(
		'title',
		'article',
		'type',
		'class'
	);
}
$pache = new pache;
date_default_timezone_set("Asia/Shanghai");

function backInfo($c, $s){
	class outputInfo{
		var $code;
		var $str;
		public function __construct($code, $str){
			$this->code = $code;
			$this->str = $str;
		}
	}
	return json_encode(new outputInfo($c, $s));
}


function getArticleBy($by, $byarg, $display){
	switch($by){
		case 'id':
			return getArticleById( (int) $byarg );
			break;

		default:
			echo backInfo(2, 'not found by method');
	}
}

function listingArticleByTag(){

}
function listingArticleByClass(){

}
function listingArticleBy($by, $start, $limit, $arg/*, $sort*/){
	switch($by){
		case 'class':
			return getArticlesByClass($class, $start, $limit);
			break;
		case 'tag':
			break;

		default:
			return getArticles($start, $limit);
	}
}
function outClassIndexJson(){
	return json_encode(getClassIndex());
}
function outClassIndexHTML(){
	$pache = new pache;

	$str = '<nav id="class">';
	$clist = getClassIndex();

	$str = $str.'<li>'.'<a href="'.$pache->root.'">'.'首页'.'</a>'.'</li>';
	$str = $str.'<li><a href="about.html" target="_blank">关于</a></li>';

	for ( $i=0; $i<count($clist); ++$i ){
		$str = $str.'<li>'.'<a href="'.$pache->root.'?class='.$clist[$i].'">'.$clist[$i].'</a>'.'</li>';
	}
	$str = $str.'</nav>';
	return $str;
}
function outArticleTagListByIdHTML($id){
	$pache = new pache;
	$tlist = getArticleTagListById($id);
	//var_dump($tlist);

	$str = '<ul id="taglist">';
	for ( $i=0; $i<count($tlist); ++$i ){

		$str = $str.'<li><a href="'.$pache->root.'?tag='.$tlist[$i]['tagname'].'">'.$tlist[$i]['tagname'].'</a></li>';
	}
	$str = $str.'</ul>';
	return $str;
}
class updateAble{
	public function __construct($op){
		$pache = new pache;
		for ( $i=0; $i<count($pache->updateAble); ++$i ){
			if ( isset($op[ $pache->updateAble[$i] ]) ){
				$str = $pache->updateAble[$i];
				$this->$str = $op[ $pache->updateAble[$i] ];
			}
		}
	}
}
function updateArticleByIdProcess($id, $op){
	$up = new updateAble($op);
	if ( updateArticleById($id, $up) ){
		return echoInfoJson(0, 'ok');
	}else{
		return echoInfoJson(2, 'fail');
	}
}
function createArticleProcess($POST){
	if ( createArticle($POST) ){
		return echoInfoJson(0, 'ok');
	}else{
		return echoInfoJson(2, 'fail');
	}
}
function deleteArticlesByIdProcess($selid){
	if ( gettype($selid) === 'array' ){
		if ( count($selid) ){
			if ( deleteArticlesById($selid) ){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}else{
		return false;
	}

}
class outIndex{
	public $display;
	public $article;
	public $page;
	public $countPage;
	public $articleCount;
	public function __construct($page, $limit){
		if ( count(func_get_args()) > 2 ){
			$this->display = func_get_arg(2);
		}
		$pache = new pache;
		$this->article = getArticles(((int)$page - 1) * $limit, $limit);
		$this->countPage = ceil( articleCount('default')/$pache->pagelimit );
		$this->page = $page;
		$this->articleCount = articleCount('default');
	}
	public function __destruct(){
		if ( $this->display == 'json' ){
			echo json_encode($this);
		}else if ( $this->display == 'html' ){
			for ( $i=0; $i<count($this->article); ++$i){
				echo '<li><div class="link"><a href="get.php?id='. $this->article[$i]['id'] .'">'.$this->article[$i]['title'].'</a></div><div class="datetime">'.$this->article[$i]['time'].'</div></li>';
			}
		}
	}
}
