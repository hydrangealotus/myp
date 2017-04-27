/*:
 * @plugindesc This plugin allows you to replace your menu with 
 * Common Events throughout your game.
 * @author SumRndmDde
 *
 * @param Common Event ID
 * @desc This is the ID of the Common Event you will use as 
 * your menu. If it is 0, the default menu will be used.
 * @default 0
 *
 * @param -Sound Effect-
 * @desc
 * @default
 *
 * @param Menu Sound Effect
 * @desc This is the Sound Effect (SE) that will be played when
 * your Common Event Menu is called. Default is "Decision1".
 * @default Decision1
 *
 * @param Menu SE Volume
 * @desc This is the volume for the Sound Effect (SE) that
 * is played. The default is 90. Range is 0 to 100.
 * @default 90
 *
 * @param Menu SE Pitch
 * @desc This is the pitch for the Sound Effect (SE) that
 * is played. The default is 100. Range is 50 to 150.
 * @default 100
 *
 * @param Menu SE Pan
 * @desc This is the volume for the Sound Effect (SE) that
 * is played. The default is 0. Range is -100 to 100.
 * @default 0
 *
 * @help This plugin allows you to replace your normal menu
 * with a Common Event. However, you can return to the normal
 * menu, or even switch which Common Event is used mid-game!
 *
 *
 * Let's start with the Plugin Commands:
 *
 * ChangeEverything #1 se #2 #3 #4
 * 	Changes the CommonEvent ID, the Sound Effect, and the 
 * 	volume, pitch, and pan of the Sound Effect with one
 * 	command.
 * 	Replace #1 with the Common Event ID
 * 	Replace se with the Sound Effect file name (no extension).
 * 	Replace #2 with the SE volume.
 * 	Replace #3 with the SE pitch.
 * 	Replace #4 with the SE pan.
 *
 * ReturnToDefault
 * 	This command returns the Common Event ID, the Sound Effect,
 * 	and the volume, pitch, and pan of the Sound Effect to
 * 	the original values that are inputted into the Parameters.
 *
 * ChangeCommonEvent #
 * 	Replace # with the ID of the Common Event you would 
 * 	like to use as your new menu.
 *
 * ChangeSoundEffect se
 * 	Replace se with the file name of the new Sound
 * 	Effect you wish to use for your menu. The file name
 * 	should not include the file extension.
 *
 * ChangeSoundVolume #
 * 	Replace # with the volume you wish to use for 
 * 	the Sound Effect. The default is 90. The range
 * 	for the volume is from 0 to 100.
 *
 * ChangeSoundPitch #
 * 	Replace # with the pitch you wish to use for 
 * 	the Sound Effect. The default is 100. The range
 * 	for the volume is from 50 to 150.
 *
 * ChangeSoundPan #
 * 	Replace # with the pan you wish to use for 
 * 	the Sound Effect. The default is 0. The range
 * 	for the volume is from -100 to 100.
 *
 *
 * Now let's look at the Parameters:
 *
 * Common Event ID
 * This is the ID of the Common Event you will use as 
 * your menu. If it is 0, the default menu will be used.
 * Default is 0.
 *
 * Menu Sound Effect
 * This is the Sound Effect (SE) that will be played when
 * your Common Event Menu is called. Default is "Decision1".
 * Default is Decision1.
 *
 * Menu SE Volume
 * This is the volume for the Sound Effect (SE) that
 * is played. The default is 90. Range is 0 to 100.
 * Default is 90.
 *
 * Menu SE Pitch
 * This is the pitch for the Sound Effect (SE) that
 * is played. The default is 100. Range is 50 to 150.
 * Default is 100
 *
 * Menu SE Pan
 * This is the volume for the Sound Effect (SE) that
 * is played. The default is 0. Range is -100 to 100.
 * Default is 0
 */

var parameters = PluginManager.parameters('SRD_CommonEventMenu');

var eventID = Number(parameters['Common Event ID'] || 0);

var soundEffect = String(parameters['Menu Sound Effect'] || 'Decision1');
var soundVolume = Number(parameters['Menu SE Volume'] || 90);
var soundPitch = Number(parameters['Menu SE Pitch'] || 100);
var soundPan = Number(parameters['Menu SE Pan'] || 0);

Scene_Map.prototype.callMenu = function() {
	AudioManager.playSe({name: soundEffect, volume: soundVolume, pitch: soundPitch, pan: soundPan});
    if(eventID == 0)
    {
    	SceneManager.push(Scene_Menu);
    	Window_MenuCommand.initCommandPosition();
    	$gameTemp.clearDestination();
    	this._mapNameWindow.hide();
    	this._waitCount = 2;
    }
    else
    {
    	$gameTemp.reserveCommonEvent(eventID);
    	this.menuCalling = false;
    }
};

var aliasPluginCommand = Game_Interpreter.prototype.pluginCommand;

Game_Interpreter.prototype.pluginCommand = function(command, args) {
   aliasPluginCommand.call(this, command, args);
   
   if (command.toLowerCase() === 'changeeverything') {
      eventID = Number(args[0]);
      soundEffect = String(args[1]);
      soundVolume = String(args[2]);
      soundPitch = String(args[3]);
      soundPan = String(args[4]);
   }
   if (command.toLowerCase() === 'returntodefault') {
      eventID = Number(parameters['Common Event ID'] || 0);
      soundEffect = String(parameters['Menu Sound Effect'] || 'Decision1');
      soundVolume = Number(parameters['Menu SE Volume'] || 90);
      soundPitch = Number(parameters['Menu SE Pitch'] || 100);
      soundPan = Number(parameters['Menu SE Pan'] || 0);
   }
   if (command.toLowerCase() === 'changecommonevent') {
      eventID = Number(args[0]);
   }
   if (command.toLowerCase() === 'changesoundeffect') {
      soundEffect = String(args[0]);
   }
   if (command.toLowerCase() === 'changesoundvolume') {
      soundVolume = String(args[0]);
   }
   if (command.toLowerCase() === 'changesoundpitch') {
      soundPitch = String(args[0]);
   }
   if (command.toLowerCase() === 'changesoundpan') {
      soundPan = String(args[0]);
   }
};
