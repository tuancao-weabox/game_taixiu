/**
 *
 */
/**
 * Update the scene processing each new frame.
 *
 * @method update
 * @instance
 * @memberof Scene_Base
 */
var alias_update_scenebase = Scene_Base.prototype.update;
Scene_Base.prototype.update = function () {
  alias_update_scenebase.call(this);
  if ($gameSystem) {
    if ($gameSystem._DOMdivContent) {
      $gameSystem._DOMdivContent.style.width =
        document.getElementById("GameCanvas").style.width;
      $gameSystem._DOMdivContent.style.height =
        document.getElementById("GameCanvas").style.height;
    }
  }
};

var alias_start_Scene_Map = Scene_Map.prototype.start;
Scene_Map.prototype.start = function () {
  alias_start_Scene_Map.call(this);
  if ($gameMap._mapId == 2) {
    ScreenGamePlay.createSceen();
  } else {
    if (!$gamePlayer._endRound) {
      ScreenMenu.createSceen();
    }
  }
};

//=================================================================================================
function setInputFilter(textbox, inputFilter, errMsg) {
  [
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mouseup",
    "select",
    "contextmenu",
    "drop",
    "focusout",
  ].forEach(function (event) {
    textbox.addEventListener(event, function (e) {
      if (inputFilter(this.value)) {
        // Accepted value
        if (["keydown", "mousedown", "focusout"].indexOf(e.type) >= 0) {
          this.classList.remove("input-error");
          this.setCustomValidity("");
        }
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        // Rejected value - restore the previous one
        this.classList.add("input-error");
        this.setCustomValidity(errMsg);
        this.reportValidity();
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        // Rejected value - nothing to restore
        this.value = "";
      }
    });
  });
}
ReloadImage = () => {
  for (let i = 2; i <= 8; i++) {
    ImageManager.loadSystem(i);
  }
  // for (let i = 25; i < 40; i++) {
  //   ImageManager.loadSystem("team" + i);
  //   ImageManager.loadSystem("EL_ROAD_" + i);
  // }
};
ReloadImage();
function initApi() {
  $.ajaxSetup({
    headers: {
      "Content-Type": "application/json",
      lang: "zh-cn",
    },
    dataType: "json",
  });
  domain = "https://api.waebox.online";
  if ($gameSystem) {
    $gameSystem.api = {
      login: domain + "/api/v1/member/login",
      register: domain + "/api/v1/member/registry",
    };
  }
}
