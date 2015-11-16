<?php

require('sqlmethod.php');
class pache{
	public $pagelimit = 10;
	public $title = "myBlog";
	public $root = "/pache";

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
