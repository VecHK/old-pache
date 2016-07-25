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
function outCustomClassHTML(){
	$pache = $GLOBALS['pache'];
	$str = '';
	foreach($pache->customClass as $key => $value){
		$str .= "<li><a href=\"{$pache->root}/get.php?id={$value}\">{$key}</a></li>";
	}
	return $str;
}
function noClass($currentClass=false){
	$pache = $GLOBALS['pache'];
	$str = '';

	if ( is_null($currentClass) ){
		$li = '<li id="current-class">';
	}else{
		$li = '<li>';
	}

	$str = $li.'<a href="'.$pache->root.'">Home</a>'.'</li>';
	$str .= outCustomClassHTML();

	//$str = '<div id="noclass">'.$str.'</div>';
	return $str;
}
function outClassIndexHTML(){
	$pache = $GLOBALS['pache'];
	if ( isset($GLOBALS['article']) ){
		$currentClass = $GLOBALS['article']->class;
	}
	else if( isset($_GET['class']) ){
		$currentClass = $_GET['class'];
	}else{
		$currentClass = NULL;
	}

	$str = '';
	$clist = getClassIndex();

	for ( $i=0; $i<count($clist); ++$i ){
		$len = strlen($clist[$i]);
		$name = $len ? $clist[$i] : '未分类';

		if ( $currentClass === $clist[$i] ){
			$li = '<li id="current-class">';
		}else{
			$li = '<li>';
		}
		$newItem = $li.'<a href="'.$pache->root.'?class='.$clist[$i].'">'.$name.'</a>'.'</li>';

		if ( $len ){
			$str = $str.$newItem;
		}else{
			$str = $newItem.$str;
		}
	}
	$str = '<nav id="class">'.noClass($currentClass).$str.'</nav>';
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
			if ( !insertTagsById($topArticle->id, $POST['tag']) ){
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

	/* 将 $classList 和 $tagList 转为 xxx,xxx,xxx,xxx,...... */
	private function outArrayStr($type, $arr){
		for ( $i=0, $str='', $lim=count($arr); $i<$lim; ++$i )
			$str = $str.'\''. mysql_escape_string( $arr[$i] ) .'\''.',';
		$whereName = $type.'Where';
		$listName = $type.'List';
		if ( is_string($this->$whereName) && is_array($this->$listName) ){
			$this->$whereName = substr($str, 0, -count($str));
			$this->$listName = $arr;
		}else{
			die('非法操作');
		}
	}

	/*
		支持class和taglist联合查询（然而并没有什么卵用）
	*/
	private $classList = Array();
	private $classWhere = '';
	private function collectClass($req){
		if ( isset($req['class']) && is_array($req['class']) ){
			$this->outArrayStr('class', $req['class']);
			$this->classWhere = 'WHERE class IN ( '. $this->classWhere .' ) ';
		}
	}

	private $tagList = Array();
	private $tagWhere = '';
	private function collectTag($req){
		if ( isset($req['tag']) && is_array($req['tag']) ){
			$this->outArrayStr('tag', $req['tag']);
			$this->tagWhere = 'WHERE tagname IN ( '. $this->tagWhere .' )';
		}
	}

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

		$countTag = count($this->tagList);
		if ( $countTag ){
			$count = '
			(SELECT * FROM `pache_tag` '. $this->tagWhere .' ) taglist '.
			' CROSS JOIN '.
			' (SELECT * FROM `pache_article` '.$this->classWhere.' ) articles '.
			' ) '.
			' WHERE articleid=id GROUP BY id HAVING counts = '. $countTag .' ORDER BY '. $this->order .' '. $this->sort;
			$sqlstr = 'SELECT *, count(1) AS counts FROM('.$count;
			$count = 'SELECT count(*) FROM('.$count;
		}else{
			$count = " `pache_article` ". $this->classWhere ." ORDER BY ". $this->order ." ". $this->sort;
			$sqlstr = "SELECT * FROM ".$count;
			$count = "SELECT count(*) FROM ".$count;
		}

		$sqlstr = $sqlstr." LIMIT ". $start .",". $limit;
		$sqlresult = mysql_query($sqlstr, $sql->con);

		!$sqlresult && die('SQLfail: '+mysql_error($sqlresult));

		$this->articles = Array();

		while ( $row=mysql_fetch_array($sqlresult) ){
			array_push( $this->articles, $row );
		}

		$this->articlesCount = $this->collectArticleCount($count, $sql);

		mysql_close($sql->con);
	}
	private function collectArticleCount($sqlstr, $sql){
		$sqlresult = mysql_query($sqlstr, $sql->con);
		if ( !$sqlresult ){
			die('SQLfail: '+mysql_error($sqlresult));
			return NULL;
		}
		$row = mysql_fetch_array($sqlresult);
		return $row[0];
	}
	public function __construct($getRequest, $page, $limit){
		if ( count(func_get_args()) > 3 ){
			$this->display = func_get_arg(3);
		}
		$pache = new pache;

		$this->collectOrder($getRequest);
		$this->collectSort($getRequest);

		$this->collectTag($getRequest);
		$this->collectClass($getRequest);

		$this->getArticles(((int)$page - 1) * (int)$limit, (int)$limit);

		//$this->countPage = ceil( articleCount('default')/(int)$limit );
		$this->countPage = ceil( $this->articlesCount / (int)$limit );
		$this->page = (int)$page;
		//$this->articlesCount = count($this->articles);//articleCount('default');
	}
	public function __destruct(){
		if ( $this->display == 'json' ){
			if ( count($this->articles) > 0 ){
				$idArr = Array();
				foreach( $this->articles as $articleKey => $articleValue ){# 清除数字键
	//				$tag = new outTagById($articleKey, 'default');
	//				$this->articles[$articleKey]['tag'] = getArticleTagListById($articleKey);
					array_push($idArr, $this->articles[$articleKey]['id']);
					unset($this->articles[$articleKey]['article'], $this->articles[$articleKey]['format']);
					foreach( $this->articles[$articleKey] as $key => $value )
						if ( is_numeric($key) )
							unset($this->articles[$articleKey][$key]);
				}
				$this->articlesTagList = getArticlesTagListById($idArr);
			}

			//header('Content-Type: text/plain; charset=utf-8');
			echo json_encode($this);
		}else if ( $this->display == 'html' ){
			$pache = new pache;
			for ( $i=0; $i<count($this->articles); ++$i){
				echo '<li><div class="link"><a href="'.$pache->root.'/get.php?id='. $this->articles[$i]['id'] .'">'.$this->articles[$i]['title'].'</a></div><div class="datetime">'.$this->articles[$i]['time'].'</div></li>';
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
