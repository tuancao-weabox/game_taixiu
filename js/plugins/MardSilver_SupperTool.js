let arrPictures = [];
Game_Picture.prototype.checkTouching = function () {
  let pic = ImageManager.loadPicture(this._name);
  if (
    TouchInput.x > this._x - pic.width / 2 &&
    TouchInput.x < this._x + pic.width / 2 &&
    TouchInput.y > this._y - pic.height / 2 &&
    TouchInput.y < this._y + pic.height / 2
  ) {
    return true;
  } else {
    return false;
  }
};
SceneManager.onKeyDown = function (event) {
  let that = this;
  if (!event.ctrlKey && !event.altKey) {
    switch (event.keyCode) {
      case 113: //F2
        $gameSystem._debug = true;
        if ($gameSystem._debug) {
          $gameSystem._editer = !$gameSystem._editer;
          that.openEditer();
        }
        break;
      case 116: // F5
        if (Utils.isNwjs()) {
          if ($Editer._window) {
            $Editer._window.close(true);
          }
          location.reload();
        }
        break;
      case 119: // F8
        if (Utils.isNwjs() && Utils.isOptionValid("test")) {
          require("nw.gui").Window.get().showDevTools();
        }
        break;
    }
  }
};

Scene_Map.prototype.drag = function (picture) {
  if (!picture._origin) {
    let pic = ImageManager.loadPicture(picture._name);
    picture._x = TouchInput.x - pic.width / 2;
    picture._y = TouchInput.y - pic.height / 2;
  } else {
    picture._x = TouchInput.x;
    picture._y = TouchInput.y;
  }

  if ($gameSystem._editer) {
    picture.X = picture._x;
    picture.Y = picture._y;
    picture.setResetOnDrag(false);
    picture.saveToFile();
  } else {
    if (picture._dragMethod) {
      picture._dragMethod();
    }
  }
};

let custom_Game_Picture_showfunction = Game_Picture.prototype.show;
Game_Picture.prototype.show = function (
  name,
  origin,
  x,
  y,
  scaleX,
  scaleY,
  opacity,
  blendMode
) {
  custom_Game_Picture_showfunction.call(
    this,
    name,
    origin,
    x,
    y,
    scaleX,
    scaleY,
    opacity,
    blendMode
  );
  this.X = this._x;
  this.Y = this._y;
  // this._drag = false;
};

Game_Picture.prototype.setResetOnDrag = function (value) {
  this._resetAfterDrag = value;
};

Game_Picture.prototype.setObjectProperties = function (obj) {
  this._propObj = obj;
};

Game_Picture.prototype.setDragFunction = function (method) {
  this._dragMethod = method;
};

Game_Picture.prototype.saveToFile = function () {
  if (!arrPictures[$gameMap._mapId]) {
    arrPictures[$gameMap._mapId] = { pictures: [], text: [] };
  }
  arrPictures[$gameMap._mapId]["pictures"] = $gameScreen._pictures;
  let fs = require("fs");
  fs.writeFileSync("./data/PictureTool.json", JSON.stringify(arrPictures));
};

Game_Picture.prototype.ShowEditer = function () {
  console.log(this);
};

Game_Picture.prototype.setAnimation = function (method) {
  if (!this._animations) {
    this._animations = [];
  }
  //TODO
};

Game_Picture.prototype.loadData = function () {};

setSystemEditer = (value) => {
  $gameSystem._editer = value;
  if ($gameSystem._editer) {
    $gameScreen._pictures.forEach((element) => {
      element._drag = true;
    });
  }
};

