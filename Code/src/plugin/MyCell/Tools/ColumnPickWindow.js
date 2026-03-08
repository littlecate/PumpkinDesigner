"use strict";

/**
 * @fileoverview 列选择窗口模块 - 提供手动选择字段功能
 * @description 该模块创建一个窗口界面，允许用户从数据库表中选择字段并插入到单元格中。
 * 支持表名选择、表体序号选择、记录号选择和字段过滤功能。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 表格和列信息存储对象
 * @type {Object}
 * @property {Array.<Object>} columnInfoList - 列信息数组
 * @property {Array.<string>} tableNameList - 表名数组
 * @description 存储从数据库获取的表格和列信息
 */
let tableAndColumnInfos = {};

/**
 * 列选择窗口类
 * @class ColumnPickWindow
 * @description 创建一个用于手动选择数据库字段的窗口，用户可以浏览、搜索和选择字段插入到表格单元格中
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象（MyCellDesigner实例）
 * @param {HTMLElement} config.parentEl - 父元素
 */
function ColumnPickWindow(config) {
  let parentObj = config.parentObj;
  let parentEl = config.parentEl;

  var windowId = "div_select_columns";
  var windowDiv = document.getElementById(windowId);
  if (windowDiv) {
    windowDiv.parentElement.removeChild(windowDiv);
  }
  let win = new MyWindow({
    id: windowId,
    parent: parentEl.parentElement,
    isDrag: true,
    width: 400,
    height: 520,
    title: "手动选择字段",
  });

  let mainDiv = document.createElement("div");
  win.setWindowContent(mainDiv);
  
  let middleDivHeight = 420;
  let middleDivWidth = 380;

  let queryBarDiv, selectTableNameDiv, tableTitleDiv, tableBodyDiv;  
  mainDiv.style.width = "100%";
  mainDiv.style.height = "100%";
  mainDiv.style.boxSizing = "border-box";
  mainDiv.style.padding = "8px"; // 整体内边距，优化拥挤感

  let columnInfoList = tableAndColumnInfos.columnInfoList || [];
  let tableNameList = tableAndColumnInfos.tableNameList || [];
  let originalColumnInfoList = JSON.parse(JSON.stringify(columnInfoList));

  let columnWidthList = getColumnWidthList();
  let titleList = ["序号", "字段名", "类型", "字段意义"];
  let columnList = ["xuhao", "columnName", "columnType", "columnChName"];
  let textAlignList = ["center", "center", "center", "center"];

  let currentTableName = tableNameList[0];
  let currentBodyIndex = 0;
  let currentRecordNum = 1;
  let leftMark = "[#";
  let rightMark = "#]";

  doJobA();
  doJobB();

  /**
   * 初始化窗口UI组件
   * @function doJobA
   * @description 创建查询栏、表名选择、表标题和表体等UI组件
   * @returns {void}
   */
  function doJobA() {
    createQuerybarDiv();
    createSelectTableNameDiv();
    createTableTitleDiv();
    createTableBodyDiv();
    setupQuerybar();
    doJobB();
  }

  /**
   * 刷新窗口数据
   * @function doJobB
   * @description 根据当前选择刷新表名选择、表标题和表体内容
   * @returns {void}
   */
  function doJobB() {
    setupSelectTableNameDiv();
    setupTableTitle();
    setupTableBody();
  }

  /**
   * 设置表体内容
   * @function setupTableBody
   * @description 清空并重新填充表体中的字段列表
   * @returns {void}
   */
  function setupTableBody() {
    tableBodyDiv.innerHTML = "";
    for (let i = 0; i < columnInfoList.length; i++) {
      let o = columnInfoList[i];
      displayOne(o);
    }
  }

  /**
   * 设置表名选择区域
   * @function setupSelectTableNameDiv
   * @description 创建表名、表体序号和记录号的选择控件
   * @returns {void}
   */
  function setupSelectTableNameDiv() {
    selectTableNameDiv.innerHTML = "";
    selectTableNameDiv.style.display = "flex";
    selectTableNameDiv.style.alignItems = "center";
    selectTableNameDiv.style.gap = "6px"; // 弹性布局间距，替代float更规整
    selectTableNameDiv.style.paddingLeft = "2px";
    setupTableNameSelect();
    setupBodyIndexSelect();
    setupRecordNumSelect();
  }

  /**
   * 设置表体序号选择控件
   * @function setupBodyIndexSelect
   * @description 创建表体序号下拉选择框，范围0-9
   * @returns {void}
   */
  function setupBodyIndexSelect() {
    var t1 = document.createElement("div");
    t1.style.width = "60px";
    t1.style.height = "24px";
    t1.style.fontSize = "9pt";
    t1.style.color = "#333333"; // Light皮肤标准文字色
    t1.style.lineHeight = "24px";
    t1.innerHTML = "表体序号:";
    selectTableNameDiv.appendChild(t1);

    var t2 = document.createElement("select");
    // ====== 下拉框Light皮肤核心美化样式 ======
    t2.style.width = "40px";
    t2.style.height = "24px";
    t2.style.padding = "0 6px";
    t2.style.border = "1px solid #E5E7EB"; // 轻量级边框，贴合Light
    t2.style.borderRadius = "4px"; // 圆润边角
    t2.style.backgroundColor = "#FFFFFF"; // 纯白底色
    t2.style.color = "#333333";
    t2.style.fontSize = "9pt";
    t2.style.outline = "none"; // 清除默认高亮边框
    t2.style.cursor = "pointer";
    // hover/focus交互增强
    t2.onmouseover = () => t2.style.borderColor = "#C9CDD4";
    t2.onmouseout = () => t2.style.borderColor = "#E5E7EB";
    t2.onfocus = () => {
      t2.style.borderColor = "#94A3B8";
      t2.style.boxShadow = "0 0 0 2px rgba(148,163,184,0.15)";
    };
    // =========================================
    for (var i = 0; i < 10; i++) {
      var t3 = document.createElement("option");
      t3.value = i;
      t3.innerText = i;
      t2.appendChild(t3);
    }
    t2.onchange = function () {
      currentBodyIndex = t2.value;
    };
    selectTableNameDiv.appendChild(t2);
  }

  /**
   * 设置记录号选择控件
   * @function setupRecordNumSelect
   * @description 创建记录号下拉选择框，范围1-60
   * @returns {void}
   */
  function setupRecordNumSelect() {
    var t1 = document.createElement("div");
    t1.style.width = "50px";
    t1.style.height = "24px";
    t1.style.fontSize = "9pt";
    t1.style.color = "#333333";
    t1.style.lineHeight = "24px";
    t1.innerHTML = "记录号:";
    selectTableNameDiv.appendChild(t1);

    var t2 = document.createElement("select");
    // ====== 下拉框Light皮肤核心美化样式 ======
    t2.style.width = "50px";
    t2.style.height = "24px";
    t2.style.padding = "0 6px";
    t2.style.border = "1px solid #E5E7EB";
    t2.style.borderRadius = "4px";
    t2.style.backgroundColor = "#FFFFFF";
    t2.style.color = "#333333";
    t2.style.fontSize = "9pt";
    t2.style.outline = "none";
    t2.style.cursor = "pointer";
    t2.onmouseover = () => t2.style.borderColor = "#C9CDD4";
    t2.onmouseout = () => t2.style.borderColor = "#E5E7EB";
    t2.onfocus = () => {
      t2.style.borderColor = "#94A3B8";
      t2.style.boxShadow = "0 0 0 2px rgba(148,163,184,0.15)";
    };
    // =========================================
    for (var i = 1; i <= 60; i++) {
      var t3 = document.createElement("option");
      t3.value = i;
      t3.innerText = i;
      t2.appendChild(t3);
    }
    t2.onchange = function () {
      currentRecordNum = t2.value;
    };
    selectTableNameDiv.appendChild(t2);
  }

  /**
   * 设置表名选择控件
   * @function setupTableNameSelect
   * @description 创建表名下拉选择框
   * @returns {void}
   */
  function setupTableNameSelect() {
    var t1 = document.createElement("div");
    t1.style.width = "35px";
    t1.style.height = "24px";
    t1.style.fontSize = "9pt";
    t1.style.color = "#333333";
    t1.style.lineHeight = "24px";
    t1.innerHTML = "表名:";
    selectTableNameDiv.appendChild(t1);

    var t2 = document.createElement("select");
    // ====== 下拉框Light皮肤核心美化样式 ======
    t2.style.width = "80px";
    t2.style.height = "24px";
    t2.style.padding = "0 6px";
    t2.style.border = "1px solid #E5E7EB";
    t2.style.borderRadius = "4px";
    t2.style.backgroundColor = "#FFFFFF";
    t2.style.color = "#333333";
    t2.style.fontSize = "9pt";
    t2.style.outline = "none";
    t2.style.cursor = "pointer";
    t2.onmouseover = () => t2.style.borderColor = "#C9CDD4";
    t2.onmouseout = () => t2.style.borderColor = "#E5E7EB";
    t2.onfocus = () => {
      t2.style.borderColor = "#94A3B8";
      t2.style.boxShadow = "0 0 0 2px rgba(148,163,184,0.15)";
    };
    // =========================================
    for (var i = 0; i < tableNameList.length; i++) {
      var t3 = document.createElement("option");
      t3.value = tableNameList[i];
      t3.innerText = tableNameList[i];
      t2.appendChild(t3);
    }
    t2.onchange = function () {
      currentTableName = t2.value;
    };
    selectTableNameDiv.appendChild(t2);
  }

  /**
   * 设置查询栏
   * @function setupQuerybar
   * @description 创建过滤输入框和操作说明
   * @returns {void}
   */
  function setupQuerybar() {
    queryBarDiv.style.display = "flex";
    queryBarDiv.style.alignItems = "center";
    queryBarDiv.style.gap = "8px";
    queryBarDiv.style.padding = "0 2px";
    
    var input = document.createElement("input");
    input.setAttribute("type", "text"); // 修正原type="input"错误
    input.setAttribute("placeholder", "过滤字段名/字段意义");
    // ====== 文本框Light皮肤核心美化样式 ======
    input.style.width = "130px";
    input.style.height = "24px";
    input.style.padding = "0 10px";
    input.style.border = "1px solid #E5E7EB";
    input.style.borderRadius = "4px";
    input.style.backgroundColor = "#FFFFFF";
    input.style.color = "#333333";
    input.style.fontSize = "9pt";
    input.style.outline = "none";
    input.style.boxSizing = "border-box";
    // placeholder样式适配
    input.style.placeholder = "color: #94A3B8;";
    // hover/focus交互增强
    input.onmouseover = () => input.style.borderColor = "#C9CDD4";
    input.onmouseout = () => input.style.borderColor = "#E5E7EB";
    input.onfocus = () => {
      input.style.borderColor = "#94A3B8";
      input.style.boxShadow = "0 0 0 2px rgba(148,163,184,0.15)";
    };
    // =========================================
    input.onkeyup = function (e) {
      var t = input.value;
      filterRecord(t);
    };
    queryBarDiv.appendChild(input);

    var div = document.createElement("div");
    div.style.height = "24px";
    div.style.lineHeight = "24px";
    div.style.fontSize = "9pt";
    div.style.color = "#F56C6C"; // Light皮肤柔和警示色，替代刺眼纯红
    div.innerHTML = "操作说明:双击以选取字段";
    queryBarDiv.appendChild(div);
  }

  /**
   * 过滤记录
   * @function filterRecord
   * @description 根据输入的关键词过滤字段列表
   * @param {string} s - 过滤关键词
   * @returns {void}
   */
  function filterRecord(s) {
    columnInfoList = JSON.parse(JSON.stringify(originalColumnInfoList));
    columnInfoList = columnInfoList.FindAll(function (p) {
      return (
        p.tableName == currentTableName &&
        (p.columnName.Contains(s) || p.columnChName.Contains(s))
      );
    });
    doJobB();
  }

  /**
   * 获取列宽度列表
   * @function getColumnWidthList
   * @description 计算各列的宽度配置
   * @returns {Array.<number>} 列宽度数组
   */
  function getColumnWidthList() {
    var tAr = [50, 80, 60];
    var t = 0;
    for (var i = 0; i < tAr.length; i++) {
      t += tAr[i];
    }
    var t1 = middleDivWidth - t - 20;
    tAr.push(t1);
    return tAr;
  }

  /**
   * 创建查询栏DIV
   * @function createQuerybarDiv
   * @description 创建包含过滤输入框的查询栏容器
   * @returns {void}
   */
  function createQuerybarDiv() {
    var t1 = document.createElement("div");
    t1.style.width = "100%";
    t1.style.height = "40px";
    t1.style.display = "flex";
    t1.style.alignItems = "center";
    t1.style.justifyContent = "space-between";
    t1.style.padding = "0 8px";
    t1.style.boxSizing = "border-box";
    queryBarDiv = t1;
    mainDiv.appendChild(t1);
  }

  /**
   * 创建表名选择DIV
   * @function createSelectTableNameDiv
   * @description 创建包含表名、表体序号、记录号选择的容器
   * @returns {void}
   */
  function createSelectTableNameDiv() {
    var t1 = document.createElement("div");
    t1.style.width = "100%";
    t1.style.height = "40px";
    t1.style.display = "flex";
    t1.style.alignItems = "center";
    t1.style.justifyContent = "flex-start";
    t1.style.padding = "0 8px";
    t1.style.boxSizing = "border-box";
    t1.style.backgroundColor = "#F8FAFC";
    t1.style.borderRadius = "4px";
    selectTableNameDiv = t1;
    mainDiv.appendChild(t1);
  }

  /**
   * 创建表标题DIV
   * @function createTableTitleDiv
   * @description 创建包含列标题的表头容器
   * @returns {void}
   */
  function createTableTitleDiv() {
    var t1 = document.createElement("div");
    t1.style.width = "100%";
    t1.style.height = "30px";
    t1.style.backgroundColor = "#F8FAFC";
    t1.style.borderRadius = "4px 4px 0 0";
    t1.style.display = "flex";
    t1.style.alignItems = "center";
    t1.style.fontWeight = "600";
    t1.style.border = "1px solid #E2E8F0";
    t1.style.borderBottom = "none";
    tableTitleDiv = t1;
    mainDiv.appendChild(t1);
  }

  /**
   * 创建表体DIV
   * @function createTableBodyDiv
   * @description 创建包含字段列表的表体容器
   * @returns {void}
   */
  function createTableBodyDiv() {
    var t1 = document.createElement("div");
    t1.style.width = "100%";
    t1.style.height = middleDivHeight - 40 - 25 + "px";
    t1.style.overflow = "auto";
    t1.style.backgroundColor = "#FFFFFF";
    t1.style.border = "1px solid #E2E8F0";
    t1.style.borderRadius = "0 0 4px 4px";
    t1.style.boxSizing = "border-box";
    tableBodyDiv = t1;
    mainDiv.appendChild(t1);
  }

  /**
   * 设置表标题
   * @function setupTableTitle
   * @description 填充表头列标题内容
   * @returns {void}
   */
  function setupTableTitle() {
    tableTitleDiv.innerHTML = "";
    for (var i = 0; i < titleList.length; i++) {
      var t1 = document.createElement("div");
      t1.style.width = columnWidthList[i] + "px";
      t1.style.height = "100%";
      t1.style.textAlign = textAlignList[i];
      t1.style.fontSize = "9pt";
      t1.style.fontWeight = "600";
      t1.style.color = "#4A5568";
      t1.style.lineHeight = "30px";
      t1.style.padding = "0 8px";
      t1.style.boxSizing = "border-box";
      t1.innerHTML = titleList[i];
      tableTitleDiv.appendChild(t1);
    }
  }

  /**
   * 显示单条记录
   * @function displayOne
   * @description 创建并显示一行字段信息，支持双击选择
   * @param {Object} o - 字段信息对象
   * @param {number} o.xuhao - 序号
   * @param {string} o.columnName - 字段名
   * @param {string} o.columnType - 字段类型
   * @param {string} o.columnChName - 字段中文名
   * @returns {void}
   */
  function displayOne(o) {
    var div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "32px";
    div.style.borderBottom = "1px solid #E2E8F0";
    div.style.color = "#4A5568";
    div.style.userSelect = "none";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.backgroundColor = "#FFFFFF";
    div.style.transition = "background-color 0.2s ease";
    // 行hover高亮，增强交互
    div.onmouseover = () => {
      if (!div.classList.contains('selected')) {
        div.style.backgroundColor = "#F7FAFC";
      }
    };
    div.onmouseout = () => {
      if (!div.classList.contains('selected')) {
        div.style.backgroundColor = "#FFFFFF";
      }
    };
    
    div.addEventListener("dblclick", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var s =
        leftMark +
        currentTableName +
        "." +
        o.columnName +
        "." +
        currentBodyIndex +
        "." +
        currentRecordNum +
        "." +
        o.columnType +
        rightMark;
      var t = parentObj.setCurrentCellString(s);
      // 无论setCurrentCellString返回什么，都改变背景色
      div.classList.add('selected');
      div.style.backgroundColor = "#3182CE";
      div.style.color = "#FFFFFF";
      // 同时更新子元素的颜色
      var childDivs = div.querySelectorAll('div');
      for (var i = 0; i < childDivs.length; i++) {
        childDivs[i].style.color = "#FFFFFF";
      }
    });

    for (var i = 0; i < columnWidthList.length; i++) {
      var t1 = document.createElement("div");
      t1.style.width = columnWidthList[i] + "px";
      t1.style.height = "100%";
      t1.style.overflow = "hidden";
      t1.style.textOverflow = "ellipsis";
      t1.style.whiteSpace = "nowrap";
      t1.style.textAlign = textAlignList[i];
      t1.style.fontSize = "9pt";
      t1.style.lineHeight = "32px";
      t1.style.color = "#4A5568";
      t1.style.padding = "0 8px";
      t1.style.boxSizing = "border-box";
      t1.innerHTML = o[columnList[i]];
      div.appendChild(t1);
    }
    tableBodyDiv.appendChild(div);
  }
}