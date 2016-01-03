(function (tipperDom){
	function fn(){
		this.inProgress = function (){

		};
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
		this.setWait = function (){
			$(tipperDom).css('cursor', 'wait');
			$(tipperDom)[0].style.removeProperty('display');
		};
		this.canWait = function (){
			$(tipperDom).css('display', 'none');
			$(tipperDom)[0].style.removeProperty('cursor');
		};

		this.warn;
		this.error = function (str, ok){
			$(tipperDom)[0].style.removeProperty('display');

			$('#tipper .error .content .label').text(str);
			$('#tipper .error').fadeIn();

			var okButton = $('#tipper .error .content .ok')[0];
			okButton.onclick = function (){
				$(tipperDom).fadeOut(function (){
					$('#tipper .error .content .label').text('');
					$('#tipper .error').css('display', 'none');
				});
				ok && ok();
				return false;
			};
		};
		this.inProgress = function (){

		};
		this.outProgress;
	}
	$(tipperDom).css('display', 'none');
	$('#tipper .confirm').css('display', 'none');
	$('#tipper .error').css('display', 'none');
	window.tipper = new fn;
})($('#tipper')[0])
