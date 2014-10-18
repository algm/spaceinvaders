!function(a,b){"use strict";function c(){this.loaded=b.Deferred(),this.loadCount=0,this.total=4,this.sounds={}}c.prototype.load=function(){function a(){return c.loadCount<c.total?setTimeout(a,50):(c.loaded.resolve(c),clearTimeout(b),!1)}var b,c=this;return b=a(),this.sounds.shoot=new Howl({urls:["res/sound/playershoot.mp3","res/sound/playershoot.wav"],volume:.5,onload:function(){c.loadCount++}}),this.sounds.explosion=new Howl({urls:["res/sound/explosion.mp3","res/sound/explosion.wav"],volume:.5,onload:function(){c.loadCount++}}),this.sounds.invaderkilled=new Howl({urls:["res/sound/invaderkilled.mp3","res/sound/invaderkilled.wav"],volume:.3,onload:function(){c.loadCount++}}),this.sounds.ufo=new Howl({urls:["res/sound/ufo.mp3","res/sound/ufo.wav"],volume:.5,onload:function(){c.loadCount++}}),this.loaded},c.prototype.play=function(a){return"undefined"!=typeof this.sounds[a]&&this.sounds[a].play(),this},a.Sound=c}(window,jQuery);var __hasProp={}.hasOwnProperty,__extends=function(a,b){function c(){this.constructor=a}for(var d in b)__hasProp.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a};!function(){"use strict";for(var a=0,b=["webkit","moz"],c=0;c<b.length&&!window.requestAnimationFrame;++c)window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(b){var c=(new Date).getTime(),d=Math.max(0,16-(c-a)),e=window.setTimeout(function(){b(c+d)},d);return a=c+d,e}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})}(),function(a,b){"use strict";function c(a,b){return!(a===b||a.settings.posX+a.settings.width<=b.settings.posX||a.settings.posY+a.settings.height<=b.settings.posY||a.settings.posX>=b.settings.posX+b.settings.width||a.settings.posY>=b.settings.posY+b.settings.height)}function d(a,b,c){this.canvas=document.createElement("canvas"),this.canvas.width=this.width=b,this.canvas.height=this.height=c,this.objects=[],this.ctx=this.canvas.getContext("2d"),a.html(this.canvas),this.height=c,this.width=b,this.stopped=!0,this.animation=null}function e(){this.down={},this.pressed={};var a=this;document.addEventListener("keydown",function(b){a.down[b.keyCode]=!0}),document.addEventListener("keyup",function(b){delete a.down[b.keyCode],delete a.pressed[b.keyCode]})}function f(a,b,c){this.input=new e,this.score=0;var f=this;this.invaderCount=0,h.addEventListener("load",function(){f.screen=new d(a,b,c),f.player=new j({sprite:[{img:this,posX:62,posY:0,width:22,height:16}],posX:.5*b-11,posY:c-26,width:22,height:16},f),f.addObject(f.player),f.initInvaders(),f.start()}),h.src="res/invaders.png"}var g=new Sound,h=new Image;d.prototype.clock=function(b){b||(b=this.clock);var c=this;return this.stopped=!1,this.animation=function(b){a.requestAnimationFrame(c.animation);b||(b=(new Date).getTime()),c.time=b,c.stopped||(c.update(),"function"==typeof c.onUpdate&&c.onUpdate.call(this))},this.timer=this.animation(),this},d.prototype.stop=function(){return this.stopped=!0,this},d.prototype.clear=function(){this.ctx.clearRect(0,0,this.width,this.height)},d.prototype.update=function(){var a=this.ctx;this.clear(),this.objects.length&&(_.each(this.objects,function(a){a.update(this)},this),_.each(this.objects,function(b){b.render(a,this)},this))},e.prototype.isDown=function(a){return this.down[a]},e.prototype.isPressed=function(a){return this.pressed[a]?!1:this.down[a]?this.pressed[a]=!0:!1};var i=function(){function a(a,b){var c={x:0,y:0,width:10,height:10,velocity:4};this.game=b,this.input=this.game.input,this.frame=0,this.oid=_.uniqueId("object-"),this.spriteFrames=0,this.currentFrame=0,a.sprite&&a.sprite.length&&(this.nsprites=a.sprite.length),this.settings=_.extend({},c,a)}return a.prototype.update=function(a){return this.frame++,"function"==typeof this.onUpdate&&_.isObject(this.settings)&&this.onUpdate.call(this,a),this},a.prototype.render=function(a,b){if(this.settings.sprite){var c=this.settings.sprite[this.currentFrame],d=this.settings.posX,e=this.settings.posY;this.settings.frameDuration&&this.spriteFrames>=this.settings.frameDuration&&(this.currentFrame=this.getNextFrame(),c=this.settings.sprite[this.currentFrame],this.spriteFrames=0),this.spriteFrames++,0>d&&(this.settings.posX=d=0),d+c.width>b.width&&(this.settings.posX=d=b.width-c.width),a.drawImage(c.img,c.posX,c.posY,c.width,c.height,d,e,c.width,c.height)}else a.fillStyle=this.settings.color,a.fillRect(this.settings.posX,this.settings.posY,this.settings.width,this.settings.height);return this},a.prototype.getNextFrame=function(){return this.currentFrame+1>=this.settings.sprite.length?0:this.currentFrame+1},a.prototype.destroy=function(){"function"==typeof this.onDestroy&&this.onDestroy.call(this),this.game.removeObject(this.oid)},a.prototype.hit=function(){this.destroy()},a}(),j=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return __extends(b,a),b.prototype.onUpdate=function(){this.input.isDown(37)&&(this.settings.posX-=this.settings.velocity),this.input.isDown(39)&&(this.settings.posX+=this.settings.velocity),this.input.isPressed(32)&&this.fire()},b.prototype.fire=function(){return this.game.addObject(new k(this.settings.posX+this.settings.width/2-1,this.settings.posY-1,10,"up",this.game)),g.play("shoot"),this},b.prototype.hit=function(){return this.destroy(),g.play("explosion"),this.game.stop(),this},b}(i),k=function(a){function b(a,c,d,e,f){var g={posX:a,posY:c,width:3,height:6,velocity:d,color:"rgba(255,255,255, 1)"};return this.direction=e,b.__super__.constructor.apply(this,[g,f])}return __extends(b,a),b.prototype.onUpdate=function(a){"down"==this.direction&&(this.settings.posY+=this.settings.velocity),"up"==this.direction&&(this.settings.posY-=this.settings.velocity),(this.settings.posY<0||this.settings.posY>a.height)&&this.destroy(),this.checkCollision()},b.prototype.checkCollision=function(){var a=this.game.findObject(function(a){return!(a instanceof b)&&c(this,a)},this);return a&&(a.hit(),this.destroy()),this},b}(i),l=function(a){function b(a,e,f,g,h){var i={posX:10+g.x+e*d,posY:10+g.y+a*c,width:d,height:16,color:"rgba(255,255,255, 1)",sprite:f,frameDuration:40};return this.offset=g,this.row=a,this.col=e,this.speed=d/75,this.value=this.value||100,b.__super__.constructor.apply(this,[i,h])}__extends(b,a);var c=26,d=26;return b.prototype.onUpdate=function(a){this.canShoot()&&this.fire(),this.shouldTurn(a)&&(this.speed=-this.speed),this.settings.posX+=this.speed},b.prototype.fire=function(){return this.game.addObject(new k(this.settings.posX+this.settings.width/2-this.speed,this.settings.posY+this.settings.height+1,4,"down",this.game)),this},b.prototype.canShoot=function(){var a;return a=this.game.findObject(function(a){return a instanceof b?a.col===this.col&&a.row>this.row:!1},this),!a&&Math.random()>=.997},b.prototype.shouldTurn=function(a){var b=d+this.settings.posX-this.offset.x,c=11-this.col,e=this.settings.posX-this.offset.x;return this.speed<0?e-d*this.col<=0:b-d+d*c>=a.width},b.prototype.hit=function(){return this.game.addScore(this.value),g.play("invaderkilled"),this.destroy(),this},b}(i),m=function(a){function b(a,c,d){var e=[{img:h,posX:22,posY:0,width:16,height:16},{img:h,posX:22,posY:16,width:16,height:16}],f={x:5,y:5};return b.__super__.constructor.apply(this,[a,c,e,f,d])}return __extends(b,a),b}(l),n=function(a){function b(a,c,d){var e=[{img:h,posX:0,posY:0,width:22,height:16},{img:h,posX:0,posY:16,width:22,height:16}],f={x:2,y:5};return b.__super__.constructor.apply(this,[a,c,e,f,d])}return __extends(b,a),b}(l),o=function(a){function b(a,c,d){var e=[{img:h,posX:38,posY:0,width:24,height:16},{img:h,posX:38,posY:16,width:24,height:16}],f={x:1,y:5};return b.__super__.constructor.apply(this,[a,c,e,f,d])}return __extends(b,a),b}(l);f.prototype.initInvaders=function(){var a,b;for(a=0;6>a;a++)for(b=0;11>b;b++)2>a&&this.addObject(new m(a,b,this)),a>=2&&4>a&&this.addObject(new n(a,b,this)),a>=4&&this.addObject(new o(a,b,this)),this.invaderCount++},f.prototype.start=function(){return this.screen.clock(),this},f.prototype.stop=function(){return this.screen.stop(),this},f.prototype.addObject=function(a){return this.screen.objects.push(a),this},f.prototype.removeObject=function(a){return this.screen.objects=_.reject(this.screen.objects,function(b){return b.oid===a}),this},f.prototype.findObject=function(a,b){return _.find(this.screen.objects,a,b||this)},f.prototype.addScore=function(a){return this.score+=a,"function"==typeof this.afterScore&&this.afterScore.call(this,this.score),this.invaderCount--,this.invaderCount||this.stop(),this},b(function(){g.load().done(function(){var a=b("#canvas"),c=b("#score"),d=new f(a,a.width(),a.height());d.afterScore=function(a){c.text(a)}})})}(window,jQuery);