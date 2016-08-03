<?php

require_once('SQLPDO.class.php');

class GetFrontData extends SQLPDO{
	public function getArticleListById($ids, $page){

	}

	public function getArticleById($id){
		$id = (int) $id;
		$sql = "SELECT * FROM `pache_article` WHERE `id` = {$id}";

		return $this->fetchRow($sql);
	}

	public function getCategories(){
		$sql = "SELECT DISTINCT class FROM `pache_article`";

		return $this->fetchColumn($sql, 0);
	}

	public function getTaglistById($id){
		$id = (int)$id;

		$sql = "SELECT * FROM `pache_tag` WHERE articleid = {$id}";

		return $this->fetchColumn($sql, 0);
	}


	private function preFetchAll($sql, $preArr=array(), $fetchParam=PDO::FETCH_ASSOC){
		$sth = $this->db->prepare($sql);
		$sth->execute($preArr);

		$result = $sth->fetchAll($fetchParam);
		return $result;
	}
	private function preFetchColumn($sql, $col=0, $preArr=array()){
		$sth = $this->db->prepare($sql);
		$sth->execute($preArr);

		return $sth->fetchColumn($col);
	}

	static $articlesSelect = "`id`,`title`,`permission`,`time`";
	static $articlesOrder = "ORDER BY time DESC ";

	public function getArticles($start, $limit){
		$sql = "SELECT `id`,`title`,`permission`,`time` FROM `pache_article` ORDER BY time DESC LIMIT ".intval($start).", ".intval($limit);

		return $this->preFetchAll($sql);
	}

	public function articleCount($by='id'){
		$extra = '';
		switch ($by){
			case 'tag':
				$tags = func_get_arg(1);
				$tagsql = self::tagSql($tags);
				$sql = "SELECT count(*) AS counts FROM `pache_article` {$tagsql}";
				return $this->preFetchColumn($sql, 0, $tags);

			break;

			case 'categories':
			case 'class':
				$categories = func_get_arg(1);
				$sql = "SELECT count(*) AS counts FROM `pache_article` WHERE class = ?";

				return $this->preFetchColumn($sql, 0, Array($categories));

			default:
				$sql = "SELECT count(*) AS counts FROM `pache_article`";
				return $this->preFetchColumn($sql);

			break;
		}
	}

	static function tagSql($tag){
		$tagCount = count($tag);
		$tagHolders = implode(',', array_fill(0, $tagCount, '?'));

		$sql = "
		WHERE EXISTS (
			SELECT `articleid`, count(1) AS counts FROM `pache_tag`
			WHERE tagname IN ( $tagHolders )
			AND `pache_article`.id = articleid
			HAVING counts = $tagCount
		)
		";
		return $sql;
	}
	static function backLimit($start, $limit){
		return " LIMIT ".intval($start).", ".intval($limit)." ";
	}

	public static function articlesByTagSql($tag, $start, $limit){
		$select = self::$articlesSelect;
		$tagSql = self::tagSql($tag);
		$order = self::$articlesOrder;
		$limit = self::backLimit($start, $limit);
		$sql = "SELECT {$select} FROM `pache_article`
			{$tagSql}
			{$order}
			{$limit}
		";
		return $sql;
	}
	public function getArticlesByTag($tag=array(), $start, $limit){
		$sql = self::articlesByTagSql($tag, $start, $limit);
		return $this->preFetchAll($sql, $tag, PDO::FETCH_ASSOC);
	}
	public function getArticlesByCategories($categories, $start, $limit){
		$order = self::$articlesOrder;
		$limit = self::backLimit($start, $limit);

		$sql = "SELECT `id`,`title`,`permission`,`time` FROM `pache_article` WHERE class = ? {$order} {$limit}";

		return $this->preFetchAll($sql, Array($categories), PDO::FETCH_ASSOC);
	}
}

class FrontData extends GetFrontData{
	/* 单例 */
	private static $instance;
	/**
	* 获得单例对象
	* @param @params array 数据库连接信息
	* @return object 单例的对象
	*/
	public static function getInstance($params = array()){
		if ( !self::$instance instanceof self ){
			self::$instance = new self($params);
		}
		return self::$instance;
	}

	public function __construct($extraParams){
		$this->dbConfig = array_merge($this->dbConfig, $extraParams);
		$this->connect();
	}
}

?>
