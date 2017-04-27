//=============================================================================
// Yanfly Engine Plugins - Buffs & States Core
// YEP_BuffsStatesCore.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_BuffsStatesCore = true;

var Yanfly = Yanfly || {};
Yanfly.BSC = Yanfly.BSC || {};

//=============================================================================
 /*:
 * @plugindesc v1.07 Alter the basic mechanics behind buffs and states
 * that aren't adjustable within the RPG Maker editor.
 * @author Yanfly Engine Plugins
 *
 * @param ---Turn Indicator---
 * @default
 *
 * @param Show Turns
 * @desc Show turns remaining for buffs and states?
 * NO - false     YES - true
 * @default true
 *
 * @param Font Size
 * @desc The default font size used for turn count.
 * Default: 28
 * @default 16
 *
 * @param Turn Alignment
 * @desc How do you want to align the turns?
 * left     center     right
 * @default right
 *
 * @param Turn Buffer X
 * @desc Buffer the x position of the turn by this much.
 * @default -3
 *
 * @param Turn Buffer Y
 * @desc Buffer the y position of the turn by this much.
 * @default -6
 *
 * @param State Color
 * @desc The default text color used for state turns.
 * @default 0
 *
 * @param Buff Color
 * @desc The default text color used for buffs.
 * @default 24
 *
 * @param Debuff Color
 * @desc The default text color used for debuffs.
 * @default 2
 *
 * @param ---Buff Settings---
 * @default
 *
 * @param Default Limit
 * @desc The default number of times you can stack buff/debuff.
 * Default: 2
 * @default 4
 *
 * @param Maximum Limit
 * @desc The maximum number of times you can stack buff/debuff.
 * @default 8
 *
 * @param Buff Formula
 * @desc The formula used for buff rate calculation.
 * Default: this._buffs[paramId] * 0.25 + 1.0
 * @default this._buffs[paramId] * 0.25 + 1.0
 *
 * @param ---State Settings---
 * @default
 *
 * @param Reapply Rules
 * @desc The rules when reapplying an already existing state:
 * 0 - Ignore     1 - Reset     2 - Add
 * @default 1
 *
 * @param Show Enemy Turns
 * @desc If using Battle Engine Core, show turns in help window?
 * NO - false     YES - true
 * @default true
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * If you are using YEP_BattleEngineCore.js, please this plugin under
 * YEP_BattleEngineCore in the plugin list for the best effect.
 *
 * Alter the basic mechanics behind buffs and states that aren't adjustable
 * within the RPG Maker editor. Such mechanics include altering the maximum
 * number of times buffs can stack, changing the turns remaining on buffs and
 * states, and the rules involved when reapplying states.
 *
 * A turn indicator has been added to show the amount of turns remaining on
 * buffs, debuffs, and states. Buffs and debuffs will operate off the plugin
 * parameter settings while states can operate on individual settings if you
 * choose for them to have unique settings.
 *
 * Furthermore, a lot of Lunatic Mode options are added with this plugin to
 * allow those with JavaScript proficiency maximum control with states and any
 * unique effects that follow.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are various notetags you can use to modify states and buffs.
 *
 * --- Buff Related ---
 *
 * Actor, Class, Enemy, Weapon, Armor, and State notetags:
 *   <Max stat Buff: +x>
 *   <Max stat Buff: -x>
 *   <Max stat Debuff: +x>
 *   <Max stat Debuff: -x>
 *   Replace 'stat' with 'maxhp', 'maxmp', 'atk', 'def', 'mat', 'mdf', 'agi',
 *   or 'luk' without the quotes. This notetag adjusts the maximum number of
 *   times the stat can be buffed or debuffed to the Maximum Limit cap in the
 *   plugin parameters.
 *
 * Skill and Item Notetags:
 *   <stat Buff Turns: +x>
 *   <stat Buff Turns: -x>
 *   <stat Debuff Turns: +x>
 *   <stat Debuff Turns: -x>
 *   Modifies already applied buff/debuff turns on target by x value. If this
 *   brings a buff/debuff to 0 or below, the buff/debuff is removed.
 *
 * --- State Related ---
 *
 * State Notetags:
 *   <Show Turns>
 *   <Hide Turns>
 *   Show/hide the turn count remaining for the state. This will override the
 *   default setting.
 *
 *   <Turn Font Size: x>
 *   Sets the font size used for this specific state to be x. This will
 *   override the default setting.
 *
 *   <Turn Alignment: Left>
 *   <Turn Alignment: Center>
 *   <Turn Alignment: Right>
 *   This sets the text alignment for the turn count indicator. This will
 *   override the default setting.
 *
 *   <Turn Buffer X: +x>
 *   <Turn Buffer X: -x>
 *   <Turn Buffer Y: +x>
 *   <Turn Buffer Y: -x>
 *   Allows you to adjust the x/y position manually for the turn count for this
 *   particular state. This will override the default settings.
 *
 *   <Turn Color: x>
 *   This will set the turn count display color to text color x. This will
 *   override the default setting.
 *
 *   <Reapply Ignore Turns>
 *   <Reapply Reset Turns>
 *   <Reapply Add Turns>
 *   Changes the rules when this state is reapplied on a battler. When ignored,
 *   the turn count remains unchanged. When reset, the turn count is set back
 *   to the default amount with variance. When added, the turn count is added
 *   upon with variance.
 *
 * Skill and Item Notetags:
 *   <State x Turns: +y>
 *   <State x Turns: -y>
 *   <State named Turns: +y>
 *   <State named Turns: -y>
 *   Modifies already applied state x turns on target by y value. If this
 *   brings the state to 0 or below turns, the state is removed. If you are
 *   using named states and have multiple states with the same name, priority
 *   will be given to the state with the highest ID.
 *
 * Enemy Notetags:
 *   <Show State Turns>
 *   <Hide State Turns>
 *   Affected by the Battle Engine Core. When selecting enemies, the state
 *   turns will show up in the help window. You can use this to have certain
 *   enemies show the state turns or hide them.
 *
 * ============================================================================
 * Lunatic Mode - Custom Turn Modifiers
 * ============================================================================
 *
 * For those with an understanding of JavaScript, you can use these notetags to
 * give conditional turn modifiers when altering a target's buff/state turn
 * count. Follow the instructions below:
 *
 * Skill and Item Notetags:
 *
 *   <Custom stat Buff Turn>
 *    turn = 10;
 *    turn += user.agi;
 *   </Custom stat Buff Turn>
 *   Replace 'stat' with 'maxhp', 'maxmp', 'atk', 'def', 'mat', 'mdf', 'agi',
 *   or 'luk' without the quotes. Whatever the 'turn' variable returns is what
 *   the turn count will be set to for the stat buff.
 *
 *   <Custom stat Debuff Turn>
 *    turn = 10;
 *    turn += user.agi;
 *   </Custom stat Debuff Turn>
 *   Replace 'stat' with 'maxhp', 'maxmp', 'atk', 'def', 'mat', 'mdf', 'agi',
 *   or 'luk' without the quotes. Whatever the 'turn' variable returns is what
 *   the turn count will be set to for the stat debuff.
 *
 *   <Custom State X Turn>
 *    turn = 10;
 *    turn += user.agi;
 *   </Custom State X Turn>
 *   This alters the turn count for state x. Whatever the 'turn' variable
 *   returns is what the turn count will be set for state x.
 *
 *   <Custom State name Turn>
 *    turn = 10;
 *    turn += user.agi;
 *   </Custom State name Turn>
 *   This alters the turn count for state 'name'. Whatever the 'turn' variable
 *   returns is what the turn count will be set for state 'name'. If you have
 *   multiple states in your database with the same name, priority will be
 *   given to the state with the highest ID.
 *
 * ============================================================================
 * Lunatic Mode - Custom Timing Effects
 * ============================================================================
 *
 * For those with an understanding of JavaScript, you can use these notetags to
 * cause code to run at certain times.
 *
 * Quick Reference:
 *   - Apply:        When a state is added.
 *   - Remove:       When a state is removed.
 *   - Leave:        When a state expires by reaching 0 turns.
 *   - Turn Start:   Whenever the battler's turn starts.
 *   - Action Start: Whenever the battler performs a new action.
 *   - Action End:   Whenever the battler finishes an action.
 *   - Regenerate:   Whenever the battler would regenerate HP/MP/TP.
 *   - Turn End:     Whenever the battler's turn ends.
 *   - Battle:       Whenever a battle is started.
 *   - Victory:      Whenever a battle is won. *Note1
 *   - Escape:       Whenever a battle is escaped. *Note1
 *   - Defeat:       Whenever a battle is lost. *Note1
 *
 * *Note1: If the state is set to expire on battle end, the expiration will
 * occur before the custom effects would take place, meaning the effects will
 * not occur at all unless the expiration is set to off.
 *
 * State Notetags:
 *
 * --- Timing Effects ---
 *
 * These effects specifically occur at certain intervals or timings.
 *
 *   <Custom Apply Effect>
 *    code
 *    code
 *   </Custom Apply Effect>
 *   The code in between these notetags will run when the state is added onto
 *   a battler. The code will process after the state is actually applied.
 *
 *   <Custom Remove Effect>
 *    code
 *    code
 *   </Custom Remove Effect>
 *   The code in between these notetags will run when the state is removed from
 *   a battler either manually or due to turn decay. The code will process
 *   after the state is actually removed but before <Custom Leave Effect>.
 *
 *   <Custom Leave Effect>
 *    code
 *    code
 *   </Custom Leave Effect>
 *   The code in between these notetags will run when the state is removed from
 *   a battler due to turn decay. The code will process after the state is
 *   actually removed and after <Custom Remove Effect>.
 *
 *   <Custom Turn Start Effect>
 *    code
 *    code
 *   </Custom Turn Start Effect>
 *   This requires YEP_BattleEngineCore. This effect will run at the start of
 *   each of the battler's turns. The code will process after all the other
 *   turn start effects have taken course.
 *
 *   <Custom Action Start Effect>
 *    code
 *    code
 *   </Custom Action Start Effect>
 *   This effect will run at the start of each of the battler's actions. The
 *   code will process before the skill/item cost takes place.
 *
 *   <Custom Action End Effect>
 *    code
 *    code
 *   </Custom Action End Effect>
 *   This effect will run at the end of each of the battler's actions. The
 *   code will process before the action end steps takes place.
 *
 *   <Custom Regenerate Effect>
 *    code
 *    code
 *   </Custom Regenerate Effect>
 *   This effect will run whenever the battler would regenerate HP, MP, or TP.
 *   The code will process after all the other regenerate effects have ran.
 *
 *   <Custom Turn End Effect>
 *    code
 *    code
 *   </Custom Turn End Effect>
 *   This effect will run at the end of each of the battler's turns. The code
 *   will process after all the other turn end effects have taken course.
 *
 *   <Custom Battle Effect>
 *    code
 *    code
 *   </Custom Battle Effect>
 *   This effect will occur at the start of battle if the battler has the state
 *   already applied (usually through a passive state).
 *
 *   <Custom Victory Effect>
 *    code
 *    code
 *   </Custom Victory Effect>
 *   This effect will occur at the end of battle if the party is victorious.
 *   This will only apply to the player's party. If this state can expire at
 *   the end of battle, this effect will not occur as state expiration will
 *   occur before this effect will happen.
 *
 *   <Custom Escape Effect>
 *    code
 *    code
 *   </Custom Escape Effect>
 *   This effect will occur at the end of battle if the party has escaped.
 *   This will only apply to the player's party. If this state can expire at
 *   the end of battle, this effect will not occur as state expiration will
 *   occur before this effect will happen.
 *
 *   <Custom Defeat Effect>
 *    code
 *    code
 *   </Custom Defeat Effect>
 *   This effect will occur at the end of battle if the party is defeated.
 *   This will only apply to the player's party. If this state can expire at
 *   the end of battle, this effect will not occur as state expiration will
 *   occur before this effect will happen.
 *
 * ============================================================================
 * Lunatic Mode - Custom Action Effects
 * ============================================================================
 *
 * For those with an understanding of JavaScript, you can use these notetags to
 * cause code to run during actions.
 *
 * Quick Reference:
 *   Action Starts
 *   - Attacker: Initiate
 *   - Defender: Select
 *   Action Connects as a Success Hit, skip if Missed or Evaded
 *   - Attacker: Confirm
 *   - Defender: React
 *   Damage is Applied to the Defender
 *   - Defender: Respond
 *   - Attacker: Establish
 *   These occur regardless if the action is successfully hit.
 *   - Defender: Deselect
 *   - Attacker: Conclude
 *
 * State Notetags:
 *
 * --- On Action Effects ---
 *
 * These effects specifically occur when the battler is a target of an action.
 *
 *   <Custom Initiate Effect>
 *    code
 *    code
 *   </Custom Initiate Effect>
 *   This effect will run when the battler selects a target. This will occur
 *   before hit/miss/evade confirmation and damage execution. This effect will
 *   run before everything else has taken course.
 *
 *   <Custom Select Effect>
 *    code
 *    code
 *   </Custom Select Effect>
 *   This effect will run when the battler is selected as a target. This will
 *   occur before hit/miss/evade confirmation and damage execution. This effect
 *   will run after <Custom Initiate Effect> before everything else has ran.
 *
 *   <Custom Confirm Effect>
 *    code
 *    code
 *   </Custom Confirm Effect>
 *   This effect will run when the battler connects a hit and before damage
 *   execution occurs. This effect will run after <Custom Initiate Effect> and
 *   <Custom Select Effect> and before everything else.
 *
 *   <Custom React Effect>
 *    value -= 100;
 *    value -= user.def;
 *   </Custom React Effect>
 *   This effect will run when the battler is selected as a target. This will
 *   occur only if the action connects and will occur before damage execution.
 *   This effect will run before damage calculation occurs and will return the
 *   'value' variable as a damage modifier. After <Custom Confirm Effect>, this
 *   effect will run.
 *
 *   <Custom Respond Effect>
 *    code
 *    code
 *   </Custom Respond Effect>
 *   This effect will run when the battler is selected as a target. This will
 *   occur only if the action connects and will occur after damage execution.
 *   This effect will run after damage calculation occurs. The 'value' variable
 *   is equal to the damage dealt to the battler. This is the first effect to
 *   run after damage execution has taken place.
 *
 *   <Custom Establish Effect>
 *    code
 *    code
 *   </Custom Establish Effect>
 *   This effect will run when the battler connects a hit and after damage
 *   execution occurs. This effect will run after <Custom Respond Effect> has
 *   occurred and before everything else.
 *
 *   <Custom Deselect Effect>
 *    code
 *    code
 *   </Custom Deselect Effect>
 *   This effect will run when the battler is selected as a target. This will
 *   occur after hit/miss/evade confirmation and damage execution. This effect
 *   will run after everything else has taken course.
 *
 *   <Custom Conclude Effect>
 *    code
 *    code
 *   </Custom Conclude Effect>
 *   This is the final effect to be run after the battler selects a target and
 *   will occur after hit/miss/evade confirmation and damage execution.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.07:
 * - Updated for RPG Maker MV version 1.1.0.
 *
 * Version 1.06:
 * - Added new notetags for <Custom Battle Effect>, <Custom Victory Effect>,
 * <Custom Escape Effect>, and <Custom Defeat Effect> for Lunatic Mode.
 *
 * Version 1.05a:
 * - Fixed a bug with the 'Show Turns' parameter not working properly.
 * - Fixed a bug with math issues for timed states.
 *
 * Version 1.04:
 * - Changed timing of when Add/Remove/Leave Lunatic Effects occur to add more
 * flexibility in custom effects.
 * - Added a fail safe for when there are no targets to modify.
 * - Fixed a bug with reapply ignore states.
 *
 * Version 1.03a:
 * - Fixed a bug that would cause NaN to show up in state turns.
 *
 * Version 1.02:
 * - Synched up <Custom Turn End Effect> with tick-based battle systems.
 *
 * Version 1.01:
 * - Fixed a bug that didn't reset the font settings with the battle status.
 *
 * Version 1.00:
 * - Finished Plugin!
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_BuffsStatesCore');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.BSCShowTurns = eval(String(Yanfly.Parameters['Show Turns']));
Yanfly.Param.BSCFontSize = String(Yanfly.Parameters['Font Size']);
Yanfly.Param.BSCTurnAlign = String(Yanfly.Parameters['Turn Alignment']);
Yanfly.Param.BSCTurnBufferX = Number(Yanfly.Parameters['Turn Buffer X']);
Yanfly.Param.BSCTurnBufferY = Number(Yanfly.Parameters['Turn Buffer Y']);
Yanfly.Param.BSCTurnColor = Number(Yanfly.Parameters['State Color']);
Yanfly.Param.BSCBuffColor = Number(Yanfly.Parameters['Buff Color']);
Yanfly.Param.BSCDebuffColor = Number(Yanfly.Parameters['Debuff Color']);

Yanfly.Param.BSCDefaultLimit = Number(Yanfly.Parameters['Default Limit']);
Yanfly.Param.BSCMaximumLimit = Number(Yanfly.Parameters['Maximum Limit']);
Yanfly.Param.BSCBuffFormula = String(Yanfly.Parameters['Buff Formula']);

Yanfly.Param.BSCReapplyRules = Number(Yanfly.Parameters['Reapply Rules']);
Yanfly.Param.BSCShowEnemyTurns = String(Yanfly.Parameters['Show Enemy Turns']);
Yanfly.Param.BSCShowEnemyTurns = eval(Yanfly.Param.BSCShowEnemyTurns);

//=============================================================================
// DataManager
//=============================================================================

Yanfly.BSC.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!Yanfly.BSC.DataManager_isDatabaseLoaded.call(this)) return false;
  if (!Yanfly._loaded_YEP_BuffsStatesCore) {
    this.processBSCNotetagsT($dataStates);
    this.processBSCNotetags1($dataStates);
    this.processBSCNotetags2($dataActors);
    this.processBSCNotetags2($dataClasses);
    this.processBSCNotetags2($dataEnemies);
    this.processBSCNotetags2($dataWeapons);
    this.processBSCNotetags2($dataArmors);
    this.processBSCNotetags2($dataStates);
    this.processBSCNotetags3($dataSkills);
    this.processBSCNotetags3($dataItems);
    this.processBSCNotetags4($dataEnemies);
    Yanfly._loaded_YEP_BuffsStatesCore = true;
  }
  return true;
};

DataManager.processBSCNotetagsT = function(group) {
  if (Yanfly.StateIdRef) return;
  Yanfly.StateIdRef = {};
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    if (obj.name.length <= 0) continue;
    Yanfly.StateIdRef[obj.name.toUpperCase()] = n;
  }
};

DataManager.processBSCNotetags1 = function(group) {
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.showTurns = Yanfly.Param.BSCShowTurns;
    obj.turnAlign = Yanfly.Param.BSCTurnAlign;
    obj.turnFontSize = Yanfly.Param.BSCFontSize;
    obj.turnBufferX = Yanfly.Param.BSCTurnBufferX;
    obj.turnBufferY = Yanfly.Param.BSCTurnBufferY;
    obj.turnColor = Yanfly.Param.BSCTurnColor;
    obj.reapplyRules = Yanfly.Param.BSCReapplyRules;
    obj.customEffectEval = {};
    obj.customEffectEval['addState'] = '';
    obj.customEffectEval['removeState'] = '';
    obj.customEffectEval['leaveState'] = '';
    obj.customEffectEval['turnStartState'] = '';
    obj.customEffectEval['turnEndState'] = '';
    obj.customEffectEval['regenerateState'] = '';
    obj.customEffectEval['selectState'] = '';
    obj.customEffectEval['deselectState'] = '';
    obj.customEffectEval['reactState'] = '';
    obj.customEffectEval['respondState'] = '';
    obj.customEffectEval['initiateState'] = '';
    obj.customEffectEval['concludeState'] = '';
    obj.customEffectEval['confirmState'] = '';
    obj.customEffectEval['establishState'] = '';
    obj.customEffectEval['actionStartState'] = '';
    obj.customEffectEval['actionEndState'] = '';
    obj.customEffectEval['battle'] = '';
    obj.customEffectEval['victory'] = '';
    obj.customEffectEval['defeat'] = '';
    obj.customEffectEval['escape'] = '';
    var evalMode = 'none';
    var evalType = 'none';

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(/<(?:SHOW TURNS)>/i)) {
        obj.showTurns = true;
      } else if (line.match(/<(?:HIDE TURNS)>/i)) {
        obj.showTurns = false;
      } else if (line.match(/<(?:TURN ALIGNMENT|turn align):[ ](.*)>/i)) {
        obj.turnAlign = String(RegExp.$1).toLowerCase();
      } else if (line.match(/<(?:TURN FONT SIZE):[ ](\d+)>/i)) {
        obj.turnFontSize = parseInt(RegExp.$1);
      } else if (line.match(/<(?:TURN BUFFER X):[ ]([\+\-]\d+)>/i)) {
        obj.turnBufferX = parseInt(RegExp.$1);
      } else if (line.match(/<(?:TURN BUFFER Y):[ ]([\+\-]\d+)>/i)) {
        obj.turnBufferY = parseInt(RegExp.$1);
      } else if (line.match(/<(?:TURN COLOR):[ ](\d+)>/i)) {
        obj.turnColor = parseInt(RegExp.$1);
      } else if (line.match(/<(?:REAPPLY IGNORE TURNS)>/i)) {
        obj.reapplyRules = 0;
      } else if (line.match(/<(?:REAPPLY RESET TURNS)>/i)) {
        obj.reapplyRules = 1;
      } else if (line.match(/<(?:REAPPLY ADD TURNS)>/i)) {
        obj.reapplyRules = 2;
      } else if (line.match(/<CUSTOM[ ](.*)[ ]EFFECT>/i)) {
        var name = String(RegExp.$1).toUpperCase();
        evalMode = 'custom state effect';
        if (['APPLY', 'ADD'].contains(name)) {
          evalType = 'addState';
        } else if (['REMOVE', 'ERASE'].contains(name)) {
          evalType = 'removeState';
        } else if (['LEAVE', 'DECAY'].contains(name)) {
          evalType = 'leaveState';
        } else if (['TURN START', 'BEGIN'].contains(name)) {
          evalType = 'turnStartState';
        } else if (['TURN END', 'CLOSE'].contains(name)) {
          evalType = 'turnEndState';
        } else if (['REGENERATE', 'REGEN', 'WHILE'].contains(name)) {
          evalType = 'regenerateState';
        } else if (['SELECT', 'ONTARGET'].contains(name)) {
          evalType = 'selectState';
        } else if (['DESELECT', 'OFFTARGET'].contains(name)) {
          evalType = 'deselectState';
        } else if (['REACT', 'REACTION'].contains(name)) {
          evalType = 'reactState';
        } else if (['RESPOND', 'RESPONSE'].contains(name)) {
          evalType = 'respondState';
        } else if (['INITIATE', 'ONAPPLY'].contains(name)) {
          evalType = 'initiateState';
        } else if (['CONFIRM', 'PREDAMAGE', 'PRE-DAMAGE'].contains(name)) {
          evalType = 'confirmState';
        } else if (['ESTABLISH', 'POSTDAMAGE', 'POST-DAMAGE'].contains(name)) {
          evalType = 'establishState';
        } else if (['CONCLUDE', 'OFFAPPLY'].contains(name)) {
          evalType = 'concludeState';
        } else if (['ACTION START', 'START'].contains(name)) {
          evalType = 'actionStartState';
        } else if (['ACTION END', 'FINISH'].contains(name)) {
          evalType = 'actionEndState';
        } else if (['BATTLE', 'BATTLE START'].contains(name)) {
          evalType = 'battle';
        } else if (['VICTORY', 'BATTLE VICTORY'].contains(name)) {
          evalType = 'victory';
        } else if (['DEFEAT', 'BATTLE DEFEAT'].contains(name)) {
          evalType = 'defeat';
        } else if (['ESCAPE', 'BATTLE ESCAPE'].contains(name)) {
          evalType = 'escape';
        }
      } else if (line.match(/<\/CUSTOM[ ](.*)[ ]EFFECT>/i)) {
        evalMode = 'none';
        evalType = 'none';
      } else if (evalMode === 'custom state effect') {
        obj.customEffectEval[evalType] = obj.customEffectEval[evalType] +
          line + '\n';
      }
    }
  }
};

DataManager.processBSCNotetags2 = function(group) {
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.maxBuff = [0, 0, 0, 0, 0, 0, 0, 0];
    obj.maxDebuff = [0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(/<(?:MAX)[ ](.*)[ ](?:BUFF):[ ]([\+\-]\d+)>/i)) {
        var paramId = 8;
        var stat = String(RegExp.$1).toUpperCase();
        var limit = parseInt(RegExp.$2);
        if (['MAXHP', 'MAX HP', 'MHP', 'HP'].contains(stat)) {
          paramId = 0;
        } else if (['MAXMP', 'MAX MP', 'MMP', 'MP'].contains(stat)) {
          paramId = 1;
        } else if (['ATK', 'STR'].contains(stat)) {
          paramId = 2;
        } else if (['DEF'].contains(stat)) {
          paramId = 3;
        } else if (['MAT', 'INT'].contains(stat)) {
          paramId = 4;
        } else if (['MDF', 'RES'].contains(stat)) {
          paramId = 5;
        } else if (['AGI', 'SPD'].contains(stat)) {
          paramId = 6;
        } else if (['LUK'].contains(stat)) {
          paramId = 7;
        }
        obj.maxBuff[paramId] = limit;
      } else if (line.match(/<(?:MAX)[ ](.*)[ ](?:DEBUFF):[ ]([\+\-]\d+)>/i)) {
        var paramId = 8;
        var stat = String(RegExp.$1).toUpperCase();
        var limit = parseInt(RegExp.$2);
        if (['MAXHP', 'MAX HP', 'MHP', 'HP'].contains(stat)) {
          paramId = 0;
        } else if (['MAXMP', 'MAX MP', 'MMP', 'MP'].contains(stat)) {
          paramId = 1;
        } else if (['ATK', 'STR'].contains(stat)) {
          paramId = 2;
        } else if (['DEF'].contains(stat)) {
          paramId = 3;
        } else if (['MAT', 'INT'].contains(stat)) {
          paramId = 4;
        } else if (['MDF', 'RES'].contains(stat)) {
          paramId = 5;
        } else if (['AGI', 'SPD'].contains(stat)) {
          paramId = 6;
        } else if (['LUK'].contains(stat)) {
          paramId = 7;
        }
        obj.maxDebuff[paramId] = limit;
      }
    }
  }
};

DataManager.processBSCNotetags3 = function(group) {
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.modifyTurnBuff = [0, 0, 0, 0, 0, 0, 0, 0];
    obj.modifyTurnDebuff = [0, 0, 0, 0, 0, 0, 0, 0];
    obj.modifyTurnBuffEval = ['', '', '', '', '', '', '', ''];
    obj.modifyTurnDebuffEval = ['', '', '', '', '', '', '', ''];
    obj.modifyTurnState = {};
    obj.modifyTurnStateEval = {};
    var evalMode = 'none';
    var evalLine = '';

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(/<(.*)[ ](?:BUFF TURNS):[ ]([\+\-]\d+)>/i)) {
        var paramId = 8;
        var stat = String(RegExp.$1).toUpperCase();
        var value = parseInt(RegExp.$2);
        if (['MAXHP', 'MAX HP', 'MHP', 'HP'].contains(stat)) {
          paramId = 0;
        } else if (['MAXMP', 'MAX MP', 'MMP', 'MP'].contains(stat)) {
          paramId = 1;
        } else if (['ATK', 'STR'].contains(stat)) {
          paramId = 2;
        } else if (['DEF'].contains(stat)) {
          paramId = 3;
        } else if (['MAT', 'INT'].contains(stat)) {
          paramId = 4;
        } else if (['MDF', 'RES'].contains(stat)) {
          paramId = 5;
        } else if (['AGI', 'SPD'].contains(stat)) {
          paramId = 6;
        } else if (['LUK'].contains(stat)) {
          paramId = 7;
        }
        obj.modifyTurnBuff[paramId] = value;
      } else if (line.match(/<(.*)[ ](?:DEBUFF TURNS):[ ]([\+\-]\d+)>/i)) {
        var paramId = 8;
        var stat = String(RegExp.$1).toUpperCase();
        var value = parseInt(RegExp.$2);
        if (['MAXHP', 'MAX HP', 'MHP', 'HP'].contains(stat)) {
          paramId = 0;
        } else if (['MAXMP', 'MAX MP', 'MMP', 'MP'].contains(stat)) {
          paramId = 1;
        } else if (['ATK', 'STR'].contains(stat)) {
          paramId = 2;
        } else if (['DEF'].contains(stat)) {
          paramId = 3;
        } else if (['MAT', 'INT'].contains(stat)) {
          paramId = 4;
        } else if (['MDF', 'RES'].contains(stat)) {
          paramId = 5;
        } else if (['AGI', 'SPD'].contains(stat)) {
          paramId = 6;
        } else if (['LUK'].contains(stat)) {
          paramId = 7;
        }
        obj.modifyTurnDebuff[paramId] = value;
      } else if (line.match(/<(?:CUSTOM)[ ](.*)[ ](?:BUFF TURNS)>/i)) {
        evalMode = 'custom buff';
        evalLine = '';
      } else if (line.match(/<\/(?:CUSTOM)[ ](.*)[ ](?:BUFF TURNS)>/i)) {
        var paramId = 8;
        var stat = String(RegExp.$1).toUpperCase();
        if (['MAXHP', 'MAX HP', 'MHP', 'HP'].contains(stat)) {
          paramId = 0;
        } else if (['MAXMP', 'MAX MP', 'MMP', 'MP'].contains(stat)) {
          paramId = 1;
        } else if (['ATK', 'STR'].contains(stat)) {
          paramId = 2;
        } else if (['DEF'].contains(stat)) {
          paramId = 3;
        } else if (['MAT', 'INT'].contains(stat)) {
          paramId = 4;
        } else if (['MDF', 'RES'].contains(stat)) {
          paramId = 5;
        } else if (['AGI', 'SPD'].contains(stat)) {
          paramId = 6;
        } else if (['LUK'].contains(stat)) {
          paramId = 7;
        }
        obj.modifyTurnBuffEval[paramId] = evalLine;
        evalMode = 'none';
        evalLine = '';
      } else if (evalMode === 'custom buff') {
        evalLine = evalLine + line + '\n';
      } else if (line.match(/<STATE[ ](\d+)[ ]TURNS:[ ]([\+\-]\d+)>/i)) {
        obj.modifyTurnState[parseInt(RegExp.$1)] = parseInt(RegExp.$2);
      } else if (line.match(/<STATE[ ](.*)[ ]TURNS:[ ]([\+\-]\d+)>/i)) {
        var name = String(RegExp.$1).toUpperCase();
        var value = parseInt(RegExp.$2);
        var id = Yanfly.StateIdRef[name];
        obj.modifyTurnState[id] = value;
      } else if (line.match(/<(?:CUSTOM STATE)[ ](.*)[ ](?:TURNS)>/i)) {
        evalMode = 'custom state';
        evalLine = '';
      } else if (line.match(/<\/(?:CUSTOM STATE)[ ](.*)[ ](?:TURNS)>/i)) {
        var text = String(RegExp.$1);
        if (text.match(/(\d+)/i)) {
          var id = parseInt(RegExp.$1);
        } else {
          var id = Yanfly.StateIdRef[text.toUpperCase()];
        }
        obj.modifyTurnStateEval[id] = evalLine;
        evalMode = 'none';
        evalLine = '';
      } else if (evalMode === 'custom state') {
        evalLine = evalLine + line + '\n';
      }
    }
  }
};

DataManager.processBSCNotetags4 = function(group) {
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.showStateTurns = Yanfly.Param.BSCShowEnemyTurns;

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(/<(?:SHOW STATE TURNS)>/i)) {
        obj.showStateTurns = true;
      } else if (line.match(/<(?:HIDE STATE TURNS)>/i)) {
        obj.showStateTurns = false;
      }
    }
  }
};

//=============================================================================
// BattleManager
//=============================================================================

Yanfly.BSC.BattleManager_startAction = BattleManager.startAction;
BattleManager.startAction = function() {
    if (this._subject) this._subject.onActionStartStateEffects();
    Yanfly.BSC.BattleManager_startAction.call(this);
};

Yanfly.BSC.BattleManager_endAction = BattleManager.endAction;
BattleManager.endAction = function() {
    if (this._subject) this._subject.onActionEndStateEffects();
    Yanfly.BSC.BattleManager_endAction.call(this);
};

Yanfly.BSC.BattleManager_endBattle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    if (result === 0) {
      $gameParty.processStateEval('victory');
    } else if (result === 1) {
      $gameParty.processStateEval('escape');
    } else if (result === 2) {
      $gameParty.processStateEval('defeat');
    }
    Yanfly.BSC.BattleManager_endBattle.call(this, result);
};

//=============================================================================
// Game_BattlerBase
//=============================================================================

Yanfly.BSC.Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;
Game_BattlerBase.prototype.refresh = function() {
    this._cacheParamBuffRate = {};
    Yanfly.BSC.Game_BattlerBase_refresh.call(this);
};

Game_BattlerBase.prototype.stateOrigin = function(stateId) {
    if (this._stateOrigin === undefined) this._stateOrigin = {};
    if (!this._stateOrigin[stateId]) return this;
    var arr = this._stateOrigin[stateId];
    if (arr[0] === 0) return $gameActors.actor(arr[1]);
    if (arr[0] === 1) return $gameTroop.members()[arr[1]];
    return this;
};

Game_BattlerBase.prototype.setStateOrigin = function(stateId, battler) {
    if (this._stateOrigin === undefined) this._stateOrigin = {};
    if (!$gameParty.inBattle()) return;
    if (!battler) {
      var battler = BattleManager._subject;
      if (!battler) return;
    }
    if (battler.isActor()) {
      var arr = [0, battler._actorId];
    } else {
      var arr = [1, battler.index()];
    }
    this._stateOrigin[stateId] = arr;
};

Game_BattlerBase.prototype.clearStateOrigin = function(stateId) {
    if (this._stateOrigin === undefined) this._stateOrigin = {};
    this._stateOrigin[stateId] = undefined;
};

Game_BattlerBase.prototype.clearEnemyStateOrigins = function() {
    var length = $dataStates.length;
    for (var i = 0; i < length; ++i) {
      if (this._stateOrigin === undefined) this._stateOrigin = {};
      if (this._stateOrigin[i] === undefined) continue;
      var data = this._stateOrigin[i];
      if (data[0] === 1) this.clearStateOrigin(i);
    }
};

Game_BattlerBase.prototype.stateTurns = function(stateId) {
    return this._stateTurns[stateId];
};

Game_BattlerBase.prototype.setStateTurns = function(stateId, turns) {
    if (Imported.YEP_BattleEngineCore && !eval(Yanfly.Param.BECTimeStates)) {
      turns = Math.floor(turns);
    }
    this._stateTurns[stateId] = turns;
};

Game_BattlerBase.prototype.buffTurns = function(paramId) {
    return this._buffTurns[paramId];
};

Game_BattlerBase.prototype.setBuffTurns = function(paramId, turns) {
    if (Imported.YEP_BattleEngineCore && !eval(Yanfly.Param.BECTimeBuffs)) {
      turns = Math.floor(turns);
    }
    this._buffTurns[paramId] = turns;
};

Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
    if (this._cacheParamBuffRate === undefined) this._cacheParamBuffRate = {};
    if (this._cacheParamBuffRate[paramId] !== undefined) {
      return this._cacheParamBuffRate[paramId];
    }
    var rate = eval(Yanfly.Param.BSCBuffFormula);
    this._cacheParamBuffRate[paramId] = rate;
    return this._cacheParamBuffRate[paramId];
};

Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
    var limit = Math.max(1, this.maxBuffLimit(paramId));
    var max = Yanfly.Param.BSCMaximumLimit;
    return this._buffs[paramId] === Math.min(limit, max);
};

Game_BattlerBase.prototype.maxBuffLimit = function(paramId) {
    var value = Yanfly.Param.BSCDefaultLimit;
    var length = this.states().length;
    for (var i = 0; i < length; ++i) {
      var state = this.states()[i];
      if (!state) continue;
      if (state.maxBuff) value += state.maxBuff[paramId];
    }
    return value;
};

Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
    var limit = Math.min(-1, this.maxDebuffLimit(paramId));
    var max = Yanfly.Param.BSCMaximumLimit * -1;
    return this._buffs[paramId] === Math.max(limit, max);
};

Game_BattlerBase.prototype.maxDebuffLimit = function(paramId) {
    var value = -1 * Yanfly.Param.BSCDefaultLimit;
    var length = this.states().length;
    for (var i = 0; i < length; ++i) {
      var state = this.states()[i];
      if (!state) continue;
      if (state.maxDebuff) value -= state.maxDebuff[paramId];
    }
    return value;
};

Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
    if (buffLevel > 0) {
      var level = Math.min(buffLevel - 1, 1);
      return Game_BattlerBase.ICON_BUFF_START + (level) * 8 + paramId;
    } else if (buffLevel < 0) {
      var level = Math.min(-buffLevel - 1, 1);
      return Game_BattlerBase.ICON_DEBUFF_START + (level) * 8 + paramId;
    } else {
      return 0;
    }
};

Yanfly.BSC.Game_BattlerBase_resetStateCounts =
    Game_BattlerBase.prototype.resetStateCounts;
Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    var state = $dataStates[stateId];
    if (state.reapplyRules === 1) {
      Yanfly.BSC.Game_BattlerBase_resetStateCounts.call(this, stateId);
    } else if (state.reapplyRules === 2) {
      this._stateTurns[stateId] = this._stateTurns[stateId] || 0;
      var variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
      this._stateTurns[stateId] += state.minTurns + Math.randomInt(variance);
    } else if (state.reapplyRules === 0 && state.minTurns) {
      if (this._stateTurns[stateId] === undefined) {
        Yanfly.BSC.Game_BattlerBase_resetStateCounts.call(this, stateId);
      }
    }
};

//=============================================================================
// Game_Battler
//=============================================================================

Game_Battler.prototype.customEffectEval = function(stateId, type) {
    var state = $dataStates[stateId];
    if (!state) return;
    if (state.customEffectEval[type] === '') return;
    var a = this;
    var user = this;
    var target = this;
    var origin = this.stateOrigin(stateId);
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    eval(state.customEffectEval[type]);
};

Yanfly.BSC.Game_Battler_addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) {
    var addable = this.isStateAddable(stateId);
    Yanfly.BSC.Game_Battler_addState.call(this, stateId);
    if (addable) {
      this.setStateOrigin(stateId);
      this.addStateEffects(stateId);
    }
};

Game_Battler.prototype.addStateEffects = function(stateId) {
    this.customEffectEval(stateId, 'addState');
};

Yanfly.BSC.Game_Battler_removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function(stateId) {
    var affected = this.isStateAffected(stateId);
    Yanfly.BSC.Game_Battler_removeState.call(this, stateId);
    if (affected) {
      this.removeStateEffects(stateId);
      this.clearStateOrigin(stateId);
    }
};

Game_Battler.prototype.removeStateEffects = function(stateId) {
    this.customEffectEval(stateId, 'removeState');
    if ($gameTemp._customLeaveEffectEval) this.leaveStateEffects(stateId);
};

Yanfly.BSC.Game_Battler_removeStatesAuto =
    Game_Battler.prototype.removeStatesAuto;
Game_Battler.prototype.removeStatesAuto = function(timing) {
    $gameTemp._customLeaveEffectEval = true;
    Yanfly.BSC.Game_Battler_removeStatesAuto.call(this, timing);
    $gameTemp._customLeaveEffectEval = undefined;
};

Game_Battler.prototype.leaveStateEffects = function(stateId) {
    this.customEffectEval(stateId, 'leaveState');
};

Game_Battler.prototype.onTurnStartStateEffects = function() {
    var length = this.states().length;
    for (var i = 0; i < length; ++i) {
      var state = this.states()[i];
      if (state) this.turnStartStateEffects(state.id);
    }
};

Game_Battler.prototype.turnStartStateEffects = function(stateId) {
    this.customEffectEval(stateId, 'turnStartState');
};

Game_Battler.prototype.onTurnEndStateEffects = function() {
    var length = this.states().length;
    for (var i = 0; i < length; ++i) {
      var state = this.states()[i];
      if (state) this.turnEndStateEffects(state.id);
    }
};

Game_Battler.prototype.turnEndStateEffects = function(stateId) {
    this.customEffectEval(stateId, 'turnEndState');
};

Yanfly.BSC.Game_Battler_onTurnEnd = Game_Battler.prototype.onTurnEnd;
Game_Battler.prototype.onTurnEnd = function() {
    Yanfly.BSC.Game_Battler_onTurnEnd.call(this);
    if (this.meetTurnEndStateEffectsConditions()) this.onTurnEndStateEffects();
};

Game_Battler.prototype.meetTurnEndStateEffectsConditions = function() {
    if (Imported.YEP_BattleEngineCore) {
      if (BattleManager.isTurnBased()) {
        return true;
      } else if (BattleManager.isTickBased() && !BattleManager.isTurnEnd()) {
        return true;
      } else {
        return false;
      }
    }
    return true;
};

Game_Battler.prototype.onRegenerateStateEffects = function() {
    var length = this.states().length;
    for (var i = 0; i < length; ++i) {
      var state = this.states()[i];
      if (state) this.regenerateStateEffects(state.id);
    }
};

Game_Battler.prototype.regenerateStateEffects = function(stateId) {
    this.clearResult();
    var lifeState = this.isAlive();
    this.customEffectEval(stateId, 'regenerateState');
    if (this.isDead() && lifeState === true) {
      this.performCollapse();
    }
    if (!Imported.YEP_BattleEngineCore) return;
    if ($gameParty.inBattle()) this.startDamagePopup();
};

Yanfly.BSC.Game_Battler_regenerateAll = Game_Battler.prototype.regenerateAll;
Game_Battler.prototype.regenerateAll = function() {
    Yanfly.BSC.Game_Battler_regenerateAll.call(this);
    this.onRegenerateStateEffects();
};

if (Imported.YEP_BattleEngineCore) {

Yanfly.BSC.Game_BattlerBase_updateStateTicks =
    Game_BattlerBase.prototype.updateStateTicks;
Game_BattlerBase.prototype.updateStateTicks = function() {
    $gameTemp._customLeaveEffectEval = true;
    Yanfly.BSC.Game_BattlerBase_updateStateTicks.call(this);
    $gameTemp._customLeaveEffectEval = undefined;
};

Yanfly.BSC.Game_BattlerBase_updateStateTurnTiming =
    Game_BattlerBase.prototype.updateStateTurnTiming;
Game_BattlerBase.prototype.updateStateTurnTiming = function(timing) {
    $gameTemp._customLeaveEffectEval = true;
    Yanfly.BSC.Game_BattlerBase_updateStateTurnTiming.call(this, timing);
    $gameTemp._customLeaveEffectEval = undefined;
};

Yanfly.BSC.Game_Battler_onTurnStart =
    Game_Battler.prototype.onTurnStart;
Game_Battler.prototype.onTurnStart = function() {
  Yanfly.BSC.Game_Battler_onTurnStart.call(this);
  if (this.meetTurnStartStateEffectsConditions()) {
    this.onTurnStartStateEffects();
  }
};

Game_Battler.prototype.meetTurnStartStateEffectsConditions = function() {
    return true;
};

}; // Imported.YEP_BattleEngineCore

Game_Battler.prototype.onActionStartStateEffects = function() {
    var length = this.states().length;
    for (var i = 0; i < length; ++i) {
      var state = this.states()[i];
      if (state) this.actionStartStateEffects(state.id);
    }
};

Game_Battler.prototype.actionStartStateEffects = function(stateId) {
    this.customEffectEval(stateId, 'actionStartState');
};

Game_Battler.prototype.onActionEndStateEffects = function() {
    var length = this.states().length;
    for (var i = 0; i < length; ++i) {
      var state = this.states()[i];
      if (state) this.actionEndStateEffects(state.id);
    }
};

Game_Battler.prototype.actionEndStateEffects = function(stateId) {
    this.customEffectEval(stateId, 'actionEndState');
};

Yanfly.BSC.Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
Game_Battler.prototype.onBattleEnd = function() {
    Yanfly.BSC.Game_Battler_onBattleEnd.call(this);
    this.clearEnemyStateOrigins();
};

//=============================================================================
// Game_Actor
//=============================================================================

Game_Actor.prototype.maxBuffLimit = function(paramId) {
    var value = Game_Battler.prototype.maxBuffLimit.call(this, paramId);
    value += this.actor().maxBuff[paramId];
    value += this.currentClass().maxBuff[paramId];
    var length = this.equips().length;
    for (var i = 0; i < length; ++i) {
      var equip = this.equips()[i];
      if (!equip) continue;
      if (equip.maxBuff) value += equip.maxBuff[paramId];
    }
    return value;
};

Game_Actor.prototype.maxDebuffLimit = function(paramId) {
    var value = Game_Battler.prototype.maxDebuffLimit.call(this, paramId);
    value -= this.actor().maxDebuff[paramId];
    value -= this.currentClass().maxDebuff[paramId];
    var length = this.equips().length;
    for (var i = 0; i < length; ++i) {
      var equip = this.equips()[i];
      if (!equip) continue;
      if (equip.maxDebuff) value -= equip.maxDebuff[paramId];
    }
    return value;
};

//=============================================================================
// Game_Enemy
//=============================================================================

Game_Enemy.prototype.maxBuffLimit = function(paramId) {
    var value = Game_Battler.prototype.maxBuffLimit.call(this, paramId);
    value += this.enemy().maxBuff[paramId];
    return value;
};

Game_Enemy.prototype.maxDebuffLimit = function(paramId) {
    var value = Game_Battler.prototype.maxDebuffLimit.call(this, paramId);
    value -= this.enemy().maxDebuff[paramId];
    return value;
};

//=============================================================================
// Game_Unit
//=============================================================================

Game_Unit.prototype.processStateEval = function(type) {
    var length1 = this.allMembers().length;
    for (var i = 0; i < length1; ++i) {
      var member = this.allMembers()[i];
      if (!member) return;
      var length2 = member.states().length;
      for (var j = 0; j < length2; ++j) {
        var state = member.states()[j];
        if (state) member.customEffectEval(state.id, type);
      }
    }
};

Yanfly.BSC.Game_Unit_onBattleStart = Game_Unit.prototype.onBattleStart;
Game_Unit.prototype.onBattleStart = function() {
    Yanfly.BSC.Game_Unit_onBattleStart.call(this);
    this.processStateEval('battle');
};

//=============================================================================
// Game_Troop
//=============================================================================

Game_Troop.prototype.allMembers = function() {
    return this.members();
};

//=============================================================================
// Game_Action
//=============================================================================

Yanfly.BSC.Game_Action_applyItemUserEffect =
    Game_Action.prototype.applyItemUserEffect;
Game_Action.prototype.applyItemUserEffect = function(target) {
    Yanfly.BSC.Game_Action_applyItemUserEffect.call(this, target);
    if (!target) return;
    this.applyModifyBuffTurns(target);
    this.applyModifyDebuffTurns(target);
    this.applyModifyStateTurns(target);
};

Game_Action.prototype.applyModifyBuffTurns = function(target) {
    if (!this.item()) return;
    var affected = false;
    for (var i = 0; i < 8; ++i) {
      if (!target.isBuffAffected(i)) continue;
      var turn = this.item().modifyTurnBuff[i] + target.buffTurns(i);
      turn = this.applyBuffTurnsEval(turn, i, target);
      target.setBuffTurns(i, turn);
      if (target.buffTurns(i) <= 0) target.eraseBuff(i);
      affected = true;
    }
    if (affected) target.refresh();
};

Game_Action.prototype.applyBuffTurnsEval = function(turn, paramId, target) {
    if (this.item().modifyTurnBuffEval[paramId] === '') return turn;
    var item = this.item();
    var a = this.subject();
    var b = target;
    var user = this.subject();
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    eval(this.item().modifyTurnBuffEval[paramId]);
    return turn;
};

Game_Action.prototype.applyModifyDebuffTurns = function(target) {
    if (!this.item()) return;
    var affected = false;
    for (var i = 0; i < 8; ++i) {
      if (!target.isDebuffAffected(i)) continue;
      var turn = this.item().modifyTurnDebuff[i] + target.buffTurns(i);
      turn = this.applyDebuffTurnsEval(turn, i, target);
      target.setBuffTurns(i, turn);
      if (target.buffTurns(i) <= 0) target.eraseBuff(i);
      affected = true;
    }
    if (affected) target.refresh();
};

Game_Action.prototype.applyDebuffTurnsEval = function(turn, paramId, target) {
    if (this.item().modifyTurnBuffEval[paramId] === '') return turn;
    var item = this.item();
    var a = this.subject();
    var b = target;
    var user = this.subject();
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    eval(this.item().modifyTurnBuffEval[paramId]);
    return turn;
};

Game_Action.prototype.applyModifyStateTurns = function(target) {
    if (!this.item()) return;
    var affected = false;
    var length = target.states().length;
    var removed = [];
    for (var i = 0; i < length; ++i) {
      var state = target.states()[i];
      if (state.autoRemovalTiming <= 0) continue;
      if (!target.isStateAffected(state.id)) continue;
      var turn = target.stateTurns(state.id);
      if (this.item().modifyTurnState[state.id]) {
        turn += this.item().modifyTurnState[state.id];
      }
      turn = this.applyStateTurnsEval(turn, state.id, target);
      target.setStateTurns(state.id, turn);
      if (target.stateTurns(state.id) <= 0) removed.push(state.id);
    }
    for (var i = 0; i < removed.length; ++i) {
      target.removeState(removed[i]);
      affected = true;
    }
    if (affected) target.refresh();
};

Game_Action.prototype.applyStateTurnsEval = function(turn, stateId, target) {
    if (this.item().modifyTurnStateEval[stateId] === undefined) return turn;
    var item = this.item();
    var a = this.subject();
    var b = target;
    var user = this.subject();
    var origin = target.stateOrigin(stateId);
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    eval(this.item().modifyTurnStateEval[stateId]);
    return turn;
};

Yanfly.BSC.Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
    this.onApplyStateEffects(target);
    this.onSelectStateEffects(target);
    Yanfly.BSC.Game_Action_apply.call(this, target);
    this.onDeselectStateEffects(target);
    this.offApplyStateEffects(target);
};

Game_Action.prototype.customEffectEval = 
function(target, stateId, type, side, value) {
    var state = $dataStates[stateId];
    if (!state) return value;
    if (state.customEffectEval[type] === '') return value;
    var attacker = this.subject();
    var defender = target;
    var a = this.subject();
    var b = target;
    var user = this.subject();
    var origin = side.stateOrigin(stateId);
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    eval(state.customEffectEval[type]);
    return value;
};

Game_Action.prototype.onApplyStateEffects = function(target) {
    var length = this.subject().states().length;
    for (var i = 0; i < length; ++i) {
      var state = this.subject().states()[i];
      if (!state) continue;
      this.initiateStateEffects(target, state.id)
    }
};

Game_Action.prototype.initiateStateEffects = function(target, stateId) {
    this.customEffectEval(target, stateId, 'initiateState', this.subject());
};

Game_Action.prototype.onSelectStateEffects = function(target) {
    var length = target.states().length;
    for (var i = 0; i < length; ++i) {
      var state = target.states()[i];
      if (!state) continue;
      this.selectStateEffects(target, state.id)
    }
};

Game_Action.prototype.selectStateEffects = function(target, stateId) {
    this.customEffectEval(target, stateId, 'selectState', target);
};

Game_Action.prototype.onDeselectStateEffects = function(target) {
    var length = target.states().length;
    for (var i = 0; i < length; ++i) {
      var state = target.states()[i];
      if (!state) continue;
      this.deselectStateEffects(target, state.id)
    }
};

Game_Action.prototype.deselectStateEffects = function(target, stateId) {
    this.customEffectEval(target, stateId, 'deselectState', target);
};

Game_Action.prototype.offApplyStateEffects = function(target) {
    var length = this.subject().states().length;
    for (var i = 0; i < length; ++i) {
      var state = this.subject().states()[i];
      if (!state) continue;
      this.concludeStateEffects(target, state.id)
    }
};

Game_Action.prototype.concludeStateEffects = function(target, stateId) {
    this.customEffectEval(target, stateId, 'concludeState', this.subject());
};

Yanfly.BSC.Game_Action_executeDamage = Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage = function(target, value) {
    value = this.onPreDamageStateEffects(target, value);
    value = this.onReactStateEffects(target, value);
    Yanfly.BSC.Game_Action_executeDamage.call(this, target, value);
    value = this.onRespondStateEffects(target, value);
    value = this.onPostDamageStateEffects(target, value);
};

Game_Action.prototype.onPreDamageStateEffects = function(target, value) {
    var length = this.subject().states().length;
    for (var i = 0; i < length; ++i) {
      var state = this.subject().states()[i];
      if (!state) continue;
      value = this.confirmStateEffects(target, state.id, value);
    }
    return value;
};

Game_Action.prototype.confirmStateEffects = function(target, stateId, value) {
    return this.customEffectEval(target, stateId, 'confirmState', 
      this.subject(), value);
};

Game_Action.prototype.onReactStateEffects = function(target, value) {
    var length = target.states().length;
    for (var i = 0; i < length; ++i) {
      var state = target.states()[i];
      if (!state) continue;
      value = this.reactStateEffects(target, state.id, value);
    }
    return value;
};

Game_Action.prototype.reactStateEffects = function(target, stateId, value) {
    return this.customEffectEval(target, stateId, 'reactState', target, value);
};

Game_Action.prototype.onRespondStateEffects = function(target, value) {
    var length = target.states().length;
    for (var i = 0; i < length; ++i) {
      var state = target.states()[i];
      if (!state) continue;
      value = this.respondStateEffects(target, state.id, value);
    }
    return value;
};

Game_Action.prototype.respondStateEffects = function(target, stateId, value) {
    return this.customEffectEval(target, stateId, 'respondState', 
      target, value);
};

Game_Action.prototype.onPostDamageStateEffects = function(target, value) {
    var length = this.subject().states().length;
    for (var i = 0; i < length; ++i) {
      var state = this.subject().states()[i];
      if (!state) continue;
      value = this.establishStateEffects(target, state.id, value);
    }
    return value;
};

Game_Action.prototype.establishStateEffects = function(target, stateId, value) {
    return this.customEffectEval(target, stateId, 'establishState', 
      this.subject(), value);
};

//=============================================================================
// Window_Base
//=============================================================================

Yanfly.BSC.Window_Base_drawActorIcons = Window_Base.prototype.drawActorIcons;
Window_Base.prototype.drawActorIcons = function(actor, wx, wy, ww) {
    ww = ww || 144;
    Yanfly.BSC.Window_Base_drawActorIcons.call(this, actor, wx, wy, ww);
    this.drawActorIconsTurns(actor, wx, wy, ww);
};

Window_Base.prototype.drawActorIconsTurns = function(actor, wx, wy, ww) {
    var iw = Window_Base._iconWidth;
    var icons = actor.allIcons().slice(0, Math.floor(ww / iw));
    var max = icons.length;
    var shownMax = Math.floor(ww / iw);
    for (var i = 0; i < actor.states().length; ++i) {
      if (shownMax <= 0) break;
      var state = actor.states()[i];
      if (state.iconIndex <= 0) continue;
      if (state.autoRemovalTiming > 0) {
        this.drawStateTurns(actor, state, wx, wy);
      }
      wx += iw;
      --shownMax;
    }
    for (var i = 0; i < 8; ++i) {
      if (shownMax <= 0) break;
      if (actor._buffs[i] === 0) continue;
      this.drawBuffTurns(actor, i, wx, wy);
      wx += iw;
      --shownMax;
    }
    this.resetFontSettings();
    this.resetTextColor();
};

Window_Base.prototype.drawStateTurns = function(actor, state, wx, wy) {
    if (!state.showTurns) return;
    var turns = actor.stateTurns(state.id);
    if (turns !== 0 && !turns) return;
    var turns = Yanfly.Util.toGroup(Math.ceil(turns));
    wx += state.turnBufferX;
    wy += state.turnBufferY;
    this.changePaintOpacity(true);
    this.changeTextColor(this.textColor(state.turnColor));
    this.contents.fontSize = state.turnFontSize;
    this.drawText(turns, wx, wy, Window_Base._iconWidth, state.turnAlign);
    this.resetFontSettings();
    this.resetTextColor();
};

Window_Base.prototype.drawBuffTurns = function(actor, paramId, wx, wy) {
    if (!Yanfly.Param.BSCShowTurns) return;
    var turns = Yanfly.Util.toGroup(Math.ceil(actor.buffTurns(paramId)));
    wx += Yanfly.Param.BSCTurnBufferX;
    wy += Yanfly.Param.BSCTurnBufferY;
    this.changePaintOpacity(true);
    this.contents.fontSize = Yanfly.Param.BSCFontSize;
    if (actor.isBuffAffected(paramId)) {
      this.changeTextColor(this.textColor(Yanfly.Param.BSCBuffColor));
    } else {
      this.changeTextColor(this.textColor(Yanfly.Param.BSCDebuffColor));
    }
    var align = Yanfly.Param.BSCTurnAlign;
    this.drawText(turns, wx, wy, Window_Base._iconWidth, align);
    this.resetFontSettings();
    this.resetTextColor();
};

//=============================================================================
// Window_Help
//=============================================================================

if (Imported.YEP_BattleEngineCore) {

Yanfly.BSC.Window_Help_drawBattler = Window_Help.prototype.drawBattler;
Window_Help.prototype.drawBattler = function(battler) {
    this.resetFontSettings();
    var length = battler.allIcons().length;
    if (length <= 0) {
      Yanfly.BSC.Window_Help_drawBattler.call(this, battler);
    } else {
      this.drawBattlerWithIcons(battler);
    }
};

Window_Help.prototype.drawBattlerWithIcons = function(battler) {
    var icons = battler.allIcons();
    var text = battler.name();
    var wx = 0;
    var wy = 0;
    this.drawText(text, wx, wy, this.contents.width, 'center');
    wy += this.lineHeight();
    var ww = icons.length * Window_Base._iconWidth;
    ww = Math.min(ww, this.contents.width);
    wx = (this.contents.width - ww) / 2;
    this.drawActorIcons(battler, wx, wy, ww);
};

}; // Imported.YEP_BattleEngineCore

//=============================================================================
// Utilities
//=============================================================================

Yanfly.Util = Yanfly.Util || {};

if (!Yanfly.Util.toGroup) {
    Yanfly.Util.toGroup = function(inVal) {
        return inVal;
    }
};

//=============================================================================
// End of File
//=============================================================================