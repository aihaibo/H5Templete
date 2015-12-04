define(['attributesupport', 'jquery'], function(attr){

	(function() {

		$.fn.navcollapse = function(options){

			var settings = {
				animate: 		true,
				speed: 			300,
				fold:			true,
				navbtn: 		"-button",
				close: 			"closed",
				open: 			"opend",
				active:			"active",
				search:			"nav-collapse-search"
			};

			$.extend(settings, options);

			var $this = $(this),
				selector = $this.selector,
				navbtn = $this.siblings(selector + settings.navbtn),
				stylestate = false,
				initstylestate = false,
				stylecss,
				totalheight = 0;

			if(settings.animate && attr){
				$this.css(attr.transition, 'height ' + settings.speed + 'ms ease');
			}

			function resize(){
				if(navbtn.css('display') === "none" ? false : true){
					if(!stylestate){
						if(!initstylestate){
							$this.children().each(function(){
								totalheight += $(this).height();
							})
							stylecss = '<style id="navRespondSyle">' + selector + '.' + settings.open + '{height:' + totalheight + 'px;}</style>';
							initstylestate = true;
						}

						$('head').append(stylecss);
						stylestate = true;
					}
				}else{
					$('#navRespondSyle').remove();
					stylestate = false;
				}
			};

			resize();

			navbtn.bind('click', toggleClass);


			function toggleClass(){
				if(!settings.fold){
					$this.removeClass(settings.close).addClass(settings.open);
					navbtn.addClass(settings.active);
				}else{
					$this.removeClass(settings.open).addClass(settings.close);
					navbtn.removeClass(settings.active);
				}
				settings.fold = !settings.fold;
			}
			toggleClass();

			if($('.' + settings.search).length){
				$('.' + settings.search + settings.navbtn).bind('click', function(){
					$(this).toggleClass('mask').siblings().toggleClass('mask');
				})
			}


			$(window).bind('resize', resize);
		}
	})();

})