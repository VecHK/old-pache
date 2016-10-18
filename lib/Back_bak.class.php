<?php

require('./Auth.class.php');
require('./Front.class.php');

class Back extends FrontData {
	private static $instance;
	public static function getInstance($params = array()){
		if ( !self::$instance instanceof self ){
			self::$instance = new self($params);
		}
		return self::$instance;
	}

	private function updateTag($id, $tag){
		$TAGTABLE = self::$PACHETAGTABLE;
		$tagStr = implode(', ', array_unique($tag));
		$del = "DELETE FROM {$TAGTABLE} WHERE articleid IN($tagStr)";

		$delResult = $this->exec($del);


		$insert = "INSERT INTO `pache_tag` (tagname, articleid) VALUES ()";

		$this->exec();
	}

	/*
		更新数据，支持批量修改
	*/
	public function update($id, $update){
		if (!is_array($id) || !is_array($update)){
			throw new Exception('update argument is not array type', 1);
		}
		$sqlArr = array();
		$ARTICLETABLE = self::$PACHEARTICLETABLE;
		$sqlString = "UPDATE `{$ARTICLETABLE}` SET ";

		function sqlArrayPush($sqlArr, $key, $value){
			$sqlString .= " {$key} = ?, ";
			array_push($sqlArr, $value);
			return $sqlString;
		}
		function compileMarkdown($str){
			require_once('../extend/Michelf/MarkdownExtra.inc.php');
			$parser = new Michelf\MarkdownExtra;
			$parser->fn_id_prefix = "mmd-";

			return $parser->transform($str);
		}

		foreach($update as $key => $value){
			if (isset($update['article']) && $key === 'type') {
				$value = strtolower($value);

				if ($value === 'markdown') {
					$insert = compileMarkdown($update['article']);
				} else if ($value === 'html') {/* 这里可能要对HTML做转义 */
					$insert = $update['article'];
				} else if ($value === 'text') {	/* 如果是text的类型的时候，format应该清除掉*/
					$insert = '';
				} else {
					throw new Exception('update type is not markdown/html/text', 1);
				}

				$sqlString .= " `format` = ?, ";
				array_push($sqlArr, $insert);
			}

			if ($key === 'tag') {
				if (is_array($key)){
					$this->updateTag($id, $value);
				} else {
					throw new Exception('update tag is not Array type', 1);
				}
			}

			$sqlString .= " {$key} = ?, ";
			array_push($sqlArr, $value);
		}

		$sqlString .= " ltime = now() ";
		$sqlString .= " WHERE id IN (". implode($id) .")";

		$this->preExecute($sqlString, $sqlArr);

	}

	private function preExecute($sql, $preArr=array(), $fetchParam=PDO::FETCH_ASSOC){
		$sth = $this->db->prepare($sql);
		return $sth->execute($preArr);
	}

	public function create($upArr){

	}

	public function tagRename(){}
	public function classRename(){}
}

(Back::getInstance())->update(array(1), array(
	"class" => "哦是么",
	"title" => '新的标now()题',

	"article" => '<html>你们好，我是vec</html>',
	"type" => 'html'
));

$err = new Exception('test', 999);
try {
	throw $err;
	print('aassasaa');
} catch (Exception $e) {

}


?>
