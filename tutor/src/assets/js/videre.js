//
if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function ($, window, document) {
	var dimensions = {
		2256: [2256	, 1269],
		1920: [1920	, 1080],
		1280: [1280	, 720],
		1024: [1024	, 576],
		768 : [768	, 432],
		512 : [512	, 288],
		320: [320, 240],
	}
		currentQuality = null;
		currentVolumeIcon = null;

	function kFormat ( num ) {
		
		if ( num >= 1000000 ) {
			return (num/1000000).toFixed(2) + 'M';
		}
		if ( num >= 100000 ) {
			return (num/1000).toFixed() + 'K';
		}
		if ( num >= 1000 ) {
			return (num/1000).toFixed(1) + 'K';
		}
		return num;
	};

	function pluralize ( string, count ) {
		return (count == 0 || count != 1) ? string + 's' : string;
	}

	var Video = {

		init : function (options, el) {
			
			var base = this;
				el = el[0];

            base.options = $.extend({}, $.fn.videre.options, options);

			if ($.inArray(base.options.dimensions, dimensions[base.options.dimensions]) == 0) {
				$('html head').append('</script><script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>');
				base.wrapPlayer(el);
			} else {
				alert("Dimension isn't included in Company player");
			};

		},

		wrapPlayer : function (el) {
			
			var base = this;
				if (base.options.video.viewCount) {
					viewCount = kFormat(base.options.video.viewCount);
				} else {
					viewCount = ''
				}
				pluralizeView = pluralize('view', base.options.video.viewCount);

				template = $(
								'<div id="videoDiv" class="vid-html5">'+
									'<video id="html-player" style="width: 100%; height: 100%;"></video>'+
									'<div class="vid-toggle-layer">'+
										'<button class="vid-play-btn item video-thumbnai" id="plypus"><i class="ion-ios-play flex align-center"></i></button>'+
									'</div>'+
									'<div class="vid-shadow-layer"></div>'+
									'<div class="vid-info-layer d-none">'+
										'<div class="vid-info-wrapper flex align-end">'+
											'<div class="main-info">'+
												'<p>You\'re watching</p>'+
												'<h1>'+base.options.video.title+'</h1>'+
											'</div>'+
											'<div class="view-count">'+
												(viewCount != '' ?('<h2>'+viewCount.toLocaleString()+' '+pluralizeView+'</h2>') : '')+
											'</div>'+
										'</div>'+
									'</div>'+
									'<div class="vid-controls-bottom flex align-center">'+
										'<div class="vid-controls-wrapper">'+
											'<div class="vid-controls-contents align-center">'+

												'<div class="flex">'+

													'<button class="vid-play-btn item"><i class="ion-ios-play flex align-center"></i></button>'+
													'<div class="vid-volume-container flex align-center">'+
														'<button class="vid-volume-control item"><i class="ion-android-volume-up flex align-center"></i></button>'+
														'<div id="vol-control" class="vid-volume-slider mb-none"></div>'+
													'</div>'+
													'<div style="margin-left:5px;margin-top:4px" class="flex">'+
														'<span class="vid-current-time"></span>'+
														'<span> / </span>'+
														'<span class="vid-duration"></span>'+
													'</div>'+
												'</div>'+
												
											'</div>'+
											'<div class="vid-controls-contents align-center">'+
												'<div class="flex f-right">'+
												'<button class="vid-request-fullscreen item"><i class="ion-android-expand flex align-center"></i></button>'+
												'<select id="preset" class="vid-preset item wd cursor">'+
													'<option value="0">Auto</option>'+
												'</select>'+
												'</div>'+
											'</div>'+
										'</div>'+
										
									'</div>'+
									'<div class="vid-controls-bottom flex align-center bt-p">'+
										'<div class="vid-controls-wrapper">'+
											'<div class="vid-controls-contents flex align-center w-s-100">'+
												'<div class="vid-progress">'+
													'<div class="progress-bg"></div>'+
													'<div class="progress-loaded"></div>'+
													'<div class="progress-fg"></div>'+
													'<div class="progress-hovertime"></div>'+
												'</div>'+
											'</div>'+
										'</div>'+
									'</div>'+
									'<div class="vid-bottom-progress-bar">'+
										'<div class="progress-fg"></div>'+
									'</div>'+
								'</div>'
								
							);
			
			currentQuality = base.options.video.quality.indexOf(base.options.video.quality[0]);
			
			$(el).css('width', '100%');
			$(el).addClass('vid-wrapper videre-container mouse-entered');
			$(el).empty().append(template);
			base.decodeMedia(el);
		},

		decodeMedia : function (el) {
			
			var base = this;
				media = document.getElementById('html-player');
				videodiv = document.getElementById('videoDiv');
				
				el = el;

			media.onloadedmetadata = function() {
				base.renderMediaData(el);
			};
			media.onwaiting = function() {
				// while video is waiting to load the next frame
			};
			media.onended = function() {
				// while video has ended
				$('.vid-wrapper').addClass('paused');
				$('.vid-play-btn').find('i').addClass('ion-ios-play').removeClass('ion-ios-pause');
			};
			media.oncanplaythrough = function() {
				// while video has loaded the next frame
			};

			// ondurationchange = Execute a function when the duration of a video has changed
		},

		renderMediaData : function(el) {
			var base = this;
				duration = base.toHHMMSS(media.duration);
				// qualitySelectorTemplate = $('<div class="vid-quality-selector flex"></div>');

			for (let i = 0; base.options.video.quality.length > i; i++){
				var qualityArray = $(
										'<button data-index="'+i+'">'+base.options.video.quality[i].label+'</button>'
									);
				// qualitySelectorTemplate.append(qualityArray);
			};

			media.volume = 0.5;

			// $(el).append(qualitySelectorTemplate);
			$(el).find('.vid-duration').text(duration);

			setInterval(function(){
				base.renderProgress();
			}, 10);

			base.setControls();
			base.setQuality();
		},

		setQuality : function () {
			var base = this;

			$('.vid-quality-selector button').click(function(){
				var index = $(this).data('index');
				
				// $('video').attr('src', base.options.video.quality[index].src);
				currentQuality = base.options.video.quality.indexOf(base.options.video.quality[index]);
				media.currentTime = base.options.currentTime;
				base.decodeMedia();
			});
			base.togglePlay();
			// set an active class for the current quality in buttons
			$('.vid-quality-selector button').removeClass();
			$('.vid-quality-selector button[data-index="'+currentQuality+'"]').addClass('active');
		},

		renderProgress : function ( ) {
			var base = this;
				currentTime = base.toHHMMSS(media.currentTime);

		 	base.options.currentTime = media.currentTime;
			$('.vid-current-time').text(currentTime);
			$('.progress-fg').css('width', (100 / media.duration) * media.currentTime+'%');
			if (media.duration && media.buffered.length){
				$('.progress-loaded').css('width', (100 / media.duration) * media.buffered.end(0)+'%');
			}
			
		},

		setControls : function () {
			var base = this;

			// $('.vid-play-btn').unbind().click(function(){
			// 	base.togglePlay();
			// });

			$('.vid-toggle-layer').unbind()

			$('.vid-toggle-layer').unbind().click(function(){
				// base.togglePlay();
			}).dblclick(function(){
				if ( videodiv.requestFullscreen ) {
					videodiv.requestFullscreen();
				} else if ( videodiv.mozRequestFullScreen ) {
					videodiv.mozRequestFullScreen();
				} else if ( videodiv.webkitRequestFullscreen ) {
					videodiv.webkitRequestFullscreen();
				} else if ( videodiv.msRequestFullscreen ) {
					videodiv.msRequestFullscreen();
				};
				base.isFullscreen();
			});

			$('.vid-request-fullscreen').unbind().click(function(){
				
				if ( videodiv.requestFullscreen ) {
					videodiv.requestFullscreen();
				} else if ( videodiv.mozRequestFullScreen ) {
					videodiv.mozRequestFullScreen();
				} else if ( videodiv.webkitRequestFullscreen ) {
					videodiv.webkitRequestFullscreen();
				} else if ( videodiv.msRequestFullscreen ) {
					videodiv.msRequestFullscreen();
				};

				base.isFullscreen();
			});

			$('.vid-volume-control').unbind().mouseenter(function(){
				base.setVolume();
			}).click(function(){
				base.toggleVolumeMute($(this));
			});

            $('.vid-progress').unbind().on('click', function(e){
                var position = base.seek(e);
                media.currentTime = position.value;
            });

            $('.progress-bg').unbind().mousemove(function(e){

                var hoverX, startX, width, result, offset;
                hoverX = e.clientX;
                offset = $('.progress-fg').offset();
                width = $('.vid-progress').width();
                result = (  base.toHHMMSS(base.seek(e).value));

                $('.progress-hovertime').addClass('hover');

                $('.progress-hovertime').css('left', hoverX - offset.left + 'px');
                $('.progress-hovertime').text(result);

            }).unbind().mouseleave(function(){
                $('.progress-hovertime').removeClass('hover');
            });

			base.mouseMovement();
		},

		seek : function ( event ) {
            var offset = $('.progress-fg').offset();
                x = event.pageX - offset.left;
                y = event.pageY - offset.top;
                max = media.duration;
                value = x * max / $('.vid-progress').width();
            return {x: x, y: y, max: max, value: value};
		},

		toggleVolumeMute : function (element) {
			var base = this;

			if (media.volume != 0) {

				media.volume = 0;
				element.find('i').removeClass().addClass('ion-android-volume-off flex align-center');
				$('#vol-control').slider({value: 0});

			} else {

				if (currentVolumeIcon) {
					element.find('i').removeClass().addClass(currentVolumeIcon);
				} else {
					element.find('i').removeClass().addClass('ion-android-volume-up flex align-center');
				}
				media.volume = base.options.audio.volume / 100;
				$('#vol-control').slider({value: base.options.audio.volume});

			}
		},

		setVolume : function() {
			var base = this;

			$('#vol-control').css('width', '100px');
			$('#vol-control').slider({
			    min: 0,
			    max: 100,
			    value: media.volume == 0 ? 0 : base.options.audio.volume,
				range: "min",
				animate: false,
			    slide: function(event, ui) {
			      	media.volume = ui.value / 100;
			      	base.options.audio.volume = ui.value;
			      	if ( ui.value >= 50) {
			      		$('.vid-volume-control i').removeClass().addClass('ion-android-volume-up flex align-center');
			      		currentVolumeIcon = 'ion-android-volume-up flex align-center';
			      	} else if ( ui.value <= 50 ) {
			      		$('.vid-volume-control i').removeClass().addClass('ion-android-volume-down flex align-center');
			      		currentVolumeIcon = 'ion-android-volume-down flex align-center';
			      		if (ui.value == 0) {
			      			$('.vid-volume-control i').removeClass().addClass('ion-android-volume-mute flex align-center');
			      			currentVolumeIcon = 'ion-android-volume-mute flex align-center';
			      		}
			      	};
			    }
			});

			$('.vid-volume-container').mouseleave(function(){
				$('#vol-control').css('width', '0');
			});

		},

		mouseMovement : function () {
			var base = this;
				timeout = null;

			    clearTimeout(timeout);

		    timeout = setTimeout(function() {
		        // mouse is idle after 1.5s
		        base.toggleControls();
		    }, 2500);
			$(this).addClass('mouse-entered');
			$('#plypus').addClass('mouse-entered');
			$('.vid-wrapper').on('mousemove', function() {
			    clearTimeout(timeout);

			    timeout = setTimeout(function() {
			        // mouse is idle after 1.5s
			        base.toggleControls();
			    }, 2500);
				$(this).addClass('mouse-entered');
				$('#plypus').addClass('mouse-entered');
			}).mouseleave(function(){
			    clearTimeout(timeout);
			    timeout = setTimeout(function() {
			        // mouse is idle after 1.5s
			        base.toggleControls();
			    }, 2500);
			});;

		},

		toggleControls : function() {
			var base = this;
			$('.vid-wrapper').removeClass('mouse-entered');
			$('#plypus').removeClass('mouse-entered');
		},

		isFullscreen : function () {
			var base = this;
			
			if (!document.fullscreen) {
				$('.vid-wrapper').addClass('is-fullscreen');
				$('.vid-wrapper button.vid-request-fullscreen i').removeClass('ion-android-expand').addClass('ion-arrow-shrink')
				// base.exitFullscreen();
			} else {
				// if not fullscreen
				$('.vid-wrapper button.vid-request-fullscreen i').addClass('ion-android-expand').removeClass('ion-arrow-shrink')
				$('.vid-wrapper').removeClass('is-fullscreen');
				base.exitFullscreen();
			};

			

		},

		exitFullscreen : function ( ) {
			// $('.vid-request-fullscreen .ion-arrow-shrink').click(function(){
		        if (document.exitFullscreen) {
					document.exitFullscreen();
					// $('.vid-wrapper button.vid-request-fullscreen i').addClass('ion-android-expand').removeClass('ion-arrow-shrink')
					// $('.vid-wrapper').removeClass('is-fullscreen');
		        } else if (document.webkitExitFullscreen) {
		            document.webkitExitFullscreen();
		        } else if (document.mozCancelFullScreen) {
		            document.mozCancelFullScreen();
		        } else if (document.msExitFullscreen) {
		            document.msExitFullscreen();
		        };
			// });
			$('.vid-toggle-layer').dblclick(function(){
		        if (document.exitFullscreen) {
		            document.exitFullscreen();
		        } else if (document.webkitExitFullscreen) {
		            document.webkitExitFullscreen();
		        } else if (document.mozCancelFullScreen) {
		            document.mozCancelFullScreen();
		        } else if (document.msExitFullscreen) {
		            document.msExitFullscreen();
		        };
			});
		},

		togglePlay : function() {
			var isPlaying = media.currentTime > 0 && !media.paused && !media.ended && media.readyState > 2;
			if (!isPlaying){
				media.play();

				$('.vid-wrapper').removeClass('paused');
				$('.vid-play-btn').find('i').removeClass('ion-ios-play').addClass('ion-ios-pause');
			} else {

				$('.vid-wrapper').addClass('paused').addClass('mouse-entered');
				$('.vid-play-btn').find('i').addClass('ion-ios-play').removeClass('ion-ios-pause');
				media.pause();
			}
		},

        toHHMMSS : function (time) {
        	var base = this;
            	m=~~(time/60), s=~~(time % 60);
            return (m<10?"0"+m:m)+':'+(s<10?"0"+s:s);
        }
	};

	$.fn.videre = function(options){
		return Video.init(options, $(this[0]));
	};

	
	// default options
	$.fn.videre.options = {
		video: {
			quality: [{
				label: null,
				src: null
			}],
			title: null,
			viewCount: null
		},
		currentTime: null,
		audio: {
			volume: 50
		},
		dimensions: {
			1920: [1920, 1080]
		},
		bottomProgressBar: true
	};


}(jQuery, window, document));


//hls.startLoad()
//hls.stopLoad()

