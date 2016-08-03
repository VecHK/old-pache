<?php
/*
	以后的配置信息都放这儿吧

	诸如： admin密码，翻页等等……

*/
class pache{
	/* 后台密码 */
	public $admin = 'pache';

	/* 单页最大文章数 */
	public $pagelimit = 10;

	/* 标题 */
	public $title = "myBlog";

	/* 站点目录 */
	public $root = "/pache";

	/* 允许更新的项目 */
	public $updateAble = Array(
		'title',
		'article',
		'type',
		'class',
	);

	/* 允许创建的项目 */
	public $createAble = Array(
		'title',
		'article',
		'type',
		'class',
	);

	/* 多说名称 */
	public $duoshuo = "vechk";

	/* 自定义类别
		键名即类名
		键值即文章ID
	 */
	public $customClass = array(
		'关于' => 999
	);
}
?>
