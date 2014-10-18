'use strict';

//Polyfills
var __hasProp = {}.hasOwnProperty,
	__extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

//REQUEST ANIMATION FRAME POLYFILL
;(function() {
	'use strict';

    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
    	window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

}());

;(function(window, $, undefined) {
	'use strict';

	var sound = new Sound();
	var img = new Image();

	// Helpers

	/**
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function isColliding(b1, b2) {
	    return !(
	      b1 === b2 ||
	        b1.settings.posX + b1.settings.width <= b2.settings.posX ||
	        b1.settings.posY + b1.settings.height <= b2.settings.posY ||
	        b1.settings.posX >= b2.settings.posX + b2.settings.width ||
	        b1.settings.posY >= b2.settings.posY + b2.settings.height
	    );
	}

	// ----------------

	//Screen
	function Screen($el, width, height) {
		// create canvas and grab 2d context
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.width = width;
		this.canvas.height = this.height = height;
		this.objects = [];
		this.ctx = this.canvas.getContext("2d");

		// append canvas to body of document
		$el.html(this.canvas);

		this.height = height;
		this.width = width;
		this.stopped = true;
		this.animation = null;
	}

	Screen.prototype.clock = function(callback, time) {
		if (!callback) {
			callback = this.clock;
		}

		var _self = this;

		this.stopped = false;

		this.animation = function(time) {
			var timer = window.requestAnimationFrame(_self.animation);

			if (!time) {
				time = new Date().getTime();
			}

			_self.time = time;

			if (!_self.stopped) {
				_self.update();
			}
		};

		this.timer = this.animation();

		return this;
	};

	Screen.prototype.stop = function() {
		this.stopped = true;

		return this;
	};

	/**
	 * Clear the complete canvas
	 */
	Screen.prototype.clear = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	};

	Screen.prototype.update = function() {
		var ctx = this.ctx;

		this.clear();

		if (this.objects.length) {
			_.each(this.objects, function(obj) {
				obj.update(this);
			}, this);

			_.each(this.objects, function(obj) {
				obj.render(ctx, this);
			}, this);
		}
	};

	// -------------------

	//InputHandler

	function InputHandler() {
		this.down = {};
		this.pressed = {};
		// capture key presses
		var _this = this;
		document.addEventListener("keydown", function(evt) {
			_this.down[evt.keyCode] = true;
		});
		document.addEventListener("keyup", function(evt) {
			delete _this.down[evt.keyCode];
			delete _this.pressed[evt.keyCode];
		});
	};

	/**
	 * Returns whether a key is pressod down
	 * @param  {number}  code the keycode to check
	 * @return {bool}         the result from check
	 */
	InputHandler.prototype.isDown = function(code) {
		return this.down[code];
	};

	/**
	 * Return wheter a key has been pressed
	 * @param  {number}  code the keycode to check
	 * @return {bool}         the result from check
	 */
	InputHandler.prototype.isPressed = function(code) {
		// if key is registred as pressed return false else if
		// key down for first time return true else return false
		if (this.pressed[code]) {
			return false;
		} else if (this.down[code]) {
			return this.pressed[code] = true;
		}
		return false;
	};

	//GameObject
	var GameObject = (function() {

		function GameObject(settings, game) {
			var _defaults = {
				x: 0,
				y: 0,
				width: 10,
				height: 10,
				velocity: 4
			};

			this.game = game;
			this.input = this.game.input;
			this.frame = 0;
			this.oid = _.uniqueId('object-');
			this.spriteFrames = 0;
			this.currentFrame = 0;

			if (settings.sprite && settings.sprite.length) {
				this.nsprites = settings.sprite.length;
			}

			this.settings = _.extend({}, _defaults, settings);
		}

		GameObject.prototype.update = function(scr) {
			this.frame++;

			if (typeof this.onUpdate == 'function' && _.isObject(this.settings)) {
				this.onUpdate.call(this, scr);
			}

			return this;
		};

		GameObject.prototype.render = function(ctx, scr) {

			if (this.settings.sprite) {
				// draw part of spritesheet to canvas
				var sp = this.settings.sprite[this.currentFrame];
				var x = this.settings.posX;
				var y = this.settings.posY;

				if (this.settings.frameDuration && this.spriteFrames >= this.settings.frameDuration) {
					this.currentFrame = this.getNextFrame();
					sp = this.settings.sprite[this.currentFrame];
					this.spriteFrames = 0;
				}

				this.spriteFrames++;

				if (x < 0) {
					this.settings.posX = x = 0;
				}

				if (x + sp.width > scr.width) {
					this.settings.posX = x = scr.width - sp.width;
				}

				ctx.drawImage(sp.img, sp.posX, sp.posY, sp.width, sp.height, x, y, sp.width, sp.height);
			} else {
				// set the current fillstyle and draw sprite
				ctx.fillStyle = this.settings.color;
				ctx.fillRect(this.settings.posX, this.settings.posY, this.settings.width, this.settings.height);
			}

			return this;
		};

		GameObject.prototype.getNextFrame = function() {
			if (this.currentFrame + 1 >= this.settings.sprite.length) {
				return 0;
			}

			return this.currentFrame + 1;
		};

		GameObject.prototype.destroy = function() {
			if (typeof this.onDestroy == 'function') {
				this.onDestroy.call(this);
			}

			this.game.removeObject(this.oid);
		};

		GameObject.prototype.hit = function() {
			this.destroy();
		};

		return GameObject;
	})();


	// -------------------

	// Player
	var Player = (function(_super) {
		__extends(Player, _super);

		function Player(settings, game) {
			return Player.__super__.constructor.apply(this, arguments);
		}

		Player.prototype.onUpdate = function(scr) {
			// update tank position depending on pressed keys
			if (this.input.isDown(37)) { // Left
				this.settings.posX -= this.settings.velocity;
			}

			if (this.input.isDown(39)) { // Right
				this.settings.posX += this.settings.velocity;
			}

			if (this.input.isPressed(32)) { // Space
				this.fire();
			}
		};

		Player.prototype.fire = function() {
			this.game.addObject(new Bullet(this.settings.posX + (this.settings.width / 2), this.settings.posY - 1, 10, 'up', this.game));
			sound.play('shoot');

			return this;
		};

		Player.prototype.hit = function() {
			this.destroy();

			this.game.stop();

			return this;
		};

		return Player;

	})(GameObject);

	// -------------------

	// Bullet
	var Bullet = (function(_super) {
		__extends(Bullet, _super);

		function Bullet(posx, posy, velocity, direction, game) {
			var settings = {
				posX: posx + 4.5,
				posY: posy,
				width: 3,
				height: 6,
				velocity: velocity,
				color: 'rgba(255,255,255, 1)'
			};

			this.direction = direction;

			return Bullet.__super__.constructor.apply(this, [settings, game]);
		}

		Bullet.prototype.onUpdate = function(scr) {
			if(this.direction == 'down') {
				this.settings.posY += this.settings.velocity;
			}

			if(this.direction == 'up') {
				this.settings.posY -= this.settings.velocity;
			}

			if (this.settings.posY < 0 || this.settings.posY > scr.height) {
				this.destroy();
			}

			this.checkCollision();
		};

		Bullet.prototype.checkCollision = function() {
			var collided = this.game.findObject(function(obj) {
				return !(obj instanceof Bullet) && isColliding(this, obj);
			}, this);

			if (collided) {
				console.log('hit!');
				collided.hit();
				this.destroy();
			}

			return this;
		};

		return Bullet;

	})(GameObject);

	// -------------------

	// Invader
	var Invader = (function(_super) {
		__extends(Invader, _super);

		var rowHeight = 26,
		    colWidth = 26;

		function Invader(row, col, sprites, offset, game) {
			var settings = {
				posX: 10 + offset.x + col * colWidth,
				posY: 10 + offset.y + row * rowHeight,
				width: colWidth,
				height: 16,
				color: 'rgba(255,255,255, 1)',
				sprite: sprites,
				frameDuration: 40
			};

			this.offset = offset;

			this.row = row;
			this.col = col;
			this.speed = colWidth / 75;
			this.value = this.value || 100;

			return Invader.__super__.constructor.apply(this, [settings, game]);
		}

		Invader.prototype.onUpdate = function(scr) {
			if (this.canShoot()) {
				this.fire();
			}

			if (this.shouldTurn(scr)) {
				this.speed = -this.speed;
			}

			this.settings.posX += this.speed;
		};

		Invader.prototype.fire = function() {
			console.log('alien firing');
			this.game.addObject(new Bullet(this.settings.posX + (this.settings.width / 2) - this.speed, this.settings.posY + this.settings.height + 1, 4, 'down', this.game));
			return this;
		};

		Invader.prototype.canShoot = function() {
			var hasInvaderAtBottom;

			hasInvaderAtBottom = this.game.findObject(function(obj) {
				if (obj instanceof Invader) {
					return obj.col === this.col && obj.row > this.row;
				}

				return false;
			}, this);

			return !hasInvaderAtBottom && Math.random() >= 0.997;
		};

		Invader.prototype.shouldTurn = function(scr) {
			var rightBorder = colWidth + this.settings.posX - this.offset.x;
			var colOffset = 11 - this.col;
			var leftBorder = this.settings.posX - this.offset.x;

			if (this.speed < 0) {
				return leftBorder - colWidth * this.col <= 0;
			}

			return rightBorder - colWidth + colWidth * colOffset >= scr.width;
		};

		Invader.prototype.hit = function() {
			this.game.addScore(this.value);
			this.destroy();

			return this;
		};

		return Invader;
	})(GameObject);

	// -------------------

	// InvaderTop
	var InvaderTop = (function(_super) {
		__extends(InvaderTop, _super);

		function InvaderTop(row, col, game) {
			var sprites = [{
				img: img,
				posX: 22,
				posY: 0,
				width: 16,
				height: 16
			}, {
				img: img,
				posX: 22,
				posY: 16,
				width: 16,
				height: 16
			}];

			var offset = {
				x: 5,
				y: 5
			};

			return InvaderTop.__super__.constructor.apply(this, [row, col, sprites, offset, game]);
		}

		return InvaderTop;
	})(Invader);

	// -------------------

	// InvaderMid
	var InvaderMid = (function(_super) {
		__extends(InvaderMid, _super);

		function InvaderMid(row, col, game) {
			var sprites = [{
				img: img,
				posX: 0,
				posY: 0,
				width: 22,
				height: 16
			}, {
				img: img,
				posX: 0,
				posY: 16,
				width: 22,
				height: 16
			}];

			var offset = {
				x: 2,
				y: 5
			};

			return InvaderMid.__super__.constructor.apply(this, [row, col, sprites, offset, game]);
		}

		return InvaderMid;
	})(Invader);

	// -------------------

	// InvaderBottom
	var InvaderBottom = (function(_super) {
		__extends(InvaderBottom, _super);

		function InvaderBottom(row, col, game) {
			var sprites = [{
				img: img,
				posX: 38,
				posY: 0,
				width: 24,
				height: 16
			}, {
				img: img,
				posX: 38,
				posY: 16,
				width: 24,
				height: 16
			}];

			var offset = {
				x: 1,
				y: 5
			};

			return InvaderBottom.__super__.constructor.apply(this, [row, col, sprites, offset, game]);
		}

		return InvaderBottom;
	})(Invader);

	// -------------------


	//Game
	function Game($canvas, width, height) {
		this.input = new InputHandler();
		this.score = 0;
		var _self = this;

		// create all sprites from assets image
		img.addEventListener("load", function() {
			_self.screen = new Screen($canvas, width, height);
			/*alSprite = [
				[new Srite(this,  0, 0, 22, 16), new Sprite(this,  0, 16, 22, 16)],
				[new Sprite(this, 22, 0, 16, 16), new Sprite(this, 22, 16, 16, 16)],
				[new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)]
			];
			taSprite = new Sprite(this, 62, 0, 22, 16);
			ciSprite = new Sprite(this, 84, 8, 36, 24);
			*/

			_self.player = new Player({
				sprite: [{
					img: this,
					posX: 62,
					posY: 0,
					width: 22,
					height: 16
				}],
				posX: width * 0.5 - 11,
				posY: height - 26
			}, _self);
			_self.addObject(_self.player);
			_self.initInvaders();

			_self.start();
		});

		img.src = "res/invaders.png";
	}

	Game.prototype.initInvaders = function() {
		var i, j;

		//top invaders
		for(i = 0; i < 6; i++) {
			for(j=0; j < 11; j++) {
				if (i < 2) {
					this.addObject(new InvaderTop(i, j, this));
				}

				if (i >= 2 && i < 4) {
					this.addObject(new InvaderMid(i, j, this));
				}

				if (i >= 4) {
					this.addObject(new InvaderBottom(i, j, this));
				}
			}
		}
	};

	Game.prototype.start = function() {
		this.screen.clock();

		return this;
	};

	Game.prototype.stop = function() {
		this.screen.stop();

		return this;
	};

	Game.prototype.addObject = function(obj) {
		this.screen.objects.push(obj);

		return this;
	};

	Game.prototype.removeObject = function(id) {
		this.screen.objects = _.reject(this.screen.objects, function(obj) {
			return obj.oid == id;
		});

		return this;
	};

	Game.prototype.findObject = function(testfunc, context) {
		return _.find(this.screen.objects, testfunc, context || this);
	};

	Game.prototype.addScore = function(score) {
		this.score += score;

		if (typeof this.afterScore == 'function') {
			this.afterScore.call(this, this.score);
		}

		return this;
	};

	// -------------------


	//Initialization
	$(function() {
		sound.load().done(function() {
			var $canvas = $('#canvas');
			var $score = $('#score');
			var game = new Game($canvas, $canvas.width(), $canvas.height());

			game.afterScore = function(score) {
				$score.text(score);
			};
		});
	});
})(window, jQuery);