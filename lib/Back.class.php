<?php

require('./Auth.class.php');
require('./Front.class.php');

class TagBack extends FrontData {
	/**
	*	移除所有文章的某一标签
	*	@param tagArr array 标签名的数组
	*	@return sql执行结果
	*/
	private function removeTag($tagArr){
		$tagCount = count($tagArr);
		$tagHolders = implode(',', array_fill(0, $tagCount, '?'));

		$TAGTABLE = self::$PACHETAGTABLE;
		$sql = "DELETE FROM {$TAGTABLE} WHERE tagname IN ({$tagHolders})";
		return $this->preExecute($sql, $tagArr);
	}

	/**
	*	移除文章的全部标签
	*	@param ids array
	*	@return sql执行结果
	*/
	 private function removeArticleTag($ids){
		$TAGTABLE = self::$PACHETAGTABLE;

		$articleid = implode(', ', array_unique($ids));

		$sql = "DELETE FROM {$TAGTABLE} WHERE articleid IN ({$articleid})";

		$result = $this->exec($sql);

		if (!$result) {
			throw new Exception('Back::removeArticleTag: article\'s tag remove fail', 1);
		}
		return $result;
	 }

	/**
	*	设置tag
	*	@param id array 文章id
	*	@param tag array 要设置的tag
	*	@return sql执行结果
	*/
	public function setTag($id, $tag){
		$TAGTABLE = self::$PACHETAGTABLE;
		if (!is_array($id) || !is_array($tag)){
			throw new Exception('Back::setTag: $id or $tag is not Array type');
		}
		$insertValue = array();
		foreach($id as $key => $idValue) {
			foreach($tag as $tagValue) {
				array_push($insertValue, "('{$tagValue}', '{$idValue}')");
			}
		}

		try {
			$this->removeArticleTag($id);
		} catch (Exception $e) {
			if ($e->getCode() !== 1) {
				throw $e;
			}
		}

		$insert = "INSERT INTO {$TAGTABLE} (tagname, articleid) VALUES ";
		$insert .= implode(', ', $insertValue);

		return $this->exec($insert);
	}

	/**
	*	修改标签的名字
	*	@param tagArr array 要重命名的标签
	*	@param set string 修改后的标签名
	*	@return sql执行结果
	*/
	public function tagRename($tagArr, $set){
		/* 这里有个问题，会出现同名标签的情况 */
		$TAGTABLE = self::$PACHETAGTABLE;

		$count = count($tagArr);
		$holders = implode(',', array_fill(0, $count, '?'));

		$sql = "UPDATE {$TAGTABLE} SET tagname = ? WHERE tagname IN ({$holders})";

		array_unshift($tagArr, $set);
		return $this->preExecute($sql, $tagArr);
	}
}

class Back extends TagBack {
	private static $instance;
	public static function getInstance($params = array()){
		if ( !self::$instance instanceof self ){
			self::$instance = new self($params);
		}
		return self::$instance;
	}

	/**
	*	编译Markdown为HTML
	*	@param $str string markdown字符串
	*	@return string 编译后的HTML
	*/
	private static function compileMarkdown($str) {
		require_once('../extend/Michelf/MarkdownExtra.inc.php');
		$parser = new Michelf\MarkdownExtra;
		$parser->fn_id_prefix = "mmd-";

		return $parser->transform($str);
	}

	/**
	*	根据文章类型处理format
	*	@param articleData	文章数据（主要得用到type和article这两个元素）
	*	@return anyType 返回format数据
	*/
	private static function processFormat($articleData) {
		$type = $articleData['type'];

		if ($type === 'markdown') {
			return self::compileMarkdown($articleData['article']);
		} else if ($type === 'html') {/* 这里可能要对HTML做转义 */
			return $articleData['article'];
		} else if ($type === 'text') {	/* 如果是text的类型的时候，format应该要做转义*/
			return htmlentities($articleData['article'], ENT_COMPAT, 'UTF-8');
		} else {
			throw new Exception('Back::processFormat: type is not markdown/html/text', 1);
		}
	}

