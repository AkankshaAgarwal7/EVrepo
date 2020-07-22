"use strict";

jQuery(document).ready(function($){
	//console.log( $('#sidebar').width());

	var $window = $(window);
	//always return window to top on load, so that all the elements are aligned and calculated right
	$window.scrollTop(0);
	
	var aniTime = 300; // default animation duration
	var aniTime2 = 600; // double animation duration
	var $menu = $('#menu-wrap');
	var $mainMenu = $('#main-menu');
	var $secMenu = $('.secondary-container');
	var menuH = $menu.height();
	var scrolling = false;
	var $searchform = $('#searchform');
	var resizing = false;
	var menuClasses = ''; // save classes removed from
	var $logoa = $('#menu-strip'); // check if this is block or none so we know if we are in responsive mobile view
	var $wrapper = $('#wrapper');
	var wrapperTop = parseInt($wrapper.css('top'));
	var scrollDelta = 150;
	var isResponsive = false;
	var $main = $('#main');
	var $brickWrap = $('#brick-wrap');
	var $sidebar = $('#sidebar');
	var hasSidebar = ($sidebar.get().length > 0) ? true : false;
	var hasBricks = ($brickWrap.get().length > 0) ? true : false;
	var lastTop = $window.scrollTop();
	var direction = 1; // scroll direction, 1 = down, -1 equals up
	var scrollTop = lastTop;
	var $catTitles = $('.brick-cat-title'); // title boxes for categories
	var sidebarWidth = Pukka.page_settings.sidebar_width;
	var columnMargin = Pukka.page_settings.margin;
	var columnWidth = Pukka.page_settings.box_width;
	var numColumns = Pukka.page_settings.num_columns;
	var sidebarPadding = 0;
	var $searchContainer = $('#search-outer'); //search wrapper in header
	var $commentsWrap = $('#comments-outer-wrap');
	var hasComments = ($commentsWrap.get().length > 0) ? true : false;
	var wrapperPaddingTop = 100;
	if(false == Pukka.secondary_menu){
		wrapperPaddingTop = 70;
	}

	// if page does't have sidebar, sidebarWidth is 0
	sidebarWidth = (hasSidebar) ? sidebarWidth : 0;
	if(sidebarWidth > 0){
		sidebarPadding = $sidebar.outerWidth() - $sidebar.width();
	}
	// remove background color from #main if page has bricks, it looks much better		
	/*if(hasBricks){
		$main.css('background', 'none');
	}*/
	
	$(window).scroll(function(e){
		// call any scroll action from here
		if(scrolling) return;
		scrolling = true;
		scrollTop = $window.scrollTop();

		if(scrollTop > lastTop){
			direction = 1;
		}else if(scrollTop < lastTop){
			direction = -1;
		}else{
			scrolling = false;
			return;
		}

		lastTop = scrollTop;
		checkMenu();
		checkSidebar();
		scrolling = false;
	});

	$(window).resize(function(e){
		// call any resize action from here
		if(resizing) return;
		resizing = true;
		pukkaResize();
		resizing = false;
	});

	function pukkaResize(){
		// check if responsive and set responsive menu and stuff
		responsive();
		setBricksWrapper();
		secondaryMenuFix();
		setTimeout(function(e){
			wrapperFix();
		}, aniTime2);
		checkSidebar();
	}
	
	function secondaryMenuFix(){
		$secMenu.css('margin-left', $mainMenu.offset().left).css('display', 'block');
	}

	function wrapperFix(){
		// if not in responsive, adjust content padding so menu does not cover it
		if(!isResponsive){
			var h = $menu.outerHeight();
			if(h < wrapperPaddingTop){
				h = wrapperPaddingTop;
			}
			$wrapper.css('padding-top', h);
		}else{
			$wrapper.css('padding-top', '');
		}
	}

	// resizing menu, depending on the page scroll
	function checkMenu(){

		if('' != menuClasses){
			return;
		}
		var top = $window.scrollTop();
		if(top > menuH && !$menu.hasClass('smaller')){
			$menu.addClass('smaller');
		}else if(top <= menuH){
			$menu.removeClass('smaller');
		}
		
		setTimeout(function(e){
			secondaryMenuFix();
		}, aniTime2);
	}

	// handles sidebar moving on all pages that have sidebar
	var movingSidebar = false;
	var additionaCall = false;
	function checkSidebar(){

        // Disable scrolling sidebar (added on request)
        if( !Pukka.scrolling_sidebar ){
            return;
        }

		if(!hasSidebar || movingSidebar){
			additionaCall = true;
			return;
		}
		movingSidebar = true;
		var sidebarTop = $sidebar.offset().top;
		var sidebarHeight = $sidebar.height();
		var windowHeight = $window.height();
		var mainTop = $main.offset().top + parseInt($main.css('padding-top'));
		var newTop = 0;
		var starTop = parseInt($main.css('padding-top')) + columnMargin;
		var offset = (hasBricks) ? 0 : starTop;

		if(1 == direction && windowHeight < sidebarHeight){
			// if scrolling direction is down, we keep scrolling until sidebars bottom is in
			// the screen
			if(scrollTop + windowHeight >= sidebarTop + sidebarHeight){
				newTop = scrollTop + windowHeight - sidebarHeight - mainTop + columnMargin - offset - 2*columnMargin;
			}else{
				newTop = parseInt($sidebar.css('top'));
			}
		}else if(-1 == direction && windowHeight < sidebarHeight){
			// if scrolling up, we keep scrolling until sidebar top is in the screen
			if(scrollTop <= sidebarTop){
				newTop = scrollTop + $menu.height() - mainTop + starTop - offset;
			}else{
				newTop = parseInt($sidebar.css('top'));
			}
		}else if(windowHeight > sidebarHeight){
			// if sidebar hight is smaller than screen height, we just need to keep top of the sidebar
			// in the screen
			newTop = scrollTop + $menu.height() - mainTop + starTop - offset;
		}

		// check if we sidebar is hovering over comments, if comments exist
		if(hasComments && newTop + sidebarHeight >= $main.outerHeight()){
			newTop = $main.outerHeight() - sidebarHeight - 40;
		}

		// check if sidebar is lower than lowest block on page, if it is, return it up
		if(hasBricks && newTop + sidebarHeight > $main.height() - columnMargin){
			newTop = $main.height() - sidebarHeight - columnMargin;
		}

		// check if sidebar is up over the start position, if it is, return it
		if(newTop < starTop - offset){
			newTop = starTop - offset;
		}

		$sidebar.css('top', newTop);
		movingSidebar = false;
		if(additionaCall){
			additionaCall = false;
			checkSidebar();
		}
	}



	function responsive(){
		if($logoa.css('display') == 'block'){
			isResponsive = true;
		}else{
			isResponsive = false;
		}

		if(isResponsive && '' == menuClasses){
			menuClasses = $menu.get(0).className;
			$menu.removeClass();
		}else if(!isResponsive && '' != menuClasses){
			$menu.addClass(menuClasses);
			menuClasses = '';
			checkMenu();
		}
	}

	
	/*
	 *	Front page brick wrap and sidebar adjustment
	 **************************************************/
	function setBricksWrapper(){
		// if no bricks, do nothing
		if(!hasBricks){
			return;
		}
		// if screen is wide enough so that everything fits, do nothing
		if($main.css('max-width') <= windowWidth) {
			$main.css('max-width', '');
			return;
		}

		// if not width enough, we need to rearrange boxes
		var windowWidth = $window.width();
		// calculate how many columns can fit on screen
		var maxColumns = Math.floor((windowWidth - sidebarWidth - 20) / (columnWidth + 2 * columnMargin));
		var max = maxColumns;
		if(maxColumns > numColumns){
			maxColumns = numColumns;
		}
		var mainWidth;
		if(max <= 2){
			// if screen can fit only 2 columns or less, we need to hide sidebar
			$sidebar.css('display', 'none');
			$brickWrap.css('margin', '0');
			$brickWrap.css('max-width', '100%');
			// calculate how many columns can we fit without sidebar
			maxColumns = Math.floor(windowWidth / (columnWidth + 2 * columnMargin));
			if(maxColumns > 1){
				// as long as we can fit at least 2 columns, we should set main width, so that everithing
				// is centred
				if(maxColumns > numColumns){ // we need to check this, because somebody could have set max number of columns to 2 or 3
					maxColumns = numColumns;
				}
				mainWidth = maxColumns * (columnWidth + 2 * columnMargin);
			}else{
				// when there is no space for 2 columns, set main to 100%
				mainWidth = '100%';
			}
		}else{
			$sidebar.css('display', '');
			$brickWrap.css('margin', '');
			$brickWrap.css('max-width', '');
			mainWidth = maxColumns * (columnWidth + 2 * columnMargin) + sidebarWidth + columnMargin + sidebarPadding; 
		}
		$main.css('max-width', mainWidth);
		$catTitles.css('width', mainWidth - sidebarWidth - 3 * columnMargin - sidebarPadding);
	}

	// init everything, so that page looks good
	function init(){
		// first check do we have enough space on screen
		pukkaResize();
		// resizing menu, depending on the page scroll
		checkMenu();
		// check sidebar position
		checkSidebar();
	}

	init();

	/*
	*   Right sidebar responsive trigger check
	***********************************/
	$(window).resize(function(e){
		masonryToggle();
	});

	var isActive = false;

	function masonryToggle(){
		if(($window.width() < 2*Pukka.page_settings.sidebar_width || $sidebar.width() == Pukka.page_settings.sidebar_width) && isActive){
			$('.widget-area').masonry('destroy');
			isActive = false;
		}else if($window.width() >= 2*Pukka.page_settings.sidebar_width && $sidebar.width() != Pukka.page_settings.sidebar_width && !isActive){
			$('.widget-area').masonry({
				columnWidth: 5,
				isAnimated: !Modernizr.csstransitions,
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false
				}
			});
			isActive = true;
		}
	}
	setTimeout(masonryToggle, 500);
	//masonryToggle();


	/*
	*	Search stuff
	************************************/
	$("#show-search").click(function(e){
		e.preventDefault();

		$searchContainer.stop().css('display', 'block').animate({opacity: 1}, {duration: aniTime, queue: false});
		$searchContainer.find('#s-main').focus();
	});

	$(document).mouseup(function(e){
		if($searchContainer.is(":visible") && !$searchContainer.is(e.target)
		&& $searchContainer.has(e.target).length === 0)
			{
				$searchContainer.stop().animate({opacity: 0}, {duration: aniTime, queue: false, complete: function(e){
						$searchContainer.css('display', 'none');
				}});
			}
	});

	$searchContainer.find('#s-main').keyup(function(e){
		if(27 == e.keyCode){
			$searchContainer.stop().animate({opacity: 0}, {duration: aniTime, queue: false, complete: function(e){
					$searchContainer.css('display', 'none');
			}});
		}
	});

	// bind autocomplete if needed
	$searchContainer.on({
		focus: function(e) {
		    if ( !$(this).data("autocomplete") ) { // If the autocomplete wasn't called yet:
			// compatible with older than wp 3.6 (tested on 3.5.1)
			$(this).autocomplete({
						appendTo: "#search-outer",
						source: Pukka.ajaxurl + "?action=pukka_search_autocomplete&lang=" + Pukka.language,
						minLength: 2,
						response: function(event, ui) {
				            // ui.content is the array that's about to be sent to the response callback.
				            if (ui.content.length === 0) {
								// if no posts found, show this message in notification
								// area (no notification area for this at the moment)
				                //$("#empty-message").text("No results found");
				            } else {
				                //$("#empty-message").empty();
				            }
							$('#search-outer #searchsubmit-main').removeClass('searching');
				        },
						select: function( event, ui ) {
							if(false != ui.item.url){
								window.location = ui.item.url;
							}else{
								$(this).closest('form').submit();
							}

							return false;
						},
						search: function( event, ui){
							$('#search-outer #searchsubmit-main').addClass('searching');
						}
					})._renderItem = function( ul, item ) {
					return $( "<li>" )
						.data( "data-ui-id", item.ID )
						.append( $("<a>" ).text( item.label ) )
						.appendTo( ul );
					};

			} // if
		},
		click: function(e){
			e.stopPropagation();
		}
	}, "#s-main");


	/*
	*	Social stuff
	************************************/
	$("#brick-wrap").on({
		mouseenter: function(){
			$(this).children(".box-social-buttons").css("display", "block");
			$(this).children(".social-arrow").css("display", "none");
			$(this).children(".social-label").css("display", "none");
		},
		mouseleave: function(){
			$(this).children(".box-social-buttons").css("display", "none");
			$(this).children(".social-arrow").css("display", "inline-block");
			$(this).children(".social-label").css("display", "inline-block");
		}
	}, ".box-social");

	// Update position on window resize
	$(window).resize(function(){
		share_winTop = (screen.height / 2) - (share_winHeight / 2);
		share_winLeft = (screen.width / 2) - (share_winWidth / 2);
	});

	$("#brick-wrap").on({
		click: function(e){
			e.preventDefault();

			var url = $(this).parent().data("url"),
				title = $(this).parent().data("title"),
				description = $(this).parent().data("desc"),
				image = $(this).parent().data("image"),
				network = $(this).data("network");

			var fn_name = "pukka"+ network.toUpperCase() +"Share";
			// create function
			var fn = window[fn_name];

			if( typeof fn === 'function' ){
				fn(url, title, description, image);
			}
		}
	}, ".pukka-share");

	/*
	*   Lightbox
	******************************************/
	if( typeof($(".swipebox").swipebox) === "function") {
		if( $(".swipebox").length > 0 ) {
			swipeboxInstance = $(".swipebox").swipebox();
		}
	}

	function masonry_loaded(){

		// attach lightbox to new content
		if( typeof($(".swipebox").swipebox) === "function" && swipeboxInstance !== undefined ) {
			if( swipeboxInstance != null ){
				swipeboxInstance.refresh();
			}
			else{
				if( $(".swipebox").length > 0 ) {
					swipeboxInstance = $(".swipebox").swipebox();
				}
			}
		}

		// attach flowplayer to new content
		if( $(".flowplayer").length > 0 && typeof($(".flowplayer").flowplayer) === "function"){
			$(".flowplayer").flowplayer({});

		}
	}
	$("#wrapper").on("content-loaded", masonry_loaded);


	/*
	*   Slider
	******************************************/
	if( $(".slider").length > 0 ){
		var $slider = $('.slider').flexslider({
							animation: "slide",
							controlNav: true,
							directionNav: false,
							smoothHeight: true
						  });
	}

	/*
	*  Scroll to top link
	******************************************/
	$('#top-link').click(function(e){
		e.preventDefault();
		$("html,body").animate({ scrollTop: 0 }, "slow");
	});

	$(window).scroll(function() {
		if( $(this).scrollTop() > $(window).height() ){
			$('#top-link:hidden').stop(true, true).fadeIn().css("display","block");
		}else{
			$('#top-link').stop(true, true).fadeOut();
		}
	});

}); // jQuery(document).ready(function($)

	// Global functions
	var swipeboxInstance = null;

	// Social share
	var share_winWidth =  '520',
		share_winHeight = '350';

	var share_winTop = (screen.height / 2) - (share_winHeight / 2);
	var share_winLeft = (screen.width / 2) - (share_winWidth / 2);

	function pukkaFBShare(url, title, descr, image) {
	  window.open('http://www.facebook.com/sharer.php?m2w&s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + encodeURIComponent(url) + '&p[images][0]=' + image, 'sharer', 'top=' + share_winTop + ',left=' + share_winLeft + ',toolbar=0,status=0,width=' + share_winWidth + ',height=' + share_winHeight);
	}


	function pukkaTWShare(url, title, descr, image) {
	  window.open('https://twitter.com/share?url=' + url +'&text='+ title, 'sharer', 'top=' + share_winTop + ',left=' + share_winLeft + ',toolbar=0,status=0,width=' + share_winWidth + ',height=' + share_winHeight);
	}

	function pukkaGPShare(url, title, descr, image) {
	  window.open('https://plus.google.com/share?url='+ encodeURIComponent(url), 'sharer', 'top=' + share_winTop + ',left=' + share_winLeft + ',toolbar=0,status=0,width=' + share_winWidth + ',height=' + share_winHeight);
	}

	function pukkaINShare(url, title, descr, image) {
	  window.open('http://www.linkedin.com/shareArticle?mini=true&url='+ encodeURIComponent(url) +"&title="+ encodeURIComponent(title) +"&sumary="+ encodeURIComponent(descr), 'sharer', 'top=' + share_winTop + ',left=' + share_winLeft + ',toolbar=0,status=0,width=' + share_winWidth + ',height=' + share_winHeight);
	}

	function pukkaPTShare(url, title, descr, image) {
	  window.open('http://pinterest.com/pin/create/button/?url=' + url + '&description=' + descr + '&media=' + image, 'sharer', 'top=' + share_winTop + ',left=' + share_winLeft + ',toolbar=0,status=0,width=' + share_winWidth + ',height=' + share_winHeight);
	}
	