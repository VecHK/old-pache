<?php
require('../../Auth.class.php');

$auth = Auth::GetInstance();

$pw = 'asd123';
$auth->setPasswd($pw);

$random = Auth::$random;
$hash = md5($random . 'asd123');

print("input random:	" . $random . "\n");
print("input passwd:	" . $pw . "\n");
print("input hash:		" . $hash . "\n");

print('session random:	' . Auth::$random . "\n");
print("auth hash:		" . md5(Auth::$random . $pw) . "\n");

if ($auth->auth($hash)){
	echo 'ok';
} else {
	echo 'false';
}

?>
