<?php

class SQLInit{
	protected $dbConfig = array(
		'port' => '3306',
		'user' => 'root',
		'pass' => 'root',
		'charset' => 'utf8',
		'dbname' => 'pache'
	);
	/* PDO */
	protected $db;
	/* 数据库连接 */
	protected function connect(){
		try{
			$dsn = "mysql:
			address=127.0.0.1;
			host=127.0.0.1;
			ip=127.0.0.1;
			port={$this->dbConfig['port']};
			dbname={$this->dbConfig['dbname']};
			charset={$this->dbConfig['charset']};
			";

			$this->db = new PDO($dsn, $this->dbConfig['user'], $this->dbConfig['pass']);
		}catch( PDOException $e ){
			die("mysqlPDO connect Error: {$e->getMessage()}");
		}
	}
}

?>