Scene_Base.prototype.loadPicture = function () {
  // let fs = require("fs");
  // let data = fs.readFileSync("./data/PictureTool.json");
  arrPictures = $PictureTool;
  if (arrPictures[$gameMap._mapId]) {
    let pictures = arrPictures[$gameMap._mapId]["pictures"];
    if (pictures) {
      for (let index = 1; index < pictures.length; index++) {
        const pic = pictures[index];
        if (pic) {
          $gameScreen.showPicture(
            index,
            pic._name,
            pic._origin,
            pic._x,
            pic._y,
            pic._scaleX,
            pic._scaleY,
            pic._opacity,
            pic._blendMode
          );

          $gameScreen._pictures[index]._drag = pic._drag;
          $gameScreen._pictures[index]._resetAfterDrag = pic._resetAfterDrag;
          $gameScreen._pictures[index].rotate(pic._rotationSpeed);
          $gameScreen._pictures[index]._onclick = pic._onclick;
          $gameScreen._pictures[index]._dragMethod = pic._dragMethod;
          $gameScreen._pictures[index]._realTimeMethod = pic._realTimeMethod;
          $gameScreen._pictures[index].loadData();
          if ($gameScreen._pictures[index]._name == "btn_green") {
            this._buttonSelect = $gameScreen._pictures[index];
          }
        }
      }
    }
  }
};

Scene_Base.prototype.loadText = function () {
  // let fs = require("fs");
  // let data = fs.readFileSync("./data/TextTool.json");
  parseData = $TextTool;
  if ($gameScreen._texts) {
    for (const key in $gameScreen._texts) {
      if (Object.hasOwnProperty.call($gameScreen._texts, key)) {
        if (parseData[key]) {
          $gameScreen._texts[key] = parseData[key];
          if (!SceneManager._scene[key]) {
            SceneManager._scene[key] = {};
          }
          SceneManager._scene[key]._prop = parseData[key];
          SceneManager._scene[key].width = parseData[key]._width;
          SceneManager._scene[key].height = parseData[key]._height;
          if (parseData[key]._x) {
            SceneManager._scene[key].x = parseData[key]._x;
            SceneManager._scene[key].y = parseData[key]._y;
          }
        }
      }
    }
  }
};

let Game_Player_reserveTransfer = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
  Game_Player_reserveTransfer.call(this, mapId, x, y, d, fadeType);
  // $gameScreen._pictures = [];
};

