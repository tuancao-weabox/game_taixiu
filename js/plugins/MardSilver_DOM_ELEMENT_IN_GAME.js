function createTextPictureBitmap(text) {
  const tempWindow = new Window_Base(new Rectangle());
  const size = tempWindow.textSizeEx(text);
  tempWindow.padding = 0;
  tempWindow.move(0, 0, size.width, size.height);
  tempWindow.createContents();
  tempWindow.drawTextEx(text, 0, 0, 0);
  const bitmap = tempWindow.contents;
  tempWindow.contents = null;
  tempWindow.destroy();
  bitmap.mzkp_isTextPicture = true;
  return bitmap;
}

function destroyTextPictureBitmap(bitmap) {
  if (bitmap && bitmap.mzkp_isTextPicture) {
    bitmap.destroy();
  }
}
//=============================================================================
// Edit
//=============================================================================
Window_Base.prototype.createSpriteEdit = function (
  symbol,
  img,
  x,
  y,
  placeholder,
  color
) {
  let bitmap = ImageManager.loadSystem(img);
  bitmap.drawText(placeholder, 0, 0, 96, 50, "center");
  console.log(bitmap);
  this["_" + symbol] = new Sprite_Button();
  this["_" + symbol].bitmap = bitmap;
  this["_" + symbol].x = x;
  this["_" + symbol].y = y;
  this["_" + symbol].imgName = img;
  this["_" + symbol].setClickHandler(onInput);
  this.addChild(this["_" + symbol]);
  if (placeholder) {
    this.changeTextColor(color);
    // this.drawText(placeholder, x, y + 5, 96, "center");
    // this["_" + symbol].bitmap.drawText(placeholder, 0, 0, 96, 50, "center");
  }

  let that = this;
  function onInput() {
    console.log("input");
    that["_" + symbol].focus = true;
  }
};

let alias_edit_update = Sprite_Button.prototype.update;
Sprite_Button.prototype.update = function () {
  alias_edit_update.call(this);
  if (this.focus) {
    let that = this;
    document.addEventListener("keydown", function (event) {
      //   console.log(event.key);
      let str = event.key;
      if (that._text != str) {
        that._text = str;
        let imgName = that.bitmap.imgName;
        //   that.bitmap.clear();
        let bitmap = ImageManager.loadSystem(imgName);
        //   that.bitmap = bitmap;
        that.bitmap.drawText(event.key, 0, 0, 96, 50, "center");
      }
    });
  }
};

Sprite_Button.prototype.processTouch = function () {
  if (this.isActive()) {
    if (TouchInput.isTriggered() && this.isButtonTouched()) {
      this._touching = true;
    } else if (TouchInput.isTriggered()) {
      console.log("cant touch");
      this.focus = false;
    }
    if (this._touching) {
      if (TouchInput.isReleased() || !this.isButtonTouched()) {
        this._touching = false;
        if (TouchInput.isReleased()) {
          this.callClickHandler();
        }
      }
    }
  } else {
    this._touching = false;
  }
};
//=============================================================================
// Button
//=============================================================================
Window_Base.prototype.createSpriteButton = function (
  symbol,
  x,
  y,
  onClick,
  isButtonFromText,
  color
) {
  let bitmap;
  if (isButtonFromText) {
    // const rect = this.baseTextRect();
    // this.addInnerChild(this["_" + symbol]);
    // this.drawTextEx(text, x + text.length/2, y + 5, rect.width, MSCW.color);
    this.changeTextColor(color);
    this.drawText(isButtonFromText, x, y + 5, 96, "center");
  } else {
    bitmap = ImageManager.loadSystem(symbol);
  }

  this["_" + symbol] = new Sprite_Button();
  if (bitmap) {
    this["_" + symbol].bitmap = bitmap;
  }
  this["_" + symbol].x = x;
  this["_" + symbol].y = y;
  this["_" + symbol].setClickHandler(onClick);
  this.addChild(this["_" + symbol]);
};
