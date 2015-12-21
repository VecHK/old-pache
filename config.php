<?php
/*
	以后的配置信息都放这儿吧

	诸如： admin密码，翻页等等……

*/
class pache{
	public $admin = 'pache';
	public $pagelimit = 10;
	public $title = "myBlog";
	public $root = "/pache";
	public $updateAble = Array(
		'title',
		'article',
		'type',
		'class',
	);
	public $createAble = Array(
		'title',
		'article',
		'type',
		'class',
	);
	/* 多说名称 */
	public $duoshuo = "vechk";
}
?>
