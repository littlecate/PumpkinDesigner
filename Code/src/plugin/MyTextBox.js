"use strict";

/**
 * @fileoverview 文本框控件模块，提供单元格编辑和显示功能
 * @module MyTextBox
 */

/**
 * 自动填充拖拽标志
 * @type {boolean}
 */
let g_isAutoFillDrag = false;

/**
 * 文本框类
 * @class
 * @param {Object} o - 配置对象
 * @param {string} o.id - 文本框ID
 * @param {number} o.left - 左边距
 * @param {number} o.top - 上边距
 * @param {number} o.width - 宽度
 * @param {number} o.height - 高度
 * @param {string} o.borderColor - 边框颜色
 * @param {string} o.valign - 垂直对齐方式
 * @param {string} o.halign - 水平对齐方式
 * @param {string} o.value - 值
 * @param {Object} o.font - 字体配置
 * @param {number} o.lineSpace - 行间距
 * @param {string} o.backgroundColor - 背景颜色
 * @param {Object} events - 事件处理对象
 */
function MyTextBox(o, events) {
  Thing.call(this, o.left, o.top);
  this.id = o.id;
  this.width = o.width;
  this.height = o.height;
  this.borderColor = o.borderColor;
  this.valign = o.valign;
  this.halign = o.halign;
  this.value = o.value || "";
  this.font = o.font || Utils.getDefaultFont();
  this.lineSpace = o.lineSpace;
  this.drawFont = Utils.getDrawFont(this.font);
  this.backgroundColor = o.backgroundColor || "";
  this.formatType = o.formatType || "";
  this.dataSourceId = o.dataSourceId || "";
  this.tableName = o.tableName;
  this.columnName = o.columnName;
  this.recNum = o.recNum;
  this.readOnly = o.readOnly || false;
  this.dwEdit = o.dwEdit;
  this.cellSheet = o.cellSheet;
  this.col = o.col;
  this.row = o.row;
  this.rangeStartCol = o.rangeStartCol;
  this.rangeStartRow = o.rangeStartRow;
  this.rangeEndCol = o.rangeEndCol;
  this.rangeEndRow = o.rangeEndRow;
  this.fillDataType = o.fillDataType;
  this.isCheckBox = o.isCheckBox;
  this.parentEl = o.parentEl;
  this.operCell = o.operCell;
  if (this.readOnly) {
    //this.backgroundColor = "#6699CC";
  }
  this.oldValue = "";
  this._isReadyToDraw = true;
  this._isDrawed = false;
  this._isMouseDown = false;
  this._isDrawInputBox = false;
  this.cacheCtxTextLayer = null;
  this.parentObj = o.parentObj;
  var me = this;

  (this.draw = function (cacheCtxTextLayer, ctx) {
    this.cacheCtxTextLayer = cacheCtxTextLayer;
    this.ctx = ctx;
    this.drawBackgroundColor(cacheCtxTextLayer);
    if (this.value != "" && this.width > 0 && this.height > 0) {
      this.drawValue(cacheCtxTextLayer);
      this.oldValue = this.value;
    }
    this._isDrawed = true;
  }),
    (this.drawBackgroundColor = function (cacheCtxTextLayer) {
      if (this.backgroundColor == "") {
        return;
      }
      cacheCtxTextLayer.save();
      cacheCtxTextLayer.fillStyle = this.backgroundColor;
      cacheCtxTextLayer.fillRect(
        this.x + 1,
        this.y + 1,
        this.width - 2,
        this.height - 2
      );
      cacheCtxTextLayer.restore();
    }),
    (this.setCellProps = function () {
      if (!this.cellSheet) {
        return;
      }
      var o = this.cellSheet.cells[this.col][this.row];
      var textAlign = Comman.GetTextAlign(o.cellHAlign, o.cellVAlign);
      this.valign = textAlign.valign;
      this.halign = textAlign.halign;
      this.backgroundColor = "";
      this.font = Comman.GetCellFont(o);
      this.lineSpace = o.lineSpace;
      this.backgroundColor =
        o.backgroundColor > 0 ? Comman.ToXColor(o.backgroundColor) : "";
    }),
    (this.drawValue = function (cacheCtxTextLayer, forceDraw) {
      if (!forceDraw && this.value == this.oldValue) {
        return;
      }
      this.setCellProps();
      this.oldValue = this.value;
      this.drawBackgroundColor(cacheCtxTextLayer);
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      var o = this.cellSheet.cells[this.col][this.row];
      var str = this.value.toString();
      if (str == "") {
        return;
      }
      if (this.isCheckBox) {
        str = str.substr(1);
        str = "   " + str;
      }
      var firstCharRect = new DrawHtmlStringClass(
        cacheCtxTextLayer,
        o,
        str,
        x,
        y,
        w,
        h
      ).DoJob();
      if (this.isCheckBox) {
        this.drawCheckBox(firstCharRect);
      }
    }),
    (this.drawCheckBox = function (firstCharRect) {
      var t = document.createElement("div");
      t.style.position = "absolute";
      t.style.left = firstCharRect.GetX() + "px";
      t.style.top = firstCharRect.GetY() - firstCharRect.GetHeight() / 2 + "px";
      t.style.width = firstCharRect.GetWidth() * 2.5 + "px";
      let t1 = document.createElement("input");
      t1.setAttribute("type", "checkbox");
      if (this.value.indexOf("☑") == 0) {
        t1.checked = true;
      } else {
        t1.checked = false;
      }
      t1.onchange = function (e) {
        if (t1.checked) {
          me.value = "☑" + me.value.substr(1);
        } else {
          me.value = "□" + me.value.substr(1);
        }
        me.setValueToFillDataJsonData();
      };
      me.setValueToFillDataJsonData();
      this.checkBox = t1;
      t.appendChild(t1);
      this.parentEl.appendChild(t);
    }),
    (this.setValueToFillDataJsonData = function () {
      var col = me.col;
      var row = me.row;
      if (
        isNeedRecordRecordFillDataMaps &&
        !isInFillDataing &&
        fillDataMaps1[col + 1 + "." + (row + 1)]
      ) {
        var t = fillDataMaps1[col + 1 + "." + (row + 1)];
        me.operCell.setDataToFillDataJsonData(t, me.value);
      }
    }),
    (this.removeCheckBox = function () {
      if (this.checkBox && this.checkBox.parentElement) {
        var t = this.checkBox.parentElement;
        t.parentElement.removeChild(t);
      }
    }),
    (this.setValue = function (v, forceDraw) {
      this.value = v.toString();
      if (this.dwEdit) {
        this.dwEdit.setitem(1, this.id, this.value);
      }
      this.drawValue(this.cacheCtxTextLayer, forceDraw);
    }),
    (this.clearRange = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      this.ctx.clearRect(x, y, w, h);
      this.cacheCtxTextLayer.clearRect(x, y, w, h);
    }),
    (this.render = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      this.ctx.drawImage(this.cacheCtxTextLayer.canvas, x, y, w, h, x, y, w, h);
    }),
    (this.drawFocusLeftBorder = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      var className =
        "focusMark" + "_" + this.col + "_" + this.row + "_leftBorder";
      var div = document.createElement("div");
      div.setAttribute("class", className);
      this.stage.node.parentElement.appendChild(div);
      div.style.width = "2px";
      div.style.height = h + "px";
      div.style.position = "absolute";
      div.style.left = x + "px";
      div.style.top = y + "px";
      div.style.backgroundColor = theme.hilightColor;
      div.style.display = "";
      div.oncontextmenu = function (e) {
        e.preventDefault();
      };
    }),
    (this.drawFocusTopBorder = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      var className =
        "focusMark" + "_" + this.col + "_" + this.row + "_topBorder";
      var div = document.createElement("div");
      div.setAttribute("class", className);
      this.stage.node.parentElement.appendChild(div);
      div.style.width = w + "px";
      div.style.height = "2px";
      div.style.position = "absolute";
      div.style.left = x + "px";
      div.style.top = y + "px";
      div.style.backgroundColor = theme.hilightColor;
      div.style.display = "";
      div.oncontextmenu = function (e) {
        e.preventDefault();
      };
    }),
    (this.drawFocusRightBorder = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      var className =
        "focusMark" + "_" + this.col + "_" + this.row + "_rightBorder";
      var div = document.createElement("div");
      div.setAttribute("class", className);
      this.stage.node.parentElement.appendChild(div);
      div.style.width = "2px";
      div.style.height = h + "px";
      div.style.position = "absolute";
      div.style.left = x + w + "px";
      div.style.top = y + "px";
      div.style.backgroundColor = theme.hilightColor;
      div.style.display = "";
      div.oncontextmenu = function (e) {
        e.preventDefault();
      };
    }),
    (this.drawFocusBottomBorder = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      var className =
        "focusMark" + "_" + this.col + "_" + this.row + "_bottomBorder";
      var div = document.createElement("div");
      div.setAttribute("class", className);
      this.stage.node.parentElement.appendChild(div);
      div.style.width = w + "px";
      div.style.height = "2px";
      div.style.position = "absolute";
      div.style.left = x + "px";
      div.style.top = y + h + "px";
      div.style.backgroundColor = theme.hilightColor;
      div.style.display = "";
      div.oncontextmenu = function (e) {
        e.preventDefault();
      };
    }),
    (this.drawMarkColor = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      var className =
        "focusMark" + "_" + this.col + "_" + this.row + "_markColor";
      var div = document.createElement("div");
      div.setAttribute("class", className);
      this.stage.node.parentElement.appendChild(div);
      div.style.width = w + "px";
      div.style.height = h + "px";
      div.style.position = "absolute";
      div.style.left = x + "px";
      div.style.top = y + "px";
      div.style.backgroundColor = "rgb(128, 100, 162)";
      div.style.opacity = 0.2;
      div.style.display = "";
      div.setAttribute("autocomplete", "off");
      div.setAttribute("contenteditable", true);
      div.setAttribute("readonly", true);
      div.focus();
      div.onkeyup = function(e){
        if(e.key === 'Delete'){
          me.parentObj.clearCellContent();          
          me.parentObj.clearCellFormula();
        }
      }     
      div.onmousedown = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var buttonCode = getButtonCode(e);
        if (buttonCode == 0) {
          //鼠标左键
          me.parentObj.deSelectRect();
        }
      };
      div.oncontextmenu = function (event) {
        event.preventDefault();
        showCellContextMenuGlobal(event, me.parentObj, me.stage);        
      };
    }),
    (this.drawDragHand = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      var className =
        "focusMark" + "_" + this.col + "_" + this.row + "_dragHand";
      var div = document.createElement("div");
      div.setAttribute("class", className);
      this.stage.node.parentElement.appendChild(div);
      div.style.width = "5px";
      div.style.height = "5px";
      div.style.position = "absolute";
      div.style.left = x + w - 5 + "px";
      div.style.top = y + h - 5 + "px";
      div.style.backgroundColor = theme.hilightColor;
      div.style.display = "";
      div.style.cursor = "cell";
      div.oncontextmenu = function (e) {
        e.preventDefault();
      };
      div.addEventListener("dragstart", function (e) {
        e.preventDefault();
      });
      div.onmousedown = function (e) {
        g_isAutoFillDrag = true;
        me.parentObj.startAutoFill();
        me.parentObj.setAutoFillRange();
      };
      var fun1 = function (e) {
        if (!g_isAutoFillDrag) {
          return;
        }
        g_isAutoFillDrag = false;
        me.parentObj.removeAutoFillRect();
        me.parentObj.endAutoFill();
      };
      document.body.removeEventListener("mouseup", fun1);
      document.body.addEventListener("mouseup", fun1);
    }),
    (this.drawAutoFillLeftBorder = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      var className =
        "focusMark" + "_" + this.col + "_" + this.row + "_autofill_leftBorder";
      var div = document.createElement("div");
      div.setAttribute("class", className);
      this.stage.node.parentElement.appendChild(div);
      div.style.width = "2px";
      div.style.height = h + "px";
      div.style.position = "absolute";
      div.style.left = x + "px";
      div.style.top = y + "px";
      div.style.backgroundColor = "red";
      div.style.display = "";
      div.oncontextmenu = function (e) {
        e.preventDefault();
      };
    }),
    (this.drawAutoFillTopBorder = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      var className =
        "focusMark" + "_" + this.col + "_" + this.row + "_autofill_topBorder";
      var div = document.createElement("div");
      div.setAttribute("class", className);
      this.stage.node.parentElement.appendChild(div);
      div.style.width = w + "px";
      div.style.height = "2px";
      div.style.position = "absolute";
      div.style.left = x + "px";
      div.style.top = y + "px";
      div.style.backgroundColor = "red";
      div.style.display = "";
      div.oncontextmenu = function (e) {
        e.preventDefault();
      };
    }),
    (this.drawAutoFillRightBorder = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      var className =
        "focusMark" + "_" + this.col + "_" + this.row + "_autofill_rightBorder";
      var div = document.createElement("div");
      div.setAttribute("class", className);
      this.stage.node.parentElement.appendChild(div);
      div.style.width = "2px";
      div.style.height = h + "px";
      div.style.position = "absolute";
      div.style.left = x + w + "px";
      div.style.top = y + "px";
      div.style.backgroundColor = "red";
      div.style.display = "";
      div.oncontextmenu = function (e) {
        e.preventDefault();
      };
    }),
    (this.drawAutoFillBottomBorder = function () {
      var x = this.x;
      var y = this.y;
      var w = this.width;
      var h = this.height;
      var className =
        "focusMark" +
        "_" +
        this.col +
        "_" +
        this.row +
        "_autofill_bottomBorder";
      var div = document.createElement("div");
      div.setAttribute("class", className);
      this.stage.node.parentElement.appendChild(div);
      div.style.width = w + "px";
      div.style.height = "2px";
      div.style.position = "absolute";
      div.style.left = x + "px";
      div.style.top = y + h + "px";
      div.style.backgroundColor = "red";
      div.style.display = "";
      div.oncontextmenu = function (e) {
        e.preventDefault();
      };
    }),
    (this.focus = function () {
      if (this.isDrawColorMark) {
        this.drawMarkColor();
      }
      if (this.isFirstCol) {
        this.drawFocusLeftBorder();
      }
      if (this.isFirstRow) {
        this.drawFocusTopBorder();
      }
      if (this.isEndCol) {
        this.drawFocusRightBorder();
      }
      if (this.isEndRow) {
        this.drawFocusBottomBorder();
      }

      if (this.isDrawDragHand) {
        this.drawDragHand();
      }

      if (this.isCheckBox && this.checkBox) {
        this.checkBox.focus();
      }

      if (topLabelParentObj) {
        topLabelParentObj.hilightTopLabel(this.rangeStartCol, this.rangeEndCol);
      }
      if (leftLabelParentObj) {
        leftLabelParentObj.hilightLeftLabel(
          this.rangeStartRow,
          this.rangeEndRow
        );
      }

      me.parentObj.displayTextBoxFormula(this);

    }),
    (this.blur = function () {
      var tAr = [
        "leftBorder",
        "topBorder",
        "rightBorder",
        "bottomBorder",
        "dragHand",
        "markColor",
      ];
      for (var i = 0; i < tAr.length; i++) {
        var className =
          "focusMark" + "_" + this.col + "_" + this.row + "_" + tAr[i];
        var div = this.stage.node.parentElement.querySelector("." + className);
        if (div) {
          div.parentElement.removeChild(div);
        }
      }
      if (topLabelParentObj) {
        topLabelParentObj.unHilightTopLabel(
          this.rangeStartCol,
          this.rangeEndCol
        );
      }
      if (leftLabelParentObj) {
        leftLabelParentObj.unHilightLeftLabel(
          this.rangeStartRow,
          this.rangeEndRow
        );
      }
      me.parentObj.removeTextBoxFormula(this);
    }),
    (this.drawAutoFillBorder = function () {
      if (this.isFirstCol) {
        this.drawAutoFillLeftBorder();
      }
      if (this.isFirstRow) {
        this.drawAutoFillTopBorder();
      }
      if (this.isEndCol) {
        this.drawAutoFillRightBorder();
      }
      if (this.isEndRow) {
        this.drawAutoFillBottomBorder();
      }
    }),
    (this.removeAutoFillBorder = function () {
      var tAr = [
        "autofill_leftBorder",
        "autofill_topBorder",
        "autofill_rightBorder",
        "autofill_bottomBorder",
      ];
      for (var i = 0; i < tAr.length; i++) {
        var className =
          "focusMark" + "_" + this.col + "_" + this.row + "_" + tAr[i];
        var div = this.stage.node.parentElement.querySelector("." + className);
        if (div) {
          div.parentElement.removeChild(div);
        }
      }
    }),
    (this.displayValue = function (v) {
      this.value = v.toString();
      this.drawValue(this.cacheCtxTextLayer);
    }),
    (this.isScope = function (x, y) {
      if (x < this.x) {
        return false;
      }
      if (y < this.y) {
        return false;
      }
      if (x > this.x + this.width) {
        return false;
      }
      if (y > this.y + this.height) {
        return false;
      }
      return true;
    }),
    (this.buildEvent = function (events) {
      for (var p in events) {
        this.addEvent(p, events[p]);
      }
    });
  if (events) this.buildEvent(events);
  if(!this.readOnly){
    MyTextBoxManager.addA(this);
  } 
}
extend(MyTextBox, Thing);
