//=============================================================================
// Fullscreen.js
//=============================================================================

(function () {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  function extend(obj, name, func) {
    var orig = obj.prototype[name];
    obj.prototype[name] = function () {
      orig.call(this);
      func.call(this);
    };
  }

  extend(Scene_Boot, "start", function () {
    if (!Utils.isMobileDevice()) {
      Graphics._switchFullScreen();
    }
  });

  var _Scene_Base_create = Scene_Base.prototype.create;

  Scene_Base.prototype.create = function () {
    _Scene_Base_create.call(this);
    if (!Utils.isMobileDevice()) {
      Graphics.width = window.innerWidth;
      Graphics.height = window.innerHeight;
      Graphics.boxHeight = window.innerHeight;
      Graphics.boxWidth = window.innerWidth;
    }
  };
})();
