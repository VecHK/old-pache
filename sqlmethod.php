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

	class escapeSQL{
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
				require('/Michelf/MarkdownExtra.inc.php');
				require_once '/Michelf/MarkdownExtra.inc.php';
				//use Michelf\MarkdownExtra;

				$parser = new \Michelf\MarkdownExtra;
				$parser->fn_id_prefix = "mmd-";//Michelf markdown
				$my_html = $parser->transform($create['article']);
				$this->format = mysql_escape_string($my_html);
			}else{
				$this->format = ' ';
			}
		}
	}
	$insert = new escapeSQL($create);

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

function updateArticleById($id, $update){
	$sql = connectSQL();

	$sqlstr = "UPDATE pache_article SET ";

	foreach( $update as $key => $value ){
		$sqlstr = $sqlstr . "".mysql_escape_string($key)."" . ' = ' . "'".mysql_escape_string($value). "'" . ', ';
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
function newResult($id, $title, $type, $class, $time, $ltime, $article){
	$obj = new stdClass();
	$obj->id = $id;
	$obj->title = $title;
	$obj->type = $type;
	$obj->class = $class;
	$obj->time = $time;
	$obj->ltime = func_get_arg(5);
	$obj->article = func_get_arg(6);
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
			$row['article']
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

	$sqlstr = $sqlstr."GROUP BY id HAVING counts = ".count($tag)." ORDER BY time ";
	$sqlstr = $sqlstr."LIMIT ". (int)$start .",". (int)$limit;
/*	echo $sqlstr;*/
	$sqlresult = mysql_query($sqlstr);
	if ( !$sqlresult ){
		die(mysql_error($sqlresult));
	}
	$list = Array();
	while ( $row=mysql_fetch_array($sqlresult) ){
		array_push($list, $row);
	}
/*	echo var_dump($list);*/

	mysql_close($sql->con);
	return $list;
}
function insertTag($id, $tagname){
	$sql = connectSQL();
	mysql_close($sql->con);
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

	$sqlstr = "SELECT * FROM pache_article WHERE class = '".mysql_escape_string($class)."' ORDER BY ltime DESC LIMIT ". (int)$start .",". (int)$limit;

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
			$sqlstr = "SELECT COUNT(*) FROM pache_tag WHERE tagname = "."'". func_get_arg(1) ."'";
			break;
		case 'class':
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
};

function deleteArticlesById( $idArr ){
	
}

?>