	/**
	*	更新数据，支持批量修改
	*	@param id array 文章id
	*	@param update array 要更新的文章数据
	*	@return sql执行结果
	*/
	public function update($id, $update){
		if (!is_array($id) || !is_array($update)){
			throw new Exception('update argument is not array type', 1);
		}
		$sqlArr = array();
		$ARTICLETABLE = self::$PACHEARTICLETABLE;
		$sqlString = "UPDATE `{$ARTICLETABLE}` SET ";

		foreach($update as $key => $value) {
			//bug, 如果只有article传入的话，下面的if不会执行
			if (isset($update['article']) && $key === 'type') {
				$value = strtolower($value);

				$insert = self::processFormat(array(
					'type' => $value,
					'article' => $update['article']
				));

				$sqlString .= " `format` = ?, ";
				array_push($sqlArr, $insert);
			}

			if ($key === 'tag') {
				if (isset($update['tag']) && is_array($value)) {
					$this->setTag($id, $value);
				} else {
					throw new Exception('update tag is not Array type', 1);
				}
			} else {
				/* 不能够将tag数组添加到sqlArr中 */
				$sqlString .= " {$key} = ?, ";
				array_push($sqlArr, $value);
			}
		}

		$sqlString .= " ltime = now() ";
		$sqlString .= " WHERE id IN (". implode(', ', $id) .")";

		return $this->preExecute($sqlString, $sqlArr);
	}

	public function preExecute($sql, $preArr=array(), $fetchParam=PDO::FETCH_ASSOC){
		$sth = $this->db->prepare($sql);
		return $sth->execute($preArr);
	}

	/**
	*	检查文章类型，如果没有就使用缺省值 text
	*	@param articleArr array 文章数据
	*	@return 被修改后的文章数据
	*/
	private static function checkArticleType($articleArr) {
		if (isset($articleArr['type'])) {
			switch ($articleArr['type']) {
				case 'text':
				case 'html':
				case 'markdown':
				break;

				default:
					$articleArr['type'] = 'text';
			}
		} else {
			$articleArr['type'] = 'text';
		}
		return $articleArr;
	}

	/**
	*	检查文章数据完整性，如果有元素缺省则使用缺省值
	*	@param article array 文章数据
	*	@return article 被修改后的文章数据
	*/
	private static function processArticleProperty($article) {
		if (!isset($article['title'])) {
			$article['title'] = '无题';
		}
		if (!isset($article['categories'])) {
			$article['categories'] = '';
		}
		if (!isset($article['tag'])) {
			$article['tag'] = array();
		}
		if (!isset($article['article'])) {
			$article['article'] = '';
		}
		$article = self::checkArticleType($article);
		$article['format'] = self::processFormat($article);
		return $article;
	}

	/**
	*	创建文章
	*	@param articleData array 文章数据
	*	@return lastInsertId number 新创建的文章id
	*/
	public function create($articleData){
		if (!is_array($articleData)) {
			throw new Exception("create fail: articleData is not Array type");
		}

		$articleData = self::processArticleProperty($articleData);

		$data = "(
			'{$articleData['title']}',
			'{$articleData['type']}',
			NULL,
			'{$articleData['article']}',
			'{$articleData['format']}',
			'{$articleData['categories']}',
			now(),
			now()
		)";

		$ARTICLETABLE = self::$PACHEARTICLETABLE;
		$insertSql = "INSERT INTO {$ARTICLETABLE} (title, type, permission, article, format, categories, time, ltime)
		VALUES " . $data;

		$lastInsertId = $this->insert($insertSql);
		if ($lastInsertId > 0) {
			$this->setTag(array($lastInsertId), $articleData['tag']);
		} else {
			throw new Exception('article insert fail', 1);
		}
		return $lastInsertId;
	}

	public function categoriesRename($categories, $set){
		
	}
}

(Back::getInstance())->update(array(1), array(
	"categories" => "哦是么",
	"title" => '新的标now()题',

	"article" => '<html>你们好，我是vec</html>',
	"type" => 'html',
	'tag' => ['test', 'bbb']
));

(Back::getInstance())->tagRename(array('test', 'bbb'), 'asd');


/*
(Back::getInstance())->create(array(
	'title' => 'test',
	'article' => '# markdown test「」"" 总文字福<div>安静过路口就爱上</div>',
	'type' => 'text',
	'tag' => array('vecHK')
));
*/

$err = new Exception('test', 999);
try {
	throw $err;
	print('aassasaa');
} catch (Exception $e) {

}


?>
