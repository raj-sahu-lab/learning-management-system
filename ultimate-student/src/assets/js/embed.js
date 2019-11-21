
var BlujeansEmbed = function(BJN_CLIENT)
{
	if (BJN_CLIENT)
	{
		BJN_CLIENT.version = 1;

		var isClean = false;

		var funcLoad = function(load, callback)
		{
			var args = '';
			var height = BJN_CLIENT.height ? BJN_CLIENT.height : '600';
			var width = BJN_CLIENT.width ? BJN_CLIENT.width : '100%';
			var pin = '';

			if (!BJN_CLIENT.meetingId)
			{
				alert('Missing BJN_CLIENT.meetingId');
				return;
			}

			if (BJN_CLIENT.pin)
			{
				pin = '/' + BJN_CLIENT.pin;
			}

			if (BJN_CLIENT.email)
			{
				args += '&email=' + encodeURIComponent(BJN_CLIENT.email);
			}

			if (BJN_CLIENT.name)
			{
				args += '&name=' + encodeURIComponent(BJN_CLIENT.name);
			}

			var html = '<iframe frameborder="0" width="' + width + '" height="' + height + '" src="' + BJN_CLIENT.protocol + '//' + BJN_CLIENT.hostname + '/' + BJN_CLIENT.meetingId + pin + '?embed=true' + args + '" allow="geolocation; microphone; camera; midi; encrypted-media"><\/iframe>';

			if (load)
			{
				if (BJN_CLIENT.content)
				{
					document.getElementById(BJN_CLIENT.content).innerHTML = html;
				}
				else
				{
					document.writeln(html);
				}
			}
			else if (isClean)
			{
				window.open(BJN_CLIENT.protocol + '//' + BJN_CLIENT.hostname + '/' + BJN_CLIENT.meetingId + pin, 'bluejeans');
			}
			else
			{
				window.open(BJN_CLIENT.protocol + '//' + BJN_CLIENT.hostname + '/' + BJN_CLIENT.meetingId + pin + '?embed=true&fullscreen=true', 'bluejeans'); // + args
			}

			if (BJN_CLIENT.onJoin)
			{
				BJN_CLIENT.onJoin.apply();
			}

			if (callback)
			{
				callback.apply();
			}
		};

		BJN_CLIENT.launch = function(callback)
		{
			funcLoad(false, typeof callback === 'undefined' ? null : callback);
		};
		BJN_CLIENT.load = function(callback)
		{
			funcLoad(true, typeof callback === 'undefined' ? null : callback);
		};

		var myScript = document.getElementById('bjn-embed');
		if (myScript)
		{
			function getLocation(href)
			{
				var l = document.createElement("a");
				l.href = href;
				return l;
			}

			var myLocation = getLocation(myScript.getAttribute('src'));
			if (myLocation)
			{
				if (!BJN_CLIENT.hostname)
				{
					BJN_CLIENT.hostname = myLocation.hostname ? myLocation.hostname : 'bluejeans.com';
				}

				if (!BJN_CLIENT.protocol)
				{
					BJN_CLIENT.protocol = myLocation.protocol && myLocation.protocol !== ':' ? myLocation.protocol : 'https:';
				}
			}

			function getParameterByName(scriptSrc, name)
			{
				name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
				var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(scriptSrc);
				return results == null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
			}

			var clean = getParameterByName(myScript.getAttribute('src'), 'clean');
			if (clean)
			{
				isClean = clean;
			}

			var defer = getParameterByName(myScript.getAttribute('src'), 'defer');
			if (!defer || defer == 'false')
			{
				funcLoad(true);
			}
		}
	}
}

module.exports = BlujeansEmbed;
