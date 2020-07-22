"use strict";

jQuery(document).ready(function($){
	var anyTime = 500;
	var $changeScheme = $('#change-scheme');
	var titleFont = $('#switch-title-font').val();
	var textFont = $('#switch-text-font').val();
	var scheme = '';
	var applyNeeded = false;
	var timeoutId = 0;
	var intervalId = 0;
	
	if($('.color-selection a.selected').get().length > 0){
		scheme = $('.color-selection a.selected').data('scheme');
	}
	
	if('' == titleFont && '' == textFont){
		$changeScheme.css('display', 'none');
		applyNeeded = false;
	}else{
		$changeScheme.css('display', '');
		applyNeeded = true;
	}
	
	prepareForChange();
	
	timeoutId = setTimeout(function(e){
		$('.color-switcher').animate({left: '+=20px'},{duration: anyTime, complete: function(e){
			$('.color-switcher').animate({left: '-=20px'},{duration: anyTime, easing: "easeOutBounce"});
		}});			
		
	}, 5000);
	
	intervalId = setInterval(function(e){
		$('.color-switcher').animate({left: '+=20px'},{duration: anyTime, complete: function(e){
			$('.color-switcher').animate({left: '-=20px'},{duration: anyTime, easing: "easeOutBounce"});
		}});			
		
	}, 20000);
	
	$('.color-selection a').click(function(e){
		e.preventDefault();
				
		scheme = $(this).data('scheme');
		$('.color-selection a').removeClass('selected');
		$(this).addClass('selected');
		
		prepareForChange();
		window.location = $('#change-scheme').attr('href');
		return true;
	});
	
	$('.color-switcher-toggle').click(function(e){		
		if(0 != timeoutId){
			clearTimeout(timeoutId);
			timeoutId = 0;
		}
		
		if(0 != intervalId){
			clearInterval(intervalId);
			intervalId = 0;
		}
		
		var $parent = $(this).closest('.color-switcher');
		if(parseInt($parent.css('left')) < 0) {
			$parent.animate({left: 0}, {duration: anyTime, queue: false});
		}else{
			$parent.animate({left: -$parent.outerWidth()}, {duration: anyTime, queue: false});
		}
	});
		
	$('#switch-title-font').change(function(e){
		titleFont = $(this).val();		
		prepareForChange();
		
		if(titleFont != '' && $changeScheme.css('display') == 'none'){
			$changeScheme.slideDown(anyTime/2);
			applyNeeded = true;
		}else if('' == titleFont && '' == textFont){
			$changeScheme.slideUp(anyTime/2);
			applyNeeded = false;
		}
	});
	
	$('#switch-text-font').change(function(e){
		textFont = $(this).val();		
		prepareForChange();
		
		if(textFont != '' && $changeScheme.css('display') == 'none'){
			$changeScheme.slideDown(anyTime/2);
			applyNeeded = true;
		}else if('' == titleFont && '' == textFont){
			$changeScheme.slideUp(anyTime/2);
			applyNeeded = false;
		}
	});
	
	$('#wrapper').on('content-loaded', prepareForChange);
	
	$('#title-font-preview').click(function(e){
		if('' == titleFont) return;
		var font = $("#switch-title-font option[value='" + titleFont + "']").text();
		var fontUrl = 'https://www.google.com/fonts/specimen/' + font.replace(' ', '+');
		var popup = window.open(fontUrl, 'FontPreview', 'width=650,height=700,scrollbars=1');
		if (window.focus){
			popup.focus()
		}
	});
	
	$('#text-font-preview').click(function(e){
		if('' == textFont) return;
		var font = $("#switch-title-font option[value='" + textFont + "']").text();
		var fontUrl = 'https://www.google.com/fonts/specimen/' + font.replace(' ', '+');
		var popup = window.open(fontUrl, 'FontPreview', 'width=650,height=700,scrollbars=1');
		if (window.focus){
			popup.focus()
		}
	});
	
	function prepareForChange(){
		var href = '';
		if(scheme != ''){
			href += 'scheme=' + scheme + '&';
		}
		if(titleFont != ''){
			href += 'title_font=' + titleFont + '&';
		}
		if(textFont != ''){
			href += 'text_font=' + textFont + '&';
		}
		
		if('' != href){
			$changeScheme.attr('href', '?' + href);
			
			$('#wrapper a').each(function(e, index){
				var $a = $(this);
				var link = $a.attr('href');
				
				if(typeof(link) == 'undefined' || null == link){
					link = '';
				}
				var newHref; // = link.substring(0, link.lastIndexOf('/')) + href;
				
				if(link.indexOf('#') >= 0){
					newHref = link.substring(0, link.indexOf('#')) + '?' + href + link.substring(link.indexOf('#'));
				}else if(link.indexOf('?') >= 0){
					newHref = link.substring(0, link.indexOf('?')) + '?' + href;
				}else {
					newHref = link + '?' + href;
				}
				
				$a.attr('href', newHref);
			});
		}
	}
});