"use strict";

/**
 * @fileoverview 顶部标签右键菜单模块，提供列相关的右键菜单操作
 * @module TopLabelContextMenuClass
 */

/**
 * 顶部标签右键菜单类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.pos - 菜单显示位置
 * @param {number} config.pos.x - X坐标
 * @param {number} config.pos.y - Y坐标
 * @param {string} config.instanceName - 实例名称
 * @param {Object} config.parentEl - 父元素
 * @param {Object} config.contextMenuThemeConfig - 主题配置
 */
function TopLabelContextMenuClass(config) {
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
  el.style.left = pos.x + "px";
  el.style.top = pos.y + 10 + "px";
  el.style.width = "60px";
  el.style.height = "116px";
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

  function getMenuItems() {
    var a = [
      {
        title: "列宽",
        command: function () {
          var t = prompt("请录入列宽", "");
          if (t && !isNaN(t)) {
            topLabelParentObj.setColWidthA(t);
          }
          el.style.display = "none";
        },
      },
      {
        title: "隐藏",
        command: function () {
          topLabelParentObj.setColWidthA(0);
          el.style.display = "none";
        },
      },
      {
        title: "插入",
        command: function () {
          topLabelParentObj.insertCol();
        },
      },
      {
        title: "插入多列",
        command: function () {
          var t = prompt("请插入列数", "");
          if (t && !isNaN(t)) {
            var t1 = Number(t);
            topLabelParentObj.insertCol(t1);
          }
        },
      },
      {
        title: "删除",
        command: function () {
          topLabelParentObj.deleteCol();
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
