<?php
require('sql.php');

function connectSQL(){
	$sql = new sqlInfo();
	$sql->con = mysql_connect($sql->address,$sql->account,$sql->password);
	if (!$sql->con) {
		die('Could not connect: ' . mysql_error($sqlresult));
	}

	if ( !mysql_select_db($sql->database, $sql->con) ){
		die('数据库连接错误: '.mysql_error($sqlresult));
	}

	mysql_query("SET NAMES utf8");
	return $sql;
}

function createArticle($create){
	$sql = connectSQL();

	class createArticleSQL{
		function __construct($create){
			$this->title = mysql_escape_string($create['title']);
			$this->type = mysql_escape_string($create['type']);
			$this->permission = NULL;
			$this->article = mysql_escape_string($create['article']);

			if ( isset($create['class']) ){
				if ( count($create['class']) == 0 ){
					$this->class = NULL;
				}else{
					$this->class = mysql_escape_string($create['class']);
				}
			}else{
				$this->class = '';
			}

			if ( strtolower($create['type']) === 'markdown' ){
				require('extend/Michelf/MarkdownExtra.inc.php');
				require_once 'extend/Michelf/MarkdownExtra.inc.php';
				//use Michelf\MarkdownExtra;

				$parser = new Michelf\MarkdownExtra;
				$parser->fn_id_prefix = "mmd-";//Michelf markdown
				$my_html = $parser->transform($create['article']);
				$this->format = mysql_escape_string($my_html);
			}
			else if ( strtolower($create['type']) === 'html' ){
				$this->format = $create['article'];
			}
			else{
				$this->format = nl2br($create['article']);
			}
		}
	}
	$insert = new createArticleSQL($create);

	$sqlstr = "INSERT INTO `pache_article` ( title, type, permission, article, format, class, time, ltime )
	VALUES
	(
		'$insert->title',
		'$insert->type',
		NULL,
		'$insert->article',
		'$insert->format',
		'$insert->class',
		now(),
		now()
	)
	";

	$sqlresult = mysql_query($sqlstr, $sql->con);

	if ( $sqlresult ){
		mysql_close($sql->con);
	}else{
		mysql_close($sql->con);
		die(mysql_error($sql->con));
	}
	return true;
}
function deleteArticlesById( $idArr ){
	$sql = connectSQL();
	$sqlstr = "DELETE FROM pache_article WHERE id IN ";

	$sqlin = "";
	for ( $i=0; $i<count($idArr); ++$i ){
		$idstr = $idArr[$i];
		$sqlin = $sqlin."'".mysql_escape_string($idArr[$i])."',";
	}
	$sqlstr = $sqlstr ."(".substr($sqlin, 0, -count($sqlin)).")";

	$sqlresult = mysql_query($sqlstr, $sql->con);
	if ( $sqlresult ){
		mysql_close($sql->con);
		return true;
	}else{
		mysql_close($sql->con);
		die(mysql_error($sql->con));
	}
}
function updateArticleById($id, $update){
	$sql = connectSQL();

	$sqlstr = "UPDATE pache_article SET ";

	foreach( $update as $key => $value ){
		if ( $key == 'type' ){
			switch( strtolower($value) ){
				case 'markdown':
					require('extend/Michelf/MarkdownExtra.inc.php');
					require_once 'extend/Michelf/MarkdownExtra.inc.php';
					//use Michelf\MarkdownExtra;
					$parser = new Michelf\MarkdownExtra;
					$parser->fn_id_prefix = "mmd-";//Michelf markdown

					$my_html = $parser->transform($update->article);

					$sqlstr = $sqlstr . "".mysql_escape_string('format')."" . ' = ' . "'".mysql_escape_string($my_html). "'" . ', ';
				break;

				case 'text':
					$ftext = nl2br($update->article);
					$sqlstr = $sqlstr . "".mysql_escape_string('format')."" . ' = ' . "'".($ftext). "'" . ', ';
				break;

				case 'html':
					$sqlstr = $sqlstr . "".mysql_escape_string('format')."" . ' = ' . "'".mysql_escape_string($update->article). "'" . ', ';
				break;

				default:
			}
		}
		if ( $key == 'tag' ){

		}else{
			$sqlstr = $sqlstr . "".mysql_escape_string($key)."" . ' = ' . "'".mysql_escape_string($value). "'" . ', ';
		}
	}
	$sqlstr = $sqlstr . ' ltime = now() ';
	$sqlstr = $sqlstr . ' WHERE id = '. (int)$id;

	$sqlresult = mysql_query($sqlstr, $sql->con);
	if ( $sqlresult ){
		mysql_close($sql->con);
	}else{
		mysql_close($sql->con);
		die(mysql_error($sql->con));
	}
	return true;
}
function newResult($id, $title, $type, $class, $time, $ltime, $article, $format){
	$obj = new stdClass();
	$obj->id = $id;
	$obj->title = $title;
	$obj->type = $type;
	$obj->class = $class;
	$obj->time = $time;
	$obj->ltime = $ltime;
	$obj->article = $article;
	$obj->format = $format;
	return $obj;
}

