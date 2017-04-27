/*
 * ==============================================================================
 * ** Victor Engine MV - Throwable Objects
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.03.23 > First release.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Throwable Objects'] = '1.00';

var VictorEngine = VictorEngine || {};
VictorEngine.ThrowableObjects = VictorEngine.ThrowableObjects || {};

(function() {

	VictorEngine.ThrowableObjects.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.ThrowableObjects.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Throwable Objects', 'VE - Basic Module', '1.16');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Throwable Objects', 'VE - Charge Actions');
	};

	VictorEngine.ThrowableObjects.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.ThrowableObjects.requiredPlugin.call(this, name, required, version)
		};
	};
	
})();

/*:
 * ------------------------------------------------------------------------------
 * @plugindesc v1.00 - Throwable object animations for skills and items.
 * @author Victor Sant
 *
 * ------------------------------------------------------------------------------
 * @help 
 * ------------------------------------------------------------------------------
 * Skills, Items, Weapons and Enemies Notetags:
 * ------------------------------------------------------------------------------
 *
 * <throw object: timing>
 *  image: weapon|icon X|animation X|picture 'name'
 *  speed: X
 *  duration: X
 *  animation: X
 *  delay: X
 *  spin: X
 *  arc: X
 *  start: X Y
 *  end: X Y
 *  return
 * </throw object>
 *  This tag adds a throwable object animation to the skill or item.
 *  All values except the type are opitional.
 *    timing : the timing that the thowable object is shown.
 *       before : the throw is shown before the action battle animation.
 *       during : the throw is shown at same time as the action battle animation.
 *       after  : the throw is shown after the action battle animation.
 *
 * ---------------
 *
 *   - Image
 *   Image used to display the throwable object.
 *     weapon : displays an image based on the weapon <throw image> notetag.
 *     icon X : displays the icon id = X.
 *     picture 'X' : displays the picture with filename = X. In quotations.
 *     animaiton X : displays the animation id = X (requires the plugin 
 *                   'VE - Looping Animation)
 *
 * ---------------
 *
 *   - Speed
 *   Speed of the throwable object movement. Numeric value. The default value
 *   is 100. The speed is not used if you set a duration to the throw.
 *
 * ---------------
 *
 *   - Duration
 *   Duration in frames of the throwable object movement. Numeric value. If you
 *   set a duration, the throw object movement will take this time no matter the
 *   distance it will have to move. Objects that targets longer distance will
 *   move faster, but all of them will reach the destination at the same time.
 *
 * ---------------
 *
 *   - Delay
 *   Delay time in frames for the throw start. Numeric value. This can be used
 *   to syncronize the throw start and the battler motion.
 *
 * ---------------
 *
 *   - Animation
 *   Display an animation on the user when the throw starts, or when it ends if
 *   the throw is returning. This animation is displayed at the start even if
 *   you have set a delay for the throw.
 *
 * ---------------
 *
 *   - Spin
 *   Adds a spinning animation to the throw object, the value decides the speed
 *   of the spin. Numeric Value. 
 *
 * ---------------
 *
 *   - Arc
 *   Adds an ellpitic arc for the throw object movement. Numeric value. Can be
 *   negative. The default value is 100. If negative, the arc will be turned down.
 *   If not set the throw will go straigth to the target.
 *
 * ---------------
 *
 *   - Start
 *   Start offset position. This will adjust the starting position for the throw
 *   object. The coordinate X is inverted if the battler is facing right.
 *
 * ---------------
 *
 *   - End
 *   End offset position. This will adjust the ending position for the throw
 *   object. The coordinate X is inverted if the battler is facing right.
 *
 * ---------------
 *
 *   - Return
 *   If added, this value will make the throw movement a returing move. The
 *   throw object will start it's movement from the target of the action and
 *   then will go toward the user.
 *
 * ------------------------------------------------------------------------------
 * Skills and Items Notetags:
 * ------------------------------------------------------------------------------
 * 
 *  <throw item>
 *   An item or skill with this notetag will use the <throw object> notetag
 *   from weapons (for actors) or enemies for the action throwable animation.
 *   If the weapon/enemy don't have an throwable animation of their own, then
 *   the skill throwable animation will be used (if there is any).
 *
 * ------------------------------------------------------------------------------
 * Weapons and Enemies Notetags:
 * ------------------------------------------------------------------------------
 *
 * <throw image: type>
 *  Setup a image to be used for some throwable object actions. This image is
 *  used only if the action throwable object image is set to 'weapon'.
 *    icon X : displays the icon id = X.
 *    picture 'X' : displays the picture with filename = X. In quotations.
 *    animaiton X : displays the animation id = X (requires the plugin 
 *                   'VE - Looping Animation)
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "b" for the target, "v[x]" for variable and "item" for the item
 *  object. The 'result' must return a numeric or string value (depeding on the
 *  type of the notetag).
 * ---------------
 *
 *  - Throw Object
 *  The <throw object> tag can be assigned to skills, items, weapons and 
 *  enemies. When assigned to weapons and enemies, the tag will have no effect
 *  unless the action uses the tag <throw item>
 *
 * ---------------
 *
 *  - Throw Timing
 *  The throw timing decides when the throwing animation will be displayed. The
 *  same action can have more than one notetag as long they have a different 
 *  timing. This can be used to show throwing with multiple stages, like a
 *  boomerang that goes to the target and return.
 *
 *  The 'during' and 'after' timings will wait the throw animation to end before
 *  going forward with the action.
 *
 * ---------------
 *
 *  - Throw Type
 *  The type decide wich image will be used for the throw object. It can be an
 *  icon, picture or looping animation (looping animations requires the plugin
 *  'VE - Loop Animation').
 *
 *  If you use the value 'weapon' as the type, the throw graphic will be based
 *  on the notetag <throwable image> from the actor's weapon notebox (for actors)
 *  or the enemy notebox (for enelies).
 *
 * ---------------
 *
 *  - Throw Objects for Weapons
 *  You can assign the tag <throw item> to the basic attack, if the weapon
 *  has no throwing object, it will just shows nothing and plays the montion
 *  normally. This can be used for generic actions that have the display based
 *  on the equiped weapon.
 * 
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 * * <throw object: before>
 *  image: weapon
 *  speed: 125
 *  start: 18, 4
 * </throw object>
 *   Throws an object before the animation based on the <throw item> notetag
 *   of the weapon.
 *
 * ---------------
 *
 * <throw object: before>
 *  image: picture 'Boomerang'
 *  speed: 50
 *  arc: 100
 *  spin: 18
 *  start: -16, -4
 * </throw object>
 *
 * <throw object: during>
 *  image: picture 'Boomerang'
 *  speed: 50
 *  arc: -100
 *  spin: 18
 *  start: 0, 0
 *  return
 * </throw object>
 *  Notetags for a boomergan. Using a picture named 'Boomerang' the first tag
 *  makes the object move into an acr toward the target and the second makes
 *  the object moves into an inverted arc returning from the target to the user.
 *
 * ---------------
 *
 * <throwable image: icon 10>
 *  If the action throw image is 'weapon', then the throw graphic will be the
 *  icon id 10.
 *
 * ---------------
 *
 * <throwable image: picture 'Arrow'>
 *  If the action throw image is 'weapon', then the throw graphic will be the
 *  picture named 'Arrow'.
 *
 *
 * ------------------------------------------------------------------------------
 * Compatibility:
 * ------------------------------------------------------------------------------
 *
 * - When used together with the plugin 'VE - Charge Actions', place this
 *   plugin above it.
 *
 * ------------------------------------------------------------------------------
 */

