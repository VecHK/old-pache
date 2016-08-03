<?php

class ArticleComponent{
	public function init(){
		$this->service = GetService::getInstance();
		$this->article = $this->service->getArticle();
	}

	public function outArticle(){
		$article = $this->article;
		if ( $article['type'] == 'markdown' ){
			return $article['format'];
		}else if ( $article['type'] == 'html' ){
			return $article['article'];
		}else if ( $article['type'] == 'text' ){
			return '<div class="text">'.$article['format'].'</div>';
		}
	}

	public function outTime(){
		$display = '';
		if (is_null($this->article['id'])){
			$str = '';
			$display = 'style="display:none;"';
		}else{
			$date = 'date';
			$str = "<div id=\"time\" {$display} >
				<time>
					{$date("Y/m/d H:i:s", strtotime($this->article['ltime']))}
				</time>
			</div>
			";
		}
		return $str;
	}

	private function outTagHTML(){
		$str = '';
		$pache = $GLOBALS['pache'];
		foreach($this->tags as $value){
			$str .= "<li><a href=\"{$pache->root}?tag={$value}\">{$value}</a></li>";
		}
		$str = '<ul id="taglist">'.$str.'</ul>';

		$this->tagHTML = $str;
		return $str;
	}

	public function outTagList(){
		$model = FrontData::getInstance();
		$this->tags = $model->getTaglistById($this->article['id']);

		return is_null($this->article['id']) ? '' : $this->outTagHTML();
	}

	public function __construct(){
		$this->init();
	}
}


?>