let $Editer = function () {};
SceneManager.openEditer = () => {
  const gui = require("nw.gui");
  let fs = require("fs");
  const path = require("path");
  if ($Editer._window) {
    if (!$Editer._window.window.closed) {
      $Editer._window.close(true);
      return;
    }
  }
  gui.Window.open(
    "supertoolsengine.html",
    {
      title: "Super Tools Engine - MardSilver",
      width: 555,
      height: 750,
      resizable: false,
      icon: "www/icon/icon.png",
    },
    function (newWindow) {
      $Editer._window = newWindow;
      $Editer._window.setShowInTaskbar(false);
      $Editer.document = $Editer._window.window.document;
      // this.moveWindow();
      // this.setupWindow();
      // this._window.on("loaded", this.onWindowLoad.bind(this));
      setTimeout(() => {
        let divEditer = drawDOM(
          $Editer.document.body,
          "divEditer",
          "div",
          "",
          0,
          0
        );
        $("#divEditer").draggable();
        let header = drawDOM(divEditer, "header", "div", "", 0, 0, true);
        header.innerText = "MardSilver - Editer";

        let selecter = drawDOM(divEditer, "selecter", "select", "", 0, 0, true);
        // let selecter = $Editer.document.getElementById("select");
        selecter.style.zIndex = 4;
        selecter.style.cursor = "pointer";
        let option = drawDOM(selecter, "", "option");
        option.text = "Select Element";
        option.value = "header";
        let pictures = $gameScreen._pictures;

        if (SceneManager._scene.constructor === Scene_Map) {
          for (let index = 0; index < pictures.length; index++) {
            const element = pictures[index];
            if (element) {
              let option = drawDOM(selecter, "option_elm" + index, "option");
              option.text = element._name + " (picture)";
              option.value = "picture_" + index;
            }
          }
        }
        for (const key in SceneManager._scene) {
          if (Object.hasOwnProperty.call(SceneManager._scene, key)) {
            if (key.includes("Sprite_")) {
              let option = drawDOM(selecter, "option_elm" + key, "option");
              option.text = key + " (sprite)";
              option.value = key;
            } else if (key.includes("Window_")) {
              let option = drawDOM(selecter, "option_elm" + key, "option");
              option.text = key + " (window)";
              option.value = key;
            }
          }
        }

        let texts = $gameScreen._texts;
        if (texts) {
          for (const key in texts) {
            if (Object.hasOwnProperty.call(texts, key)) {
              const element = texts[key];
              if (element) {
                let option = drawDOM(selecter, element._id, "option");
                option.text = element._id + " (text)";
                option.value = "text_" + element._id;
              }
            }
          }
        }

        let picture;
        selecter.addEventListener("change", function () {
          var selectedValue = selecter.value;
          let id = selectedValue.split("_")[1];
          if (selectedValue.split("_")[0] == "picture") {
            picture = $gameScreen._pictures[id];
            SceneManager._scene._pictureSelect = picture;
            if ($Editer.document.getElementById("divProperties")) {
              $Editer.document.getElementById("divProperties").remove();
            }
            if (!$Editer.document.getElementById("divProperties")) {
              let divProperties = drawDOM(
                divEditer,
                "divProperties",
                "div",
                "",
                0,
                10
              );
              divProperties.innerHTML =
                '<form id="fromEditer"> <div class="form-group"> <label for="name">Name:</label> <select id="name"> </select> </div><div class="form-group"> <label for="origin">Origin:</label> <input type="number" id="origin" value="0"> </div> <div class="form-group"> <label for="angle">Angle:</label> <input type="text" id="angle" value="0"> </div> <div class="form-group"> <label for="blend">Blend:</label> <input type="number" id="blend" value="0"> </div> <div class="form-group"> <label for="drag">Drag:</label> <select id="drag"> <option value="true">True</option> <option value="false">False</option> </select> </div> <div class="form-group"> <label for="opacity">Opacity:</label> <input type="number" id="opacity" value="1"> </div> <div class="form-group"> <label for="resetdrag">Reset Drag:</label> <select id="resetdrag"> <option value="true">True</option> <option value="false">False</option> </select> </div> <div class="form-group"> <label for="rotationSpeed">Rotation Speed:</label> <input type="number" id="rotationSpeed" value="0"> </div> <div class="form-group"> <label for="scaleX">Scale X:</label> <input type="number" id="scaleX" value="1"> </div> <div class="form-group"> <label for="scaleY">Scale Y:</label> <input type="number" id="scaleY" value="1"> </div> <div class="form-group"> <label for="method">Method:</label> <input type="text" id="method" value=""> </div> <div class="form-group"> <label for="realtimeMethod">Realtime Method:</label> <input type="text" id="realtimeMethod" value=""></div><div class="form-group"> <label for="dragMethod">Drag Method:</label> <input type="text" id="dragMethod" value=""> </div> <input type="submit" value="Submit"> </form>';
            }
            const directoryPath = path.join(
              window.location.pathname.split("/").slice(0, -1).join("/"),
              "img/pictures"
            );

            fs.readdir(directoryPath, (err, files) => {
              if (err) {
                console.log("Error getting directory information:", err);
              } else {
                files.forEach((file) => {
                  filename = file.split(".png")[0];
                  let select = $Editer.document.getElementById("name");
                  let option = drawDOM(select, filename, "option");
                  option.text = filename;
                  option.value = filename;
                  if (filename == picture._name) {
                    select.value = filename;
                  }
                });
              }
            });

            //set data for element
            $Editer.document.getElementById("origin").value = picture._origin;
            $Editer.document.getElementById("angle").value = picture._angle;
            $Editer.document.getElementById("blend").value = picture._blendMode;
            $Editer.document.getElementById("drag").value = picture._drag;
            $Editer.document.getElementById("opacity").value = picture._opacity;
            if (picture._resetAfterDrag) {
              $Editer.document.getElementById("resetdrag").value =
                picture._resetAfterDrag;
            } else {
              $Editer.document.getElementById("resetdrag").value = false;
            }

            $Editer.document.getElementById("rotationSpeed").value =
              picture._rotationSpeed;
            $Editer.document.getElementById("scaleX").value = picture._scaleX;
            $Editer.document.getElementById("scaleY").value = picture._scaleY;
            $Editer.document.getElementById("method").value = picture._onclick;
            $Editer.document.getElementById("realtimeMethod").value =
              picture._realTimeMethod;
            $Editer.document.getElementById("dragMethod").value =
              picture._dragMethod;

            //Get data from Element
            let fromEditer = $Editer.document.getElementById("fromEditer");
            fromEditer.addEventListener("submit", (e) => {
              e.preventDefault();
              console.log(id);
              console.log(picture);
              picture._name = $Editer.document.getElementById("name").value;
              picture._origin = parseInt(
                $Editer.document.getElementById("origin").value
              );
              picture._angle = parseInt(
                $Editer.document.getElementById("angle").value
              );
              picture._blendMode = parseInt(
                $Editer.document.getElementById("blend").value
              );
              picture._drag =
                $Editer.document.getElementById("drag").value === "true";
              picture._opacity = parseInt(
                $Editer.document.getElementById("opacity").value
              );
              picture._resetAfterDrag =
                $Editer.document.getElementById("resetdrag").value === "true";
              picture._rotationSpeed = parseInt(
                $Editer.document.getElementById("rotationSpeed").value
              );
              picture._scaleX = parseInt(
                $Editer.document.getElementById("scaleX").value
              );
              picture._scaleY = parseInt(
                $Editer.document.getElementById("scaleY").value
              );
              picture._onclick =
                $Editer.document.getElementById("method").value;
              picture._realTimeMethod =
                $Editer.document.getElementById("realtimeMethod").value;
              picture._dragMethod =
                $Editer.document.getElementById("dragMethod").value;
              picture.saveToFile();
              openEditer();
              SceneManager._scene._pictureSelect = null;

              setTimeout(() => {
                openEditer();
              }, 150);

              // handle submit
            });
          } else if (
            selectedValue.split("_")[0] == "Sprite" ||
            selectedValue.split("_")[0] == "Window"
          ) {
            SceneManager._scene._pictureSelect =
              SceneManager._scene[selectedValue];
          } else {
            SceneManager._scene._pictureSelect = null;
            let wdtext = $gameScreen._texts[id];
            SceneManager._scene._wdTextSelect = wdtext;
            if ($Editer.document.getElementById("divProperties")) {
              $Editer.document.getElementById("divProperties").remove();
            }

            let divProperties = drawDOM(
              divEditer,
              "divProperties",
              "div",
              "",
              0,
              10
            );
            divProperties.innerHTML =
              '<form id="fromEditer"> <div class="form-group"> <label for="text">Text:</label> <input type="text" id="text" value="0" /> </div> <div class="form-group"> <label for="color">Color:</label> <input type="text" id="color" value="0" /> </div> <div class="form-group"> <label for="align">Align:</label> <input type="text" id="align" value="0" /> </div> <div class="form-group"> <label for="font">Font:</label> <input type="text" id="font" value="0" /> </div> <div class="form-group"> <label for="fontSize">Font Size:</label> <input type="number" id="fontSize" value="0" /> </div> <div class="form-group"> <label for="width">Width:</label> <input type="number" id="width" value="0" /> </div> <div class="form-group"> <label for="height">Height:</label> <input type="number" id="height" value="0" /> </div> <div class="form-group"> <label for="bg">BG:</label> <select id="bg"></select> </div> <div class="form-group"> <label for="drag">Drag:</label> <select id="drag"> <option value="true">True</option> <option value="false">False</option> </select> </div> <div class="form-group"> <label for="resetdrag">Reset Drag:</label> <select id="resetdrag"> <option value="true">True</option> <option value="false">False</option> </select> </div> <div class="form-group"> <label for="method">Method:</label> <input type="text" id="method" value="" /> </div> <div class="form-group"> <label for="realtimeMethod">Realtime Method:</label> <input type="text" id="realtimeMethod" value="" /> </div> <div class="form-group"> <label for="dragMethod">Drag Method:</label> <input type="text" id="dragMethod" value="" /> </div> <input type="submit" value="Submit" /> </form>';
            const directoryPath = path.join(
              window.location.pathname.split("/").slice(0, -1).join("/"),
              "img/pictures"
            );

            fs.readdir(directoryPath, (err, files) => {
              if (err) {
                console.log("Error getting directory information:", err);
              } else {
                files.forEach((file) => {
                  filename = file.split(".png")[0];
                  let select = $Editer.document.getElementById("bg");
                  let option = drawDOM(select, filename, "option");
                  option.text = filename;
                  option.value = filename;
                  if (filename == picture._name) {
                    select.value = filename;
                  }
                });
              }
            });

            //set data for element
            $Editer.document.getElementById("text").value = wdtext._text;
            $Editer.document.getElementById("color").value = wdtext._color;
            $Editer.document.getElementById("align").value = wdtext._align;
            $Editer.document.getElementById("font").value = wdtext._font;
            $Editer.document.getElementById("fontSize").value =
              wdtext._fontSize;
            $Editer.document.getElementById("width").value = wdtext._width;
            $Editer.document.getElementById("height").value = wdtext._height;
            $Editer.document.getElementById("bg").value = wdtext._bg;
            if (wdtext._drag) {
              $Editer.document.getElementById("drag").value = wdtext._drag;
            } else {
              $Editer.document.getElementById("drag").value = false;
            }
            if (wdtext._resetAfterDrag) {
              $Editer.document.getElementById("resetdrag").value =
                wdtext._resetAfterDrag;
            } else {
              $Editer.document.getElementById("resetdrag").value = false;
            }

            $Editer.document.getElementById("method").value = wdtext._onclick;
            $Editer.document.getElementById("realtimeMethod").value =
              wdtext._realTimeMethod;
            $Editer.document.getElementById("dragMethod").value =
              wdtext._dragMethod;

            //Get data from Element
            let fromEditer = $Editer.document.getElementById("fromEditer");
            fromEditer.addEventListener("submit", (e) => {
              e.preventDefault();
              SceneManager._scene[wdtext._id]._prop._bg =
                $Editer.document.getElementById("bg").value;
              SceneManager._scene[wdtext._id]._prop._text =
                $Editer.document.getElementById("text").value;
              SceneManager._scene[wdtext._id]._prop._color =
                $Editer.document.getElementById("color").value;
              SceneManager._scene[wdtext._id]._prop._align =
                $Editer.document.getElementById("align").value;
              SceneManager._scene[wdtext._id]._prop._font =
                $Editer.document.getElementById("font").value;
              SceneManager._scene[wdtext._id]._prop._fontSize = parseInt(
                $Editer.document.getElementById("fontSize").value
              );
              SceneManager._scene[wdtext._id].width = SceneManager._scene[
                wdtext._id
              ]._prop._width = parseInt(
                $Editer.document.getElementById("width").value
              );
              SceneManager._scene[wdtext._id].height = SceneManager._scene[
                wdtext._id
              ]._prop._height = parseInt(
                $Editer.document.getElementById("height").value
              );
              SceneManager._scene[wdtext._id]._prop._drag =
                $Editer.document.getElementById("drag").value === "true";
              SceneManager._scene[wdtext._id]._prop._resetAfterDrag =
                $Editer.document.getElementById("resetdrag").value === "true";
              SceneManager._scene[wdtext._id]._prop._onclick =
                $Editer.document.getElementById("method").value;
              SceneManager._scene[wdtext._id]._prop._realTimeMethod =
                $Editer.document.getElementById("realtimeMethod").value;
              SceneManager._scene[wdtext._id]._prop._dragMethod =
                $Editer.document.getElementById("dragMethod").value;
              SceneManager._scene[wdtext._id].saveToFile();
              openEditer();
              SceneManager._scene._wdTextSelect = null;

              setTimeout(() => {
                openEditer();
              }, 150);

              // handle submit
            });
          }
        });
      }, 100);
    }.bind(this)
  );
  // createContent();
};

