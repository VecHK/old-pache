<?php

/*
	这里是登陆认证的模块
	采用的是Session认证

	如果是GET请求的话则返回随机码

	如果是POST请求，只接受pw参数，这个pw参数由 随机码与真实密码相连接后 后再md5
	大概是「md5(随机码 . 真实密码)」这样的

	GET方式：
	直接打印随机码字符串

	POST方式:
	{"code": 0, "msg": "ok"}

	code: 状态码
		 0 为认证失败
		 1 为认证成功
		 2 已经登陆

	msg: 消息
		用于进一步描述错误的字符串

*/

require('./lib/Auth.class.php');

class Info {
	public function __construct($code, $msg=''){
		$this->code = $code;
		$this->msg = $msg;
	}

	public function __tostring(){
		return json_encode($this);
	}
}

$auth = Auth::getInstance();

if ($_SERVER["REQUEST_METHOD"] === 'GET') {
	$str = $auth->refresh();
} else if (empty($_POST['pw'])) {
	$str = new Info(0, 'no pw argument');
} else if ($auth->auth($_POST['pw'])) {
	$str = new Info(1, 'ok');
} else {
	/* 到了这里可以说是pw不正确，不过也有可能是非 GET/POST 访问的原因 */
	$str = new Info(0, 'pw fail, not GET/POST');
}

print($str);

?>