(function() {
	
	//=============================================================================
	// VictorEngine
	//=============================================================================
	
	VictorEngine.ThrowableObjects.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function(data, index) {
		VictorEngine.ThrowableObjects.loadNotetagsValues.call(this, data, index);
		var list = ['skill', 'item', 'weapon', 'enemy'];
		if (this.objectSelection(index, list)) VictorEngine.ThrowableObjects.loadNotes1(data);
		var list = ['weapon', 'enemy'];
		if (this.objectSelection(index, list)) VictorEngine.ThrowableObjects.loadNotes2(data);
	};
	
	VictorEngine.ThrowableObjects.loadNotes1 = function(data) {
		data.throwableObjects = data.throwableObjects || {};
		this.processNotes1(data);
		this.processNotes2(data);
	};
	
	VictorEngine.ThrowableObjects.loadNotes2 = function(data) {
		data.throwableObjects = data.throwableObjects || {};
		this.processNotes2(data);
		
	};
	
	VictorEngine.ThrowableObjects.processNotes1 = function(data) {
		var match;
		var part1 = '[ ]*:[ ]*(before|after|during)';
		var regex = VictorEngine.getNotesValues('throw object' + part1, 'throw object');
		while ((match = regex.exec(data.note)) !== null) { this.processValues1(data, match) };
		data.throwableObjects.weapon = !!data.note.match(/<throw item>/gi);
	};
	
	VictorEngine.ThrowableObjects.processNotes2 = function(data) {
		var match;
		var part1 = 'throw image[ ]*:[ ]*(icon|animation|picture)[ ]*';
		var regex = new RegExp('<' + part1 + "(\\d+|'[^\']+'|\"[^\"]+\")[ ]*>", 'gi');
		while ((match = regex.exec(data.note)) !== null) { this.processValues2(data, match) };	
	};
	
	VictorEngine.ThrowableObjects.processValues1 = function(data, match) {
		var result = {};
		var type = match[1].toLowerCase()
		result.image = this.getImage(match[2]);
		result.start = this.getOffset(match[2], 'start');
		result.end   = this.getOffset(match[2], 'end');
		result.speed = VictorEngine.getNumberValue(match[2], 'speed', 100);
		result.delay = VictorEngine.getNumberValue(match[2], 'delay', 0);
		result.spin  = VictorEngine.getNumberValue(match[2], 'spin', 0);
		result.arc   = VictorEngine.getNumberValue(match[2], 'arc', 0);
		result.anim  = VictorEngine.getNumberValue(match[2], 'animation', 0);
		result.duration  = VictorEngine.getNumberValue(match[2], 'duration', 0);
		result.angled    = !!match[2].match(/angled/gi);
		result.returning = !!match[2].match(/return(?:ing)?/gi);
		data.throwableObjects[type] = result;
	};
	
	VictorEngine.ThrowableObjects.processValues2 = function(data, match) {
		var result  = {};
		var type    = match[1].toLowerCase();
		result.type = type;
		result.id   = type === 'picture' ? 0 : Number(match[2]) || 0;
		result.name = type === 'picture' ? match[2].slice(1, -1) : '';
		data.throwableObjects.item = result;
	};
	
	VictorEngine.ThrowableObjects.getImage = function(match) {
		var image = '(weapon|icon|animation|picture)';
		var regex = new RegExp("image[ ]*:[ ]*" + image + "[ ]*(\\d+|'[^\']+'|\"[^\"]+\")?", 'gi');
		var value = regex.exec(match) || [];
		var type = value[1] || '';
		var id   = type !== 'picture' && value[2] ? Number(value[2]) || 0 : 0;
		var name = type === 'picture' && value[2] ? value[2].slice(1, -1) : '';
		return {type: type.toLowerCase(), id: id, name: name};
	};
	
	VictorEngine.ThrowableObjects.getOffset = function(match, type) {
		var regex = new RegExp(type + '[ ]*:[ ]*([+-]?\\d+)[ ]*,?[ ]*([+-]?\\d+)', 'gi');
		var value = regex.exec(match) || [];
		var x  = Number(value[1]) || 0;
		var y  = Number(value[2]) || 0;
		return {x: x, y: y};
	};
	
	//=============================================================================
	// Game_Action
	//=============================================================================
	
	Game_Action.prototype.isThrowable = function() {
		var object = this.item().throwableObjects;
		return object && (object.before || object.after || object.during);
	};
	
	//=============================================================================
	// Sprite_Battler
	//=============================================================================
	
	VictorEngine.ThrowableObjects.initMembers = Sprite_Battler.prototype.initMembers;
	Sprite_Battler.prototype.initMembers = function() {
		VictorEngine.ThrowableObjects.initMembers.call(this);
		this._throwableObjects = [];
	};
	
	VictorEngine.ThrowableObjects.updateSpriteBattler = Sprite_Battler.prototype.update;
	Sprite_Battler.prototype.update = function() {
		VictorEngine.ThrowableObjects.updateSpriteBattler.call(this);
		this.updateThrowableSprites();
	};

	Sprite_Battler.prototype.startThrow = function(subject, target, item, type) {
		var object = this.setupThrowObject(subject, item, type);
		if (object) {
			var sprite = new Sprite_Throw(subject, target, object);
			this._throwableObjects.push(sprite);
			this.parent.addChild(sprite);
		}
	};
	
	Sprite_Battler.prototype.setupThrowObject = function(subject, item, type) {
		var object = item.throwableObjects;
		if (object && object.weapon) {
			if (subject.isActor()) {
				var weapon = subject.weapons()[0];
				if (weapon) return weapon.throwableObjects[type];
			} else {
				return subject.enemy().throwableObjects[type];
			}
		}
		return object[type];
	};
	
	Sprite_Base.prototype.updateThrowableSprites = function() {
		if (this._throwableObjects.length > 0) {
			var sprites = this._throwableObjects.clone();
			this._throwableObjects = [];
			for (var i = 0; i < sprites.length; i++) {
				var sprite = sprites[i];
				if (sprite.isPlaying()) {
					this._throwableObjects.push(sprite);
				} else {
					sprite.remove();
				}
			}
		}
	};
	
	Sprite_Base.prototype.isThrowing = function(subject, target) {
		return this._throwableObjects.some(function(object) {
			return object.isThrowing(subject, target);
		})
	};

	//=============================================================================
	// BattleManager
	//=============================================================================
	
	/* Compatibility with YEP_BattleEngineCore */
	VictorEngine.ThrowableObjects.actionActionAnimation = BattleManager.actionActionAnimation;
	BattleManager.actionActionAnimation = function(actionArgs) {
		var item = this._action.item();
		if (this._logWindow.isThrowable(item, 'before') || this._logWindow.isThrowable(item, 'after') ||
			this._logWindow.isThrowable(item, 'during')) {
			if (actionArgs && actionArgs[0]) {
				var targets = this.makeActionTargets(actionArgs[0]);
			} else {
				var targets = this._targets;
			}
			var mirror = false;
			if (actionArgs && actionArgs[1]) {
				if (actionArgs[1].toUpperCase() === 'MIRROR') mirror = true;
			}
			var group = targets.filter(Yanfly.Util.onlyUnique);
			var stackIndex = this._logWindow._stackIndex
			var length = this._logWindow._methodsStack.length + 1;
			for (var i = 0; i < group.length; i++) {
				this._logWindow._stackIndex = length + i;
				var target = group[i]
				this.actionThrowActionAnimation(target, mirror);
			}
			this._logWindow._stackIndex = stackIndex;
			return true;
		} else {
			return VictorEngine.ThrowableObjects.actionActionAnimation.call(this, actionArgs);
		}
	};
	
	/* Compatibility with YEP_BattleEngineCore */
	BattleManager.actionThrowActionAnimation = function(target, mirror) {
		var item    = this._action.item();
		var aniId   = item.animationId;
		var subject = this._subject;
		if (this._logWindow.isThrowable(item, 'before')) {
			this._logWindow.push('startThrow', subject, item, target, 'before');
			this._logWindow.push('waitForThrow', this._logWindow._stackIndex, subject, target);
		}
		if (aniId < 0) {
			if (mirror) {
				this._logWindow.push('showActorAtkAniMirror', subject, [target]);
			} else {
				this._logWindow.push('showAttackAnimation' ,subject, [target]);
			}
		} else {
			this._logWindow.push('showNormalAnimation', [target], aniId, mirror);
		}
		if (this._logWindow.isThrowable(item, 'during')) {
			this._logWindow.push('startThrow', subject, item, target, 'during');
		}
		if (this._logWindow.isThrowable(item, 'after')) {
			this._logWindow.push('waitForBattleAnimation', aniId);
			this._logWindow.push('startThrow', subject, item, target, 'after');
			this._logWindow.push('waitForThrow', this._logWindow._stackIndex, subject, target);
		}
	};

	//=============================================================================
	// Spriteset_Battle
	//=============================================================================
	
	Spriteset_Battle.prototype.isThrowing = function(subject, target) {
		return this.battlerSprites().some(function(sprite) {
			return sprite.isThrowing(subject, target);
		});
	};
	
	VictorEngine.ThrowableObjects.updateSpritesetBattle = Spriteset_Battle.prototype.update;
	Spriteset_Battle.prototype.update = function() {
		VictorEngine.ThrowableObjects.updateSpritesetBattle.call(this);
		this.sortBattleSprites();
	};
	
	//=============================================================================
	// Window_BattleLog
	//=============================================================================
	
	VictorEngine.ThrowableObjects.initialize = Window_BattleLog.prototype.initialize;
	Window_BattleLog.prototype.initialize = function() {
		this.initializeMethodsStack()
		VictorEngine.ThrowableObjects.initialize.call(this);
	};
	
	VictorEngine.ThrowableObjects.update = Window_BattleLog.prototype.update;
	Window_BattleLog.prototype.update = function() {
		if (this.methodStackActive()) {
			this.updateMethodsStack();
		} else {
			VictorEngine.ThrowableObjects.update.call(this);
		}
	};
	
	VictorEngine.ThrowableObjects.isBusy = Window_BattleLog.prototype.isBusy;
	Window_BattleLog.prototype.isBusy = function() {
		return VictorEngine.ThrowableObjects.isBusy.call(this) || this.methodStackActive();
	};
	
	VictorEngine.ThrowableObjects.updateWait = Window_BattleLog.prototype.updateWait;
	Window_BattleLog.prototype.updateWait = function() {
		return VictorEngine.ThrowableObjects.updateWait.call(this) || this.methodStackActive();
	};
	
	VictorEngine.ThrowableObjects.push = Window_BattleLog.prototype.push;
	Window_BattleLog.prototype.push = function(methodName) {
		if (this._stackIndex || this.methodStackActive()) {
			this.pushMethodsStack.apply(this, arguments);
		} else {
			VictorEngine.ThrowableObjects.push.apply(this, arguments);
		}
	};
	
	VictorEngine.ThrowableObjects.startAction = Window_BattleLog.prototype.startAction;
	Window_BattleLog.prototype.startAction = function(subject, action, targets) {
		VictorEngine.ThrowableObjects.startAction.call(this, subject, action, targets);
		this.setupStartAction(subject, action, targets);
	};
	
	VictorEngine.ThrowableObjects.updateStackWaitMode = Window_BattleLog.prototype.updateStackWaitMode;
	Window_BattleLog.prototype.updateStackWaitMode = function(index) {
		if (this._stackWaitMode[index] === 'throw') {
			if (this.isThrowing(index)) {
				return true;
			} else {
				this._throwingStack[index] = null;
				this._stackWaitMode[index] = '';
				return false;
			}
		}
		return VictorEngine.ThrowableObjects.updateStackWaitMode.call(this, index);
	};
	
	VictorEngine.ThrowableObjects.prepareUniqueActionStep1 = Window_BattleLog.prototype.prepareUniqueActionStep1;
	Window_BattleLog.prototype.prepareUniqueActionStep1 = function(subject, item, target, repeat) {
		this.push('startThrow', subject, item, target, 'before');
		this.push('waitForThrow', this._stackIndex, subject, target);
		VictorEngine.ThrowableObjects.prepareUniqueActionStep1.call(this, subject, item, target, repeat);
	};
	
	VictorEngine.ThrowableObjects.prepareUniqueActionStep2 = Window_BattleLog.prototype.prepareUniqueActionStep2;
	Window_BattleLog.prototype.prepareUniqueActionStep2 = function(subject, item, target, repeat) {
		this.push('startThrow', subject, item, target, 'during');
		VictorEngine.ThrowableObjects.prepareUniqueActionStep2.call(this, subject, item, target, repeat);
	};
	
	VictorEngine.ThrowableObjects.prepareUniqueActionStep3 = Window_BattleLog.prototype.prepareUniqueActionStep3;
	Window_BattleLog.prototype.prepareUniqueActionStep3 = function(subject, item, target, repeat) {
		this.push('startThrow', subject, item, target, 'after');
		VictorEngine.ThrowableObjects.prepareUniqueActionStep3.call(this, subject, item, target, repeat);
		this.push('waitForThrow', this._stackIndex, subject, target);
	};
	
	Window_BattleLog.prototype.waitForThrow = function(index, subject, target) {
		this._throwingStack[index] = {subject: subject, target: target};
		this.setStackWaitMode(index, 'throw');
	};
	
	Window_BattleLog.prototype.isThrowable = function(item, type) {
		return item.throwableObjects && item.throwableObjects[type];
	};
	
	Window_BattleLog.prototype.startThrow = function(subject, item, target, type) {
		target.battleSprite().startThrow(subject, target, item, type);
	};
	
	Window_BattleLog.prototype.isThrowing = function(index) {
		var throwing = this._throwingStack[index];
		return this._spriteset.isThrowing(throwing.subject, throwing.target)
	};
	
	Window_BattleLog.prototype.uniqueActionEnabled = function() {
		return true;
	};
	
})();

