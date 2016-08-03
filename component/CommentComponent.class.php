<?php

class CommentComponent{
	public function outDuoshuo(){
		$article = $this->service->article;
		$pache = $this->pache;

		return "
		<div id=\"duoshuo\">
		<!-- 多说评论框 start -->
			<div class=\"ds-thread\" data-thread-key=\"{$article['id']}\" data-title=\"{$article['title']}\" data-url=\"http://vechk.com$pache->root/get.php?id={$article['id']}\"></div>
		<!-- 多说评论框 end -->
		<!-- 多说公共JS代码 start (一个网页只需插入一次) -->
		<script type=\"text/javascript\">
			var duoshuoQuery = {short_name:\"$pache->duoshuo\"};
				(function() {
					var ds = document.createElement('script');
					ds.type = 'text/javascript';ds.async = true;
					ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
					ds.charset = 'UTF-8';
					(document.getElementsByTagName('head')[0]
					 || document.getElementsByTagName('body')[0]).appendChild(ds);
				})();

			</script>
		<!-- 多说公共JS代码 end -->
		</div>
		";
	}

	public function outPache(){

	}

	public function out(){
		$this->pache = $GLOBALS['pache'];
		$this->service = GetService::getInstance();

		/* 如果出错的话则不返回html */
		if ( is_null($this->service->article['id']) ){
			return '';
		}

		$method = 'out' . (strlen($this->pache->duoshuo) ? 'Duoshuo' : 'Pache');

		return $this->$method();
	}
}

?>
