"use strict";

/**
 * @fileoverview 单元格工具栏模块，提供字体、对齐、边框、插入等操作按钮
 * @module CellToolbar
 */

/**
 * 单元格工具栏类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {Object} config.parentEl - 父元素
 * @param {string} config.cellInstanceName - 单元格实例名称
 * @param {string} config.cellInstanceId - 单元格实例ID
 * @param {number} config.toolbarHeight - 工具栏高度
 * @param {number} config.leftLabelWidth - 左侧标签宽度
 * @param {number} config.leftLabelPadding - 左侧标签内边距
 * @param {Object} config.toolbarThemeConfig - 工具栏主题配置
 */
function CellToolbar(config) {
  var parentObj = config.parentObj;
  var parentEl = config.parentEl;
  var cellInstanceName = config.cellInstanceName;
  var cellInstanceId = config.cellInstanceId;
  var height = config.toolbarHeight;
  var leftLabelWidth = config.leftLabelWidth;
  var leftLabelPadding = config.leftLabelPadding;
  var toolbarThemeConfig = config.toolbarThemeConfig || {};
  var thisEl = null;
  let selectCellBorderColorButton;
  let selectLineStyleButtonCanvas;
  let currentCol, currentRow;
  let buttonBarDiv = null;
  let me = this;

  function doJob() {
    var parentElPosition = Comman.getNodePosition(parentEl);
    var x = parentElPosition.left;
    var y = parentElPosition.top;
    var id = cellInstanceId + "_toolbar";
    var t1 = document.getElementById(id);
    var isFirstTime = true;
    if (t1) {
      t1.parentElement.removeChild(t1);
      isFirstTime = false;
    }
    thisEl = document.createElement("div");
    thisEl.setAttribute("id", id);
    var w = parentEl.parentElement.clientWidth;
    var style =
      "width:100%;height:" +
      (height - 4) +
      "px;" +
      theme.toolbar.backgroundStyle;
    thisEl.setAttribute("style", style);
    thisEl.style.userSelect = "none";
    parentEl.parentElement.insertBefore(thisEl, parentEl);
    var h = parentEl.parentElement.clientHeight;
    if (isFirstTime) parentEl.parentElement.style.height = h + 30 + 30 + "px";
    buttonBarDiv = document.createElement("div");
    buttonBarDiv.style.width = "100%";
    buttonBarDiv.style.height = "26px";
    buttonBarDiv.style.overflow = "hidden";
    thisEl.appendChild(buttonBarDiv);
    setupButtons();
    setupFormulaBar();
  }

  function setupFormulaBar() {
    var t = document.createElement("div");
    t.style.clear = "both";
    t.style.width = "calc(100% - 2px)";
    t.style.height = "25px";
    t.style.border = "1px solid #cecece";
    thisEl.appendChild(t);

    var t1 = document.createElement("div");
    t1.setAttribute("id", cellInstanceId + "_formulabar_div1");
    t1.style.float = "left";
    t1.style.width = "100px";
    t1.style.height = "100%";
    t1.style.display = "inline-block";
    t1.style.lineHeight = "25px";
    t1.style.verticalAlign = "middle";
    t1.style.backgroundColor = "white";
    t1.style.textAlign = "center";
    t1.style.borderRight = "1px solid lightblue";
    t1.style.fontSize = "9pt";
    t1.style.color = "black";
    t.appendChild(t1);

    var t2 = document.createElement("div");
    t2.style.float = "left";
    t2.style.width = "calc(100% - 100px - 2px)";
    t2.style.height = "100%";
    t2.style.backgroundColor = "white";
    t2.style.overflow = "hidden";
    t2.style.padding = "0px";
    t.appendChild(t2);

    var t3 = document.createElement("input");
    t3.setAttribute("id", cellInstanceId + "_formulabar_inputbox");
    t3.setAttribute("type", "input");
    t3.style.width = "100%";
    t3.style.height = "100%";
    t3.style.border = "0px";
    t3.style.marginLeft = "2px";
    t3.style.fontSize = "9pt";
    t3.style.padding = "0px";
    t3.style.backgroundColor = "white";
    t3.style.color = "black";
    t3.onkeyup = function (e) {
      if(readOnlyText){
        return;
      }
      parentObj.setCellFormula(currentCol, currentRow);
    };
    if(readOnlyText){
      t3.setAttribute("readonly", "readonly");
    }
    t2.appendChild(t3);
  }

  function setCurrentCurrentCell(col, row) {
    currentCol = col;
    currentRow = row;
  }

  function setupButtons() {
    var icon = theme.toolbar.icon;
    var buttonList = [
      {
        backgroundImage: icon.open,
        cmd: function () {
          parentObj.openFile();
        },
        text: "打开",
      },
    //   {
    //     backgroundImage: icon.export,
    //     cmd: function () {
    //       parentObj.export();
    //     },
    //     text: "导出",
    //   },
      {
        backgroundImage: icon.printsetting,
        cmd: function () {
          parentObj.pageSet();
        },
        text: "页面设置",
      },
      {
        backgroundImage: icon.undo,
        cmd: function () {
          parentObj.undo();
        },
        text: "撤消",
      },
      {
        backgroundImage: icon.redo,
        cmd: function () {
          parentObj.redo();
        },
        text: "重做",
      },
      {
        mark: "font",
      },
      {
        mark: "fontSize",
      },
      {
        backgroundImage: icon.bold,
        cmd: function () {
          parentObj.setCellBold();
        },
        text: "粗体",
      },
      {
        backgroundImage: icon.italic,
        cmd: function () {
          parentObj.setCellItalic();
        },
        text: "斜体",
      } /*{
            backgroundImage: "./images/underline.gif",
                cmd: "SetCellUnderline",
                text: "下划线"
            }, */,
      {
        backgroundImage: icon.fontcolor,
        cmd: function () {
          parentObj.setCellForeColor();
        },
        text: "设置文字颜色",
      },
      {
        backgroundImage: icon.fillcolor,
        cmd: function () {
          parentObj.setCellBackColor();
        },
        text: "设置单元格背景色",
      },
      {
        backgroundImage: icon.sup,
        cmd: function () {
          parentObj.setCellSup();
        },
        text: "上标",
      },
      {
        backgroundImage: icon.sub,
        cmd: function () {
          parentObj.setCellSub();
        },
        text: "下标",
      },
      {
        backgroundImage: icon.alignleft,
        cmd: function () {
          parentObj.setCellAlignLeft();
        },
        text: "左对齐",
      },
      {
        backgroundImage: icon.aligncenter,
        cmd: function () {
          parentObj.setCellAlignCenter();
        },
        text: "水平居中",
      },
      {
        backgroundImage: icon.alignright,
        cmd: function () {
          parentObj.setCellAlignRight();
        },
        text: "右对齐",
      },
      {
        backgroundImage: icon.alignbottom,
        cmd: function () {
          parentObj.setCellAlignBottom();
        },
        text: "垂直居下",
      },
      {
        backgroundImage: icon.alignmiddle,
        cmd: function () {
          parentObj.setCellAlignMiddle();
        },
        text: "垂直居中",
      },
      {
        backgroundImage: icon.aligntop,
        cmd: function () {
          parentObj.setCellAlignTop();
        },
        text: "垂直居上",
      },
      {
        backgroundImage: icon.mergecells,
        cmd: function () {
          parentObj.mergeCells();
        },
        text: "合并单元格",
      },
      {
        backgroundImage: icon.unmergecells,
        cmd: function () {
          parentObj.unmergeCells();
        },
        text: "取消合并单元格",
      },
      {
        backgroundImage: icon.insertrow,
        cmd: function () {
          parentObj.insertRow();
        },
        text: "插入行",
      },
      {
        backgroundImage: icon.insertcol,
        cmd: function () {
          parentObj.insertCol();
        },
        text: "插入列",
      },
      {
        backgroundImage: icon.appendrow,
        cmd: function () {
          parentObj.appendRow();
        },
        text: "追加行",
      },
      {
        backgroundImage: icon.appendcol,
        cmd: function () {
          parentObj.appendCol();
        },
        text: "追加列",
      },
      {
        backgroundImage: icon.delrow,
        cmd: function () {
          parentObj.deleteRow();
        },
        text: "删除行",
      },
      {
        backgroundImage: icon.delcol,
        cmd: function () {
          parentObj.deleteCol();
        },
        text: "删除列",
      },
      {
        backgroundImage: icon.insertpicture,
        cmd: function (e) {
          me.showInsertPictureDropdown(e);
        },
        text: "插入图片",
      },
      {
        mark: "borderColor",
      },
      {
        mark: "borderStyle",
      },
      {
        backgroundImage: icon.drawline,
        cmd: function (e) {
          showSetCellBorderMenu(e);
        },
        text: "画线",
      },
      {
        backgroundImage: icon.ereaseline,
        cmd: function (e) {
          showClearCellBorderMenu(e);
        },
        text: "抹线",
      },     
      {
        backgroundImage: icon.autofillcolumn,
        cmd: function () {
          parentObj.autoFillColumns();
        },
        text: "自动填充字段",
      },
      {
        backgroundImage: icon.selectcolumn,
        cmd: function () {
          parentObj.showColumnPickWindow();
        },
        text: "选择字段",
      },
    ];
    for (var i = 0; i < buttonList.length; i++) {
      var o = buttonList[i];
      if (o["mark"]) {
        setupButtonByMark(o["mark"]);
      } else {
        var a = document.createElement("A");
        a.setAttribute("title", o.text);
        a.setAttribute(
          "style",
          "display:block;float:left;cursor:pointer;width:16px;height:16px;margin:6px 2px 5px 2px;text-align:center;vertical-align:center;"
        );
        var t1 = document.createElement("div");
        t1.style.width = "100%";
        t1.style.height = "100%";
        t1.style.textAlign = "center";
        t1.style.display = "flex";
        t1.style.justifyContent = "center";
        t1.style.alignItems = "center";
        t1.style.backgroundImage = "url(" + o.backgroundImage + ")";
        t1.style.backgroundRepeat = "no-repeat";
        t1.style.backgroundPosition = "center";
        t1.style.backgroundSize = "contain";
        t1.onmouseover = function (e) {
          this.style.border = "1px solid rgba(255, 255, 255, 1)";
        };
        t1.onmouseleave = function (e) {
          this.style.border = "";
        };
        a.onclick = o.cmd;
        a.appendChild(t1);
        buttonBarDiv.appendChild(a);
      }
    }
  }

  this.showInsertPictureDropdown = function (e) {
    var t = e.target;
    var div1 = Comman.getNodePosition(t);
    var t2 = Comman.getNodePosition(buttonBarDiv);
    var id = "div_insertPicture_menu_" + cellInstanceId;
    var div = document.getElementById(id);
    if (!div) {
      div = document.createElement("div");
      div.setAttribute("id", id);
      parentEl.parentElement.appendChild(div);
    } else {
      div.style.display = "";
      return;
    }
    div.style.position = "absolute";
    div.style.left = div1.left - t2.left + "px";
    div.style.top = div1.top - t2.top + t.clientHeight + "px";
    div.style.width = "100px";
    div.style.textAlign = "center";
    div.style.backgroundColor = "#fff";
    div.style.borderRadius = "4.8px";
    div.style.boxShadow = "0px 8px 15px 0px rgba(0,0,0,0.08)";
    div.onmouseleave = function (e) {
      this.style.display = "none";
    };

    var div1 = document.createElement("div");
    div1.style.textAlign = "center";
    div1.style.color = "#222222";
    div1.style.fontSize = "12px";
    div1.style.lineHeight = "32px";
    div1.style.cursor = "pointer";
    div1.innerText = "插入单元格图片";
    div1.onclick = function (e) {
      parentObj.insertPicture();
    };
    div.appendChild(div1);

    var div1 = document.createElement("div");
    div1.style.textAlign = "center";
    div1.style.color = "#222222";
    div1.style.fontSize = "12px";
    div1.style.lineHeight = "32px";
    div1.style.cursor = "pointer";
    div1.innerText = "插入浮动图片";
    div1.onclick = function (e) {
      parentObj.insertFloatPicture();
    };
    div.appendChild(div1);

    var div1 = document.createElement("div");
    div1.style.textAlign = "center";
    div1.style.color = "#222222";
    div1.style.fontSize = "12px";
    div1.style.lineHeight = "32px";
    div1.style.cursor = "pointer";
    div1.innerText = "插入背景图片";
    div1.onclick = function (e) {
      parentObj.setBackImage();
    };
    div.appendChild(div1);
  };

  function setupButtonByMark(mark) {
    if (mark == "font") {
      setupFontToolbarButton();
    } else if (mark == "fontSize") {
      setupFontSizeToolbarButton();
    } else if (mark == "borderColor") {
      setupBorderColorPicker();
    } else if (mark == "borderStyle") {
      setupBorderStyleSelect();
    }
  }

  function setupBorderColorPicker() {
    var a = document.createElement("A");
    a.setAttribute("title", "选择边框颜色");
    a.style.display = "block";
    a.style.float = "left";
    a.style.cursor = "pointer";
    a.style.width = "12px";
    a.style.height = "12px";
    a.style.margin = "8px 5px 5px 5px";
    a.onclick = function () {
      parentObj.selectCellBorderColor();
    };
    var div = document.createElement("div");
    div.style.width = "11px";
    div.style.height = "11px";
    div.style.backgroundColor = "black";
    div.style.border = "1px solid #fff";
    a.appendChild(div);
    selectCellBorderColorButton = div;
    buttonBarDiv.appendChild(a);
  }

  function setupBorderStyleSelect() {
    var a = document.createElement("A");
    a.setAttribute("title", "选择边框样式");
    a.style.display = "block";
    a.style.float = "left";
    a.style.cursor = "pointer";
    a.style.width = "26px";
    a.style.height = "16px";
    a.style.margin = "6px 2px 5px 2px";
    a.onclick = function (e) {
      showSelectBorderStyleMenu(e);
    };
    buttonBarDiv.appendChild(a);

    var div = document.createElement("div");
    div.style.width = "25px";
    div.style.height = "15px";
    div.style.backgroundColor = "#fff";
    a.appendChild(div);

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", "26px");
    canvas.setAttribute("height", "15px");
    div.appendChild(canvas);
    selectLineStyleButtonCanvas = canvas;
    setSelectLineStyleButton(2);
  }

  function setSelectLineStyleButton(style) {
    var ctx = selectLineStyleButtonCanvas.getContext("2d", {
      willReadFrequently: false,
    });
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var xGraphics = new CellCanvas(null, ctx);
    var xColor = Comman.ToXColor(1);
    var xPoint1 = new XPoint(0, 8);
    var xPoint2 = new XPoint(26, 8);
    drawLine(xGraphics, style, xColor, xPoint1, xPoint2);
    var t = document.getElementById(
      "div_selectBorderStyle_menu_" + cellInstanceId
    );
    if (t) t.style.display = "none";
  }

  function showSelectBorderStyleMenu(e) {
    var t = e.target;
    var t1 = Comman.getNodePosition(t);
    var t2 = Comman.getNodePosition(buttonBarDiv);
    var id = "div_selectBorderStyle_menu_" + cellInstanceId;
    var div = document.getElementById(id);
    if (!div) {
      div = document.createElement("div");
      div.setAttribute("id", id);
      parentEl.parentElement.appendChild(div);
    } else {
      div.style.display = "";
      return;
    }
    div.style.position = "absolute";
    div.style.left = t1.left - t2.left + "px";
    div.style.top = t1.top - t2.top + t.clientHeight + "px";
    div.style.width = "47px";
    div.style.textAlign = "center";
    div.style.backgroundColor = "#fff";
    div.style.borderRadius = "4.8px";
    div.style.boxShadow = "0px 8px 15px 0px rgba(0,0,0,0.08)";

    for (let i = 2; i <= 12; i++) {
      var canvas = document.createElement("canvas");
      canvas.setAttribute("width", "45px");
      canvas.setAttribute("height", "6px");
      canvas.style.padding = "2px";
      canvas.style.margin = "2px";
      canvas.style.marginLeft = "2px";
      canvas.style.marginRight = "2px";
      canvas.style.cursor = "pointer";
      canvas.onclick = function () {
        parentObj.setDefinedLineStyle(i);
      };
      div.appendChild(canvas);
      var ctx = canvas.getContext("2d", { willReadFrequently: false });
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      var xGraphics = new CellCanvas(null, ctx);
      var xColor = Comman.ToXColor(1);
      var xPoint1 = new XPoint(0, 2);
      var xPoint2 = new XPoint(36, 2);
      drawLine(xGraphics, i, xColor, xPoint1, xPoint2);
    }

    div.addEventListener("mouseleave", function (e) {
      div.style.display = "none";
    });
  }

  function drawLine(xGraphics, style, xColor, xPoint1, xPoint2) {
    if (style == 2) {
      DrawLine.drawThinLine(xColor, xGraphics, xPoint1, xPoint2);
    } else if (style == 3) {
      DrawLine.drawMiddleLine(xColor, xGraphics, xPoint1, xPoint2);
    } else if (style == 4) {
      DrawLine.drawBoldLine(xColor, xGraphics, xPoint1, xPoint2);
    } else if (style == 5) {
      DrawLine.drawDashLine(xColor, xGraphics, xPoint1, xPoint2);
    } else if (style == 6) {
      DrawLine.drawDotLine(xColor, xGraphics, xPoint1, xPoint2);
    } else if (style == 7) {
      DrawLine.drawDotDashLine(xColor, xGraphics, xPoint1, xPoint2);
    } else if (style == 8) {
      DrawLine.drawDotDotDashLine(xColor, xGraphics, xPoint1, xPoint2);
    } else if (style == 9) {
      DrawLine.drawBoldDashLine(xColor, xGraphics, xPoint1, xPoint2);
    } else if (style == 10) {
      DrawLine.drawBoldDotLine(xColor, xGraphics, xPoint1, xPoint2);
    } else if (style == 11) {
      DrawLine.drawBoldDotDashLine(xColor, xGraphics, xPoint1, xPoint2);
    } else if (style == 12) {
      DrawLine.drawBoldDotDotDashLine(xColor, xGraphics, xPoint1, xPoint2);
    }
  }

  function setupFontSizeToolbarButton() {
    var t = document.createElement("select");
    t.setAttribute("id", cellInstanceId + "_select_fontSize");
    t.setAttribute(
      "style",
      "float:left;display:block;margin-top:4px;text-align:center;background-color:white;color:black"
    );
    var t1 = document.createElement("option");
    t1.value = "";
    t1.text = "--字号--";
    t.appendChild(t1);
    for (var i = 5; i <= 48; i += 0.5) {
      t1 = document.createElement("option");
      t1.value = i;
      t1.text = i;
      t.appendChild(t1);
    }
    t.onchange = function () {
      parentObj.changeFontSize();
    };
    buttonBarDiv.appendChild(t);
  }

  function setupFontToolbarButton() {
    var t = document.createElement("select");
    t.setAttribute("id", cellInstanceId + "_select_font");
    t.setAttribute(
      "style",
      "float:left;display:block;margin-top:4px;text-align:center;background-color:white;color:black"
    );
    t.innerHTML =
      '<option value="">--字体--</option><option value="宋体">宋体</option><option value="Times New Roman">Times New Roman</option><option value="黑体">黑体</option><option value="微软雅黑">微软雅黑</option><option value="微软正黑体">微软正黑体</option><option value="楷体">楷体</option><option value="新宋体">新宋体</option><option value="仿宋">仿宋</option><option value="华文楷体">华文楷体</option><option value="华文宋体">华文宋体</option><option value="华文仿宋">华文仿宋</option><option value="华文中宋">华文中宋</option><option value="华文琥珀">华文琥珀</option><option value="华文新魏">华文新魏</option><option value="华文隶书">华文隶书</option><option value="华文行楷">华文行楷</option><option value="幼圆">幼圆</option><option value="隶书">隶书</option><option value="华文细黑">华文细黑</option><option value="华文楷体">华文楷体</option><option value="华文宋体">华文宋体</option><option value="华文仿宋">华文仿宋</option><option value="华文中宋">华文中宋</option><option value="华文彩云">华文彩云</option><option value="华文琥珀">华文琥珀</option><option value="华文新魏">华文新魏</option><option value="华文隶书">华文隶书</option><option value="华文行楷">华文行楷</option><option value="方正舒体">方正舒体</option><option value="方正姚体">方正姚体</option>';
    t.onchange = function () {
      parentObj.changeFont();
    };
    buttonBarDiv.appendChild(t);
  }

  function showSetCellBorderMenu(e) {
    var t = e.target;
    var t1 = Comman.getNodePosition(t);
    var t2 = Comman.getNodePosition(buttonBarDiv);
    var id = "div_setCellBorder_menu_" + cellInstanceId;
    var div = document.getElementById(id);
    if (!div) {
      div = document.createElement("div");
      div.setAttribute("id", id);
      parentEl.parentElement.appendChild(div);
    } else {
      div.style.display = "";
      return;
    }
    div.style.position = "absolute";
    div.style.left = t1.left - t2.left + "px";
    div.style.top = t1.top - t2.top + t.clientHeight + "px";
    div.style.width = "80px";
    div.style.textAlign = "center";
    div.style.backgroundColor = "#fff";
    div.style.borderRadius = "4.8px";
    div.style.boxShadow = "0px 8px 15px 0px rgba(0,0,0,0.08)";

    var menuItems = [
      {
        text: "画上下左右线",
        cmd: function () {
          parentObj.setCellBorder_setValue_do(
            "all",
            parentObj.getDefinedLineStyle()
          );
        },
      },
      {
        text: "画上线",
        cmd: function () {
          parentObj.setCellBorder_setValue_do(
            "top",
            parentObj.getDefinedLineStyle()
          );
        },
      },
      {
        text: "画下线",
        cmd: function () {
          parentObj.setCellBorder_setValue_do(
            "bottom",
            parentObj.getDefinedLineStyle()
          );
        },
      },
      {
        text: "画左线",
        cmd: function () {
          parentObj.setCellBorder_setValue_do(
            "left",
            parentObj.getDefinedLineStyle()
          );
        },
      },
      {
        text: "画右线",
        cmd: function () {
          parentObj.setCellBorder_setValue_do(
            "right",
            parentObj.getDefinedLineStyle()
          );
        },
      },
      {
        text: "画框线",
        cmd: function () {
          parentObj.setCellBorder_setValue_do(
            "outborder",
            parentObj.getDefinedLineStyle()
          );
        },
      },
    ];
    var h = 0;
    for (var i = 0; i < menuItems.length; i++) {
      h += 20;
      let o = menuItems[i];
      var t3 = document.createElement("div");
      t3.style.width = "76px";
      t3.style.marginLeft = "2px";
      t3.style.height = "20px";
      t3.style.textAlign = "center";
      t3.style.paddingTop = "3px";
      t3.style.fontSize = "9pt";
      t3.style.cursor = "pointer";
      t3.style.color = "#000000";
      t3.innerHTML = o.text;
      t3.onmouseover = function (e) {
        e.target.style.backgroundColor = "#367FC9";
      };
      t3.onmouseleave = function (e) {
        e.target.style.backgroundColor = "";
      };
      t3.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        o.cmd();
        div.style.display = "none";
      };
      div.appendChild(t3);
    }
    div.style.height = h + 20 + "px";

    div.addEventListener("mouseleave", function (e) {
      div.style.display = "none";
    });
  }

  function showClearCellBorderMenu(e) {
    var t = e.target;
    var t1 = Comman.getNodePosition(t);
    var t2 = Comman.getNodePosition(buttonBarDiv);
    var id = "div_clearCellBorder_menu_" + cellInstanceId;
    var div = document.getElementById(id);
    if (!div) {
      div = document.createElement("div");
      div.setAttribute("id", id);
      parentEl.parentElement.appendChild(div);
    } else {
      div.style.display = "";
      return;
    }
    div.style.position = "absolute";
    div.style.left = t1.left - t2.left + "px";
    div.style.top = t1.top - t2.top + t.clientHeight + "px";
    div.style.width = "80px";
    div.style.textAlign = "center";
    div.style.backgroundColor = "#fff";
    div.style.borderRadius = "4.8px";
    div.style.boxShadow = "0px 8px 15px 0px rgba(0,0,0,0.08)";

    var menuItems = [
      {
        text: "抹上下左右线",
        cmd: function () {
          parentObj.clearCellBorder_setValue_do("all", 2);
        },
      },
      {
        text: "抹上线",
        cmd: function () {
          parentObj.clearCellBorder_setValue_do("top", 2);
        },
      },
      {
        text: "抹下线",
        cmd: function () {
          parentObj.clearCellBorder_setValue_do("bottom", 2);
        },
      },
      {
        text: "抹左线",
        cmd: function () {
          parentObj.clearCellBorder_setValue_do("left", 2);
        },
      },
      {
        text: "抹右线",
        cmd: function () {
          parentObj.clearCellBorder_setValue_do("right", 2);
        },
      },
      {
        text: "抹框线",
        cmd: function () {
          parentObj.clearCellBorder_setValue_do("outborder", 4);
        },
      },
    ];
    var h = 0;
    for (var i = 0; i < menuItems.length; i++) {
      h += 20;
      let o = menuItems[i];
      var t3 = document.createElement("div");
      t3.style.width = "76px";
      t3.style.marginLeft = "2px";
      t3.style.height = "20px";
      t3.style.textAlign = "center";
      t3.style.paddingTop = "3px";
      t3.style.fontSize = "9pt";
      t3.style.cursor = "pointer";
      t3.style.color = "#000000";
      t3.innerHTML = o.text;
      t3.onmouseover = function (e) {
        e.target.style.backgroundColor = "#367FC9";
      };
      t3.onmouseleave = function (e) {
        e.target.style.backgroundColor = "";
      };
      t3.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        o.cmd();
        div.style.display = "none";
      };
      div.appendChild(t3);
    }
    div.style.height = h + 20 + "px";

    div.addEventListener("mouseleave", function (e) {
      div.style.display = "none";
    });
  }

  function setSelectCellBorderColorButtonColor(intColor) {
    selectCellBorderColorButton.style.backgroundColor =
      Comman.ToXColor(intColor);
  }

  return {
    doJob: doJob,
    setSelectCellBorderColorButtonColor: setSelectCellBorderColorButtonColor,
    setSelectLineStyleButton: setSelectLineStyleButton,
    setCurrentCurrentCell: setCurrentCurrentCell,
  };
}
