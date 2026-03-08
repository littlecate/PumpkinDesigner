/**
 * 继承工具与舞台管理类
 * 提供类继承机制、舞台管理和物件基类
 */
"use strict";

/**
 * 类继承工具函数
 * @param {Function} subClass - 子类构造函数
 * @param {Function} supClass - 超类构造函数
 * @returns {Function} 继承后的子类
 */
function extend(subClass, supClass) {
  var AbstractMethod = {};
  for (var i in supClass.prototype) {
    if (supClass.prototype[i] === extend.AbstractMethod) {
      AbstractMethod[i] = true;
    }
  }

  for (var i in subClass.prototype) {
    if (AbstractMethod[i] && subClass.prototype[i] === extend.AbstractMethod) {
      throw new Error(i + " Method is not Implemented!");
    }
  }

  var supClassPrototype = supClass.prototype;

  subClass.prototype = Object.create(supClassPrototype);
  subClass.prototype.constructor = subClass;

  subClass.prototype.$supClass = function (methodName, ...args) {
    if (typeof supClassPrototype[methodName] === "function") {
      supClassPrototype[methodName].apply(this, args);
    } else {
      throw new Error(methodName + " Method does not exist in SuperClass!");
    }
  };

  Object.keys(subClass.prototype).forEach(function (key) {
    if (key !== "constructor" && key !== "$supClass") {
      subClass.prototype[key] = subClass.prototype[key];
    }
  });

  subClass.$supClass = supClass;

  return subClass;
}

/**
 * 抽象方法标记
 */
extend.AbstractMethod = function () {};

/**
 * 舞台类 - 管理画布和物件
 * @param {CanvasRenderingContext2D} cacheCanvas - 缓存画布上下文
 * @param {Object} canvas - 画布对象
 * @param {boolean} isNeedMouseMoveEvent - 是否需要鼠标移动事件
 */
function Stage(cacheCanvas, canvas, isNeedMouseMoveEvent) {
  this.cacheCanvas = cacheCanvas;
  this.canvas = canvas;
  this.isNeedMouseMoveEvent = isNeedMouseMoveEvent || false;
  this.node = canvas.canvas;
  this.parentEl = this.node.parentElement;
  this.height = this.node.height;
  this.width = this.node.width;
  this.thing = [];
  this.models = [];
  this.fps = 1000 / 60;
  this.lasttime = new Date();
  this.onEnterFrame = [];
  if (typeof options === "object") this.setOption(options);
  this.init();
}

