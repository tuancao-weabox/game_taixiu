Input._shouldPreventDefault = function (e) {
    switch (e.keyCode) {
        case 8: // backspace
            if ($(e.target).is("input, textarea"))
                break;
        case 33: // pageup
        case 34: // pagedown
        case 37: // left arrow
        case 38: // up arrow
        case 39: // right arrow
        case 40: // down arrow
            return true;
    }
    return false;
};

Input._onKeyDown = function (event) {
    if (this._shouldPreventDefault(event)) {
        event.preventDefault();
    }
    if (event.keyCode === 144) { // Numlock
        this.clear();
    }
    var buttonName = this.keyMapper[event.keyCode];
    if (buttonName) {
        this._currentState[buttonName] = true;
    }
};

 // Input.keyMapper["88"] = "cancel";
 Input.keyMapper["13"] = "Enter";
 var sceneMap_updtSceneAlias_Input = Scene_Map.prototype.updateScene;
 Scene_Map.prototype.updateScene = function () {
     $gameSystem.MKPSell = false;
     sceneMap_updtSceneAlias_Input.call(this);
     if (!$gamePlayer._dashing) {
         $gamePlayer._dashing = true;
     }
     if (Input.isTriggered("Enter")) {
        //TODO
     }
 };