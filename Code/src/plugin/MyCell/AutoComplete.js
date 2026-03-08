"use strict";

/**
 * @fileoverview 自动完成下拉列表组件
 * @description 提供输入框自动完成功能，支持API查询和自定义查询函数两种数据获取方式
 * @module AutoComplete
 */

/**
 * 自动完成组件构造函数
 * @description 创建一个自动完成下拉列表组件，用于输入框的自动提示和选择功能
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象，用于回调设置值
 * @param {HTMLElement} config.parentEl - 父DOM元素，下拉列表将附加到此元素
 * @returns {Object} 自动完成组件实例，包含以下方法：
 *   - setAttr: 设置下拉列表属性
 *   - queryData: 查询数据
 *   - goUp: 向上移动选中项
 *   - goDown: 向下移动选中项
 *   - initValue: 初始化值
 *   - getValueObj: 获取当前选中项数据对象
 *   - hide: 隐藏下拉列表
 *   - show: 显示下拉列表
 */
function AutoComplete(config) {
  let parentObj = config.parentObj;
  let parentEl = config.parentEl;

  let div = document.createElement("div");
  parentEl.appendChild(div);

  let itemDataList = [];
  let columnInfoList = [];
  let itemList = [];
  let currentIndex = -1;
  let oldValue = "";
  let itemHeight = 0;
  let fontSize = "9pt";
  let textBox = null;
  let isDropDownListBox = false;
  let isHaveQueryed = false;

  /**
   * 向上移动选中项
   * @description 将当前选中项向上移动一位，如果已在顶部则保持不变
   * @private
   */
  function goUp() {
    deHighlightItem();
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    highlightItem();
    scrollView();
  }

  /**
   * 滚动视图以确保当前选中项可见
   * @description 根据当前选中项位置自动滚动下拉列表
   * @private
   */
  function scrollView() {
    var viewHeight = div.clientHeight;
    var currentHeight = getHeightNow();
    if (currentHeight < viewHeight) {
      div.scrollTop = 0;
      return;
    }
    var deltaHeight = currentHeight - viewHeight;
    div.scrollTop = deltaHeight;
  }

  /**
   * 获取当前选中项的高度位置
   * @description 计算当前选中项距离列表顶部的像素高度
   * @returns {number} 当前选中项的高度位置（像素）
   * @private
   */
  function getHeightNow() {
    return currentIndex * (itemHeight + 2);
  }

  /**
   * 向下移动选中项
   * @description 将当前选中项向下移动一位，如果已在底部则保持不变
   * @private
   */
  function goDown() {
    deHighlightItem();
    currentIndex++;
    if (currentIndex > itemList.length - 1) {
      currentIndex = itemList.length - 1;
    }
    highlightItem();
    scrollView();
  }

  /**
   * 取消当前项的高亮显示
   * @description 将当前选中项的背景色恢复为默认颜色
   * @private
   */
  function deHighlightItem() {
    if (currentIndex < 0 || currentIndex > itemList.length - 1) {
      return;
    }
    var item = itemList[currentIndex];
    item.style.backgroundColor = "lightgreen";
  }

  /**
   * 高亮显示当前选中项
   * @description 将当前选中项的背景色设置为高亮颜色
   * @private
   */
  function highlightItem() {
    if (currentIndex < 0 || currentIndex > itemList.length - 1) {
      return;
    }
    var item = itemList[currentIndex];
    item.style.backgroundColor = "#23A9F2";
  }

  /**
   * 获取当前选中项的数据对象
   * @description 返回当前选中项对应的原始数据对象
   * @returns {Object|null} 当前选中项的数据对象，如果无选中项则返回null
   */
  function getValueObj() {
    if (currentIndex == -1) {
      return null;
    }
    return itemDataList[currentIndex];
  }

  /**
   * 设置下拉列表的属性
   * @description 配置下拉列表的位置、大小和关联的文本框
   * @param {Object} attrObj - 属性对象
   * @param {number} attrObj.left - 左边距（像素）
   * @param {number} attrObj.top - 上边距（像素）
   * @param {HTMLElement} attrObj.textBox - 关联的文本框元素
   * @param {boolean} attrObj.isDropDownListBox - 是否为下拉列表模式
   */
  function setAttr(attrObj) {
    div.style.backgroundColor = "lightblue";
    div.style.position = "absolute";
    div.style.left = attrObj.left + "px";
    div.style.top = attrObj.top + "px";
    div.style.width = (parentEl.clientWidth - attrObj.left - 20) + "px";
    div.style.minHeight = 20 + "px";
    div.style.maxHeight = 320 + "px";
    div.style.overflow = "auto";
    textBox = attrObj.textBox;
    isDropDownListBox = attrObj.isDropDownListBox;
  }

  /**
   * 绘制下拉列表项
   * @description 根据数据数组创建并显示下拉列表项
   * @param {Array<Object>} dataList - 数据数组，每个元素为一个选项的数据对象
   * @private
   */
  function drawItems(dataList) {
    emptyItems();
    show();
    if (dataList.length == 0) {
      showEmptyMsg();
      return;
    }
    let itemWidth = getItemWidth();
    if (itemWidth < div.clientWidth) {
      itemWidth = div.clientWidth;
    }
    if (isDropDownListBox) {
      itemHeight = 20;
    } else {
      itemHeight = 30;
    }
    for (let i = 0; i < dataList.length; i++) {
      var item = document.createElement("div");
      item.style.width = itemWidth + "px";
      item.style.height = itemHeight + "px";
      item.style.backgroundColor = "lightgreen";
      item.style.marginTop = "1px";
      item.style.marginBottom = "1px";
      item.style.overflow = "hidden";
      item.style.fontSize = fontSize;
      item.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        parentObj.setAutoCompleteValue(textBox);
        hide();
      };
      item.onmouseover = function (e) {
        deHighlightItem(currentIndex);
        currentIndex = i;
        highlightItem();
      };
      itemList.push(item);
      div.appendChild(item);
      if (isDropDownListBox) {
        setItemsA(item, dataList[i]);
      } else {
        setItemsB(item, dataList[i]);
      }
    }
    highlightItem();
  }

  /**
   * 计算列表项的总宽度
   * @description 根据列信息计算列表项应有的总宽度
   * @returns {number} 列表项总宽度（像素）
   * @private
   */
  function getItemWidth() {
    var totalWidth = 0;
    for (var i = 0; i < columnInfoList.length; i++) {
      totalWidth += columnInfoList[i].width;
    }
    return totalWidth;
  }

  /**
   * 显示空数据提示信息
   * @description 当查询结果为空时显示提示信息
   * @private
   */
  function showEmptyMsg() {
    itemHeight = 20;
    var emptyDiv = document.createElement("div");
    emptyDiv.style.width = "100%";
    emptyDiv.style.height = itemHeight + "px";
    emptyDiv.style.backgroundColor = "lightyellow";
    emptyDiv.style.marginTop = "1px";
    emptyDiv.style.marginBottom = "1px";
    emptyDiv.style.overflow = "hidden";
    emptyDiv.style.fontSize = fontSize;
    emptyDiv.innerHTML = "未检索到与 【" + oldValue + "】相关的数据!";
    div.appendChild(emptyDiv);
  }

  /**
   * 设置列表项内容（带标题模式）
   * @description 为列表项添加多列内容，每列包含标题和值两行
   * @param {HTMLElement} itemElement - 列表项DOM元素
   * @param {Object} dataObj - 数据对象
   * @private
   */
  function setItemsB(itemElement, dataObj) {
    for (var i = 0; i < columnInfoList.length; i++) {
      var columnInfo = columnInfoList[i];
      var columnDiv = document.createElement("div");
      columnDiv.style.float = "left";
      columnDiv.style.height = "100%";
      columnDiv.style.width = columnInfo.width + "px";
      columnDiv.style.position = "relative";
      itemElement.appendChild(columnDiv);
      setItemsBSubItem(columnDiv, dataObj, columnInfo);
    }
  }

  /**
   * 设置列表项子元素内容（带标题模式）
   * @description 为单个列添加标题和值两行内容
   * @param {HTMLElement} columnElement - 列容器DOM元素
   * @param {Object} dataObj - 数据对象
   * @param {Object} columnInfo - 列信息对象
   * @param {string} columnInfo.columnName - 列名（数据属性名）
   * @param {string} columnInfo.columnChName - 列中文标题
   * @param {number} columnInfo.width - 列宽度
   * @private
   */
  function setItemsBSubItem(columnElement, dataObj, columnInfo) {
    var titleDiv = document.createElement("div");
    titleDiv.style.position = "absolute";
    titleDiv.style.left = "0px";
    titleDiv.style.top = "0px";
    titleDiv.style.width = "100%";
    titleDiv.style.height = "20px";
    titleDiv.style.fontSize = "9px";
    titleDiv.style.color = "#868686";
    titleDiv.innerHTML = columnInfo.columnChName;
    columnElement.appendChild(titleDiv);

    var valueDiv = document.createElement("div");
    valueDiv.style.position = "absolute";
    valueDiv.style.left = "0px";
    valueDiv.style.top = "10px";
    valueDiv.style.width = "100%";
    valueDiv.style.height = "20px";
    valueDiv.style.fontSize = fontSize;
    valueDiv.innerHTML = dataObj[columnInfo.columnName] || "";
    columnElement.appendChild(valueDiv);
  }

  /**
   * 设置列表项内容（简单模式）
   * @description 为列表项添加多列内容，每列只显示值
   * @param {HTMLElement} itemElement - 列表项DOM元素
   * @param {Object} dataObj - 数据对象
   * @private
   */
  function setItemsA(itemElement, dataObj) {
    for (var i = 0; i < columnInfoList.length; i++) {
      var columnInfo = columnInfoList[i];
      var columnDiv = document.createElement("div");
      columnDiv.style.float = "left";
      columnDiv.style.height = "100%";
      columnDiv.style.width = columnInfo.width + "px";
      columnDiv.innerHTML = dataObj[columnInfo.columnName] || "";
      itemElement.appendChild(columnDiv);
    }
  }

  /**
   * 清空所有列表项
   * @description 移除下拉列表中的所有选项，重置状态
   * @private
   */
  function emptyItems() {
    div.innerHTML = "";
    itemList.length = 0;
    currentIndex = -1;
  }

  /**
   * 查询数据
   * @description 根据配置查询数据，支持下拉列表模式和自动完成模式
   * @param {Object} queryObj - 查询参数对象
   * @param {string} queryObj.value - 当前输入值
   * @param {Array<Object>} queryObj.columnInfoList - 列信息数组
   * @param {string} queryObj.apiUrl - API接口地址（可选）
   * @param {Function} queryObj.queryFun - 自定义查询函数（可选）
   * @param {Object} queryObj.requestData - 请求数据对象
   */
  function queryData(queryObj) {
    if (isDropDownListBox) {
      queryDataB(queryObj);
    } else {
      queryDataA(queryObj);
    }
  }

  /**
   * 查询数据（下拉列表模式）
   * @description 下拉列表模式下只查询一次数据
   * @param {Object} queryObj - 查询参数对象
   * @private
   */
  function queryDataB(queryObj) {
    if (isHaveQueryed) {
      return;
    }
    isHaveQueryed = true;
    queryObj.requestData.v = "";
    queryDataDo(queryObj);
  }

  /**
   * 查询数据（自动完成模式）
   * @description 自动完成模式下，当输入值变化时重新查询
   * @param {Object} queryObj - 查询参数对象
   * @private
   */
  function queryDataA(queryObj) {
    if (queryObj.value == oldValue) {
      return;
    }
    oldValue = queryObj.value;
    queryDataDo(queryObj);
  }

  /**
   * 执行数据查询
   * @description 根据配置选择API查询或函数查询方式获取数据
   * @param {Object} queryObj - 查询参数对象
   * @private
   */
  function queryDataDo(queryObj) {
    columnInfoList = queryObj.columnInfoList;
    if (queryObj.apiUrl) {
      queryDataByApiUrl(queryObj);
    }
    else if (queryObj.queryFun) {
      queryDataByFun(queryObj);
    }
    else{
        console.log("表单自动下拉检索功能请配置apiUrl或queryFun");
    }
  }

  /**
   * 通过自定义函数查询数据
   * @description 调用自定义查询函数获取数据
   * @param {Object} queryObj - 查询参数对象
   * @param {Function} queryObj.queryFun - 自定义查询函数，返回Promise
   * @param {Object} queryObj.requestData - 请求数据对象
   * @private
   */
  function queryDataByFun(queryObj) {
     queryObj.queryFun(queryObj.requestData)
      .then((response) => {        
        itemDataList = response.data;
        drawItems(itemDataList);
      })
      .catch((response) => {
        itemDataList = [];
        drawItems(itemDataList);
      });
  }

  /**
   * 通过API URL查询数据
   * @description 调用API接口获取数据
   * @param {Object} queryObj - 查询参数对象
   * @param {string} queryObj.apiUrl - API接口地址
   * @param {Object} queryObj.requestData - 请求数据对象
   * @private
   */
  function queryDataByApiUrl(queryObj) {
    var encryptedData = JSON.stringify(queryObj.requestData);
    encryptedData = encodeURIComponent(encryptedData);
    encryptedData = myEncrypt(encryptedData);
    myAjaxJson(
      queryObj.apiUrl,
      encryptedData,
      function (responseData) {
        var parsedData = JSON.parse(responseData);
        if (parsedData["code"] == 200) {
          itemDataList = parsedData["data"];
        } else {
          itemDataList = [];
        }
        drawItems(itemDataList);
      },
      function () {
        itemDataList = [];
        drawItems(itemDataList);
      },
    );
  }

  /**
   * 初始化值
   * @description 设置初始值并重置查询状态
   * @param {string} value - 初始值
   */
  function initValue(value) {
    oldValue = value;
    isHaveQueryed = false;
  }

  /**
   * 隐藏下拉列表
   * @description 将下拉列表设置为不可见
   */
  function hide() {
    div.style.display = "none";
  }

  /**
   * 显示下拉列表
   * @description 将下拉列表设置为可见
   */
  function show() {
    div.style.display = "";
  }

  return {
    setAttr: setAttr,
    queryData: queryData,
    goUp: goUp,
    goDown: goDown,
    initValue: initValue,
    getValueObj: getValueObj,
    hide: hide,
    show: show,
  };
}
