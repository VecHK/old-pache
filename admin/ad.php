<?php
header('Content-type: text/html;charset=utf-8;');
require('../article.php');

class outFail{
	var $code;
	var $str;
	function __construct(){
		$this->code = func_get_arg(0);
		$this->str = func_get_arg(1);
	}
}
function checkRequestAll($request, $checkArr){
	for ( $i=0; $i<count($checkArr); ++$i )
		if ( !isset($request[$checkArr[$i]]) )
			return false;
	return true;
}
function checkRequestAny($request, $checkArr){
	for ( $i=0; $i<count($checkArr); ++$i)
		if ( isset($request[$checkArr[$i]]) )
			return true;
	return false;
}
function echoFailJson($code, $str){
	echo json_encode(new outFail($code, $str));
	return $code;
}
function echoInfoJson($code, $str){
	echo json_encode(new outFail($code, $str));
}
if ( isset($_GET['pw']) ){
	if ( $_GET['pw'] !== $pache->admin ){
		return echoFailJson(1, 'pw');
	}
}else{
	return echoFailJson(1, 'pw');
}

if ( !isset($_GET['type']) ){
	return echoFailJson(1, "type on found");
}

switch($_GET['type']){
	case 'gettag':
		if ( isset($_GET['id']) ){
			if ( isset($_GET['display']) ){
				if ( $_GET['display'] == 'json' ){
					return new outTagById( $_GET['id'], 'json');
				}
			}
			return new outTagById($_GET['id'], 'html');
		}else{
			return echoFailJson(1, 'id no found.');
		}
		break;
	case 'getindex':
		if ( isset($_GET['page']) && (int)$_GET['page'] > 0 ){
			$page = (int) $_GET['page'];
		}else{
			$page = 1;
		}
		if ( isset($_GET['limit']) ){
			$limit = (int) $_GET['limit'];
		}else{
			$limit = $pache->pagelimit;
		}
		if( isset($_GET['display']) ){
			if ( $_GET['display'] == 'json' ){
				new outIndex($page, $limit, 'json');
				return 0;
			}
		}
		new outIndex($page, $limit, 'html');

		break;
	case 'getclass':
		if( isset($_GET['display']) ){
			if ( $_GET['display'] == 'json' ){
				echo outClassIndexJson();
			}
			return 0;
		}
		echo outClassIndexHTML();
		break;
	case 'update':
		if ( isset($_POST['id']) ){
			if ( checkRequestAny($_POST, $pache->updateAble) ){
				updateArticleByIdProcess($_POST['id'], $_POST);
			}
		}else{
			return echoFailJson(1, 'update: id no found.');
		}
		break;
	case 'updatetag':
		break;

	case 'new':
		if ( isset($_POST['id']) ){
			if ( checkRequestAll($_POST, $pache->createAble) ){
				createArticleProcess($_POST);
			}else{
				return echoFailJson(1, 'new: 哦是吗？参数是不是少了？');
			}
		}else{
			return echoFailJson(1, 'new: id no found.');
		}
		break;
	case 'manage':
		switch( $_GET['manage'] ){
			case 'del':
				if ( isset($_POST['selid']) ){
					return deleteArticlesByIdProcess($_POST['selid']) ? echoInfoJson(0, 'ok') : echoFailJson(2, 'inter fail');
				}else{
					return echoFailJson(1, 'selid no found');
				}
				break;

			default:
				return echoFailJson(1, 'manage default');
		}

		break;
	default:
		return echoFailJson(1, 'type default.');
}

?>
