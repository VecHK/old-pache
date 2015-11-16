<?php

if ( !( isset($_GET['pw']) && $_GET['pw'] == 'asd123' ) ){
	echo 'pw';
	return 0;
}else{
	require('manageArticle.html');
}

?>
