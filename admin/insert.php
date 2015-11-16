<?php
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
if ( !( isset($_GET['pw']) && $_GET['pw'] == 'asd123' ) ){
	echo backInfo(1, 'pw fail');
	return 0;
}

if ( isset($_GET['type']) ){
	switch( $_GET['type'] ){

		default:
			echo backInfo(1, 'not found type');
	}
}else{
	echo backInfo(1, 'type is empty');
}


?>
