<?php

class Auth {
	/* 单例 */
	private static $instance;
	public static function getInstance(){
		if (!self::$instance instanceof self) {
			self::$instance = new self;
		}
		return self::$instance;
	}

	private $passwd;
	public function setPasswd($value){
		$this->passwd = $value;
	}

	private static function randomChar($isUpper){
		return chr( rand(0,25) + (rand(0, (int)$isUpper) ? 65 : 97) );
	}

	public static function randomString($length, $isUpper=false){
		return self::randomChar($isUpper) . ($length ? self::randomString(--$length, $isUpper) : '');
	}

	public static $random;
	private function initRandom(){
		self::$random = $_SESSION['random'];
	}
	private static function getRandom(){
		$_SESSION['random'] = self::randomString(8);

		self::$random = $_SESSION['random'];

		return self::$random;
	}

	public static function refresh(){
		return self::getRandom();
	}

	/* $code是认证的代码 */
	public function auth($code){
		if ($code === md5(self::$random . $this->passwd)) {
			$_SESSION['authed'] = 1;
			return true;
		} else {
			unset($_SESSION['authed']);
			return false;
		}
	}

	public function authed(){
		if (isset($_SESSION['authed'])){
			return $_SESSION['authed'];
		} else {
			return 0;
		}
	}

	public function __construct(){
		session_start();
		$this->initRandom();
	}

	public function __destruct(){

	}
}

?>
