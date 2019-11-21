/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof exports?require("jquery"):jQuery)}(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function o(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function r(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(c," ")),u.json?JSON.parse(e):e}catch(n){}}function t(n,o){var i=u.raw?n:r(n);return e.isFunction(o)?o(i):i}var c=/\+/g,u=e.cookie=function(r,c,a){if(arguments.length>1&&!e.isFunction(c)){if(a=e.extend({},u.defaults,a),"number"==typeof a.expires){var f=a.expires,s=a.expires=new Date;s.setTime(+s+864e5*f)}return document.cookie=[n(r),"=",i(c),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}for(var d=r?void 0:{},p=document.cookie?document.cookie.split("; "):[],m=0,x=p.length;x>m;m++){var l=p[m].split("="),g=o(l.shift()),k=l.join("=");if(r&&r===g){d=t(k,c);break}r||void 0===(k=t(k))||(d[g]=k)}return d};u.defaults={},e.removeCookie=function(n,o){return void 0===e.cookie(n)?!1:(e.cookie(n,"",e.extend({},o,{expires:-1})),!e.cookie(n))}});


/*
 *
 *		STYLE-SWITHER.JS
 *
 */

$(document).ready(function() {
    
	var theme_options_content = ' \
		<h4>Option Panel</h4> \
		<a class="switcher_btn" href="#"></a> \
		<br> \
		<a class="btn buy-button" target="_blank" href="https://themeforest.net/item/epoint-multiuse-responsive-template/14406373?ref=zozothemes">Buy EPOINT</a> \
		<h5>Change Color</h5> \
		<div class="colors clearfix"> \
			<a id="color1" href="#" data-style="color1"></a> \
			<a id="color2" href="#" data-style="color2"></a> \
			<a id="color3" href="#" data-style="color3"></a> \
			<a id="color4" href="#" data-style="color4"></a> \
			<a id="color5" href="#" data-style="color5"></a> \
			<a id="color6" href="#" data-style="color6"></a> \
			<a id="color7" href="#" data-style="color7"></a> \
			<a id="color8" href="#" data-style="color8"></a> \
			<a id="color9" href="#" data-style="color9"></a> \
			<a id="color10" href="#" data-style="color10"></a> \
			<a id="color11" href="#" data-style="color11"></a> \
			<a id="color12" href="#" data-style="color12"></a> \
		</div><!-- colors --> \
		<h5 class="mar-10">Demos / Create Custom color</h5> \
		<a class="btn buy-button c-btn" target="_blank" href="http://zozothemes.com/html/epoint/">Click Here</a> \
		\ ';
	
	$("#theme-options").prepend(theme_options_content);
	
	$("#theme-options > a.switcher_btn").on("click", function(e) {
        
		e.preventDefault();
		$("#theme-options").toggleClass("open");
		
    });
	
	
	var link = $('link[data-style="styles"]');
	var startup_auto_colors = $.cookie('startup_auto_colors'),
		startup_auto_layout = $.cookie('startup_auto_layout'),		
		startup_auto_bg_pattern = $.cookie('startup_auto_bg_pattern');
		
	if ($.cookie('startup_auto_layout') == "wide" ){
		$(".boxed-bg").hide();
	} else {
		$(".boxed-bg").show();		
	}
		
	if (!($.cookie('startup_auto_colors'))) {
		
		$.cookie('startup_auto_colors', 'color1', 457);		
		startup_auto_colors = $.cookie('startup_auto_colors');
		link.attr('href', 'css/colors/' + startup_auto_colors + '.css');
		$('#changeable-colors').attr('href', 'css/colors/' + startup_auto_colors + '.css');
		
	} else {
				
		link.attr('href', 'css/colors/' + startup_auto_colors + '.css');
		$("#logo img").attr('src','img/logo-' + startup_auto_colors + '.png');
		$(".footer-logo img").attr('src','img/logo-' + startup_auto_colors + '.png');
		$('#changeable-colors').attr('href', 'css/colors/' + startup_auto_colors + '.css');		
		
	};

	if (!($.cookie('startup_auto_layout'))) {
		
		$.cookie('startup_auto_layout', 'wide', 457);
		startup_auto_layout = $.cookie('startup_auto_layout');
		$("body").addClass(startup_auto_layout);
		$('#theme-options .layout a[data-style="wide"]');
		
	} else {
		
		if (startup_auto_layout=="boxed") {
			
			$("body").addClass(startup_auto_layout);
			$("body").addClass("bg-pattern-2");
			$("body").removeClass("wide");
			
		} else { 
		
			$("body").addClass(startup_auto_layout);
			$("body").removeClass("boxed bg-pattern-1 bg-pattern-2 bg-pattern-3 bg-pattern-4 bg-pattern-5 bg-pattern-6 bg-pattern-7 bg-pattern-8 bg-pattern-9 bg-pattern-10");
			
		};
		
	};

	if ((startup_auto_layout =="boxed") && $.cookie('startup_auto_bg_pattern')) {
		
		$("body").removeClass("bg-pattern-1 bg-pattern-2 bg-pattern-3 bg-pattern-4 bg-pattern-5 bg-pattern-6 bg-pattern-7 bg-pattern-8 bg-pattern-9 bg-pattern-10 wide");
		$("body").addClass(startup_auto_bg_pattern); 
		
	} else { 
	
		if (startup_auto_layout =="boxed") {
			
			$("body").removeClass("bg-pattern-1 bg-pattern-3 bg-pattern-4 bg-pattern-5 bg-pattern-6 bg-pattern-7 bg-pattern-8 bg-pattern-9 bg-pattern-10");
			
		} else {
			
			$("body").removeClass("bg-pattern-1 bg-pattern-2 bg-pattern-3 bg-pattern-4 bg-pattern-5 bg-pattern-6 bg-pattern-7 bg-pattern-8 bg-pattern-9 bg-pattern-10 boxed");
			
		}
		
	};


	// CHANGE COLOR //
	$('#theme-options .colors a').on('click',function(e) {
		
		var $this = $(this),
			startup_auto_colors = $this.data('style');
			
		e.preventDefault();
		
		link.attr('href', 'css/colors/' + startup_auto_colors + '.css');
		$('#changeable-colors').attr('href', 'css/colors/' + startup_auto_colors + '.css');
		$("#logo img").attr('src','img/logo-' + startup_auto_colors + '.png');
		$(".footer-logo img").attr('src','img/logo-' + startup_auto_colors + '.png');
		$.cookie('startup_auto_colors', startup_auto_colors, 457);
				
	});

	// BOXED LAYOUT //
	$('#theme-options .layout a.boxed').on('click',function(e) {
		
		e.preventDefault(); 
		
		$("body").addClass("boxed");
		$("body").removeClass("wide");
		$.cookie('startup_auto_layout', 'boxed', 457);
		
		if ($.cookie('startup_auto_bg_pattern')) {
			
			var startup_auto_bg_pattern = $.cookie('startup_auto_bg_pattern');
			
			$("body").removeClass("bg-pattern-1 bg-pattern-2 bg-pattern-3 bg-pattern-4 bg-pattern-5 bg-pattern-6 bg-pattern-7 bg-pattern-8 bg-pattern-9 bg-pattern-10");
			$("body").addClass(startup_auto_bg_pattern);
			
		}
		
		document.location.reload();
		
	});

	// WIDE LAYOUT
	$('#theme-options .layout a.wide').on('click',function(e) {
		
		e.preventDefault(); 
		
		$("body").addClass("wide");
		$("body").removeClass("boxed bg-pattern-1 bg-pattern-2 bg-pattern-3 bg-pattern-4 bg-pattern-5 bg-pattern-6 bg-pattern-7 bg-pattern-8 bg-pattern-9 bg-pattern-10");
		$.cookie('startup_auto_layout', 'wide', 457);
		
		document.location.reload();
		
	});
	
	// CHANGE PATTERNS //
	$('#theme-options .patterns a').on('click',function(e) {
		
		var $this = $(this),
			startup_auto_bg_pattern = $this.data('style');
			
		e.preventDefault();
			 
		$("body").removeClass("bg-pattern-1 bg-pattern-2 bg-pattern-3 bg-pattern-4 bg-pattern-5 bg-pattern-6 bg-pattern-7 bg-pattern-8 bg-pattern-9 bg-pattern-10 wide");
		$("body").addClass(startup_auto_bg_pattern);
		$("#theme-options select").val("boxed");
		$.cookie('startup_auto_bg_pattern', startup_auto_bg_pattern, 457);
		
	});
	
	

});    	