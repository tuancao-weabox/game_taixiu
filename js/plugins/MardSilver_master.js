Scene_Base.prototype.setGravitation = function (obj) {
  if (!this._gravitation) {
    this._gravitation = [];
  }
  this._gravitation.push(obj);
};

Scene_Base.prototype.setCollision = function (obj1, obj2, func) {
  if (!this._collision) {
    this._collision = [];
  }
  this._collision.push({ sprite1: obj1, sprite2: obj2, func: func });
};

Scene_Base.prototype.collisionShapeRectangle = function (sprite) {
  var shape = {
    x: sprite._realX,
    y: sprite._realY,
    width: sprite.width,
    height: sprite.height,
  };
  return shape;
};

Scene_Base.prototype.isColliding = function (sprite1, sprite2) {
  if (sprite1 && sprite2) {
    var sprite1Shape = this.collisionShapeCircle(sprite1);
    var sprite2Shape = this.collisionShapeCircle(sprite2);
    // Kiểm tra xem sprite1 và sprite2 có giao nhau không
    if (sprite1Shape.x == sprite2Shape.x && sprite1Shape.y == sprite2Shape.y) {
      return true;
    }

    var dx = Math.abs(sprite1Shape.x - sprite2Shape.x);
    var dy = Math.abs(sprite1Shape.y - sprite2Shape.y);
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= sprite1Shape.width / 64 + sprite2Shape.width / 64 - 1) {
      return true;
    }
  }

  return false;
};

Scene_Base.prototype.collisionShapeCircle = function (sprite) {
  var radius = sprite.width / 2;
  var centerX = sprite._realX + radius;
  var centerY = sprite._realY + radius;
  var shape = {
    x: centerX - radius,
    y: centerY - radius,
    width: radius * 2,
    height: radius * 2,
  };
  return shape;
};

var alias_update_Scene_Base = Scene_Base.prototype.update;
Scene_Base.prototype.update = function () {
  alias_update_Scene_Base.call(this);
  if (this._gravitation) {
    this._gravitation.forEach((obj) => {
      if (obj._y) {
        obj._y = window.innerHeight;
      } else if (obj.y) {
        obj.y = window.innerHeight;
      }
    });
  }
  if (this._collision) {
    this._collision.forEach((obj) => {
      if (this.isColliding(obj.sprite1, obj.sprite2)) {
        obj.func();
      }
    });
  }
};