Stage.prototype = {
  /**
   * 初始化舞台
   */
  init: function () {
    this.BuildEvent();
    var me = this;
    setInterval(function () {
      for (var i = 0, len = me.onEnterFrame.length; i < len; i++) {
        typeof me.onEnterFrame[i] == "function" && me.onEnterFrame[i].call(me);
      }
    }, this.fps);
    this.showFPS();
  },

  /**
   * 添加一个物件到舞台
   * @param {Object} thing - 要添加的物件
   * @returns {Stage} 舞台实例
   */
  add: function (thing) {
    if (!thing) return this;
    this.thing.push(thing);
    thing.setStage(this);
    this.draw();
  },

  /**
   * 添加一个模型到舞台
   * @param {Object} model - 要添加的模型
   */
  addModel: function (model) {
    this.models.push(model);
  },

  /**
   * 从舞台移除一个物件
   * @param {Object} thing - 要移除的物件
   */
  remove: function (thing) {
    var me = this;
    me.thing.RemoveAll(function (p) {
      return p.id == thing.id;
    });
    thing = null;
  },

  /**
   * 移除舞台上的所有物件
   */
  removeAll: function () {
    var me = this;
    for (var i = me.thing.length - 1; i >= 0; i--) {
      var t = me.thing.splice(i, 1);
      t = null;
    }
    me.thing = [];
  },

  /**
   * 绘制未绘制的物件
   */
  draw: function () {
    var me = this;
    for (var i = 0; i < me.thing.length; i++) {
      if (!me.thing[i]._isDrawed) {
        me.thing[i].draw(me.cacheCanvas, me.canvas);
      }
    }
  },

  /**
   * 检查所有未绘制的物件是否准备好绘制
   * @param {Stage} me - 舞台实例
   * @returns {boolean} 是否都准备好
   */
  isAllNotDrawedThingsReadyToDraw: function (me) {
    for (var i = 0; i < me.thing.length; i++) {
      if (!me.thing[i]._isDrawed && !me.thing[i]._isReadyToDraw) {
        return false;
      }
    }
    return true;
  },

  /**
   * 重新绘制所有物件和模型
   */
  redraw: function () {
    this.cacheCanvas.clearRect(0, 0, this.width, this.height);
    var i;
    for (i = 0, len = this.thing.length; i < len; i++) {
      this.thing[i].draw(this.cacheCanvas);
    }
    for (i = 0, len = this.models.length; i < len; i++) {
      this.models[i].draw(this.cacheCanvas);
    }
  },

  /**
   * 重新绘制指定ID的物件
   * @param {string} id - 物件ID
   */
  redrawOneThing: function (id) {
    for (var i = 0; i < this.thing.length; i++) {
      if (this.thing[i].id == id) {
        this.thing[i].draw(this.cacheCanvas);
        break;
      }
    }
  },

  /**
   * 重新绘制指定物件
   * @param {Object} thing - 要绘制的物件
   */
  redrawOneThing2: function (thing) {
    thing.draw(this.cacheCanvas);
  },

  /**
   * 根据ID获取物件
   * @param {string} id - 物件ID
   * @returns {Object|null} 找到的物件或null
   */
  getThingById: function (id) {
    for (var i = 0; i < this.thing.length; i++) {
      if (this.thing[i].id == id) {
        return this.thing[i];
      }
    }
    return null;
  },

  /**
   * 绑定事件及派发事件
   */
  BuildEvent: function () {
    var stage = this;
    this.node.addEventListener(
      "click",
      function (event) {
        var pos = stage.getMousePosition(event.clientX, event.clientY);
        var thing = stage.thing;
        for (var i = thing.length - 1; i >= 0; i--) {
          if (thing[i].isScope(pos.x, pos.y)) {
            thing[i].onClick(pos);
            break;
          }
        }
      },
      false
    );
    this.node.addEventListener(
      "dblclick",
      function (event) {
        var pos = stage.getMousePosition(event.clientX, event.clientY);
        var thing = stage.thing;
        for (var i = thing.length - 1; i >= 0; i--) {
          if (thing[i].isScope(pos.x, pos.y)) {
            thing[i].onDblClick(pos);
            break;
          }
        }
      },
      false
    );
    this.node.addEventListener(
      "mousemove",
      function (event) {
        event.preventDefault();
        var pos = stage.getMousePosition(event.clientX, event.clientY);
        var thing = stage.thing;
        for (var i = thing.length - 1; i >= 0; i--) {
          if (
            thing[i].isScope(pos.x, pos.y) &&
            !thing[i].getMouseState() &&
            "onMouseOver" in thing[i]
          ) {
            thing[i].onMouseOver(event, pos);
            thing[i].setMouseState(true, pos);
            break;
          } else if (
            !thing[i].isScope(pos.x, pos.y) &&
            thing[i].getMouseState() &&
            "onMouseOut" in thing[i]
          ) {
            thing[i].onMouseOut(event, pos);
            thing[i].setMouseState(false, pos);
            break;
          }
        }
      },
      false
    );
    this.node.addEventListener(
      "mouseout",
      function (event) {
        document.body.style.cursor = "default";
      },
      false
    );
    this.node.addEventListener(
      "mousedown",
      function (event) {
        var buttonCode = getButtonCode(event);
        if (buttonCode == 0) {
          var pos = stage.getMousePosition(event.clientX, event.clientY);
          var thing = stage.thing;
          for (var i = thing.length - 1; i >= 0; i--) {
            if (thing[i].isScope(pos.x, pos.y) && "onMouseDown" in thing[i]) {
              thing[i].onMouseDown(event, pos);
              break;
            }
          }
        }
      },
      false
    );
    this.node.addEventListener(
      "mouseup",
      function (event) {
        var buttonCode = getButtonCode(event);
        if (buttonCode == 0) {
          var pos = stage.getMousePosition(event.clientX, event.clientY);
          var thing = stage.thing;
          for (var i = thing.length - 1; i >= 0; i--) {
            if (
              (thing[i].isScope(pos.x, pos.y) || thing[i].isMouseDown) &&
              "onMouseUp" in thing[i]
            ) {
              thing[i].onMouseUp(event, pos);
            }
          }
        }
      },
      false
    );
    this.node.addEventListener(
      "keyup",
      function (event) {
        var pos = stage.getMousePosition(event.clientX, event.clientY);
        var thing = stage.thing;
        for (var i = thing.length - 1; i >= 0; i--) {
          if (thing[i].isScope(pos.x, pos.y) && "onKeyUp" in thing[i]) {
            thing[i].onKeyUp(event, pos);
            event.preventDefault();
            event.stopPropagation();
            break;
          }
        }
      },
      false
    );
    var scrollFunc = function (event) {
      var pos = stage.getMousePosition(event.clientX, event.clientY);
      var thing = stage.thing;
      for (var i = thing.length - 1; i >= 0; i--) {
        if (thing[i].isScope(pos.x, pos.y) && "onMouseWheel" in thing[i]) {
          thing[i].onMouseWheel(event, pos);
          break;
        }
      }
    };
    var contextmenuFunc = function (event) {
      var pos = stage.getMousePosition(event.clientX, event.clientY);
      var pos1 = { x: event.clientX, y: event.clientY };
      var thing = stage.thing;
      for (var i = thing.length - 1; i >= 0; i--) {
        if (thing[i].isScope(pos.x, pos.y) && "onContextmenu" in thing[i]) {
          thing[i].onContextmenu(event, pos1);
          event.preventDefault();
          event.stopPropagation();
          break;
        }
      }
    };
    this.node.addEventListener("DOMMouseScroll", scrollFunc, false);
    this.node.addEventListener("contextmenu", contextmenuFunc, false);
    this.node.onmousewheel = scrollFunc;
  },

  /**
   * 添加事件监听
   * @param {string} type - 事件类型
   * @param {Function} handler - 事件处理函数
   */
  addEvent: function (type, handler) {
    switch (type) {
      case "onEnterFrame":
        this.onEnterFrame.push(handler);
        break;
    }
  },

  /**
   * 获取鼠标相对于cacheCanvas的位置
   * @param {number} clientX - 客户端X坐标
   * @param {number} clientY - 客户端Y坐标
   * @returns {Object} 包含x和y的位置对象
   */
  getMousePosition: function (clientX, clientY) {
    var t = Comman.getMousePosition(this.parentEl, clientX, clientY);
    var t1 = Number(this.node.style.top.replace("px", "")) || 0;
    var t2 = Number(this.node.style.left.replace("px", "")) || 0;
    t.y -= t1;
    t.x -= t2;
    return t;
  },

  /**
   * 测试一个物件是否碰到边界
   * @param {Object} thing - 要测试的物件
   * @returns {boolean} 是否在边界内
   */
  testOutBorder: function (thing) {
    var isInBorder = true;
    if (thing.x + thing.width / 2 > this.width) {
      isInBorder = false;
    }
    if (thing.x - thing.width / 2 < 0) {
      isInBorder = false;
    }
    if (thing.y + thing.height / 2 > this.height) {
      isInBorder = false;
    }
    if (thing.y - thing.height / 2 < 0) {
      isInBorder = false;
    }
    return isInBorder;
  },

  /**
   * 判断两个物件是否有碰撞（物理碰撞）
   * @param {Object} one - 第一个物件
   * @param {Object} two - 第二个物件
   */
  testOverlap: function (one, two) {
    var x = two.x - one.x,
      y = two.y - one.y,
      l = Math.sqrt(x * x + y * y),
      angle,
      radian;
    if (one.radius + two.radius >= l) {
      radian = Math.atan2(y, x);
      var sin = Math.sin(radian);
      var cos = Math.cos(radian);
      var pos0 = { x: 0, y: 0 };

      var pos1 = this.rotate(x, y, sin, cos, true);
      var vel0 = this.rotate(one.ax, one.ay, sin, cos, true);
      var vel1 = this.rotate(two.ax, two.ay, sin, cos, true);

      var vxTotal = vel0.x - vel1.x;
      vel0.x =
        ((one.mass - two.mass) * vel0.x + 2 * one.mass * vel1.x) /
        (one.mass + two.mass);

      vel1.x = vxTotal + vel0.x;
      var absV = Math.abs(vel0.x) + Math.abs(vel1.x);
      var overlap = one.radius + two.radius - Math.abs(pos0.x - pos1.x);

      pos0.x += (vel0.x / absV) * overlap;
      pos1.x += (vel1.x / absV) * overlap;
      var pos0f = this.rotate(pos0.x, pos0.y, sin, cos, false);
      var pos1f = this.rotate(pos1.x, pos1.y, sin, cos, false);
      two.x = one.x + pos1f.x;
      two.y = one.y + pos1f.y;
      one.x = one.x + pos0f.x;
      one.y = one.y + pos0f.y;

      var vel0f = this.rotate(vel0.x, vel0.y, sin, cos, false);
      var vel1f = this.rotate(vel1.x, vel1.y, sin, cos, false);
      one.ax = vel0f.x;
      one.ay = vel0f.y;
      two.ax = vel1f.x;
      two.ay = vel1f.y;
    }
  },

  /**
   * 获得改变角度后的位置
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @param {number} sin - 正弦值
   * @param {number} cos - 余弦值
   * @param {boolean} reverse - 是否反向旋转
   * @returns {Object} 旋转后的位置
   */
  rotate: function (x, y, sin, cos, reverse) {
    var result = {};
    if (reverse) {
      result.x = x * cos + y * sin;
      result.y = y * cos - x * sin;
    } else {
      result.x = x * cos - y * sin;
      result.y = y * cos + x * sin;
    }
    return result;
  },

  /**
   * 显示FPS（仅用于调试）
   */
  showFPS: function () {
    var me = this;
    var fps = {
      draw: function (cacheCanvas) {
        var now = new Date();
        cacheCanvas.save();
        cacheCanvas.fillStyle = "#ccc";
        cacheCanvas.font = "15px 微软雅黑";
        cacheCanvas.fillText("拽拽小球看看", 10, 20);
        cacheCanvas.restore();
        me.lasttime = new Date();
      },
    };

    this.addModel(fps);
  },
};

