<?php

require_once('SQLInit.class.php');

/* 数据层面 */
class SQLPDO extends SQLInit{
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

	private function __clone(){}


	/**
	* @param $sql string 执行的SQL语句
	* @return object PDOStatement
	*/
	public function query($sql){
		$rst = $this->db->query($sql);
		if ( $rst === false ){
			$error = $this->db->errorInfo();
			die("mysqlPDO query Error: ERROR {$error[1]}({$error[0]}): {$error[2]}");
		}
		return $rst;
	}

	/**
	* @param $sql string 执行的SQL语句
	* @return number lastInsertId
	*/
	public function insert($sql){
		$result = $this->query($sql);
		if ( $result ){
			return $this->db->lastInsertId();
		}else{
			return false;
		}
	}

	/**
	* 取得一行结果
	* @param $sql string 执行的SQL语句
	* @return array 关联数组结果
	*/
	public function fetchRow($sql){
		return $this->query($sql)->fetch(PDO::FETCH_ASSOC);
	}

	/**
	* 取得一列结果
	* @param $sql string 执行的SQL语句
	* @return array 返回的一列结果
	*/
	public function fetchColumn($sql, $col){
		$colArr = array();
		$stmt = $this->db->prepare($sql);
		$stmt->execute();

		for ($i=0; $i<$stmt->rowCount(); ++$i){
			array_push( $colArr, $stmt->fetchColumn($col) );
		}
		return $colArr;
	}

	/**
	* 取得所有结果
	* @param $sql string 执行的SQL语句
	* @return array 关联数组结果
	*/
	public function fetchAll($sql){
		return $this->query($sql)->fetchAll(PDO::FETCH_ASSOC);
	}

	/**
	* 执行sql语句
	* @param $sql string 执行的SQL语句
	* @return 受到影响的行
	*/
	public function exec($sql){
		return $this->db->exec($sql);
	}
}

?>
