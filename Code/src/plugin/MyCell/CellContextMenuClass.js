"use strict";

/**
 * @fileoverview 单元格右键菜单模块，提供复制、粘贴、合并、清除等操作菜单
 * @module CellContextMenuClass
 */

/**
 * 单元格右键菜单类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.pos - 菜单显示位置
 * @param {number} config.pos.x - X坐标
 * @param {number} config.pos.y - Y坐标
 * @param {string} config.instanceName - 实例名称
 * @param {Object} config.parentEl - 父元素
 * @param {Object} config.contextMenuThemeConfig - 主题配置
 */
function CellContextMenuClass(config) {
  var pos = config.pos;  
  var contextMenuThemeConfig = config.contextMenuThemeConfig || {};

  var id = "div_contextMenu_" + config.instanceName;
  var el = document.getElementById(id);
  if (el) {
    el.parentElement.removeChild(el);
  }
  var x = pos.x;
  var y = pos.y;    

  el = document.createElement("div");
  el.setAttribute("id", id);
  el.style.position = "absolute";
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.width = "100px";  
  el.style.zIndex = 9999;
  el.style.backgroundColor = "#fff";
  el.style.borderRadius = "4.8px";
  el.style.boxShadow = "0px 8px 15px 0px rgba(0,0,0,0.08)";
  el.style.userSelect = "none";
  el.oncontextmenu = function (e) {
    e.preventDefault();
  };  

  addMenuItems();

  config.parentEl.parentElement.appendChild(el);

  /**
   * 添加菜单项列表
   * @function addMenuItems
   */
  function addMenuItems() {
    var L = getMenuItems();
    for (var i = 0; i < L.length; i++) {
      var o = L[i];
      addOneMenuItem(o);
    }
  }

  /**
   * 添加单个菜单项
   * @function addOneMenuItem
   * @param {Object} o - 菜单项配置
   * @param {string} o.title - 菜单项标题
   * @param {Function} o.command - 点击回调函数
   */
  function addOneMenuItem(o) {
    if (o.title == "splitor") {
      var el1 = document.createElement("div");
      el1.style.width = "100%";
      el1.style.height = "6px";
      el1.style.textAlign = "center";
      el1.style.fontSize = "10pt";
      el1.style.marginTop = "2px";
      el1.style.marginBottom = "2px";
      el1.style.color = contextMenuThemeConfig.textColor || "black";
      el1.innerHTML = "<hr>";
      if (o.command) {
        el1.style.cursor = "pointer";
        el1.onclick = o.command;
      }
      el.appendChild(el1);
    } else {
      var el1 = document.createElement("div");
      el1.style.width = "100%";
      el1.style.height = "16px";
      el1.style.textAlign = "center";
      el1.style.fontSize = "10pt";
      el1.style.marginTop = "5px";
      el1.style.marginBottom = "5px";
      el1.style.color = contextMenuThemeConfig.textColor || "black";
      el1.innerHTML = o.title;
      if (o.command) {
        el1.style.cursor = "pointer";
        el1.onclick = o.command;
      }
      el.appendChild(el1);
    }
  }

  /**
   * 获取菜单项列表
   * @function getMenuItems
   * @returns {Array} 菜单项配置数组
   */
  function getMenuItems() {
    var a = [
      {
        title: "复制单元格",
        command: function () {
          myContextMenu.operObj.copyRange();
        },
      },
      {
        title: "粘贴单元格",
        command: function () {
          myContextMenu.operObj.paste();
        },
      },
      {
        title: "复制文本",
        command: function () {
          myContextMenu.operObj.copyText();
        },
      },
      {
        title: "粘贴文本",
        command: function () {
          myContextMenu.operObj.pasteText();
        },
      },     
      {
        title: "复制图片",
        command: function () {
          myContextMenu.operObj.copyImage();
        },
      },
      {
        title: "粘贴图片",
        command: function () {
          myContextMenu.operObj.pasteImage();
        },
      },
      {
        title: "splitor",
      },
      {
        title: "普通文本",
        command: function () {
          el.style.display = "none";
          myContextMenu.operObj.setNumType(0, true);
        },
      },
      {
        title: "修约设置",
        command: function () {
          el.style.display = "none";
          myContextMenu.operObj.amendSetting();
        },
      },
      {
        title: "splitor",
      },
      {
        title: "清除内容",
        command: function () {
          myContextMenu.operObj.clearCellContent();
        },
      },
      {
        title: "清除图片",
        command: function () {
          myContextMenu.operObj.clearCellImage();
        },
      },
      {
        title: "清除公式",
        command: function () {
          myContextMenu.operObj.clearCellFormula();
        },
      },
      {
        title: "清除隐藏内容",
        command: function () {
          myContextMenu.operObj.clearCellHiddenContent();
          el.style.display = "none";
        },
      },
      {
        title: "清除全部",
        command: function () {
          myContextMenu.operObj.clearCellAllContent();
        },
      },
      {
        title: "splitor",
      },
      {
        title: "合并单元格",
        command: function () {
          myContextMenu.operObj.mergeCells();
          el.style.display = "none";
        },
      },
      {
        title: "取消合并",
        command: function () {
          myContextMenu.operObj.unmergeCells();
          el.style.display = "none";
        },
      },
      {
        title: "splitor",
      },
      {
        title: "自动缩放",
        command: function () {
          myContextMenu.operObj.setCellAutoZoom(1);
          el.style.display = "none";
        },
      },
      {
        title: "不自动缩放",
        command: function () {
          myContextMenu.operObj.setCellAutoZoom(0);
          el.style.display = "none";
        },
      },
      {
        title: "自动折行",
        command: function () {
          myContextMenu.operObj.setCellTextStyle(2);
          el.style.display = "none";
        },
      },
      {
        title: "不自动折行",
        command: function () {
          myContextMenu.operObj.setCellTextStyle(1);
          el.style.display = "none";
        },
      },
      //    , {
      //    title: "splitor"
      //}, {
      //    title: "水平居左",
      //    command: function () {
      //        myContextMenu.operObj.setCellAlignLeft();
      //    }
      //}, {
      //    title: "水平居中",
      //    command: function () {
      //        myContextMenu.operObj.setCellAlignCenter();
      //    }
      //}, {
      //    title: "水平居右",
      //    command: function () {
      //        myContextMenu.operObj.setCellAlignRight();
      //    }
      //}, {
      //    title: "splitor"
      //}, {
      //    title: "垂直居上",
      //    command: function () {
      //        myContextMenu.operObj.setCellAlignTop();
      //    }
      //}, {
      //    title: "垂直居中",
      //    command: function () {
      //        myContextMenu.operObj.setCellAlignMiddle();
      //    }
      //}, {
      //    title: "垂直居下",
      //    command: function () {
      //        myContextMenu.operObj.setCellAlignBottom();
      //    }
      //}
    ];
    return a;
  }

  /**
   * 执行任务（空实现）
   * @function doJob
   */
  function doJob() {}

  return {
    doJob: doJob,
  };
}
