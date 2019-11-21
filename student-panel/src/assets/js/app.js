

var BufferM3U8Video = function (src) {
	$('#player').videre({
		video: {
			quality: [
				{
					label: '720p',
				},
				{
					label: '360p'
				},
				{
					label: '240p'
				}
			],
			title: '[PLATFORM]'
		},
		dimensions: 768
	});


	var video = document.getElementById('html-player');
	
	var preset = document.getElementById('preset');
	var hls = new Hls();

	function getComboA(selectObject) {
		var value = selectObject.value;
		hls.currentLevel = value;
	}

	$('.vid-preset').unbind().on('change',function(selectObject){
		
		var value = selectObject.target.value;
		hls.currentLevel = value;
		
	});

	$('.vid-play-btn').unbind().click(function(){
		var isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
		if (!isPlaying){
			hls.startLoad();
			media.play();
			$('.vid-wrapper').removeClass('paused');
			$('.vid-play-btn').find('i').removeClass('ion-ios-play').addClass('ion-ios-pause');
		} else {
			$('.vid-wrapper').addClass('paused').addClass('mouse-entered');
			$('.vid-play-btn').find('i').addClass('ion-ios-play').removeClass('ion-ios-pause');
			media.pause();
			hls.stopLoad();
		}
	});

	// $('.vid-toggle-layer').unbind().click(function(){
	// 	var isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
	// 	if (!isPlaying){
	// 		hls.startLoad();
	// 		media.play();
	// 		$('.vid-wrapper').removeClass('paused');
	// 		$('.vid-play-btn').find('i').removeClass('ion-ios-play').addClass('ion-ios-pause');
	// 	} else {
	// 		$('.vid-wrapper').addClass('paused').addClass('mouse-entered');
	// 		$('.vid-play-btn').find('i').addClass('ion-ios-play').removeClass('ion-ios-pause');
	// 		media.pause();
	// 		hls.stopLoad();
	// 	}
	// });

	if (Hls.isSupported()) {
		hls.currentLevel = 0;
		hls.loadSource(src);
		hls.attachMedia(video);

		hls.on(Hls.Events.MANIFEST_PARSED, function () {
			video.play();
			
			for (var i = 0; i < hls.levels.length; i++) {
				let level = hls.levels[i];

				var option = document.createElement("option");
				option.text = level.width + "X" + level.height;
				option.value = i;
				preset.appendChild(option);
			}
		});
	}
	else if (video.canPlayType('application/vnd.apple.mpegurl')) {
		video.src = src;
		video.addEventListener('loadedmetadata', function () {
			video.play();
		});
	}

}

module.exports = BufferM3U8Video;