/**
 * 物件抽象基类
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 */
function Thing(x, y) {
  this.stage = null;
  this.x = x;
  this.y = y;
  this.vx = x;
  this.vy = y;
  this.width = null;
  this.height = null;
  this.MouseLastState = false;
  this.MouseLastPos = null;
  this.onClickList = [];
  this.onDblClickList = [];
  this.onMouseOverList = [];
  this.onMouseOutList = [];
  this.onMouseMoveList = [];
  this.onMouseDownList = [];
  this.onMouseUpList = [];
  this.onKeyUpList = [];
  this.onMouseWheelList = [];
  this.onContextmenuList = [];
  this.preImageData = null;
  this.preImageDataObj = {};
  this.myRedrawTimeout = 0;
}

Thing.prototype = {
  /**
   * 抽象方法：绘制物件
   */
  draw: extend.AbstractMethod,

  /**
   * 抽象方法：检查坐标是否在物件范围内
   */
  isScope: extend.AbstractMethod,

  /**
   * 存储物件区域的图像数据
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  storePreImageDataSquare: function (ctx) {
    try {
      this.preImageData = {};
      this.preImageData.data = ctx.getImageData(
        this.x,
        this.y,
        this.width,
        this.height
      );
      this.preImageData.x = this.x;
      this.preImageData.y = this.y;
    } catch (e) {}
  },

  /**
   * 恢复之前存储的图像数据
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  restorePreImageDataSquare: function (ctx) {
    if (this.preImageData && this.preImageData.data)
      ctx.putImageData(
        this.preImageData.data,
        this.preImageData.x,
        this.preImageData.y
      );
  },

  /**
   * 存储指定矩形区域的图像数据
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {Object} rect - 矩形区域
   */
  storePreImageDataSquare2: function (ctx, rect) {
    try {
      this.preImageData = {};
      this.preImageData.data = ctx.getImageData(
        rect.x,
        rect.y,
        rect.width,
        rect.height
      );
      this.preImageData.x = rect.x;
      this.preImageData.y = rect.y;
    } catch (e) {}
  },

  /**
   * 存储指定矩形区域的图像数据（带ID缓存）
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {Object} rect - 矩形区域
   */
  storePreImageDataSquare3: function (ctx, rect) {
    try {
      var id = rect.x + "_" + rect.y + "_" + rect.width + "_" + rect.height;
      var o = (this.preImageDataObj[id] = {});
      o.data = ctx.getImageData(rect.x, rect.y, rect.width, rect.height);
      o.x = rect.x;
      o.y = rect.y;
    } catch (e) {}
  },

  /**
   * 恢复指定矩形区域的图像数据（带ID缓存）
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {Object} rect - 矩形区域
   */
  restorePreImageDataSquare3: function (ctx, rect) {
    var id = rect.x + "_" + rect.y + "_" + rect.width + "_" + rect.height;
    var o = this.preImageDataObj[id];
    if (o) ctx.putImageData(o.data, o.x, o.y);
  },

  /**
   * 添加事件监听器
   * @param {string} type - 事件类型
   * @param {Function} EventHander - 事件处理函数
   */
  addEvent: function (type, EventHander) {
    type = type.toLowerCase();
    switch (type) {
      case "click":
        this.onClickList.push(EventHander);
        break;
      case "dblclick":
        this.onDblClickList.push(EventHander);
        break;
      case "mouseover":
        this.onMouseOverList.push(EventHander);
        break;
      case "mouseout":
        this.onMouseOutList.push(EventHander);
        break;
      case "mousemove":
        this.onMouseMoveList.push(EventHander);
        break;
      case "mousedown":
        this.onMouseDownList.push(EventHander);
        break;
      case "mouseup":
        this.onMouseUpList.push(EventHander);
        break;
      case "keyup":
        this.onKeyUpList.push(EventHander);
        break;
      case "onmousewheel":
        this.onMouseWheelList.push(EventHander);
        break;
      case "contextmenu":
        this.onContextmenuList.push(EventHander);
        break;
    }
  },

  /**
   * 触发点击事件
   * @param {Event} event - 事件对象
   * @param {Object} pos - 位置对象
   */
  onClick: function (event, pos) {
    for (var i = 0, len = this.onClickList.length; i < len; i++) {
      this.onClickList[i].call(this, event, pos);
    }
  },

  /**
   * 触发双击事件
   * @param {Event} event - 事件对象
   * @param {Object} pos - 位置对象
   */
  onDblClick: function (event, pos) {
    for (var i = 0, len = this.onDblClickList.length; i < len; i++) {
      this.onDblClickList[i].call(this, event, pos);
    }
  },

  /**
   * 触发鼠标移入事件
   * @param {Event} event - 事件对象
   * @param {Object} pos - 位置对象
   */
  onMouseOver: function (event, pos) {
    for (var i = 0, len = this.onMouseOverList.length; i < len; i++) {
      this.onMouseOverList[i].call(this, event, pos);
    }
  },

  /**
   * 触发鼠标移出事件
   * @param {Event} event - 事件对象
   * @param {Object} pos - 位置对象
   */
  onMouseOut: function (event, pos) {
    for (var i = 0, len = this.onMouseOutList.length; i < len; i++) {
      this.onMouseOutList[i].call(this, event, pos);
    }
  },

  /**
   * 触发鼠标移动事件
   * @param {Event} event - 事件对象
   * @param {Object} pos - 位置对象
   */
  onMouseMove: function (event, pos) {
    for (var i = 0, len = this.onMouseMoveList.length; i < len; i++) {
      this.onMouseMoveList[i].call(this, event, pos);
    }
  },

  /**
   * 触发鼠标按下事件
   * @param {Event} event - 事件对象
   * @param {Object} pos - 位置对象
   */
  onMouseDown: function (event, pos) {
    for (var i = 0, len = this.onMouseDownList.length; i < len; i++) {
      this.onMouseDownList[i].call(this, event, pos);
    }
  },

  /**
   * 触发鼠标释放事件
   * @param {Event} event - 事件对象
   * @param {Object} pos - 位置对象
   */
  onMouseUp: function (event, pos) {
    for (var i = 0, len = this.onMouseUpList.length; i < len; i++) {
      this.onMouseUpList[i].call(this, event, pos);
    }
  },

  /**
   * 触发键盘释放事件
   * @param {Event} event - 事件对象
   * @param {Object} pos - 位置对象
   */
  onKeyUp: function (event, pos) {
    for (var i = 0, len = this.onKeyUpList.length; i < len; i++) {
      this.onKeyUpList[i].call(this, event, pos);
    }
  },

  /**
   * 触发鼠标滚轮事件
   * @param {Event} event - 事件对象
   * @param {Object} pos - 位置对象
   */
  onMouseWheel: function (event, pos) {
    for (var i = 0, len = this.onMouseWheelList.length; i < len; i++) {
      this.onMouseWheelList[i].call(this, event, pos);
    }
  },

  /**
   * 触发右键菜单事件
   * @param {Event} event - 事件对象
   * @param {Object} pos - 位置对象
   */
  onContextmenu: function (event, pos) {
    for (var i = 0, len = this.onContextmenuList.length; i < len; i++) {
      this.onContextmenuList[i].call(this, event, pos);
    }
  },

  /**
   * 设置鼠标状态
   * @param {boolean} isIn - 是否在物件内
   * @param {Object} pos - 鼠标位置
   */
  setMouseState: function (isIn, pos) {
    this.MouseLastState = isIn;
    this.MouseLastPos = pos;
  },

  /**
   * 获取鼠标状态
   * @returns {boolean} 鼠标是否在物件内
   */
  getMouseState: function () {
    return this.MouseLastState;
  },

  /**
   * 获取鼠标最后位置
   * @returns {Object} 鼠标位置对象
   */
  getMouseLastPos: function () {
    return this.MouseLastPos;
  },

  /**
   * 设置舞台引用
   * @param {Stage} stage - 舞台实例
   */
  setStage: function (stage) {
    this.stage = stage;
  },
};
