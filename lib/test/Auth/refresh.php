<?php
require('../../Auth.class.php');

$auth = Auth::GetInstance();

$auth->setPasswd('asd123');

print($auth->refresh());

?>