function Sprite_Throw() {
    this.initialize.apply(this, arguments);
}

Sprite_Throw.prototype = Object.create(Sprite_Base.prototype);
Sprite_Throw.prototype.constructor = Sprite_Throw;

(function() {

	Object.defineProperties(Sprite_Throw.prototype, {
		z: { get: function() { return this.throwZ(); }, configurable: true },
		h: { get: function() { return this.throwH(); }, configurable: true }
	});

	Sprite_Throw.prototype.initialize = function(subject, target, object) {
		Sprite_Base.prototype.initialize.call(this);
		this._subject = subject;
		this._target  = target;
		this._object  = object;
		this.initMembers();
	};

	Sprite_Throw.prototype.subject = function() {
		return this._subject;
	};
	
	Sprite_Throw.prototype.target = function() {
		return this._target;
	};
	
	Sprite_Throw.prototype.item = function() {
		return this._item;
	};
	
	Sprite_Throw.prototype.object = function() {
		return this._object;
	};
	
	Sprite_Throw.prototype.isMirrorAnimation = function() {
		return this._mirror;
	};
	
	Sprite_Throw.prototype.throwZ = function() {
		return this._z;
	};
	
	Sprite_Throw.prototype.throwH = function() {
		return this._homeY + this._offsetY + (this._duration > this._starting / 2 ? this._homeZ : this._targetZ);
	};
	
	Sprite_Throw.prototype.initMembers = function() {
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this.setupBitmap();
		this.setupMovement();
		this.setupDuration();
		this.setupArc();
		this.setupAnimation('start');
	};
	
	Sprite_Throw.prototype.setupAnimation = function(timing) {
		var object = this.object();
		var source = object.returning ? this.target() : this.subject();
		if (timing === 'start' && object.anim && source === this.subject()) {
			this.subject().startAnimation(object.anim, this._mirror, 0);
		} else if (timing === 'end' && object.anim && source === this.subject()) {
			this.subject().startAnimation(object.anim, this._mirror, 0);
		}
	};
	
	Sprite_Throw.prototype.update = function() {
		Sprite_Base.prototype.update.call(this);
		if (this._delay === 0 && this.object()) {
			this.updateBitmap();
			this.updateGraphics();
			this.updateArc();
			this.updateMove();
			this.updateAngle();
			this.updatePosition();
		} else {
			this._delay--;
		}
	};
	
	Sprite_Throw.prototype.setupMovement = function() {
		var object = this.object();
		var source = object.returning ? this.target() : this.subject();
		var target = object.returning ? this.subject() : this.target();
		var srcRight = source.isFacingRight();
		var trgRight = target.isFacingRight();
		var srcSprite = source.battleSprite();
		var trgSprite = target.battleSprite();
		var srcOffset = srcRight ? -object.start.x : object.start.x;
		var trgOffset = trgRight ? -object.end.x : object.end.x;
		this._homeX   = srcSprite.x + srcOffset * (srcRight ? -1 : 1);
		this._homeY   = srcSprite.y + object.start.y - srcSprite.center().y;
		this._homeZ   = srcSprite.center().y + 1;
		this._targetX = trgSprite.x + trgOffset * (trgRight ? -1 : 1) - this._homeX;
		this._targetY = trgSprite.y + object.end.y - trgSprite.center().y - this._homeY;
		this._targetZ = trgSprite.center().y + 1;
		this._offsetX = 0;
		this._offsetY = 0;
		this._z = trgSprite.z;
	};
	
	Sprite_Throw.prototype.setupDuration = function() {
		var object = this.object();
		var source = object.returning ? this.target() : this.subject();
		var duration = object.duration;
		this._delay  = object.delay;
		this._mirror = source.isFacingRight();
		this._distance = Math.sqrt(Math.pow(this._targetX, 2) + Math.pow(this._targetY, 2));
		this._duration = duration ? duration : Math.floor(this._distance * 5 / object.speed);
		this._starting = this._duration;
		if (!this._imageType) this._duration = 0;
	};
	
	Sprite_Throw.prototype.setupArc = function() {
		var distance  = Math.sqrt(Math.abs(this._targetX))
		this._arcPeak = Math.floor(Math.abs(this.object().arc) * distance / 20);
		this._arcHeight = 0;
		this._arcInvert = this.object().arc < 0;
	};
	
	Sprite_Throw.prototype.setupBitmap = function() {
		var image = this.setupObjectImage();
		if (image) {
			switch (image.type) {
			case 'icon':
				this._imageType = image.type;
				this._iconIndex = image.id;
				break;
			case 'picture':
				this._imageType = image.type;
				this._imageFilename = image.name;
				break;
			case 'animation':
				if (Imported['VE - Loop Animation']) {
					this._imageType = image.type;
					this._animationId = image.id;
				}
				break;
			}
		}
	};
	
	Sprite_Throw.prototype.setupObjectImage = function() {
		var object = this.object().image;
		if (object.type === 'weapon') {
			if (this._subject.isActor()) {
				var weapon = this._subject.weapons()[0];
				if (weapon) return weapon.throwableObjects.item;
			} else {
				return this._subject.enemy().throwableObjects.item;
			}
		}
		return object;
	};
	
	
	Sprite_Throw.prototype.updateBitmap = function() {
		if (this._iconIndex && this._iconIndex !== this._thworIcon) {
			this._thworIcon = this._iconIndex;
			this.bitmap = ImageManager.loadSystem('IconSet');
			this.bitmap.addLoadListener(this.updateIcon.bind(this));
		}
		if (this._imageFilename && this._imageFilename !== this._thworImage) {
			this._thworImage = this._imageFilename;
			this.bitmap = ImageManager.loadPicture(this._imageFilename);
			this.bitmap.addLoadListener(this.updatePicture.bind(this));
		}
		if (this._animationId && this._animationId !== this._thworImage) {
			this._thworImage = this._animationId;
			this.addLoopAnimation({id: this._animationId, type: 'throw', loop: 1});
		}
	};
	
	Sprite_Throw.prototype.updateMove = function() {
		if (this._duration > 0) {
			var d = this._duration;
			this._offsetX = (this._offsetX * (d - 1) + this._targetX) / d;
			this._offsetY = (this._offsetY * (d - 1) + this._targetY) / d;
			this._duration--;
			if (this._duration === 0) this.onThrowEnd();
		}
	};
	
	Sprite_Throw.prototype.updateArc = function() {
		if (this._arcPeak) {
			var height   = this._arcPeak;
			var radius   = this._targetX / 2;
			var position = this._offsetX - radius;
			var distance = (1 - Math.pow(position, 2) / Math.pow(radius, 2));
			this._arcHeight = Math.sqrt(Math.pow(height, 2) * distance);
			if (this._arcInvert) this._arcHeight *= -1;
		}
	};
	
	Sprite_Throw.prototype.updatePosition = function() {
		this.x = this._homeX + this._offsetX;
		this.y = this._homeY + this._offsetY - this._arcHeight;
	};
	
	Sprite_Throw.prototype.updateAngle = function() {
		if (this.object().spin)  this.rotation += this.object().spin;
		if (this.object().angle) this.rotation = this.object().angle * Math.PI / 180;
	};
	
	Sprite_Throw.prototype.updateGraphics = function() {
		switch (this._imageType) {
		case 'icon':
			this.updateIcon();
			break;
		case 'picture':
			this.updatePicture();
			break;
		}
	};
	
	Sprite_Throw.prototype.updateIcon = function() {
		var pw = Window_Base._iconWidth;
		var ph = Window_Base._iconHeight;
		var sx = this._iconIndex % 16 * pw;
		var sy = Math.floor(this._iconIndex / 16) * ph;
		this.setFrame(sx, sy, pw, ph);
	};
	
	Sprite_Throw.prototype.updatePicture = function() {
		if (this.bitmap.width && this.bitmap.height) {
			this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
		}
	};
	
	Sprite_Throw.prototype.onThrowEnd = function() {
		this.setupAnimation('end');
	};
	
	Sprite_Throw.prototype.remove = function() {
		if (this.parent) {
			this.parent.removeChild(this);
			if (this._animationId) {
				Object.keys(this._loopAnimations).forEach(function(type) { 
					this.clearLoopAnimation(type)
				}, this);
			}
		}
	};
	
	Sprite_Throw.prototype.isPlaying = function() {
		return this._duration > 0 || this._delay > 0;
	};
	
	Sprite_Throw.prototype.isThrowing = function(subject, target) {
		return this._subject === subject && this._target === target;
	};
	
})();