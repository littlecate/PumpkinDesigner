"use strict";

/**
 * @fileoverview 扩展窗口控件模块，提供带有背景图片的可拖动窗口组件
 * @module MyWindowEx
 */

/**
 * 窗口管理器类
 * @class
 */
function WindowExManager() {
  /**
   * 窗口数组
   * @type {Array}
   */
  let winAr = [];

  /**
   * 添加窗口
   * @function add
   * @param {Object} o - 窗口对象
   */
  this.add = function (o) {
    winAr.push(o);
  };

  this.find = function (id) {
    for (var i = 0; i < winAr.length; i++) {
      if (winAr[i].id == id) {
        return winAr[i];
      }
    }
    return null;
  };
}

let windowExManager = new WindowExManager();

function MyWindowEx(config) {
  let me = this;
  let mainDiv, middleDiv;
  var middleDivWidth;
  var middleDivHeight;
  let backgroundCanvas, backgroundCtx, bgImage, middleWidth, middleHeight;

  doJob();

  windowExManager.add({
    id: config.id,
    win: me,
  });

  this.setWindowContent = function (t) {
    middleDiv.innerHTML = "";
    middleDiv.appendChild(t);
  };

  this.adjustSize = function (w, h) {
    if (w != -1) {
      var deltaWidth = w - middleDivWidth;
      config.width += deltaWidth;
    }

    if (h != -1) {
      var deltaHeight = h - middleDivHeight;
      config.height += deltaHeight;
    }

    resize();
  };

  this.show = function () {
    mainDiv.style.display = "";
  };

  this.hide = function () {
    mainDiv.style.display = "none";
  };

  this.setZIndex = function (v) {
    mainDiv.style.zIndex = v;
  };

  function resize() {
    setMainDivProps();
    setMiddleDivProps();
    setBackgroundCanvasProps();
    drawBackgroundImageDo();
  }

  function doJob() {
    mainDiv = document.createElement("div");
    mainDiv.setAttribute("id", config.id);
    setMainDivProps();

    middleDiv = document.createElement("div");
    setMiddleDivProps();
    mainDiv.appendChild(middleDiv);

    if (config.backgroundImage) drawBackgroundImage();

    if (config.closeButtonConfig) setColseButtonDiv();

    config.parent.appendChild(mainDiv);

    if (config.isDrag) new Drag(mainDiv, config.parent);
  }

  function setMiddleDivProps() {
    middleDivWidth =
      config.width - config.leftBorderWidth - config.rightBorderWidth;
    middleDivHeight =
      config.height - config.topBorderHeight - config.bottomBorderHeight;
    middleDiv.style.position = "absolute";
    middleDiv.style.left = config.leftBorderWidth + "px";
    middleDiv.style.top = config.topBorderHeight + "px";
    middleDiv.style.right = config.rightBorderWidth + "px";
    middleDiv.style.bottom = config.bottomBorderHeight + "px";
  }

  function setMainDivProps() {
    mainDiv.style.width = config.width + "px";
    mainDiv.style.height = config.height + "px";
    mainDiv.style.margin = "0px";
    mainDiv.style.padding = "0px";
    if (config.backgroundColor)
      mainDiv.style.backgroundColor = config.backgroundColor;
    mainDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.2)";
    mainDiv.style.borderRadius = "10px";
    var w = Number(config.parent.style.width.replace("px", ""));
    var h = Number(config.parent.style.height.replace("px", ""));
    if (config.align == "center-top") {
      mainDiv.style.position = "absolute";
      mainDiv.style.left = (w - config.width) / 2 + "px";
    } else {
      mainDiv.style.position = "absolute";
      mainDiv.style.left = (w - config.width) / 2 + "px";
      mainDiv.style.top = (h - config.height) / 2 + "px";
    }
  }

  function setBackgroundCanvasProps() {
    backgroundCanvas.style.width = config.width + "px";
    backgroundCanvas.style.height = config.height + "px";
    backgroundCanvas.setAttribute("width", config.width + "px");
    backgroundCanvas.setAttribute("height", config.height + "px");
  }

  function drawBackgroundImage() {
    var width, height;

    backgroundCanvas = document.createElement("canvas");
    setBackgroundCanvasProps();
    backgroundCtx = backgroundCanvas.getContext("2d", {
      willReadFrequently: false,
    });
    mainDiv.appendChild(backgroundCanvas);

    bgImage = new Image();
    bgImage.onload = function () {
      width = bgImage.width;
      height = bgImage.height;
      middleWidth = width - config.leftBorderWidth - config.rightBorderWidth;
      middleHeight =
        height - config.topBorderHeight - config.bottomBorderHeight;
      drawBackgroundImageDo();
    };
    bgImage.src = config.backgroundImage;
  }

  function drawBackgroundImageDo() {
    backgroundCtx.clearRect(0, 0, backgroundCtx.width, backgroundCtx.height);
    draw1();
    draw2();
    draw3();
    draw4();
    draw5();
    draw6();
    draw7();
    draw8();
    draw9();
  }

  function draw1() {
    backgroundCtx.drawImage(
      bgImage,
      0,
      0,
      config.leftBorderWidth,
      config.topBorderHeight,
      0,
      0,
      config.leftBorderWidth,
      config.topBorderHeight
    );
  }

  function draw2() {
    backgroundCtx.drawImage(
      bgImage,
      config.leftBorderWidth,
      0,
      middleWidth,
      config.topBorderHeight,
      config.leftBorderWidth,
      0,
      middleDivWidth,
      config.topBorderHeight
    );
  }

  function draw3() {
    backgroundCtx.drawImage(
      bgImage,
      config.leftBorderWidth + middleWidth,
      0,
      config.rightBorderWidth,
      config.topBorderHeight,
      config.leftBorderWidth + middleDivWidth,
      0,
      config.rightBorderWidth,
      config.topBorderHeight
    );
  }

  function draw4() {
    backgroundCtx.drawImage(
      bgImage,
      0,
      config.topBorderHeight,
      config.leftBorderWidth,
      middleHeight,
      0,
      config.topBorderHeight,
      config.leftBorderWidth,
      middleDivHeight
    );
  }

  function draw5() {
    backgroundCtx.drawImage(
      bgImage,
      config.leftBorderWidth,
      config.topBorderHeight,
      middleWidth,
      middleHeight,
      config.leftBorderWidth,
      config.topBorderHeight,
      middleDivWidth,
      middleDivHeight
    );
  }

  function draw6() {
    backgroundCtx.drawImage(
      bgImage,
      config.leftBorderWidth + middleWidth,
      config.topBorderHeight,
      config.rightBorderWidth,
      middleHeight,
      config.leftBorderWidth + middleDivWidth,
      config.topBorderHeight,
      config.rightBorderWidth,
      middleDivHeight
    );
  }

  function draw7() {
    backgroundCtx.drawImage(
      bgImage,
      0,
      config.topBorderHeight + middleHeight,
      config.leftBorderWidth,
      config.bottomBorderHeight,
      0,
      config.topBorderHeight + middleDivHeight,
      config.leftBorderWidth,
      config.bottomBorderHeight
    );
  }

  function draw8() {
    backgroundCtx.drawImage(
      bgImage,
      config.leftBorderWidth,
      config.topBorderHeight + middleHeight,
      middleWidth,
      config.bottomBorderHeight,
      config.leftBorderWidth,
      config.topBorderHeight + middleDivHeight,
      middleDivWidth,
      config.bottomBorderHeight
    );
  }

  function draw9() {
    backgroundCtx.drawImage(
      bgImage,
      config.leftBorderWidth + middleWidth,
      config.topBorderHeight + middleHeight,
      config.rightBorderWidth,
      config.bottomBorderHeight,
      config.leftBorderWidth + middleDivWidth,
      config.topBorderHeight + middleDivHeight,
      config.rightBorderWidth,
      config.bottomBorderHeight
    );
  }

  function setColseButtonDiv() {
    config.closeButtonConfig.parentDiv = mainDiv;
    config.closeButtonConfig.floatRightUp = true;
    let t = config.closeButtonConfig.onclick;
    config.closeButtonConfig.onclick = function () {
      if (t) {
        t();
      }
      mainDiv.style.display = "none";
    };
    new MyButtonEx(config.closeButtonConfig);
  }
}