//Controler
//=============================================================================
// Button
//=============================================================================
Sprite_Button.prototype.processTouch = function () {
  if (this.isActive()) {
    if (TouchInput.isTriggered() && this.isButtonTouched()) {
      this._touching = true;
    }
    // else if (TouchInput.isTriggered()) {
    //   console.log("cant touch");
    //   this.focus = false;
    // }

    /**For drag */
    if ($gameSystem._editer && this == SceneManager._scene._pictureSelect) {
      if (this._touching) {
        this.x = TouchInput._x - this.width / 2;
        this.y = TouchInput._y - this.height / 2;
      } else {
        if (this._resetWhenDrop) {
          this.x = this._X;
          this.y = this._Y;
        }
      }
    }

    if (this._touching) {
      if (TouchInput.isReleased() || !this.isButtonTouched()) {
        this._touching = false;
        if (TouchInput.isReleased()) {
          this.callClickHandler();
          if (
            $gameSystem._editer &&
            this == SceneManager._scene._pictureSelect
          ) {
            console.log(this.x);
            console.log(this.y);
          }
        }
      }
    }
  } else {
    this._touching = false;
  }
};

Sprite_Button.prototype.setDrag = function (func) {
  this._dragfunction = func;
};

Sprite_Button.prototype.setDrop = function (func) {
  this._dropfunction = func;
};

