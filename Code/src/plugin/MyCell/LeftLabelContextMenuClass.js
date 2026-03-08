"use strict";

/**
 * @fileoverview 左侧标签右键菜单模块，提供行相关的右键菜单操作
 * @module LeftLabelContextMenuClass
 */

/**
 * 左侧标签右键菜单类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.pos - 菜单显示位置
 * @param {number} config.pos.x - X坐标
 * @param {number} config.pos.y - Y坐标
 * @param {string} config.instanceName - 实例名称
 * @param {Object} config.parentEl - 父元素
 * @param {Object} config.contextMenuThemeConfig - 主题配置
 */
function LeftLabelContextMenuClass(config) {
  var pos = config.pos;
  var contextMenuThemeConfig = config.contextMenuThemeConfig;

  var id = "div_contextMenu_" + config.instanceName;
  var el = document.getElementById(id);
  if (el) {
    el.parentElement.removeChild(el);
  }
  el = document.createElement("div");
  el.setAttribute("id", id);
  el.style.position = "absolute";
  el.style.left = pos.x + 15 + "px";
  el.style.top = pos.y + "px";
  //el.style.width = "100px";
  //el.style.height = "110px";  
  el.style.padding = "6px";
  el.style.backgroundColor = "#fff";
  el.style.borderRadius = "4.8px";
  el.style.boxShadow = "0px 8px 15px 0px rgba(0,0,0,0.08)";
  el.style.zIndex = 9999;
  el.style.userSelect = "none";
  el.oncontextmenu = function (e) {
    e.preventDefault();
  };
  el.onmouseleave = function(e){
    el.style.display = "none";
  }

  addMenuItems();

  config.parentEl.parentElement.appendChild(el);

  function addMenuItems() {
    var L = getMenuItems();
    for (var i = 0; i < L.length; i++) {
      var o = L[i];
      addOneMenuItem(o);
    }
  }

  function addOneMenuItem(o) {
    var el1 = document.createElement("div");
    el1.style.width = "100%";
    el1.style.height = "16px";
    el1.style.textAlign = "center";
    el1.style.fontSize = "10pt";
    el1.style.marginLeft = "0px";
    el1.style.marginBottom = "3px";
    el1.style.marginTop = "3px";
    el1.style.color = contextMenuThemeConfig.textColor || "black";
    el1.innerHTML = o.title;
    if (o.command) {
      el1.style.cursor = "pointer";
      el1.onclick = o.command;
    }
    el.appendChild(el1);
  }

  function getMenuItems() {
    var a = [
      {
        title: "行高",
        command: function () {
          var t = prompt("请录入行高", "");
          if (t && !isNaN(t)) {
            leftLabelParentObj.setRowHeightA(t);
          }
          el.style.display = "none";
        },
      },
      {
        title: "隐藏",
        command: function () {
          leftLabelParentObj.setRowHeightA(0);
          el.style.display = "none";
        },
      },
      {
        title: "插入",
        command: function () {
          leftLabelParentObj.insertRow();
        },
      },
      {
        title: "插入多行",
        command: function () {
          var t = prompt("请录入插入的行数", "");
          if (t && !isNaN(t)) {
            var t1 = Number(t);
            leftLabelParentObj.insertRow(t1);
          }
          el.style.display = "none";
        },
      },
      {
        title: "删除",
        command: function () {
          leftLabelParentObj.deleteRow();
        },
      },
      {
        title: "插入硬分页符",
        command: function () {
          leftLabelParentObj.insertHardPageBreakRow();
        },
      },
      {
        title: "清除硬分页符",
        command: function () {
          leftLabelParentObj.clearHardPageBreakRow();
        },
      },
    ];
    return a;
  }

  function doJob() {}

  return {
    doJob: doJob,
  };
}