function getArticleById($id){
	$sql = connectSQL();

	$sqlstr = "SELECT * FROM pache_article WHERE id=". (int)$id;
	$sqlresult = mysql_query($sqlstr, $sql->con);
	if ( !$sqlresult ){
		die('SQLfail: '+mysql_error($sqlresult));
		return 2;
	}

	if ( is_resource($sqlresult) ){
		$result = array();
		$row = mysql_fetch_array($sqlresult);
		return newResult(
			$row['id'],
			$row['title'],
			$row['type'],
			$row['class'],
			$row['time'],
			$row['ltime'],
			$row['article'],
			$row['format']
		);

		/*
		while ( $row = mysql_fetch_array($sqlresult) ){
			array_push(
				$result,
				newResult(
					$row['id'],
					$row['title'],
					$row['time'],
					$row['ltime']
				)
			);

		}
		return $result;
		*/

	}
	mysql_close($sql->con);
}

function getArticles($start, $limit){
	$sql = connectSQL();
	$sqlstr = "SELECT * FROM pache_article ORDER BY time DESC LIMIT ". (int)$start .",". (int)$limit;
	$sqlresult = mysql_query($sqlstr, $sql->con);
	if ( !$sqlresult ){
		die('SQLfail: '+mysql_error($sqlresult));
		return NULL;
	}
	$list = Array();
	while ( $row=mysql_fetch_array($sqlresult) ){
		array_push($list, $row);
	}
	mysql_close($sql->con);
	return $list;
}
function getArticleTop(){
	$sql = connectSQL();
	$sqlstr = "SELECT  * FROM  `pache_article` ORDER BY id DESC LIMIT 1";
	$sqlresult = mysql_query($sqlstr, $sql->con);
	if ( !$sqlresult ){
		die('SQLfail: '+mysql_error($sqlresult));
		return NULL;
	}
	$row=mysql_fetch_array($sqlresult);
	mysql_close($sql->con);
	return $row;
}

function getArticlesById($ids){
	$sql = connectSQL();
	$sqlstr = "SELECT * FROM `pache_article` WHERE";

	mysql_close($sql->con);
}