Sprite_Button.prototype.setResetOnDrop = function (b) {
  this._resetWhenDrop = b;
};

Window_Base.prototype.createSpriteButton = function (
  symbol,
  filename,
  x,
  y,
  onClick,
  text,
  color
) {
  let bitmap = ImageManager.loadPicture(filename);
  this["_" + symbol] = new Sprite_Button();
  if (bitmap) {
    this["_" + symbol].bitmap = bitmap;
  }
  this["_" + symbol].x = x;
  this["_" + symbol].y = y;
  this["_" + symbol]._X = x;
  this["_" + symbol]._Y = y;
  this["_" + symbol].setClickHandler(onClick);
  this["_" + symbol]._id = "_" + symbol;
  this.addChild(this["_" + symbol]);
  if (text) {
    this["_" + symbol].bitmap.addLoadListener(
      function () {
        bitmap.drawText(text, x, y, bitmap.width, bitmap.height, "center");
      }.bind(this)
    );
  }
};

/**
 * Window Text
 */
Scene_Base.prototype.drawText = function (
  parent,
  id,
  text,
  color,
  x,
  y,
  width,
  height,
  align
) {
  this[id] = new Window_Text(x, y, width, height);
  this[id]._prop = {
    _id: id,
    _text: text,
    _color: color,
    _width: width,
    _height: height,
    _align: align,
    _x: x,
    _y: y,
  };
  if (!$gameScreen._texts) {
    $gameScreen._texts = {};
  }
  $gameScreen._texts[id] = this[id]._prop;
  this.addChild(this[id]);
  return this[id];
};

