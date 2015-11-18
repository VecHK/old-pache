<?php

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
	if ( $_GET['pw'] !== 'pache' ){
		return echoFailJson(1, 'pw');
	}
}else{
	return echoFailJson(1, 'pw');
}

if ( !isset($_GET['type']) ){
	return echoFailJson(1, "type on found");
}

switch($_GET['type']){
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
			if ( checkRequestAll($_POST, Array('title', 'type', 'article')) ){
				createArticleProcess($_POST);
			}else{
				return echoFailJson(1, 'new: 哦是吗？参数是不是少了？');
			}
		}else{
			return echoFailJson(1, 'new: id no found.');
		}
		break;
	default:
		return echoFailJson(1, 'type default.');
}

?>
