(function (tipperDom){
	function fn(){
		this.confirm = function (str, ok, cancel){
			function closeConfirm(){
				setTimeout(function (){
					$('#tipper .confirm')[0].style.removeProperty('height');
				}, 5);
				$(tipperDom).fadeOut(function (){
					$('#tipper .confirm .label').text('');
					$('#tipper .confirm').fadeOut();
				}, 0.382);
				if ( this.className === 'ok' ){
					cancel && ok(this);
				}else if ( this.className = 'cancel' ){
					cancel && cancel(this);
				}
			}
			var okButton = $('#tipper .confirm .ok')[0];
			var cancelButton = $('#tipper .confirm .cancel')[0];

			$('#tipper .confirm .label').text(str);

			$('#tipper .confirm')[0].style.removeProperty('display');

			$(tipperDom).fadeIn();

			setTimeout(function (){
				$('#tipper .confirm').css('height', '128px');
			}, 5);

			okButton.onclick = closeConfirm;
			cancelButton.onclick = closeConfirm;
		};
	}
	$(tipperDom).css('display', 'none');
	$('#tipper .confirm').css('display', 'none');
	window.tipper = new fn;
})($('#tipper')[0])