function Window_Text() {
  this.initialize.apply(this, arguments);
}

Window_Text.prototype = Object.create(Window_Base.prototype);
Window_Text.prototype.constructor = Window_Text;

Window_Text.prototype.initialize = function (x, y, width, height) {
  Window_Base.prototype.initialize.call(this, x, y, width, height);
  this.padding = 0;
};

Window_Text.prototype.update = function () {
  Window_Base.prototype.update.call(this);
  if (
    TouchInput.x > this.x &&
    TouchInput.y > this.y &&
    TouchInput.x < this.x + this.width &&
    TouchInput.y < this.y + this.height
  ) {
    if (TouchInput.isTriggered() || TouchInput.isPressed()) {
      if (this._prop._drag || $gameSystem._editer) {
        if (SceneManager._scene._wdTextSelect) {
          if (SceneManager._scene._wdTextSelect._id == this._prop._id) {
            this.x = TouchInput.x - this.width / 2;
            this.y = TouchInput.y - this.height / 2;
            if ($gameSystem._editer) {
              this._prop._x = this.x;
              this._prop._y = this.y;
              this.saveToFile();
            }
          }
        }
      }
    }
  }
  if (this._prop._realTimeMethod) {
    try {
      this._realTimemethod();
    } catch (error) {
      eval(this._prop._realTimeMethod);
    }
  }
  // if (this._linked) {
  //   this.x += this._linked._x;
  //   this.y += this._linked._y;
  // }
  this.drawItem();
};

Window_Text.prototype.drawItem = function () {
  this.contents.clear();
  if (this._prop._fontSize) {
    this.contents.fontSize = this._prop._fontSize;
  }
  if (this._prop._color) {
    this.changeTextColor(this._prop._color);
  }
  this.drawText(
    this._prop._text,
    0,
    this._prop._height / 2 - this.lineHeight() / 2,
    this._prop._width,
    this._prop._align
  );
};

