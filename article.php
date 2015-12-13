<?php

require('sqlmethod.php');
require('config.php');
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
	$str = $str.'<li><a href="get.php?id=33" target="_blank">关于</a></li>';
	$str = $str.'<li>'.'<a href="'.$pache->root.'/get.php?id=30">'.'links'.'</a>'.'</li>';

	for ( $i=0; $i<count($clist); ++$i ){
		$str = $str.'<li>'.'<a href="'.$pache->root.'?class='.$clist[$i].'">'.$clist[$i].'</a>'.'</li>';
	}
	$str = $str.'</nav>';
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
		if ( isset($op['tag']) && gettype($op['tag']) == 'array' ){
			if ( !insertTagsById($id, $op['tag']) ){
				return echoInfoJson(101, 'ok, but tag fail');
			}
		}else{
			return echoInfoJson(101, 'ok, but tag fail');
		}
		return echoInfoJson(0, 'ok');
	}
	return echoInfoJson(2, 'fail');
}
function createArticleProcess($POST){
	if ( createArticle($POST) ){
		$topArticle = getArticleTop();
		if ( isset($POST['tag']) && gettype($POST['tag']) == 'array' ){
			if ( !insertTagsById($topArticle['id'], $POST['tag']) ){
				return echoInfoJson(101, 'ok, but tag fail');
			}
		}
		class backTop{
			public $code = 0;
			public $info;
			function __construct($top){
				$this->info = $top;
			}
		}
		echo json_encode(new backTop($topArticle));
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
	private function collectSort($req){
		if ( isset( $req['sort'] ) ){
			if ( $req['sort'] == 'ASC' )
				return $this->sort = 'ASC';
		}
		$this->sort = 'DESC';
	}
	private function collectOrder($req){
		$able = Array('id', 'title', 'class', 'time', 'ltime');
		if ( isset($req['order']) ){
			for( $i=0, $lim=count($able); $i<$lim; $i++ )
				if ( strcmp($able[$i], $req['order']) == 0 )
					return $this->order = $able[$i];
		}
		$this->order = 'time';
	}
	private function getArticles($start, $limit){
		$sql = connectSQL();
		$sqlstr = "SELECT * FROM `pache_article` ". $this->where ." ORDER BY ". $this->order ." ". $this->sort ." LIMIT ". $start .",". $limit;
//		echo $sqlstr;
		$sqlresult = mysql_query($sqlstr, $sql->con);

		!$sqlresult && die('SQLfail: '+mysql_error($sqlresult));

		$this->article = Array();

		while ( $row=mysql_fetch_array($sqlresult) ){
			array_push( $this->article, $row );
		}
		mysql_close($sql->con);
	}
	private function collectWhere($req){
		$this->where = '';
		if ( isset($req['class']) ){
			if ( is_array($req['class']) ){
				$str = '';
				foreach( $req['class'] as $key => $value ){
					$str = $str.'\''. mysql_escape_string($value) .'\''.',';
				}
				$this->where = ' WHERE class IN('. substr($str, 0, -count($str)) .') ';
			}
		}else if ( isset($req['tag']) ){

		}
	}
	public function __construct($getRequest, $page, $limit){
		if ( count(func_get_args()) > 3 ){
			$this->display = func_get_arg(3);
		}
		$pache = new pache;

		$this->collectOrder($getRequest);
		$this->collectSort($getRequest);
		$this->collectWhere($getRequest);

		$this->getArticles(((int)$page - 1) * (int)$limit, (int)$limit);

		$this->countPage = ceil( articleCount('default')/(int)$limit );
		$this->page = (int)$page;
		$this->articleCount = articleCount('default');
	}
	public function __destruct(){
		if ( $this->display == 'json' ){

			$idArr = Array();
			foreach( $this->article as $articleKey => $articleValue ){# 清除数字键
//				$tag = new outTagById($articleKey, 'default');
//				$this->article[$articleKey]['tag'] = getArticleTagListById($articleKey);
				array_push($idArr, $this->article[$articleKey]['id']);
				unset($this->article[$articleKey]['article'], $this->article[$articleKey]['format']);
				foreach( $this->article[$articleKey] as $key => $value )
					if ( is_numeric($key) )
						unset($this->article[$articleKey][$key]);
			}
			$this->articlesTagList = getArticlesTagListById($idArr);
//			var_dump($articlesTagList);

			header('Content-Type: text/plain; charset=utf-8');
			echo json_encode($this);
		}else if ( $this->display == 'html' ){
			$pache = new pache;
			for ( $i=0; $i<count($this->article); ++$i){
				echo '<li><div class="link"><a href="'.$pache->root.'/get.php?id='. $this->article[$i]['id'] .'">'.$this->article[$i]['title'].'</a></div><div class="datetime">'.$this->article[$i]['time'].'</div></li>';
			}
		}
	}
}

class outTagById{
	public $articleId;
	public $tagList;
	function __construct($id, $display){
		$this->tagList = getArticleTagListById($id);
		$this->articleId = (int)$id;
		$this->display = $display;
	}
	function __destruct(){
		if ( $this->display == 'json' ){
			echo json_encode($this);
		}else if ( $this->display == 'html' ){
			$pache = new pache;
			$str = '<ul id="taglist">';
			//$str = $str.'<ul>';
			for ( $i=0; $i<count($this->tagList); ++$i ){
				$str = $str.'<li><a href="'.$pache->root.'?tag='.$this->tagList[$i]['tagname'].'">'.$this->tagList[$i]['tagname'].'</a></li>';
			}
			$str = $str.'</ul>';
			//$str = $str.'</div>';
			echo $str;
		}
	}
}