function getArticlesByTag($tag, $start, $limit){
	$sql = connectSQL();
	$sqlstr = "SELECT *,  count(1) AS counts FROM (
	(SELECT * FROM `pache_tag` WHERE";

	for ( $i=0; $i<count($tag); ++$i ){
		$sqlstr = $sqlstr." tagname = '".mysql_escape_string($tag[$i])."' ";
		if ( $i != count($tag)-1 ){
			$sqlstr = $sqlstr.' OR';
		}
	}
	$sqlstr = $sqlstr.") taglist ";
	$sqlstr = $sqlstr."CROSS JOIN ";
	$sqlstr = $sqlstr."(SELECT * FROM `pache_article`) articlepool ";
	$sqlstr = $sqlstr.") ";
	$sqlstr = $sqlstr."WHERE articleid = id ";

	$sqlstr = $sqlstr." GROUP BY id HAVING counts = ".count($tag)." ORDER BY time DESC ";
	$sqlstr = $sqlstr." LIMIT ". (int)$start .",". (int)$limit;

	$sqlresult = mysql_query($sqlstr);
	if ( !$sqlresult ){
		die(mysql_error($sqlresult));
	}
	$list = Array();
	while ( $row=mysql_fetch_array($sqlresult) ){
		array_push($list, $row);
	}

	mysql_close($sql->con);
	return $list;
}
function insertTagsById($id, $tagArr){
	$sql = connectSQL();

	$sqlstr = "DELETE  FROM `pache_tag` WHERE articleid = ".(int)$id;
	$sqlresult = mysql_query($sqlstr, $sql->con);

	if ( !$sqlresult ){
		mysql_close($sql->con);
		die(mysql_error($sql->con));
	}
	$sqlstr = "INSERT INTO `pache_tag` (tagname, articleid)
	VALUES ";
	for ( $i=0; $i<count($tagArr); ++$i ){
		$sqlstr = $sqlstr. "(". "'".mysql_escape_string($tagArr[$i])."', ". (int)$id ."),";
	}

	$sqlstr = substr($sqlstr, 0, -count($sqlstr));

	$sqlresult = mysql_query($sqlstr, $sql->con);
	if ( !$sqlresult ){
		mysql_close($sql->con);
		die(mysql_error($sql->con));
	}

	mysql_close($sql->con);
	return true;
}
function updateTag($id, $tag){
	$sql = connectSQL();
	mysql_close($sql->con);
}
function getArticleTagListById($id){
	$sql = connectSQL();
	$sqlstr = "SELECT * FROM `pache_tag` WHERE articleid = ".(int)$id;
	$sqlresult = mysql_query($sqlstr, $sql->con);
	if ( !$sqlresult ){
		die(mysql_error($sqlresult));
	}
	$list = Array();
	while ( $row=mysql_fetch_array($sqlresult) ){
		array_push($list, $row);
	}
	mysql_close($sql->con);
	return $list;
}

function getArticlesByClass($class, $start, $limit){
	$sql = connectSQL();

	$sqlstr = "SELECT * FROM pache_article WHERE class = '".mysql_escape_string($class)."' ORDER BY time DESC LIMIT ". (int)$start .",". (int)$limit;

	$sqlresult = mysql_query($sqlstr, $sql->con);
	if ( !$sqlresult ){
		die(mysql_error($sqlresult));
		return NULL;
	}
	$list = Array();
	while ( $row=mysql_fetch_array($sqlresult) ){
		array_push($list, $row);
	}
	mysql_close($sql->con);
	return $list;
}

function articleCount($by){
	$sql = connectSQL();
	switch($by){
		case 'tag':
			$sqlstr = "SELECT COUNT(*) FROM pache_tag WHERE tagname = "."'". mysql_escape_string(func_get_arg(1)) ."'";
			break;
		case 'class':
			$sqlstr = "SELECT COUNT(*) FROM pache_article WHERE class = "."'". mysql_escape_string(func_get_arg(1)) ."'";
			break;

		default:
		case 'id':
			$sqlstr = "SELECT COUNT(*) FROM pache_article";
			break;
	}

	$sqlresult = mysql_query($sqlstr, $sql->con);
	if ( !$sqlresult ){
		die('SQLfail: '+mysql_error($sqlresult));
		return NULL;
	}
	$row = mysql_fetch_array($sqlresult);
	mysql_close($sql->con);
	return $row[0];
}
class ArticleCount{
	public $result;
	function __construct(){
		switch(func_get_art(0)){
			case 'tag':
				$sqlstr = "SELECT COUNT(*) FROM pache_tag WHERE tagname = "."'". mysql_escape_string(func_get_arg(1)) ."'";
				break;
			case 'class':
				$sqlstr = "SELECT COUNT(*) FROM pache_article WHERE class = "."'". mysql_escape_string(func_get_arg(1)) ."'";
				break;

			default:
			case 'id':
				$sqlstr = "SELECT COUNT(*) FROM pache_article";
				break;
		}
		$sql = connectSQL();
		$sqlresult = mysql_query($sqlstr, $sql->con);
		if ( !$sqlresult ){
			die('SQLfail: '+mysql_error($sqlresult));
			return NULL;
		}
		$row = mysql_fetch_array($sqlresult);
		mysql_close($sql->con);
		$this->result = $row[0];
	}
}

function pacheInfo(){

}

function getClassIndex(){
	$sql = connectSQL();
	$sqlstr = "SELECT DISTINCT class FROM `pache_article`";
	$sqlresult = mysql_query($sqlstr, $sql->con);
	if ( !$sqlresult ){
		die('SQLfail: '+mysql_error($sqlresult));
		return NULL;
	}

	$list = Array();
	while ( $row=mysql_fetch_row($sqlresult) ){
		array_push($list, $row[0]);
	}
	mysql_close($sql->con);
	return $list;
}

?>