Window_Text.prototype.setLinkComponent = function (obj) {
  this._linked = obj;
};

Window_Text.prototype.setText = function (value) {
  this._text = value;
};
Window_Text.prototype.setFontSize = function (value) {
  this._fontSize = value;
};

Window_Text.prototype.textPadding = function () {
  return 6;
};

Window_Text.prototype.saveToFile = function () {
  const fs = require("fs");
  $gameScreen._texts[this._prop._id] = this._prop;
  fs.writeFileSync("./data/TextTool.json", JSON.stringify($gameScreen._texts));
};

/**
 * Window Edittext
 */
Scene_Base.prototype.drawEditText = function (
  parent,
  id,
  text,
  color,
  x,
  y,
  width,
  height,
  align
) {
  parent[id] = new Window_EditText(x, y, width, height);
  parent[id]._text = text;
  parent[id]._color = color;
  parent[id]._align = align;
  parent.addChild(parent[id]);
  return parent[id];
};
function Window_EditText() {
  this.initialize.apply(this, arguments);
}

Window_EditText.prototype = Object.create(Window_Base.prototype);
Window_EditText.prototype.constructor = Window_EditText;

Window_EditText.prototype.initialize = function (x, y, width, height) {
  Window_Base.prototype.initialize.call(this, x, y, width, height);
  this.padding = 0;
  // this.deactivate();
};

Window_EditText.prototype.update = function () {
  Window_Base.prototype.update.call(this);
  if (
    TouchInput.x > this.x &&
    TouchInput.y > this.y &&
    TouchInput.x < this.x + this.width &&
    TouchInput.y < this.y + this.height
  ) {
    if (TouchInput.isTriggered() && this._drag) {
      //TODO
    }
    if (TouchInput.isTriggered()) {
      this.focus = true;
    }
  } else {
    this.focus = false;
  }
  if (this.focus) {
    let that = this;
    document.addEventListener("keyup", function (event) {
      const keyCode = event.keyCode || event.which;
      let str = event.key;
      if (
        (keyCode >= 65 && keyCode <= 90) || // các ký tự in hoa và in thường
        (keyCode >= 97 && keyCode < 112) || // các ký tự in hoa và in thường
        (keyCode >= 48 && keyCode <= 57) || // các số trên bàn phím chữ số
        keyCode == 32 || // phím cách
        keyCode == 43 || // dấu cộng
        keyCode == 45 || // dấu trừ
        keyCode == 95 || // gạch ngang
        (keyCode >= 32 && keyCode <= 47) || // các ký tự đặc biệt từ khoảng 32 đến 47
        (keyCode >= 58 && keyCode <= 64) || // các ký tự đặc biệt từ khoảng 58 đến 64
        (keyCode >= 91 && keyCode <= 96) || // các ký tự đặc biệt từ khoảng 91 đến 96
        (keyCode > 123 && keyCode <= 126)
      ) {
        if (that._text != str) {
          that._text += str;
          // let imgName = that.bitmap.imgName;
          // //   that.bitmap.clear();
          // let bitmap = ImageManager.loadSystem(imgName);
          // //   that.bitmap = bitmap;
          // that.bitmap.drawText(event.key, 0, 0, 96, 50, "center");
        }
      }
    });
  }
  if (this._realTimemethod) {
    this._realTimemethod();
  }
  // if (this._linked) {
  //   this.x += this._linked._x;
  //   this.y += this._linked._y;
  // }
  this.drawItem();
};

Window_EditText.prototype.drawItem = function () {
  this.contents.clear();
  this.contents.fontSize = 20;
  if (this._fontSize) {
    this.contents.fontSize = this._fontSize;
  }
  if (this._color) {
    this.changeTextColor(this._color);
  }
  this.drawText(
    this._text,
    0,
    this.height / 2 - this.lineHeight() / 2,
    this.width,
    this._align
  );
};

Window_EditText.prototype.setLinkComponent = function (obj) {
  this._linked = obj;
};

Window_EditText.prototype.setText = function (value) {
  this._text = value;
};
Window_EditText.prototype.setFontSize = function (value) {
  this._fontSize = value;
};

Window_EditText.prototype.textPadding = function () {
  return 6;
};
