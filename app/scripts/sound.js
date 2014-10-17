;(function(window, $, undefined) {
	'use strict';

	function Sound() {
		this.loaded = $.Deferred();
		this.loadCount = 0;
		this.total = 1;
		this.sounds = {};
	}

	Sound.prototype.load = function() {
		var _self = this, to;

		function waitForLoad() {
			if (_self.loadCount < _self.total) {
				return setTimeout(waitForLoad, 50);
			} else {
				_self.loaded.resolve(_self);
				clearTimeout(to);
			}

			return false;
		}

		to = waitForLoad();

		this.sounds.shoot = new Howl({
		  urls: ['res/sound/playershoot.mp3'],
		  volume: 0.5,
		  onload: function() {
		  	_self.loadCount++;
		  }
		});

		return this.loaded;
	};

	Sound.prototype.play = function(sound) {
		if (typeof this.sounds[sound] !== 'undefined') {
			this.sounds[sound].play();
		}

		return this;
	};

	window.Sound = Sound;
})(window, jQuery);