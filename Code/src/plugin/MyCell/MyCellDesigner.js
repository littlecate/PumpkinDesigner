"use strict";

/**
 * @fileoverview 单元格设计器核心模块
 * @description 提供类似Excel的单元格设计器功能，包括单元格编辑、格式设置、公式处理、图片插入、打印预览等功能
 * @module MyCellDesigner
 */

/**
 * 缩放比例（像素/点）
 * @type {number}
 * @constant
 */
let scaleRate = 96 / 72;

/**
 * 单元格消息提示对象
 * @type {Object|null}
 */
let cellMsg = null;

/**
 * 单元格消息提示对象2
 * @type {Object|null}
 */
let cellMsg2 = null;

/**
 * 计算信息列表
 * @type {Array|null}
 */
let calculateInfo = null;

/**
 * 当前选中的计算信息ID
 * @type {number}
 */
let g_calculateInfoOneId = -1;

/**
 * 当前公式符号
 * @type {string}
 */
let g_formulaSymbol = "";

/**
 * 是否匹配公式符号
 * @type {boolean}
 */
let g_isMatchFormulaSymbol = false;

/**
 * 当前选中应用索引
 * @type {number}
 */
let g_currentSelectApplyIndex = -1;

/**
 * 输入框容器ID
 * @type {string}
 */
let myInputContainerId = "";

/**
 * 输入框ID
 * @type {string}
 */
let myInputBoxId = "";

/**
 * 创建单元格消息提示对象2
 * @description 创建一个用于显示单元格相关消息的提示对象
 * @param {HTMLElement} parentEl - 父元素
 * @param {string} parentId - 父元素ID
 */
function createCellMsg2(parentEl, parentId) {
  cellMsg2 = new MyMsgEx2({
    parentId: parentId,
    parentDiv: parentEl.parentElement,
  });
}

/**
 * 创建单元格消息提示对象
 * @description 创建一个滑动显示的消息提示对象
 * @param {HTMLElement} parentEl - 父元素
 * @param {number} parentElWidth - 父元素宽度
 * @param {number} parentElHeight - 父元素高度
 */
function createCellMsg(parentEl, parentElWidth, parentElHeight) {
  var div = document.createElement("div");
  div.style.width = "300px";
  div.style.height = "50px";
  div.style.backgroundColor = "#FFFFCE";
  div.style.position = "absolute";
  div.style.left = (parentElWidth - 300) / 2 + "px";
  div.style.top = parentElHeight - 50 + "px";
  div.style.zIndex = 10000;
  div.style.textAlign = "center";
  div.style.display = "none";
  parentEl.appendChild(div);

  cellMsg = new MyMsgEx({
    slidingDiv: div,
    distanceX: 0,
    distanceY: 50,
    duration: 1000,
  });
}

/**
 * 显示单元格消息提示2
 * @description 使用消息提示对象2显示消息
 * @param {string} title - 标题
 * @param {string} s - 消息内容
 */
function showCellMsg2(title, s) {
  cellMsg2.showMsg(title, s);
}

/**
 * 显示单元格消息提示
 * @description 使用滑动消息提示对象显示消息
 * @param {string} s - 消息内容
 */
function showCellMsg(s) {
  cellMsg.setMsg(s);
  cellMsg.slideIn();
}

/**
 * 显示单元格右键菜单（全局）
 * @description 在指定位置显示单元格的右键上下文菜单
 * @param {Event} event - 鼠标事件
 * @param {Object} operObj - 操作对象
 * @param {Object} stage - 舞台对象
 */
function showCellContextMenuGlobal(event, operObj, stage) {
  myContextMenu.operObj = operObj;
  myContextMenu.stage = stage;
  var pos = Comman.getMousePosition(
    stage.parentEl.parentElement,
    event.pageX,
    event.pageY,
  );
  var t1 = Comman.getMousePosition(
    stage.node.parentElement.parentElement,
    event.pageX,
    event.pageY,
  );
  var t2 = Comman.getNodeRect(stage.node.parentElement);
  var menuHeight = 460;
  var t3 = t1.y + menuHeight - (t2.top + stage.node.parentElement.offsetHeight);
  if (t3 > 0) {
    pos.y = pos.y - t3;
  }
  myContextMenu.operObj.showCellContextMenu(pos);
}

/**
 * 当前主题对象
 * @type {Object}
 */
let theme;

/**
 * 字段左标记
 * @type {string}
 * @constant
 */
const leftMark = "[#";

/**
 * 字段右标记
 * @type {string}
 * @constant
 */
const rightMark = "#]";

/**
 * 是否只读文本
 * @type {boolean}
 */
let readOnlyText = false;

/**
 * 是否用于输入模式
 * @type {boolean}
 */
let g_isUseForInput = false;

/**
 * 单元格设计器构造函数
 * @description 创建一个功能完整的单元格设计器实例，提供类似Excel的电子表格功能
 * @param {Object} config - 配置对象
 * @param {Object} config.workbook - 工作簿对象
 * @param {number} [config.sheetIndex=0] - 工作表索引
 * @param {HTMLElement} config.parentEl - 父DOM元素
 * @param {boolean} [config.readOnly=false] - 是否只读模式
 * @param {boolean} [config.readOnlyText=false] - 是否只读文本
 * @param {boolean} [config.isDisplayToolbar=true] - 是否显示工具栏
 * @param {boolean} [config.isDisplayLabel=true] - 是否显示行列标签
 * @param {boolean} [config.isDisplayTabBar=true] - 是否显示标签栏
 * @param {boolean} [config.isPageMode=true] - 是否页面模式
 * @param {boolean} [config.isDisplayFormulaDesigner=true] - 是否显示公式设计器
 * @param {boolean} [config.isEnableFormulaTool=true] - 是否启用公式工具
 * @param {string} [config.theme='light'] - 主题名称
 * @param {number} [config.scaleRate] - 缩放比例
 * @param {string} [config.pdfGenUrl] - PDF生成URL
 * @param {string} [config.saveToUrl] - 保存URL
 * @param {Function} [config.saveMethod] - 保存方法
 * @param {Function} [config.setModelPropertyMethod] - 设置模型属性方法
 * @param {Object} [config.toolbarThemeConfig] - 工具栏主题配置
 * @param {Object} [config.labelThemeConfig] - 标签主题配置
 * @param {Object} [config.tabBarThemeConfig] - 标签栏主题配置
 * @param {Object} [config.contextMenuThemeConfig] - 右键菜单主题配置
 * @param {Object} [config.dialogThemeConfig] - 对话框主题配置
 * @returns {Object} 设计器实例，包含以下方法：
 *   - DoJob: 执行渲染任务
 *   - ClearPageView: 清除页面视图
 *   - ResetCellData: 重置单元格数据
 *   - GetFillDataObj: 获取填充数据对象
 *   - GetCellContent: 获取单元格内容
 *   - SetCellString: 设置单元格字符串
 *   - GetCellString: 获取单元格字符串
 *   - GetCurrentCol: 获取当前列
 *   - GetCurrentRow: 获取当前行
 *   - Save: 保存
 *   - Undo: 撤销
 *   - Redo: 重做
 */
function MyCellDesigner(config) {
  var instanceName = Guid.NewGuid();
  var isDoNotDraw = config.isDoNotDraw;
  var workbook = config.workbook;
  var sheetIndex = config.sheetIndex || 0;
  var sheetContent = workbook["sheets"][sheetIndex]["content"];
  //releaseData(sheetContent); //releaseData已经不能使用
  this._cellSheet = JSON.parse(JSON.stringify(sheetContent)); //激活Array.prototype扩展函数
  var readOnly = config.readOnly === true;
  readOnlyText = config.readOnlyText === true;
  var cellSheet = this._cellSheet;
  var parentEl = config.parentEl;
  var dwEdit = config.dwEdit;
  var instanceId = Guid.NewGuid();
  var pdfGenUrl = config.pdfGenUrl;
  var saveToUrl = config.saveToUrl;
  var isDisplayToolbar = config.isDisplayToolbar === true;
  var isDisplayLabel = config.isDisplayLabel === true;
  var isDisplayTabBar = config.isDisplayTabBar === true;
  var isPageMode = config.isPageMode === true;
  var isDisplayFormulaDesigner = config.isDisplayFormulaDesigner === true;
  var isEnableFormulaTool = config.isEnableFormulaTool === true;
  var toolbarThemeConfig = config.toolbarThemeConfig || {};
  var labelThemeConfig = config.labelThemeConfig || {};
  var tabBarThemeConfig = config.tabBarThemeConfig || {};
  var contextMenuThemeConfig = config.contextMenuThemeConfig || {};
  var dialogThemeConfig = config.dialogThemeConfig || {};
  var setAmendCallback = config.setAmendCallback || null;
  if (config.hasOwnProperty("isUseForInput")) {
    g_isUseForInput = config.isUseForInput;
  }
  if (config.hasOwnProperty("isUseCellDrawStringMode")) {
    isUseCellDrawStringMode = config.isUseCellDrawStringMode;
  }
  g_isCalFormula = config.isCalFormula || 1;
  isUseCommanColumnMaps = config.isUseCommanColumnMaps || false;
  autoFillColumnConvertStrObjs = config.autoFillColumnConvertStrObjs || {};
  isDebug = config.isDebug || false;
  checkResultMap = cellSheet.checkResultMap || [];
  calculateInfo = cellSheet.calculateInfo || [];
  setCheckResultCallBack = config.setCheckResultCallBack || undefined;
  needSetCheckBoxInfoList = config.needSetCheckBoxInfoList || [];
  let isSetReadOnlyCells = config.isSetReadOnlyCells;
  let onDrawCompleteDo = config.onDrawCompleteDo || undefined;
  theme = new Theme().getOne(config.theme || "light");
  var canvasId;
  var printInfo;
  var pageInfo;
  var page = null;
  var pageIndex = 0;
  var imageList = [];
  var startX = 0;
  var startY = 0;
  var contentWidth = 0;
  var contextMenuIdList = [];
  var isDesignMode = true;
  var selectStartCol = -1;
  var selectStartRow = -1;
  var selectEndCol = -1;
  var selectEndRow = -1;
  var selectStartColSingle = -1;
  var selectStartRowSingle = -1;
  var selectEndColSingle = -1;
  var selectEndRowSingle = -1;
  var selectedColRowList = [];
  var selectedTextBoxList = [];
  var haveDrawedColMarkList = [];
  var haveDrawedRowMarkList = [];
  var haveDrawedMarkDivList = [];
  var canvasImageData = null;
  var operCell = null;
  var operCellForDataMake = null;
  var parentElWidth = parentEl.clientWidth;
  var parentElHeight = parentEl.clientHeight;
  var leftLabelWidth = 25;
  var topLabelHeight = 22;
  var leftLabelPadding = config.leftLabelPadding || 4;
  var topLabelPadding = config.topLabelPadding || 4;
  if (!isDisplayLabel) {
    leftLabelWidth = 0;
    topLabelHeight = 0;
    leftLabelPadding = 0;
    topLabelPadding = 0;
  }
  var leftLabelCanvasHeight = 0;
  var topLabelCanvasWidth = 0;
  var cellAreaWidth = parentElWidth - leftLabelWidth - leftLabelPadding;
  var cellAreaHeight = parentElHeight - topLabelHeight - topLabelPadding;
  var toolbarHeight = 55;
  if (!isDisplayToolbar) {
    toolbarHeight = 0;
  }
  var formulaBarHeight = 0; //20;
  var deltaX = 0;
  var deltaY = 0;
  var isHScrolled = true;
  var isVScrolled = true;
  var stage = null;
  var myRedrawTimeout = 0;
  var drawSelectColFlagTimeout = 0;
  var drawSelectRowFlagTimeout = 0;
  var setRowHeightTimeout = 0;
  var setColWidthTimeout = 0;
  var drawStartRow = 0;
  var drawStartCol = 0;
  var leftXX = 0;
  var topYY = 0;
  var xCache = {};
  var yCache = {};
  var convertPageInfoList_Horizontal = [];
  var convertPageInfoList_Vertical = [];
  var convertPageInfoListAll = [];
  var beforePasteStr = "";
  var excelData = "";
  var formulaTool = null;
  var isSelectedAll = false;
  var formulaMarkEls = [];
  var checkResultMarkEls = [];
  var pdfCanvas = null;
  var isDrawComplete = true;
  var drawObjTypes = [];
  let definedBorderColor = 1;
  let definedLineStyle = 2;
  var cellToolbar;
  let inputBoxSelectText = "";
  let inputBoxSelectTextStartOffset = 0;
  let inputBoxSelectTextEndOffset = 0;
  let maybeSetValueEls = [];
  let templateRowCount = cellSheet.rowHeightList.length;
  fillDataMaps1 = cellSheet.fillDataMaps1 || {};
  fillDataMaps2 = cellSheet.fillDataMaps2 || {};

  let canInputCells = [];
  let isHaveSetCanInputCells = false;

  let autoFillRangeStartCol = -1;
  let autoFillRangeEndCol = -1;
  let autoFillRangeStartRow = -1;
  let autoFillRangeEndRow = -1;
  let autoFillRangeTextBoxList = [];

  if (config.scaleRate) {
    scaleRate = config.scaleRate;
  }
  var me = this;

  var fillDataObj = null;

  if (config.isNeedFillData) {
    isNeedRecordRecordFillDataMaps = true;
    fillDataObj = new FillData(this);
  }

  myInputContainerId = Guid.NewGuid();
  myInputBoxId = Guid.NewGuid();

  commanColumnMaps = config.commanColumnMaps || {};
  commanColumnMapsMainTable = config.commanColumnMapsMainTable || {};
  customDataTableName = config.customDataTableName || "customdata";

  scaleLineWidth();
  scalePage();

  repairFormulaCodeLine();

  if (isSetReadOnlyCells) {
    SetReadOnlyCells();
  }

  var totalWidth = GetTotalWidth();
  var totalHeight = GetTotalHeight();

  /**
   * 获取报表主体参数
   * @description 生成报表主体参数对象
   * @returns {Object} 报表主体参数
   */
  function getReportBodyParm() {
    return new CalReportBody({
      parentObj: me,
      operCell: operCell,
      cellSheet: cellSheet,
    }).doJob();
  }

  /**
   * 设置表和列信息
   * @description 设置表和列的映射信息
   * @param {Object} o - 表和列信息对象
   */
  function SetTableAndColumnInfos(o) {
    tableAndColumnInfos = o;
  }

  /**
   * 获取填充数据对象
   * @description 返回填充数据对象实例
   * @returns {Object} 填充数据对象
   */
  function GetFillDataObj() {
    return fillDataObj;
  }

  /**
   * 修复公式代码行
   * @description 遍历并修复所有公式的代码行
   */
  function repairFormulaCodeLine() {
    for (let i = 0; i < cellSheet.formulaList.length; i++) {
      repairFormulaCodeLineOne(cellSheet.formulaList[i]);
    }
  }

  /**
   * 修复单个公式代码行
   * @description 处理并修复单个公式的代码行
   * @param {Object} formula - 公式对象
   */
  function repairFormulaCodeLineOne(formula) {
    let L = [];
    for (let i = 0; i < formula.codeLineRaw.length; i++) {
      var t = Comman.SplitSource(formula.codeLineRaw[i]);
      L.AddRange(t);
    }
    formula.codeLineRaw = L;
    let codeLine = new ProcessFormulaCodeLine(formula.codeLineRaw).DoJob();
    formula.codeLine = codeLine;
  }

  let myResetCellDataInterval = 0;

  /**
   * 重置单元格数据
   * @description 重新加载并渲染单元格数据
   * @param {Object} _cellSheetData - 单元格数据
   * @param {boolean} isOnlyNeedRedrawText - 是否仅重绘文本
   * @param {boolean} isFromFillData - 是否来自填充数据
   */
  function ResetCellData(_cellSheetData, isOnlyNeedRedrawText, isFromFillData) {
    isHaveSetCanInputCells = false;
    if (myResetCellDataInterval) {
      clearInterval(myResetCellDataInterval);
    }
    myResetCellDataInterval = setInterval(function () {
      if (!isDrawComplete) {
        return;
      }
      clearInterval(myResetCellDataInterval);
      sheetContent = _cellSheetData;
      releaseData(sheetContent);
      me._cellSheet = JSON.parse(JSON.stringify(sheetContent)); //激活Array.prototype扩展函数
      cellSheet = me._cellSheet;
      repairFormulaCodeLine();
      templateRowCount = cellSheet.rowHeightList.length;
      if (!isFromFillData) {
        fillDataMaps1 = cellSheet.fillDataMaps1 || {};
        fillDataMaps2 = cellSheet.fillDataMaps2 || {};
      }
      operCell.Open(cellSheet);
      scalePage();
      totalWidth = GetTotalWidth();
      totalHeight = GetTotalHeight();
      if (config.isResizeParentEl) {
        ResizeParentElSize();
      }
      if (isOnlyNeedRedrawText) {
        drawObjTypes.push(DrawObjType.text);
      }
      checkResultMap = cellSheet.checkResultMap || [];
      calculateInfo = cellSheet.calculateInfo || [];
      RemoveCheckResultMarks();
      if (isSetReadOnlyCells && !isFromFillData) {
        SetReadOnlyCells();
      }
      drawObjTypes = [];
      redraw();
    }, 10);
  }

  this.resetCellData = ResetCellData;

  /**
   * 首次绘制单元格数据
   * @description 首次加载并渲染单元格数据
   * @param {Object} _cellSheetData - 单元格数据
   */
  this.drawCellDataFirstTime = function (_cellSheetData) {
    sheetContent = _cellSheetData;
    releaseData(sheetContent);
    me._cellSheet = null;
    me._cellSheet = JSON.parse(JSON.stringify(sheetContent)); //激活Array.prototype扩展函数
    cellSheet = me._cellSheet;
    repairFormulaCodeLine();
    templateRowCount = cellSheet.rowHeightList.length;
    operCell.Open(cellSheet);
    scalePage();
    totalWidth = GetTotalWidth();
    totalHeight = GetTotalHeight();
    if (config.isResizeParentEl) {
      ResizeParentElSize();
    }
    if (isDrawObj(DrawObjType.floatImage)) {
      FloatImageManager.Clear();
    }
    RemoveCheckResultMarks();
    DoJob();
  };

  /**
   * 调整父元素尺寸
   * @function ResizeParentElSize
   * @description 根据内容宽高调整父元素的尺寸
   */
  function ResizeParentElSize() {
    var w = totalWidth + 5;
    var h = totalHeight + 5;
    if (config.isDisplayLabel) {
      w += leftLabelWidth + leftLabelPadding;
      h += topLabelHeight + topLabelPadding;
    }
    if (config.isDisplayToolbar) {
      h += toolbarHeight;
    }
    parentEl.style.width = w + "px";
    parentEl.style.height = h + "px";
    if (config.isResizeParentParentEl) {
      parentEl.parentElement.style.width = w + 12 + "px";
      parentEl.parentElement.style.height = h + 12 + "px";
    }
    parentElWidth = w;
    parentElHeight = h;
    cellAreaWidth = parentElWidth - leftLabelWidth - leftLabelPadding;
    cellAreaHeight = parentElHeight - topLabelHeight - topLabelPadding;
  }

  if (config.isResizeParentEl) {
    ResizeParentElSize();
  }

  var doc = new Document({ parentEl: parentEl });
  operCell = new OperCell(me);
  operCell.Open(cellSheet);
  operCellForDataMake = new OperCell();

  if (isEnableFormulaTool) {
    formulaTool = new FormulaTool({
      parentObj: me,
      parentEl: parentEl,
      parentId: instanceId,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
      leftLabelWidth: leftLabelWidth,
      topLabelHeight: topLabelHeight,
      leftLabelPadding: leftLabelPadding,
      topLabelPadding: topLabelPadding,
      toolbarHeight: toolbarHeight,
      formulaBarHeight: formulaBarHeight,
    });
  }

  var tabBar = null;
  if (isDisplayTabBar) {
    tabBar = new CellTabBar({
      tabBarThemeConfig: tabBarThemeConfig,
      parentObj: me,
      parentEl: parentEl,
      parentId: instanceId,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
      leftLabelWidth: leftLabelWidth,
      topLabelHeight: topLabelHeight,
      leftLabelPadding: leftLabelPadding,
      topLabelPadding: topLabelPadding,
      toolbarHeight: toolbarHeight,
      formulaBarHeight: formulaBarHeight,
    });
  }

  var leftLabel = null;
  if (isDisplayLabel) {
    leftLabel = new LeftLabel({
      labelThemeConfig: labelThemeConfig,
      parentObj: me,
      parentEl: parentEl,
      parentId: instanceId,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
      leftLabelWidth: leftLabelWidth,
      topLabelHeight: topLabelHeight,
      leftLabelPadding: leftLabelPadding,
      topLabelPadding: topLabelPadding,
      toolbarHeight: toolbarHeight,
      formulaBarHeight: formulaBarHeight,
    });
  }

  var topLabel = null;
  if (isDisplayLabel) {
    setupLeftTopCornerButton();
    topLabel = new TopLabel({
      labelThemeConfig: labelThemeConfig,
      parentObj: me,
      parentEl: parentEl,
      parentId: instanceId,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
      leftLabelWidth: leftLabelWidth,
      topLabelHeight: topLabelHeight,
      leftLabelPadding: leftLabelPadding,
      topLabelPadding: topLabelPadding,
      toolbarHeight: toolbarHeight,
      formulaBarHeight: formulaBarHeight,
    });
  }

  if (isDisplayFormulaDesigner) {
    new FormulaDesigner({
      parentObj: me,
      parentEl: parentEl,
      parentId: instanceId,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
      leftLabelWidth: leftLabelWidth,
      topLabelHeight: topLabelHeight,
      leftLabelPadding: leftLabelPadding,
      topLabelPadding: topLabelPadding,
      toolbarHeight: toolbarHeight,
    }).doJob();
  }

  createCellMsg(parentEl, parentElWidth, parentElHeight);
  createCellMsg2(parentEl, instanceId);

  let autoComplete = new AutoComplete({ parentObj: me, parentEl: parentEl });

  /**
   * 设置左上角按钮
   * @function setupLeftTopCornerButton
   * @description 创建左上角的全选按钮，点击可选中所有单元格
   */
  function setupLeftTopCornerButton() {
    var div = document.createElement("div");
    div.style.width = leftLabelWidth - 2 + "px";
    div.style.height = topLabelHeight - 2 + "px";
    div.style.position = "absolute";
    div.style.top = toolbarHeight + "px";
    div.style.left = "0px";
    div.style.border = "1px solid #ABABAB";
    div.style.backgroundColor = "white";
    parentEl.parentElement.appendChild(div);

    var t = document.createElement("div");
    t.style.width = "11px";
    t.style.height = "11px";
    t.style.backgroundImage =
      "url(data:image/gif;base64,R0lGODlhCwALAIABAFBQUCkDPiH5BAEAAAEALAAAAAALAAsAAAIUjI+Aq3vtAnRwysdw0rxe43mgUQAAOw==)";
    t.style.position = "absolute";
    t.style.right = "0px";
    t.style.bottom = "0px";
    div.appendChild(t);

    div.onclick = function (e) {
      e.stopPropagation();
      me.selectall();
    };
  }

  this.showFormulaMark = function (calculateInfoOne) {
    ShowFormulaMark(calculateInfoOne);
  };

  /**
   * 显示公式标记
   * @function ShowFormulaMark
   * @param {Object} calculateInfoOne - 计算信息对象
   */
  function ShowFormulaMark(calculateInfoOne) {
    ClearFormulaMarkEls();
    var L = new RelaseOneFormula({
      cellSheet: cellSheet,
      calculateInfoOne: calculateInfoOne,
    }).releaseMaps();
    for (var i = 0; i < L.length; i++) {
      var t = L[i];
      for (var k = 0; k < t.formulaSymbolInfos.length; k++) {
        var t1 = t.formulaSymbolInfos[k];
        drawFormulaMark(
          calculateInfoOne.id,
          t.col,
          t.row,
          [t1.formulaSymbol],
          t1.index,
        );
      }
    }
  }

  /**
   * 清除公式标记元素
   * @function ClearFormulaMarkEls
   * @description 移除所有公式标记DOM元素
   */
  function ClearFormulaMarkEls() {
    for (var i = 0; i < formulaMarkEls.length; i++) {
      var t = formulaMarkEls[i];
      t.parentElement.removeChild(t);
    }
    formulaMarkEls = [];
  }

  this.clearFormulaMarkEls = ClearFormulaMarkEls;

  var drawFormulaMark = function (
    calculateInfoOneId,
    col,
    row,
    formulaSymbols,
    index,
  ) {
    var t1 = getTextBox(col, row);
    if (!t1) {
      return;
    }
    var x = t1.x;
    var y = t1.y;
    var h = t1.height;
    var w = t1.width;
    var id =
      "formulaMark_" +
      config.instanceId +
      "_" +
      calculateInfoOneId +
      "_" +
      col +
      "_" +
      row;
    var t = document.getElementById(id);
    if (t) {
      t.parentElement.removeChild(t);
    }
    var w1 = 30 * formulaSymbols.length;
    var t2 = document.createElement("div");
    t2.style.width = w1 + "px";
    t2.style.height = "20px";
    t2.style.position = "absolute";
    t2.style.left = x + (w - w1) / 2 + "px";
    t2.style.top = y + "px";
    formulaMarkEls.push(t2);
    parentEl.appendChild(t2);

    var t = {
      parentDiv: t2,
      backgroundImage:
        getLocation() + "/images/FormulaTool/ball" + (index + 1) + ".png",
      width: 10,
      height: 10,
      onclick: function () {},
    };
    var o2 = new MyButtonEx(t);
    var t4 = o2.getEl();
    t4.style.float = "right";
    t4.style.clear = "none";

    for (var i = 0; i < formulaSymbols.length; i++) {
      var t3 = document.createElement("div");
      t3.style.height = "100%";
      t3.style.width = "20px";
      t3.style.color = "red";
      t3.style.fontSize = "16pt";
      t3.style.fontWeight = "bold";
      t3.style.fontStyle = "italic";
      t3.innerHTML = formulaSymbols[i];
      t2.appendChild(t3);
    }
  };

  this.showFormulaDesign = function () {
    if (formulaTool.getIsDisplay()) {
      formulaTool.hide();
    } else {
      formulaTool.show();
    }
  };

  this.setCurrentCellString = function (s) {
    var col = GetCurrentCol();
    var row = GetCurrentRow();
    if (col == 0 || row == 0) {
      alert("请先选择一个单元格!");
      return false;
    }
    SetCellString(col, row, 0, s);
    removeInput();
    this.redrawOneCell(col - 1, row - 1);
    return true;
  };

  this.autoFillColumns = function () {
    new AutoFillColumns({
      parentObj: me,
      operCell: operCell,
      cellSheet: cellSheet,
    }).doJob();
  };

  function RemoveCheckResultMarks() {
    for (var i = 0; i < checkResultMarkEls.length; i++) {
      var t = checkResultMarkEls[i];
      if (t && t.parentElement) {
        t.parentElement.removeChild(t);
      }
    }
    checkResultMarkEls = [];
  }

  this.removeCheckResultMarks = RemoveCheckResultMarks;

  /**
   * 显示检查结果标记
   * @function ShowCheckResultMarks
   * @description 显示当前选中检查结果的所有标记
   */
  function ShowCheckResultMarks() {
    RemoveCheckResultMarks();
    var t2 = g_forSelectCheckResult.split(".");
    var parmName = t2[0];
    var itemName = t2[1];
    var t3 = checkResultMap.find((p) => p.parmname == parmName);
    var t4 = t3.items[itemName];
    for (var i = 0; i < t4.length; i++) {
      drawCheckResultMap(t4[i], parmName, itemName);
    }
  }

  this.showCheckResultMarks = ShowCheckResultMarks;

  function drawCheckResultMap(s, parmName, itemName) {
    var tAr = s.split("_");
    let col = Number(tAr[0]);
    let row = Number(tAr[1]);
    var t1 = getTextBox(col, row);
    if (!t1) {
      return;
    }
    var x = t1.x;
    var y = t1.y;
    var h = t1.height;
    var w = t1.width;
    var id = "checkResultMark_" + config.instanceId + "_" + col + "_" + row;
    var t = document.getElementById(id);
    if (t) {
      t.parentElement.removeChild(t);
    }
    var w1 = 30;
    var h1 = 30;
    var t2 = document.createElement("div");
    t2.style.width = w1 + "px";
    t2.style.height = h1 + "px";
    t2.style.position = "absolute";
    t2.style.left = x + (w - w1) / 2 + "px";
    t2.style.top = y + (h - h1) / 2 + "px";
    checkResultMarkEls.push(t2);
    parentEl.appendChild(t2);

    var index = checkResultMapItemNames.indexOf(itemName) + 1;
    var t = {
      parentDiv: t2,
      backgroundImage:
        getLocation() + "/images/FormulaTool/ball" + index + ".png",
      width: 30,
      height: 30,
      onclick: function () {},
    };
    var o2 = new MyButtonEx(t);

    var tt1 = {
      parentDiv: t2,
      backgroundImage: closeButtonImage,
      width: 10,
      height: 10,
      onclick: function () {
        deleteCheckResultMark(s, parmName, itemName);
      },
    };
    var o3 = new MyButtonEx(tt1);
    var t5 = o3.getEl();
    t5.style.position = "absolute";
    t5.style.top = "0px";
    t5.style.right = "0px";
  }

  /**
   * 删除检查结果标记
   * @function deleteCheckResultMark
   * @param {string} s - 标记位置字符串
   * @param {string} parmName - 参数名称
   * @param {string} itemName - 项目名称
   */
  function deleteCheckResultMark(s, parmName, itemName) {
    var t = checkResultMap.find((p) => p.parmname == parmName);
    t.items[itemName].Remove(s);
    ShowCheckResultMarks();
  }

  /**
   * 释放数据
   * @function releaseData
   * @description 解析单元格字符串数据并转换为单元格对象数组
   * @param {Object} cellSheet - 单元格工作表对象
   */
  function releaseData(cellSheet) {
    if (cellSheet.cells != null && cellSheet.cells.length > 0) {
      return;
    }
    var LAll = [];
    for (var i = 0; i < cellSheet.cellsStr.length; i++) {
      var L1 = [];
      for (var k = 0; k < cellSheet.cellsStr[i].length; k++) {
        var t1 = {};
        var t2 = cellSheet.cellsStr[i][k];
        var tAr = t2.split(",");
        t1.str = decodeStr(tAr[0]);
        t1.backgroundColor = getIntV(tAr[1]);
        t1.borderLeft = getIntV(tAr[2]);
        t1.borderTop = getIntV(tAr[3]);
        t1.borderRight = getIntV(tAr[4]);
        t1.borderBottom = getIntV(tAr[5]);
        t1.borderLeftColor = getIntV(tAr[6]);
        t1.borderTopColor = getIntV(tAr[7]);
        t1.borderRightColor = getIntV(tAr[8]);
        t1.borderBottomColor = getIntV(tAr[9]);
        t1.imageIndex = getIntV(tAr[10]);
        t1.imageStyle = getIntV(tAr[11]);
        t1.imageHAlign = getIntV(tAr[12]);
        t1.imageVAlign = getIntV(tAr[13]);
        t1.fontFamily = cellSheet.fontFamilyList[getIntV(tAr[14])];
        t1.fontSize = getFloatV(tAr[15]);
        t1.fontStyle = getIntV(tAr[16]);
        t1.fontColor = getIntV(tAr[17]);
        t1.lineSpace = getFloatV(tAr[18]);
        t1.cellHAlign = getIntV(tAr[19]);
        t1.cellVAlign = getIntV(tAr[20]);
        t1.isInMergeArea = getBooleanV(tAr[21]);
        t1.mergeAreaId = tAr[22];
        t1.formulaId = tAr[23];
        t1.note = tAr[24];
        t1.numType = getIntV(tAr[25]);
        t1.digital = getIntV(tAr[26]);
        t1.isMultiLine = getBooleanV(tAr[27]);
        t1.isAutoScale = getBooleanV(tAr[28]);
        L1.push(t1);
      }
      LAll.push(L1);
    }
    cellSheet.cells = LAll;
  }

  /**
   * 获取布尔值
   * @function getBooleanV
   * @param {string} v - 字符串值
   * @returns {boolean} 布尔值
   */
  function getBooleanV(v) {
    return v == "1";
  }

  /**
   * 获取浮点数值
   * @function getFloatV
   * @param {string} v - 字符串值
   * @returns {number} 浮点数值
   */
  function getFloatV(v) {
    return parseFloat(v);
  }

  /**
   * 获取整数值
   * @function getIntV
   * @param {string} v - 字符串值
   * @returns {number} 整数值
   */
  function getIntV(v) {
    return parseInt(v);
  }

  /**
   * 解码字符串
   * @function decodeStr
   * @param {string} s - 编码字符串
   * @returns {string} 解码后的字符串
   */
  function decodeStr(s) {
    return s.replace(/\{\$\}/g, ",");
  }

  /**
   * 执行渲染任务
   * @function DoJob
   * @param {boolean} isRedrawMark - 是否重绘标记
   * @description 主渲染函数，负责绘制单元格、标签、选择框等所有内容
   */
  function DoJob(isRedrawMark) {
    if (isDoNotDraw) {
      return;
    }
    isDrawComplete = false;
    if (
      isDrawObj(DrawObjType.backgroundImage) ||
      isDrawObj(DrawObjType.cellImage) ||
      isDrawObj(DrawObjType.floatImage)
    ) {
      loadAllImages();
    }
    printInfo = cellSheet.printInfo;
    pageInfo = printInfo;
    startX = 0;
    startY = 0;
    totalHeight = GetTotalHeight();
    totalWidth = GetTotalWidth();
    if (isDisplayLabel) {
      if (isDrawObj(DrawObjType.leftLabel)) {
        drawLeftLabel();
      }
      if (isDrawObj(DrawObjType.topLabel)) {
        drawTopLabel();
      }
    }
    var myInterval = setInterval(function () {
      if (!isAllImageIsLoad()) {
        return;
      }
      clearInterval(myInterval);
      drawPageDo();
      page.render();
      if (isRedrawMark) redrawMark();
      drawObjTypes = [];
      isDrawComplete = true;
      me.displaySomeInfo();
      if (onDrawCompleteDo) {
        onDrawCompleteDo(me);
      }
    }, 1);
  }

  function isDrawObj(drawObjType) {
    if (drawObjTypes.length == 0) {
      return true;
    }
    return drawObjTypes.indexOf(drawObjType) != -1;
  }

  function drawPageDo() {
    if (page == null) {
      page = doc.AddNewPage(totalWidth, totalHeight);
      pdfCanvas = new CellCanvas(page);
      stage = doc.getStageByIndex(pageIndex);
      setupScrollBarEvent();
      if (isDisplayToolbar) setupToolbar();
      if (isDisplayTabBar) {
        tabBar.drawTabs(["sheet1"]);
        tabBar.render();
      }
    }
    if (
      isDrawObj(DrawObjType.grid) ||
      isDrawObj(DrawObjType.backgroundImage) ||
      isDrawObj(DrawObjType.floatImage)
    ) {
      var headHeight = Comman.GetHeadHeight(cellSheet);
      var tailHeight = Comman.GetTailHeight(cellSheet);
      convertPageInfoList_Horizontal =
        GetConvertPageInfoList_Horizontal(cellSheet);
      convertPageInfoList_Vertical = GetConvertPageInfoList_Vertical(
        cellSheet,
        headHeight,
        tailHeight,
      );
      convertPageInfoListAll = MergeHorizontalAndVerticalPageInfo(
        convertPageInfoList_Horizontal,
        convertPageInfoList_Vertical,
      );
    }
    drawCells();
    removeContextMenuFun();
    if (!config.doNotDrawPageBreakLines) {
      drawPageBreakLines();
    }
  }

  /**
   * 记录撤销内容
   * @function recordUndoContent
   * @description 将当前状态保存到撤销历史中
   */
  function recordUndoContent() {
    myUndoRedo.recordUndoContent({
      sheetIndex: sheetIndex,
      content: Comman.DeepCopyObj(cellSheet),
      operObj: me,
    });
  }

  /**
   * 记录重做内容
   * @function recordRedoContent
   * @description 将当前状态保存到重做历史中
   */
  function recordRedoContent() {
    myUndoRedo.recordRedoContent({
      sheetIndex: sheetIndex,
      content: Comman.DeepCopyObj(cellSheet),
      operObj: me,
    });
  }

  /**
   * 移除右键菜单
   * @function removeContextMenuFun
   * @description 移除当前显示的右键上下文菜单
   */
  function removeContextMenuFun() {
    var id = "div_contextMenu_" + instanceName;
    var el = document.getElementById(id);
    if (el) {
      el.parentElement.removeChild(el);
    }
  }

  this.removeContextMenu = removeContextMenuFun;

  /**
   * 绘制分页线
   * @function drawPageBreakLines
   * @description 绘制水平和垂直方向的分页线
   */
  function drawPageBreakLines() {
    pdfCanvas.SaveState();
    drawPageBreakLinesV();
    drawPageBreakLinesH();
    pdfCanvas.RestoreState();
  }

  /**
   * 绘制水平分页线
   * @function drawPageBreakLinesH
   * @description 绘制水平方向的分页线
   */
  function drawPageBreakLinesH() {
    var L1 = convertPageInfoList_Horizontal;
    for (var i = 1; i < L1.length; i++) {
      var startCol = L1[i].startCol + 1;
      if (startCol == 0) {
        startCol = 1;
      }
      var endCol = L1[i].endCol + 1;
      if (endCol == 0) {
        endCol = operCell.GetCols(0) - 1;
      }
      var startRow = L1[i].startRow + 1;
      if (startRow == 0) {
        startRow = 1;
      }
      var endRow = L1[i].endRow + 1;
      if (endRow == 0) {
        endRow = operCell.GetRows(0) - 1;
      }
      pdfCanvas.BeginPath();
      var x1 = GetRangeX(startCol - 1);
      var y1 = 0;
      var x2 = GetRangeX(startCol - 1);
      var y2 = GetRangeY(operCell.GetRows(0) - 1);
      pdfCanvas.SetLineWidth(2);
      pdfCanvas.SetStrokeColor("blue");
      pdfCanvas.SetLineDash([2, 2]);
      pdfCanvas.MoveTo(x1, y1);
      pdfCanvas.LineTo(x2, y2);
      pdfCanvas.Stroke();
      pdfCanvas.EndPath();
    }
  }

  /**
   * 绘制垂直分页线
   * @function drawPageBreakLinesV
   * @description 绘制垂直方向的分页线
   */
  function drawPageBreakLinesV() {
    var L1 = convertPageInfoList_Vertical;
    for (var i = 0; i < L1.length - 1; i++) {
      var startCol = L1[i].startCol + 1;
      if (startCol == 0) {
        startCol = 1;
      }
      var endCol = L1[i].endCol + 1;
      if (endCol == 0) {
        endCol = operCell.GetCols(0) - 1;
      }
      var startRow = L1[i].startRow + 1;
      if (startRow == 0) {
        startRow = 1;
      }
      var endRow = L1[i].endRow + 1;
      if (endRow == 0) {
        endRow = operCell.GetRows(0) - 1;
      }
      pdfCanvas.BeginPath();
      var x1 = GetRangeX(startCol - 1);
      var y1 = GetRangeY(endRow);
      var x2 = GetRangeX(endCol);
      var y2 = GetRangeY(endRow);
      pdfCanvas.SetLineWidth(2);
      pdfCanvas.SetStrokeColor("blue");
      pdfCanvas.SetLineDash([2, 2]);
      pdfCanvas.MoveTo(x1, y1);
      pdfCanvas.LineTo(x2, y2);
      pdfCanvas.Stroke();
      pdfCanvas.EndPath();
    }
  }

  /**
   * 绘制左侧标签
   * @function drawLeftLabel
   * @description 绘制Excel表格左侧的行标签（1, 2, 3...）
   */
  function drawLeftLabel() {
    leftLabel.setCanvasHeight(totalHeight + 50);
    leftLabel.resetContent();
    var rowHeightList = cellSheet.rowHeightList;
    var y = startY;
    for (var row = drawStartRow; row < rowHeightList.length; row++) {
      leftLabel.drawOneLabel(
        row,
        (row + 1).toString(),
        0,
        y,
        leftLabelWidth,
        rowHeightList[row],
      );
      y += rowHeightList[row];
    }
    leftLabel.render();
  }

  function scrollLeftLabel() {
    leftLabel.scroll(deltaY);
  }

  let addRowHeightObj = null;
  this.clearAddHeightObj = function () {
    addRowHeightObj = null;
  };

  this.setAddRowHeight = function (row, addNum) {
    if (!addRowHeightObj) {
      addRowHeightObj = {};
    }
    if (!addRowHeightObj[row]) {
      addRowHeightObj[row] = addNum;
    } else {
      addRowHeightObj[row] += addNum;
    }
  };

  this.addRowHeightM = function (row) {
    if (!addRowHeightObj) {
      return;
    }
    var addNum = addRowHeightObj[row];
    if (!addNum) {
      return;
    }
    this.addRowHeight(row, addNum);
  };

  this.addRowHeight = function (row, addNum) {
    var h = cellSheet.rowHeightList[row];
    h += addNum;
    if (h < 0) {
      h = 0;
    }
    recordUndoContent();
    cellSheet.rowHeightList[row] = h;
    for (var i = selectStartRowSingle; i <= selectEndRowSingle; i++) {
      cellSheet.rowHeightList[i] = h;
    }
    recordRedoContent();
    requestAnimationFrame(_redraw__);
  };

  let addColWidthObj = null;
  this.clearAddWidthObj = function () {
    addColWidthObj = null;
  };

  this.setAddColWidth = function (col, addNum) {
    if (!addColWidthObj) {
      addColWidthObj = {};
    }
    if (!addColWidthObj[col]) {
      addColWidthObj[col] = addNum;
    } else {
      addColWidthObj[col] += addNum;
    }
  };

  this.addColWidthM = function (col) {
    if (!addColWidthObj) {
      return;
    }
    var addNum = addColWidthObj[col];
    if (!addNum) {
      return;
    }
    this.addColWidth(col, addNum);
  };

  this.addColWidth = function (col, addNum) {
    var w = cellSheet.colWidthList[col];
    w += addNum;
    if (w < 0) {
      w = 0;
    }
    recordUndoContent();
    cellSheet.colWidthList[col] = w;
    for (var i = selectStartColSingle; i <= selectEndColSingle; i++) {
      cellSheet.colWidthList[i] = w;
    }
    recordRedoContent();
    requestAnimationFrame(_redraw__);
  };

  function _redraw__() {
    redraw({ isNeedRedrawMark: true });
  }

  this.setRowHeightA = function (v) {
    if (selectStartRowSingle == -1 || selectEndRowSingle == -1) {
      return;
    }
    if (v !== 0) {
      if (v == "" || isNaN(v)) {
        alert("行高必须是数字!");
        return;
      }
    }
    recordUndoContent();
    for (var row = selectStartRowSingle; row <= selectEndRowSingle; row++) {
      cellSheet.rowHeightList[row] = parseFloat(v);
    }
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  };

  this.setColWidthA = function (v) {
    if (selectStartColSingle == -1 || selectEndColSingle == -1) {
      return;
    }
    if (v !== 0) {
      if (v == "" || isNaN(v)) {
        alert("列宽必须是数字!");
        return;
      }
    }
    recordUndoContent();
    for (var col = selectStartColSingle; col <= selectEndColSingle; col++) {
      cellSheet.colWidthList[col] = parseFloat(v);
    }
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  };

  /**
   * 绘制顶部标签
   * @function drawTopLabel
   * @description 绘制Excel表格顶部的列标签（A, B, C...）
   */
  function drawTopLabel() {
    topLabel.setCanvasWidth(totalWidth + 50);
    topLabel.resetContent();
    var colWidthList = cellSheet.colWidthList;
    var x = startX;
    for (var col = drawStartCol; col < colWidthList.length; col++) {
      topLabel.drawOneLabel(
        col,
        Comman.GetColStr(col + 1),
        x,
        0,
        colWidthList[col],
        topLabelHeight,
      );
      x += colWidthList[col];
    }
    topLabel.render();
  }

  function scrollTopLabel() {
    topLabel.scroll(deltaX);
  }

  this.hilightTopLabel = function (startCol, endCol) {
    for (var col = startCol; col <= endCol; col++) {
      topLabel.showHilightTopLabelOneX(col);
    }
  };

  this.unHilightTopLabel = function (startCol, endCol) {
    topLabel.unHilightTopLabelX(startCol, endCol);
  };

  this.hilightLeftLabel = function (startRow, endRow) {
    for (var row = startRow; row <= endRow; row++) {
      leftLabel.showHilightLeftLabelOneX(row);
    }
  };

  this.unHilightLeftLabel = function (startRow, endRow) {
    leftLabel.unHilightLeftLabelX(startRow, endRow);
  };

  /**
   * 绘制单元格
   * @function drawCells
   * @description 主绘制函数，遍历所有单元格并绘制其内容、边框、背景等
   */
  function drawCells() {
    xCache = {};
    yCache = {};
    if (isDrawObj(DrawObjType.text)) {
      MyTextBoxManager.setIsAddReady(false);
    }
    if (
      isDrawObj(DrawObjType.text) ||
      isDrawObj(DrawObjType.cellImage) ||
      isDrawObj(DrawObjType.grid)
    ) {
      SetMergeAreaUnDrawed();
    }
    var rowHeightList = cellSheet.rowHeightList;
    var colWidthList = cellSheet.colWidthList;
    var cells = cellSheet.cells;
    if (isDrawObj(DrawObjType.grid)) {
      totalWidth = GetTotalWidth();
      totalHeight = GetTotalHeight();
      resetCanvasSize();
    }
    if (isDrawObj(DrawObjType.backgroundImage)) {
      drawBackGroundImageAllPages();
    }
    if (isDrawObj(DrawObjType.floatImage)) {
      drawFloatImagesAllPages();
    }
    if (
      isDrawObj(DrawObjType.text) ||
      isDrawObj(DrawObjType.cellImage) ||
      isDrawObj(DrawObjType.grid)
    ) {
      drawStartRow = GetDrawStartRow();
      drawStartCol = GetDrawStartCol();
      for (var row = drawStartRow; row < rowHeightList.length; row++) {
        for (var col = drawStartCol; col < colWidthList.length; col++) {
          DrawRange(cells[col][row], col, row);
        }
      }
    }
    if (isDrawObj(DrawObjType.text)) {
      MyTextBoxManager.setIsAddReady(true);
    }
  }

  function resetCanvasSize() {
    page.setPageWidth(totalWidth);
    page.setPageHeight(totalHeight);
  }

  this._resetCanvasSize = resetCanvasSize;

  function GetDrawStartRow() {
    return 0;
  }

  function GetDrawStartCol() {
    return 0;
  }

  function setupScrollBarEvent() {
    parentEl.onscroll = function () {
      var inputContainer = document.getElementById(myInputContainerId);
      if (inputContainer) hideInputBox(inputContainer);
      setInputBoxValueToDisplay();
      var t1 = parentEl.scrollTop;
      var t2 = parentEl.scrollLeft;
      if (deltaY != t1) {
        deltaY = t1;
        isVScrolled = true;
      } else {
        isVScrolled = false;
      }
      if (deltaX != t2) {
        deltaX = t2;
        isHScrolled = true;
      } else {
        isHScrolled = false;
      }
      if (isDisplayLabel) {
        if (isVScrolled) scrollLeftLabel();
        if (isHScrolled) scrollTopLabel();
      }
    };
  }

  function GetTotalWidth() {
    var t = 0;
    for (var i = 0; i < cellSheet.colWidthList.length; i++) {
      t += cellSheet.colWidthList[i];
    }
    return t + 5;
  }

  function GetTotalHeight() {
    var t = 0;
    for (var i = 0; i < cellSheet.rowHeightList.length; i++) {
      t += cellSheet.rowHeightList[i];
    }
    return t + 5;
  }

  let myRedrawInterval = 0;

  /**
   * 重绘函数
   * @function redraw
   * @description 重新绘制整个表格或部分内容
   * @param {Object} redrawConfig - 重绘配置对象
   * @param {boolean} [redrawConfig.isNeedRedrawMark] - 是否需要重绘标记
   * @param {boolean} [redrawConfig.isNeedRedrawText] - 是否需要重绘文本
   * @param {boolean} [redrawConfig.isNeedRedrawBackground] - 是否需要重绘背景
   */
  function redraw(redrawConfig) {
    redrawConfig = redrawConfig || {};
    if (myRedrawInterval) {
      clearInterval(myRedrawInterval);
    }
    myRedrawInterval = setInterval(function () {
      if (!isDrawComplete) {
        return;
      }
      clearInterval(myRedrawInterval);
      var isRedrawMark = redrawConfig.isNeedRedrawMark;
      if (isDrawObj(DrawObjType.floatImage)) {
        FloatImageManager.Clear();
      }
      if (isRedrawMark) {
        clearSelectMarks();
      } else {
        deSelectRectFun();
      }
      resetContent();
      DoJob(isRedrawMark);
    }, 10);
  }

  /**
   * 重绘标记
   * @function redrawMark
   * @description 重新绘制选择框、合并区域等标记
   */
  function redrawMark() {
    drawSelectRowFlag();
    drawSelectColFlag();
    setSelectedTextBoxFocus();
  }

  this._redraw = redraw;

  function resetRectSelectionFun() {
    selectStartCol = -1;
    selectStartRow = -1;
    selectEndCol = -1;
    selectEndRow = -1;
    selectedColRowList = [];
    selectedTextBoxList = [];
  }

  this.resetRectSelection = resetRectSelectionFun;

  function resetContent() {
    setInputBoxValueToDisplay();
    var o = document.getElementById(myInputContainerId);
    if (o) {
      hideInputBox(o);
    }
    if (isDrawObj(DrawObjType.text)) {
      removeTextBoxsFromStage();
      pdfCanvas.ClearCanvasTextLayer();
    }
    if (isDrawObj(DrawObjType.backgroundImage)) {
      pdfCanvas.ClearCanvasBackgroundLayer();
    }
    if (isDrawObj(DrawObjType.cellImage)) {
      pdfCanvas.ClearCanvasImageLayer();
    }
    if (isDrawObj(DrawObjType.grid)) {
      pdfCanvas.ClearCanvasGridLayer();
    }
  }

  function removeTextBoxsFromStage() {
    stage.removeAll();
    MyTextBoxManager.clear();
  }

  /**
   * 设置工具栏
   * @function setupToolbar
   * @description 创建并初始化单元格设计器的工具栏，包含字体、对齐、边框等工具按钮
   */
  function setupToolbar() {
    cellToolbar = new CellToolbar({
      toolbarThemeConfig: toolbarThemeConfig,
      parentObj: me,
      parentEl: parentEl,
      cellInstanceName: instanceName,
      cellInstanceId: instanceId,
      toolbarHeight: toolbarHeight,
      leftLabelWidth: leftLabelWidth,
      leftLabelPadding: leftLabelPadding,
    });
    cellToolbar.doJob();
  }

  this.paste_autoFill = function () {
    removeCellContextMenu();
    if (
      autoFillRangeStartCol == -1 ||
      autoFillRangeEndCol == -1 ||
      autoFillRangeStartRow == -1 ||
      autoFillRangeEndRow == -1
    ) {
      return;
    }
    let startCol = -1;
    let startRow = -1;
    let flag = -1;
    if (
      autoFillRangeStartCol == selectStartCol &&
      autoFillRangeEndCol == selectEndCol &&
      autoFillRangeEndRow > selectEndRow
    ) {
      startCol = selectStartCol;
      startRow = selectEndRow + 1;
      flag = 1;
    } else if (
      autoFillRangeStartRow == selectStartRow &&
      autoFillRangeEndRow == selectEndRow &&
      autoFillRangeEndCol > selectEndCol
    ) {
      startCol = selectEndCol + 1;
      startRow = selectStartRow;
      flag = 2;
    } else {
      return;
    }
    recordUndoContent();
    if (flag == 1) {
      var col = startCol;
      var row = startRow;
      var t1 = selectEndRow - selectStartRow + 1;
      while (row <= autoFillRangeEndRow - t1 + 1) {
        operCell.Paste(col + 1, row + 1, 0, 1, 0);
        row += t1;
      }
    } else if (flag == 2) {
      var col = startCol;
      var row = startRow;
      var t1 = selectEndCol - selectStartCol + 1;
      while (col <= autoFillRangeEndCol - t1 + 1) {
        operCell.Paste(col + 1, row + 1, 0, 1, 0);
        col += t1;
      }
    }
    removeInput();
    recordRedoContent();
    totalWidth = GetTotalWidth();
    totalHeight = GetTotalHeight();
    redraw({ isNeedRedrawMark: true });
  };

  this.selectRectRow = function (row) {
    if (selectStartRowSingle == -1) {
      selectStartRowSingle = row;
      selectEndRowSingle = row;
    } else {
      selectEndRowSingle = row;
    }
    selectStartColSingle = -1;
    selectEndColSingle = -1;
    drawSelectRowFlag();
  };

  function drawSelectRowFlag() {
    if (selectStartRowSingle == -1 || selectEndRowSingle == -1) {
      return;
    }
    var x1 = 0;
    var x2 = pdfCanvas.GetContext().canvas.width;
    var y1 = 0;
    var drawStartRow = GetDrawStartRow();
    for (var i = drawStartRow; i < selectStartRowSingle; i++) {
      y1 += cellSheet.rowHeightList[i];
    }
    var y2 = y1;
    for (var i = selectStartRowSingle; i <= selectEndRowSingle; i++) {
      y2 += cellSheet.rowHeightList[i];
      var x = x1;
      var y = y1;
      var w = x2 - x1;
      var h = y2 - y1;
      y1 = y2;
      if (!haveDrawedRowMarkList.Contains(i)) {
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = x + "px";
        div.style.top = y + "px";
        div.style.width = w + "px";
        div.style.height = h + "px";
        div.style.backgroundColor = "rgb(128, 100, 162)";
        div.style.opacity = 0.2;
        div.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          clearSelectColRowMark();
        });
        haveDrawedMarkDivList.push(div);
        parentEl.appendChild(div);
        haveDrawedRowMarkList.push(i);
      }
    }
  }

  function resetSelectRectSingleFun() {
    selectStartColSingle = -1;
    selectEndColSingle = -1;
    selectStartRowSingle = -1;
    selectEndRowSingle = -1;
  }

  this.resetSelectRectSingle = resetSelectRectSingleFun;

  this.setSelectSingleStartCol = function (col) {
    selectStartColSingle = col;
  };

  this.setSelectSingleEndCol = function (col) {
    selectEndColSingle = col;
  };

  this.selectRectCol = function (col) {
    if (selectStartColSingle == -1) {
      selectStartColSingle = col;
      selectEndColSingle = col;
    } else {
      selectEndColSingle = col;
    }
    selectStartRowSingle = -1;
    selectEndRowSingle = -1;
    drawSelectColFlag();
  };

  function drawSelectColFlag() {
    if (selectStartColSingle == -1 || selectEndColSingle == -1) {
      return;
    }
    var x1 = 0;
    var drawStartCol = GetDrawStartCol();
    for (var i = drawStartCol; i < selectStartColSingle; i++) {
      x1 += cellSheet.colWidthList[i];
    }
    var x2 = x1;
    var y1 = 0;
    var y2 = pdfCanvas.GetContext().canvas.height;
    for (var i = selectStartColSingle; i <= selectEndColSingle; i++) {
      x2 += cellSheet.colWidthList[i];
      var x = x1;
      var y = y1;
      var w = x2 - x1;
      var h = y2 - y1;
      x1 = x2;
      if (!haveDrawedColMarkList.Contains(i)) {
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = x + "px";
        div.style.top = y + "px";
        div.style.width = w + "px";
        div.style.height = h + "px";
        div.style.backgroundColor = "rgb(128, 100, 162)";
        div.style.opacity = 0.2;
        div.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          deSelectRectFun();
          clearSelectColRowMark();
        });
        haveDrawedMarkDivList.push(div);
        parentEl.appendChild(div);
        haveDrawedColMarkList.push(i);
      }
    }
  }

  function clearSelectColRowMark() {
    for (var i = 0; i < haveDrawedMarkDivList.length; i++) {
      var t = haveDrawedMarkDivList[i];
      t.parentElement.removeChild(t);
    }
    haveDrawedColMarkList.length = 0;
    haveDrawedRowMarkList.length = 0;
    haveDrawedMarkDivList.length = 0;
  }

  function addToSelectedColRowList(o) {
    if (!isExistsInSelectedColRowList(o)) {
      selectedColRowList.push(o);
    }
  }

  function isExistsInSelectedColRowList(o) {
    for (var i = 0; i < selectedColRowList.length; i++) {
      var p = selectedColRowList[i];
      if (p.col == o.col && p.row == o.row) {
        return true;
      }
    }
    return false;
  }

  function drawLabelText(str, rect, events) {
    var font = {
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: 10,
      fontFamily: "宋体",
      color: "#ff0000",
    };
    var o1 = new MySpan(
      {
        id: "text_" + Comman.newGuid(),
        x: rect.GetX(),
        y: rect.GetY(),
        width: rect.GetWidth(),
        height: rect.GetHeight(),
        text: str,
        font: font,
        valign: "middle",
        halign: "center",
        backgroundColor: "silver",
      },
      events,
    );
    stage.add(o1);
  }

  function GetCellHeight() {
    var t = 0;
    for (var i = 0; i < cellSheet.rowHeightList.length; i++) {
      t += cellSheet.rowHeightList[i];
    }
    return t;
  }

  function hideAllContextMenu() {
    for (var i = 0; i < contextMenuIdList.length; i++) {
      var o = document.getElementById(contextMenuIdList[i]);
      if (o) {
        o.style.display = "none";
      }
    }
  }

  function isAllImageIsLoad() {
    for (var i = 0; i < imageList.length; i++) {
      var p = imageList[i];
      if (!p.isLoaded && !p.isLoadError) {
        return false;
      }
    }
    return true;
  }

  function loadAllImages() {
    for (var i = imageList.length - 1; i >= 0; i--) {
      var t = imageList.splice(i, 1);
      t = null;
      //delete t;
    }
    imageList = [];
    for (var i = 0; i < cellSheet.cellImageList.length; i++) {
      var o = cellSheet.cellImageList[i];
      var image = ImageDataFactory.Create(o);
      imageList.push(image);
      image.loadImg();
    }
  }

  function isExistsInImageList(imageIndex) {
    var o = imageList.Find(function (p) {
      return p.imageIndex == imageIndex;
    });
    return o != null;
  }

  function unScalePageForSave() {
    var o = cellSheet;
    unScalePrintInfo(o);
    unScaleColWidthList(o);
    unScaleRowHeightList(o);
    unScaleFloatImageInfo(o);
    var t = JSON.stringify(o);
    scalePage();
    return t;
  }

  function unScaleFloatImageInfo(o) {
    for (var i = 0; i < o.floatImageList.length; i++) {
      var p = o.floatImageList[i];
      p.xpos /= scaleRate;
      p.ypos /= scaleRate;
      p.width /= scaleRate;
      p.height /= scaleRate;
      p.xpos = parseInt(p.xpos);
      p.ypos = parseInt(p.ypos);
      p.width = parseInt(p.width);
      p.height = parseInt(p.height);
    }
  }

  function unScaleRowHeightList(o) {
    for (var i = 0; i < o.rowHeightList.length; i++) {
      o.rowHeightList[i] /= scaleRate;
    }
  }

  function unScaleColWidthList(o) {
    for (var i = 0; i < o.colWidthList.length; i++) {
      o.colWidthList[i] /= scaleRate;
    }
  }

  function unScalePrintInfo(o) {
    var printInfo = o.printInfo;
    printInfo.marginTop /= scaleRate;
    printInfo.marginRight /= scaleRate;
    printInfo.marginBottom /= scaleRate;
    printInfo.marginLeft /= scaleRate;
    printInfo.paperWidth /= scaleRate;
    printInfo.paperHeight /= scaleRate;
    printInfo.contentHeight /= scaleRate;
    printInfo.contentWidth /= scaleRate;
  }

  function scalePage() {
    scalePrintInfo();
    scaleColWidthList();
    scaleRowHeightList();
    scaleFloatImageInfo();
  }

  function scaleLineWidth() {
    GlobalV.lineWidth1 *= scaleRate;
    GlobalV.lineWidth2 *= scaleRate;
    GlobalV.lineWidth3 *= scaleRate;
  }

  function scaleFloatImageInfo() {
    for (var i = 0; i < cellSheet.floatImageList.length; i++) {
      var p = cellSheet.floatImageList[i];
      p.xpos *= scaleRate;
      p.ypos *= scaleRate;
      p.width *= scaleRate;
      p.height *= scaleRate;
    }
  }

  function scaleRowHeightList() {
    for (var i = 0; i < cellSheet.rowHeightList.length; i++) {
      cellSheet.rowHeightList[i] *= scaleRate;
    }
  }

  function scaleColWidthList() {
    for (var i = 0; i < cellSheet.colWidthList.length; i++) {
      cellSheet.colWidthList[i] *= scaleRate;
    }
  }

  function scalePrintInfo() {
    printInfo = cellSheet.printInfo;
    printInfo.marginTop *= scaleRate;
    printInfo.marginRight *= scaleRate;
    printInfo.marginBottom *= scaleRate;
    printInfo.marginLeft *= scaleRate;
    printInfo.paperWidth *= scaleRate;
    printInfo.paperHeight *= scaleRate;
    printInfo.contentHeight *= scaleRate;
    printInfo.contentWidth *= scaleRate;
  }

  function DrawRange(/*CellProp*/ o, col, row) {
    if (o.isInMergeArea) {
      var o1 = Comman.getMergeAreaById(cellSheet, o.mergeAreaId);
      if (o1 != null && !o1.isDrawed) {
        var x = GetRangeX(o1.startCol - 1);
        var y = GetRangeY(o1.startRow - 1);
        DrawMergeArea(o1, x, y);
        o1.isDrawed = true;
      } else if (o1 == null) {
        var x = GetRangeX(col);
        var y = GetRangeY(row);
        DrawSingleArea(o, x, y, col, row);
      }
    } else {
      var x = GetRangeX(col);
      var y = GetRangeY(row);
      DrawSingleArea(o, x, y, col, row);
    }
  }

  function GetRangeX(col) {
    if (xCache[col]) {
      return xCache[col];
    }
    var t = 0;
    for (var i = 0; i < col; i++) {
      t += cellSheet.colWidthList[i];
    }
    xCache[col] = t;
    return t;
  }

  function GetRangeY(row) {
    if (yCache[row]) {
      return yCache[row];
    }
    var t = 0;
    for (var i = 0; i < row; i++) {
      t += cellSheet.rowHeightList[i];
    }
    yCache[row] = t;
    return t;
  }

  function DrawSingleArea(/*CellProp*/ o, x, y, col, row) {
    var width = cellSheet.colWidthList[col];
    var height = cellSheet.rowHeightList[row];

    if (isDrawObj(DrawObjType.grid)) {
      DrawSingleAreaBorder(o, x, y, col, row);
    }

    if (isDrawObj(DrawObjType.cellImage)) {
      DrawCellImage(o, x, y, width, height);
    }

    if (isDrawObj(DrawObjType.text)) {
      DrawText(o, x, y, width, height, col, row, col, row);
    }
  }

  function DrawSingleAreaBorder(o, x, y, col, row) {
    DrawLine.drawLine(
      o.borderLeft,
      Comman.ToXColor(o.borderLeftColor),
      pdfCanvas,
      new XPoint(x, y),
      new XPoint(x, y + cellSheet.rowHeightList[row]),
      cellAreaHeight,
      isDesignMode,
      CanvasType.gridLayer,
    );
    DrawLine.drawLine(
      o.borderTop,
      Comman.ToXColor(o.borderTopColor),
      pdfCanvas,
      new XPoint(x, y),
      new XPoint(x + cellSheet.colWidthList[col], y),
      cellAreaHeight,
      isDesignMode,
      CanvasType.gridLayer,
    );
    DrawLine.drawLine(
      o.borderRight,
      Comman.ToXColor(o.borderRightColor),
      pdfCanvas,
      new XPoint(x + cellSheet.colWidthList[col], y),
      new XPoint(
        x + cellSheet.colWidthList[col],
        y + cellSheet.rowHeightList[row],
      ),
      cellAreaHeight,
      isDesignMode,
      CanvasType.gridLayer,
    );
    if (o.borderRight > 1 && col + 1 < cellSheet.colWidthList.length) {
      cellSheet.cells[col + 1][row].borderLeft = 0;
    }
    DrawLine.drawLine(
      o.borderBottom,
      Comman.ToXColor(o.borderBottomColor),
      pdfCanvas,
      new XPoint(x, y + cellSheet.rowHeightList[row]),
      new XPoint(
        x + cellSheet.colWidthList[col],
        y + cellSheet.rowHeightList[row],
      ),
      cellAreaHeight,
      isDesignMode,
      CanvasType.gridLayer,
    );
    if (o.borderBottom > 1 && row + 1 < cellSheet.rowHeightList.length) {
      cellSheet.cells[col][row + 1].borderTop = 0;
    }
  }

  function drawSpecialColumnValue(columnName, o, rect, textAlign, font, stage) {
    var str = getColumnV(columnName);
    var o1 = new MySpan({
      id: "text_" + Comman.newGuid(),
      x: rect.GetX(),
      y: rect.GetY(),
      width: rect.GetWidth(),
      height: rect.GetHeight(),
      text: str,
      font: font,
      valign: textAlign.valign,
      halign: textAlign.halign,
    });
    stage.add(o1);
  }

  function getColumnV(columnName) {
    var rsUnit = getRsUnit();
    var t = rsUnit[columnName];
    if (t) {
      return t;
    }
    return "";
  }

  function getRsUnit() {
    var r = {};
    top.$.ajax({
      WD: self.document,
      url:
        "/pkpmaspx/AjaxOther/769/Ajax_getRsUnit.aspx?t=" + new Date().getTime(),
      async: false,
      data: { stationcode: top.stationcode },
      type: "post",
      dataType: "json",
      success: function (data) {
        r = data[0];
      },
      error: function (data, status, e) {},
    });
    return r;
  }

  function DrawText(
    o,
    x,
    y,
    width,
    height,
    rangeStartCol,
    rangeStartRow,
    rangeEndCol,
    rangeEndRow,
  ) {
    if (!isDesignMode) {
      if (string.IsNullOrEmpty(o.str)) {
        return;
      }
      if (width == 0 || height == 0) {
        return;
      }
    }
    var rect = new XRect(x, y, width, height);
    var str = o.str;
    var id = Comman.getTextBoxId(
      rangeStartCol,
      rangeStartRow,
      rangeEndCol,
      rangeEndRow,
    );
    var o1 = {
      type: "text",
      id: id,
      cellSheet: cellSheet,
      col: rangeStartCol,
      row: rangeStartRow,
      rangeStartCol: rangeStartCol,
      rangeStartRow: rangeStartRow,
      rangeEndCol: rangeEndCol,
      rangeEndRow: rangeEndRow,
      canvasId: canvasId,
      left: rect.GetX(),
      top: rect.GetY(),
      width: rect.GetWidth(),
      height: rect.GetHeight(),
      value: str,
      fillDataType: o.fillDataType,
      isCheckBox: o.isCheckBox,
      parentEl: parentEl,
      operCell: operCell,
      parentObj: me,
      readOnly:
        g_isUseForInput &&
        isSetReadOnlyCells &&
        canInputCells.indexOf(rangeStartCol + "_" + rangeStartRow) == -1,
    };
    var events = null;
    var o2 = new MyTextBox(o1, events);
    stage.add(o2);
    if (o1.readOnly) {
      return;
    }
    if (!readOnly) {
      events = {
        //"click": function (event, pos) {
        //    //
        //},
        dblclick: function (event, pos) {
          if (g_forSelectCheckResult != -1) {
            var col = rangeStartCol;
            var row = rangeStartRow;
            setCheckResultMap(col, row);
          } else if (g_isMatchFormulaSymbol) {
            var col = rangeStartCol;
            var row = rangeStartRow;
            setFormulaMap(col, row);
          } else {
            var inputBox = document.getElementById(myInputBoxId);
            setSelectionAll(inputBox);
            displayInputBox();
          }
        },
        contextmenu: function (event) {
          setInputBoxValueToDisplay();
          showCellContextMenuGlobal(event, me, stage);
        },
        mouseover: function (event, pos) {
          if (g_isAutoFillDrag) {
            autoFillRangeEndCol = rangeEndCol;
            autoFillRangeEndRow = rangeEndRow;
            me.setAutoFillRange();
          }
        },
        mousedown: function (event, pos) {
          inputBoxSelectText = "";
          if (g_forSelectCheckResult != -1) {
            deSelectRectFun();
          } else {
            setInputBoxValueToDisplay();
            myMouseStatus.isMouseDown = true;
            myMouseStatus.isSelectObjNum = 1;
            deSelectRectFun();
            startSelectRect(rangeStartCol, rangeStartRow);
          }
        },
        mouseup: function (event, pos) {
          if (myMouseStatus.isMouseDown && myMouseStatus.isSelectObjNum == 1) {
            endSelectRect(rangeEndCol, rangeEndRow);
          }
          if (selectedTextBoxList.length == 1) {
            drawInputBox(selectedTextBoxList[0]);
            me.displaySomeInfo();
          }
          myMouseStatus.isMouseDown = false;
          myMouseStatus.isSelectObjNum = -1;
        },
      };
      o2.buildEvent(events);
    }
  }

  function SetReadOnlyCells() {
    if (!g_isUseForInput) {
      return;
    }
    if (isHaveSetCanInputCells) {
      return;
    }
    isHaveSetCanInputCells = true;
    canInputCells = [];
    for (var col = 0; col < cellSheet.colWidthList.length; col++) {
      for (var row = 0; row < cellSheet.rowHeightList.length; row++) {
        var s = cellSheet.cells[col][row].str;
        if (s.indexOf(leftMark) != -1) {
          canInputCells.push(col + "_" + row);
        }
      }
    }
  }

  function setCheckResultMap(col, row) {
    var tAr = g_forSelectCheckResult.split(".");
    var tt1 = tAr[0];
    var tt2 = tAr[1];
    var tt3 = checkResultMap.find((p) => p.parmname == tt1);
    var t = tt3.items[tt2];
    var t1 = col + "_" + row;
    if (t.indexOf(t1) == -1) {
      t.push(t1);
    }
    ShowCheckResultMarks();
  }

  function setFormulaMap(col, row) {
    var o = cellSheet.cells[col][row];
    var s = o.str;
    var pos1 = s.indexOf("[#");
    if (pos1 == -1) {
      showCellMsg("单元格内容需要是字段格式!");
      return;
    }
    var pos2 = s.indexOf("#]", pos1 + 2);
    if (pos2 == -1) {
      showCellMsg("单元格内容需要是字段格式!");
      return;
    }
    var t = s
      .substring(pos1 + 2, pos2)
      .split(".")
      .slice(0, 2)
      .join(".");
    var calculateInfoOne = calculateInfo.Find(function (p) {
      return p.id == g_calculateInfoOneId;
    });
    var maps = calculateInfoOne.maps;
    var index = g_currentSelectApplyIndex;
    for (var p in maps) {
      if (!maps.hasOwnProperty(p)) {
        continue;
      }
      var L = maps[p];
      if (p == g_formulaSymbol) {
        L[index] = t;
        break;
      }
    }
    ShowFormulaMark(calculateInfoOne);
  }

  function markCellForFormula(id) {
    var textbox = MyTextBoxManager.getTextBoxById(id);
    showFormulaInputWindow(textbox);
  }

  function showFormulaInputWindow(textbox) {
    new FormulaInputWindow({
      parentObj: me,
      parentEl: parentEl,
      parentId: instanceId,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
      leftLabelWidth: leftLabelWidth,
      topLabelHeight: topLabelHeight,
      leftLabelPadding: leftLabelPadding,
      topLabelPadding: topLabelPadding,
      toolbarHeight: toolbarHeight,
      formulaBarHeight: formulaBarHeight,
      textbox: textbox,
    });
  }

  function displayTextBoxFontSize() {
    if (!isDisplayToolbar) {
      return;
    }
    var t = selectedColRowList[0];
    if (!t) {
      return;
    }
    var o = document.getElementById(instanceId + "_select_fontSize");
    o.value = cellSheet.cells[t.col][t.row].fontSize;
  }

  function displayTextBoxFont() {
    if (!isDisplayToolbar) {
      return;
    }
    var t = selectedColRowList[0];
    if (!t) {
      return;
    }
    var o = document.getElementById(instanceId + "_select_font");
    o.value = cellSheet.cells[t.col][t.row].fontFamily;
  }

  function displayCellContent() {
    if (!isDisplayToolbar) {
      return;
    }
    var t = selectedColRowList[0];
    if (!t) {
      return;
    }
    var o = document.getElementById(instanceId + "_formulabar_inputbox");
    var t1 = operCell.GetFormulaStr(t.col + 1, t.row + 1, 0);
    if (t1 != "") {
      //公式
      o.value = "=" + t1;
    } else {
      o.value = cellSheet.cells[t.col][t.row].str;
    }
  }

  function displayCellMark() {
    if (!isDisplayToolbar) {
      return;
    }
    var t = selectedColRowList[0];
    if (!t) {
      return;
    }
    var o = document.getElementById(instanceId + "_formulabar_div1");
    o.innerHTML = Comman.GetColRowStr({ col: t.col + 1, row: t.row + 1 });
    cellToolbar.setCurrentCurrentCell(t.col + 1, t.row + 1);
  }

  this.setCellFormula = function (col, row) {
    if (readOnlyText) {
      return;
    }
    var o = document.getElementById(instanceId + "_formulabar_inputbox");
    var v = o.value;
    if (v.indexOf("=") == 0 && v.indexOf("==") == -1) {
      cellSheet.formulaList.RemoveAll(function (p) {
        return p.targetCol == col - 1 && p.targetRow == row - 1;
      });
      operCell.SetFormula(col, row, 0, v.substring(1), "");
      var textbox = getTextBox(col - 1, row - 1);
      if (textbox) {
        me.removeTextBoxFormula();
        me.displayTextBoxFormula(textbox);
      }
      if (g_isCalFormula == 1) operCell.CalculateSheet(0);
    } else {
      SetCellString(col, row, 0, v);
    }
  };

  function isCtrlV(e) {
    return e.ctrlKey && e.keyCode == 86;
  }

  function isCtrlZ(e) {
    return e.ctrlKey && e.keyCode == 90;
  }

  function isHaveFormula(o) {
    var t1 = operCell.GetFormulaStr(o.col + 1, o.row + 1, 0);
    if (t1 != "") {
      return true;
    } else {
      return false;
    }
  }

  function drawInputBox(o) {
    if (o.isCheckBox) {
      return;
    }
    var x = o.x + 2;
    var y = o.y + 2;
    var w = o.width - 7;
    var h = o.height - 7;

    var inputContainer = document.getElementById(myInputContainerId);
    if (inputContainer) {
      inputContainer.parentElement.removeChild(inputContainer);
    }
    inputContainer = document.createElement("div");
    inputContainer.setAttribute("id", myInputContainerId);
    parentEl.appendChild(inputContainer);
    var inputBox = document.createElement("div");
    inputBox.setAttribute("id", myInputBoxId);
    inputContainer.appendChild(inputBox);
    inputContainer.setAttribute("forTextBoxId", o.id);
    inputContainer.setAttribute("w", w);
    inputContainer.setAttribute("h", h);
    inputContainer.style.opacity = 0;
    inputContainer.style.width = "0px";
    inputContainer.style.height = "0px";
    inputContainer.style.position = "absolute";
    inputContainer.style.left = x + "px";
    inputContainer.style.top = y + "px";
    inputContainer.style.border = "0px";
    inputContainer.style.padding = "0px";
    inputContainer.style.margin = "0px";
    inputContainer.style.overflow = "hidden";
    inputContainer.style.backgroundColor = "white";
    inputContainer.style.zIndex = 99999;

    inputBox.setAttribute("autocomplete", "off");
    inputBox.setAttribute("contenteditable", true);
    inputBox.style.boxSizing = "content-box";
    inputBox.style.overflowWrap = "normal";
    inputBox.style.resize = "none";
    inputBox.style.outline = "none";
    inputBox.style.boxShadow = "";
    inputBox.style.position = "relative";
    inputBox.style.top = "50%";
    inputBox.style.transform = "translateY(-50%)";
    inputBox.style.textAlign = "center";
    inputBox.style.border = "0px";
    inputBox.style.width = "100%";
    inputBox.removeAttribute("dir"); // 移除可能的 dir 属性
    inputBox.style.setProperty("direction", "ltr", "important");
    var o1 = cellSheet.cells[o.col][o.row];
    if (isHtml(o.value)) {
      inputBox.innerHTML = o.value;
    } else {
      inputBox.innerText = replaceChar1(o.value);
    }
    setInputBoxAlign(o1, inputBox);
    setInputBoxFont(o1, inputBox);
    setInputBoxKeyDownEvent(inputBox, o);
    setInputBoxKeyUpEvent(inputBox, o);
    setSelectionAll(inputBox);
    inputBox.focus();
    if (isHaveFormula(o)) {
      return;
    }
    setInputBoxBlurEvent(inputBox, o);
    setInputBoxChangeEvent(inputBox, o);
    inputBox.addEventListener("mouseup", function () {
      inputBoxSelectText = window.getSelection().toString();
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        inputBoxSelectTextStartOffset = range.startOffset;
        inputBoxSelectTextEndOffset = range.endOffset;
      }
    });
    autoComplete.hide();
    if (o.fillDataType == "d") {
      flatpickr(inputBox, {});
      inputBox.click();
    } else {
      if (o.autoCompleteConfig) {
        autoComplete.initValue(inputBox.innerText);
        if (o.autoCompleteConfig.isDropDownListBox) {
          displayInputBox(o);
          queryAutoCompleteData(inputBox, o);
        }
      } else if (o.additionalClickEvent) {
        inputBox.addEventListener("click", function () {
          o.additionalClickEvent();
        });
        inputBox.click();
      }
    }
  }

  function replaceChar1(s) {
    return s.replace(/\r\n/g, "\n");
  }

  function replaceChar2(s) {
    return s.replace(/\n/g, "\r\n");
  }

  function DisplayFormula(o) {
    var className = "textboxformula";

    var colors = [
      "Aqua",
      "Aquamarine",
      "Blue",
      "BlueViolet",
      "CadetBlue",
      "Chartreuse",
      "Chocolate",
      "Coral",
      "CornflowerBlue",
      "Crimson",
      "Cyan",
      "DarkBlue",
      "DarkOrchid",
      "DeepPink",
      "GreenYellow",
      "Orange",
    ];

    function doJob() {
      var div = document.createElement("div");
      div.setAttribute("class", className);
      div.style.position = "absolute";
      div.style.left = o.x + "px";
      div.style.top = o.y + "px";
      div.style.fontSize = "8pt";
      //div.style.opacity = "0.8";
      div.style.paddingLeft = "2px";
      div.style.color = "red";
      div.style.userSelect = "none";
      div.oncontextmenu = function (event) {
        event.preventDefault();
        showCellContextMenuGlobal(event, me, stage);
      };

      var t1 = operCell.GetFormula(o.col + 1, o.row + 1, 0);
      div.innerHTML = "=" + doCodeLineRaw(t1.codeLineRaw);

      parentEl.appendChild(div);
    }

    function doCodeLineRaw(codeLineRaw) {
      var str = "";
      var reg1 = /^([A-Za-z]{1,3})(\d{1,5})$/;
      var reg2 = /^([A-Za-z]{1,3})(\d{1,5}):([A-Za-z]{1,3})(\d{1,5})$/;
      var L1 = [];
      for (var i = 0; i < codeLineRaw.Count(); i++) {
        var p = codeLineRaw[i];
        var mc = Regex.Match(p, reg1);
        if (mc.Success) {
          var colRow = Comman.GetColRow(p.ToUpper());
          if (L1.indexOf(p) == -1) {
            L1.push(p);
          }
          var colorIndex = L1.indexOf(p);
          str += '<font color="' + colors[colorIndex] + '">' + p + "</font>";
          drawOneMark(colRow, colorIndex);
        } else {
          mc = Regex.Match(p, reg2);
          if (mc.Success) {
            if (L1.indexOf(p) == -1) {
              L1.push(p);
            }
            var colorIndex = L1.indexOf(p);
            str += '<font color="' + colors[colorIndex] + '">' + p + "</font>";
            var ar = p.split(":");
            var colRow1 = Comman.GetColRow(ar[0]);
            var colRow2 = Comman.GetColRow(ar[1]);
            var L2 = GetRangeColRowList(colRow1, colRow2);
            for (var j = 0; j < L2.length; j++) {
              drawOneMark(L2[j], colorIndex);
            }
          } else {
            str += p;
          }
        }
      }
      return str;
    }

    function GetRangeColRowList(/*ColRow */ colRow1, /*ColRow */ colRow2) {
      /*List < ColRow >*/ var L = []; /* new List < ColRow > ()*/
      for (var col = colRow1.col; col <= colRow2.col; col++) {
        for (var row = colRow1.row; row <= colRow2.row; row++) {
          L.Add(
            new ColRow({
              col: col,
              row: row,
            }),
          );
        }
      }
      return L;
    }

    function drawOneMark(colRow, colorIndex) {
      var o = getTextBox(colRow.col, colRow.row);
      if (!o) {
        return;
      }
      var div = document.createElement("div");
      div.setAttribute("class", className);
      div.style.position = "absolute";
      div.style.left = o.x + "px";
      div.style.top = o.y + "px";
      div.style.fontSize = "8pt";
      //div.style.opacity = "0.8";
      div.style.paddingLeft = "2px";
      div.style.color = colors[colorIndex];
      div.style.userSelect = "none";
      div.oncontextmenu = function (e) {
        e.preventDefault();
      };
      div.innerHTML = Comman.GetColRowStr({ col: o.col + 1, row: o.row + 1 });
      parentEl.appendChild(div);
    }

    return {
      doJob: doJob,
    };
  }

  this.displayTextBoxFormula = function (o) {
    if (!isHaveFormula(o)) {
      return;
    }
    new DisplayFormula(o).doJob();
  };

  this.removeTextBoxFormula = function (o) {
    var L = parentEl.querySelectorAll(".textboxformula");
    for (var i = 0; i < L.length; i++) {
      var t = L[i];
      if (t && t.parentElement) {
        t.parentElement.removeChild(t);
      }
    }
  };

  function focusOnNext(t, inputBox) {
    deSelectRectFun();
    setSelectRange(
      t.rangeStartCol,
      t.rangeStartRow,
      t.rangeEndCol,
      t.rangeEndRow,
    );
    drawInputBox(t);
    setInputBoxBlurEvent(inputBox, t);
    me.displaySomeInfo();
    setInputBoxKeyDownEvent(inputBox, t);
    setInputBoxKeyUpEvent(inputBox, t);
  }

  this.displaySomeInfo = function () {
    displayTextBoxFont();
    displayTextBoxFontSize();
    displayCellContent();
    displayCellMark();
  };

  function goUp(inputBox, o, isF) {
    if (!isF) {
      setTextBoxValue(inputBox, o);
    }
    o.blur();
    var t = MyTextBoxManager.findUpTextBox(o);
    if (t && t.id != o.id) {
      focusOnNext(t, inputBox);
    }
  }

  function goDown(inputBox, o, isF) {
    if (!isF) {
      setTextBoxValue(inputBox, o);
    }
    o.blur();
    var t = MyTextBoxManager.findDownTextBox(o);
    if (t && t.id != o.id) {
      focusOnNext(t, inputBox);
    }
  }

  function goLeft(inputBox, o, isF) {
    if (!isF) {
      setTextBoxValue(inputBox, o);
    }
    o.blur();
    var t = MyTextBoxManager.findLeftTextBox(o);
    if (t && t.id != o.id) {
      focusOnNext(t, inputBox);
    }
  }

  function goRight(inputBox, o, isF) {
    if (!isF) {
      setTextBoxValue(inputBox, o);
    }
    o.blur();
    var t = MyTextBoxManager.findRightTextBox(o);
    if (t && t.id != o.id) {
      focusOnNext(t, inputBox);
    }
  }

  function setInputBoxKeyDownEvent(inputBox, o) {
    inputBox.onkeydown = function (e) {
      if (isCtrlV(e)) {
        return true;
      }
      if (isCtrlZ(e)) {
        return true;
      }
      if (e.ctrlKey || e.altKey || e.shiftKey) {
        if (e.keyCode == 13 && (e.ctrlKey || e.altKey)) {
          // Prevent default behavior (which would create a new line)
          e.preventDefault();

          // Insert a new line character manually
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const br = document.createElement("br");
          range.insertNode(br);

          // Move the cursor to the next line
          range.setStartAfter(br);
          range.setEndAfter(br);
          selection.removeAllRanges();
          selection.addRange(range);
        } else if (e.keyCode == 9 && e.shiftKey) {
          e.stopPropagation();
          goLeft(inputBox, o);
        }
        return true;
      }
      if (
        e.keyCode == 38 ||
        e.keyCode == 40 ||
        e.keyCode == 37 ||
        e.keyCode == 39 ||
        e.keyCode == 13 ||
        e.keyCode == 9
      ) {
        e.preventDefault();
        e.stopPropagation();
        if (o.fillDataType != "d") {
          if (e.keyCode == 38) {
            //上
            if (o.autoCompleteConfig) {
              autoComplete.goUp();
            } else {
              goUp(inputBox, o);
            }
          } else if (e.keyCode == 40) {
            //下
            if (o.autoCompleteConfig) {
              autoComplete.goDown();
            } else {
              goDown(inputBox, o);
            }
          } else if (e.keyCode == 37) {
            //左
            if (o.autoCompleteConfig) {
              //
            } else {
              goLeft(inputBox, o);
            }
          } else if (e.keyCode == 39) {
            //右
            if (o.autoCompleteConfig) {
              //
            } else {
              goRight(inputBox, o);
            }
          } else if (e.keyCode == 13) {
            //下
            if (o.autoCompleteConfig) {
              _setAutoCompleteValue(o);
              autoComplete.hide();
              goDown(inputBox, o, true);
            } else {
              goDown(inputBox, o);
            }
          } else if (e.keyCode == 9) {
            //右
            if (o.autoCompleteConfig) {
              _setAutoCompleteValue(o);
              autoComplete.hide();
              goRight(inputBox, o, true);
            } else {
              goRight(inputBox, o);
            }
          }
        }
        return true;
      }
    };
  }

  this.setAutoCompleteValue = function (o) {
    _setAutoCompleteValue(o);
  };

  function _setAutoCompleteValue(o) {
    removeInput();
    var valueObj = autoComplete.getValueObj();
    if (!valueObj) {
      return;
    }
    if (o.autoCompleteConfig.type === 3) {
      _setAutoCompleteValueThree(valueObj, o);
    } else if (o.autoCompleteConfig.type === 2) {
      _setAutoCompleteValueTwo(valueObj, o);
    } else {
      _setAutoCompleteValueOne(valueObj, o);
    }
  }

  function _setAutoCompleteValueThree(valueObj, o) {
    var tAr = o.autoCompleteConfig.valueColumnMaps;
    for (var i = 0; i < tAr.length; i++) {
      var t2 = tAr[i];
      var t4 = { col: t2.targetCol, row: t2.targetRow };
      var v = valueObj[t2.source] || "";
      SetCellString(t4.col, t4.row, 0, v);
      _redrawOneCell(t4.col - 1, t4.row - 1);
    }
  }

  function _setAutoCompleteValueTwo(valueObj, o) {
    var tAr = o.autoCompleteConfig.valueColumnMaps;
    for (var i = 0; i < tAr.length; i++) {
      var t2 = tAr[i];
      var t4 = new GetOneRightCellClass({
        operCell: operCell,
        cellSheet: cellSheet,
        needFindStr: t2.needFindStr,
      }).doJob();
      if (!t4) {
        continue;
      }
      var v = valueObj[t2.source] || "";
      SetCellString(t4.col + 1, t4.row + 1, 0, v);
      _redrawOneCell(t4.col, t4.row);
    }
  }

  function _setAutoCompleteValueOne(valueObj, o) {
    var tAr = o.autoCompleteConfig.valueColumnMaps;
    var t1 = getTableAndColumnInfo(o);
    if (!t1) {
      return;
    }
    var recNum = t1.recNum;
    for (var i = 0; i < tAr.length; i++) {
      var t2 = tAr[i];
      var t3 = t2.target + "." + recNum;
      var t4 = getColRowRefTableAndColumnInfo(t3);
      if (!t4) {
        continue;
      }
      var v = valueObj[t2.source] || "";
      SetCellString(t4.col, t4.row, 0, v);
      _redrawOneCell(t4.col - 1, t4.row - 1);
    }
  }

  function removeInput() {
    try {
      var inputContainer = document.getElementById(myInputContainerId);
      if (inputContainer) {
        inputContainer.parentElement.removeChild(inputContainer);
      }
    } catch (e) {}
  }

  function getTableAndColumnInfo(o) {
    var t = o.col + 1 + "." + (o.row + 1);
    return fillDataMaps1[t];
  }

  function getColRowRefTableAndColumnInfo(key) {
    return fillDataMaps2[key];
  }

  function SetCellValueByTableAndColumn(key, v) {
    var t = getColRowRefTableAndColumnInfo(key);
    if (!t) {
      return;
    }
    SetCellString(t.col, t.row, 0, v);
  }

  function setInputBoxChangeEvent(inputBox, o) {
    inputBox.onpaste = function () {
      setTimeout(function () {
        var text = inputBox.innerText;
        var tAr = text.split("\n");
        if (tAr.length > 1) {
          if (confirm("是否是来自Excel的数据?")) {
            hideInputBox();
            setTextBoxValue(inputBox, o);
            pasteExcelData(tAr);
          }
        }
      }, 300);
    };

    inputBox.onchange = function (e) {
      hideInputBox();
      setTextBoxValue(inputBox, o);
    };
  }

  function pasteExcelData(tAr) {
    removeCellContextMenu();
    if (
      selectStartCol == -1 ||
      selectStartRow == -1 ||
      selectEndCol == -1 ||
      selectEndRow == -1
    ) {
      return;
    }
    removeInput();
    let L = [];
    for (var i = 0; i < tAr.length; i++) {
      L.push(tAr[i].split("\t"));
    }
    top.copyedTextAr = L;
    recordUndoContent();
    removeInput();
    new PasteRangeData({
      cellSheet: cellSheet,
      operCell: operCell,
      startCol: selectStartCol,
      startRow: selectStartRow,
    }).doJob();
    removeInput();
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  }

  function setInputBoxKeyUpEvent(inputBox, o) {
    inputBox.onkeyup = function (e) {
      if (e.ctrlKey || e.altKey || e.shiftKey) {
        return false;
      }
      if (o.autoCompleteConfig) {
        if (e.keyCode == 38 || e.keyCode == 40) {
          //上 //下
          //
        } else {
          displayInputBox(o);
          queryAutoCompleteData(inputBox, o);
        }
      } else {
        displayInputBox(o);
        autoComplete.hide();
      }
    };
  }

  function queryAutoCompleteData(inputBox, o) {
    var t;
    if (o.autoCompleteConfig.type === 2 || o.autoCompleteConfig.type === 3) {
      t = {
        tableName: o.autoCompleteConfig.tableName,
        columnName: o.autoCompleteConfig.columnName,
      };
    } else {
      t = getTableAndColumnInfo(o);
    }
    autoComplete.queryData({
      apiUrl: o.autoCompleteConfig.apiUrl,
      queryFun: o.autoCompleteConfig.queryFun,
      value: inputBox.innerText,
      columnInfoList: o.autoCompleteConfig.columnInfoList,
      requestData: {
        keyword: inputBox.innerText,
        tn: t.tableName,
        cs: getColumnListForQuery(o.autoCompleteConfig.columnInfoList),
        sc: t.columnName,
        v: inputBox.innerText,
      },
    });
  }

  function getColumnListForQuery(L) {
    var L1 = [];
    for (var i = 0; i < L.length; i++) {
      L1.push(L[i].columnName);
    }
    return L1;
  }

  function setTextBoxValue(inputBox, o) {
    if (readOnlyText) {
      return;
    }
    if (selectedColRowList.length == 0) {
      return;
    }
    if (replaceChar2(inputBox.innerText) == o.value) {
      return;
    }
    var o1 = selectedColRowList[0];
    recordUndoContent();
    var str = "";
    var isHtmlV = isHtml(inputBox.innerHTML);
    if (isHtmlV) {
      str = replaceDiv(inputBox.innerHTML);
    } else {
      str = replaceChar2(inputBox.innerText.Trim("\r").Trim("\n"));
    }
    str = str.replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF]/gm, "");
    SetCellString(o1.col + 1, o1.row + 1, 0, str);
    recordRedoContent();
    o.clearRange();
    o.setValue(operCell.GetCellString(o1.col + 1, o1.row + 1, 0), true);
    page.render();
  }

  function replaceDiv(s) {
    var pos1 = s.indexOf("<div ");
    if (pos1 == -1) {
      return s;
    }
    var pos2 = s.indexOf(">", pos1);
    if (pos2 == -1) {
      return s;
    }
    s = s.substring(pos2 + 1);
    var pos3 = s.lastIndexOf("</div>");
    if (pos3 != -1) {
      s = s.substring(0, pos3);
    }
    return s;
  }

  function isHtml(s) {
    return s.toLowerCase().indexOf("<font ") != -1;
  }

  /**
   * 设置单元格字符串
   * @function SetCellString
   * @description 设置指定单元格的文本内容
   * @param {number} col - 列号（从1开始）
   * @param {number} row - 行号（从1开始）
   * @param {number} sheet - 工作表索引
   * @param {string} s - 要设置的字符串内容
   */
  function SetCellString(col, row, sheet, s) {
    if (col <= 0 || row <= 0) {
      return;
    }
    operCell.SetCellString(col, row, sheet, s);
    removeInput();
  }

  function _redrawOneCell(col, row) {
    var o = getTextBox(col, row);
    if (!o) {
      return;
    }
    var o2 = cellSheet.cells[col][row];
    o.clearRange();
    o.setValue(o2.str, true);
    page.render();
    me.displaySomeInfo();
  }

  this.redrawOneCell = _redrawOneCell;

  /**
   * 获取当前选中列
   * @function GetCurrentCol
   * @description 获取当前选中单元格的列号
   * @returns {number} 当前列号（从1开始）
   */
  function GetCurrentCol() {
    return selectStartCol + 1;
  }

  /**
   * 获取当前选中行
   * @function GetCurrentRow
   * @description 获取当前选中单元格的行号
   * @returns {number} 当前行号（从1开始）
   */
  function GetCurrentRow() {
    return selectStartRow + 1;
  }

  function redrawBorder(o, col, row) {
    if (o.isInMergeArea) {
      var o1 = Comman.getMergeAreaById(cellSheet, o.mergeAreaId);
      if (o1 != null) {
        var x = GetRangeX(o1.startCol - 1);
        var y = GetRangeY(o1.startRow - 1);
        DrawMergeAreaBorder(o1, x, y);
      } else if (o1 == null) {
        var x = GetRangeX(col);
        var y = GetRangeY(row);
        DrawSingleAreaBorder(o, x, y, col, row);
      }
    } else {
      var x = GetRangeX(col);
      var y = GetRangeY(row);
      DrawSingleAreaBorder(o, x, y, col, row);
    }
  }

  function displayInputBox(o) {
    //if (o && isHaveFormula(o)) {
    //  return;
    //}
    var inputContainer = document.getElementById(myInputContainerId);
    if (!inputContainer) {
      return;
    }
    var w = Number(inputContainer.getAttribute("w"));
    var h = Number(inputContainer.getAttribute("h"));
    inputContainer.style.width = w + "px";
    inputContainer.style.height = h + "px";
    //inputContainer.style.border = "2px solid rgb(82, 146, 247)";
    inputContainer.style.padding = "1px";
    inputContainer.style.margin = "0px";
    inputContainer.style.opacity = 1;
    //inputContainer.style.backgroundColor = "red";
    var inputBox = document.getElementById(myInputBoxId);
    //inputBox.style.backgroundColor = "green";
    inputBox.focus();

    if (o && o.autoCompleteConfig) {
      setAutoCompleteAttr(o);
    } else {
      autoComplete.hide();
    }
  }

  function setAutoCompleteAttr(o) {
    var inputContainer = document.getElementById(myInputContainerId);
    var w = Number(inputContainer.getAttribute("w"));
    var h = Number(inputContainer.getAttribute("h"));
    var x = Number(inputContainer.style.left.replace("px", ""));
    var y = Number(inputContainer.style.top.replace("px", ""));
    autoComplete.setAttr({
      left: x,
      top: y + h + 6,
      width: w + 5,
      textBox: o,
      isDropDownListBox: o.autoCompleteConfig.isDropDownListBox,
    });
  }

  function isInputBoxIsShow() {
    var inputContainer = document.getElementById(myInputContainerId);
    return inputContainer.style.opacity == 1;
  }

  function redrawSelectRange(o) {
    if (o.isInMergeArea) {
      var o1 = Comman.getMergeAreaById(cellSheet, o.mergeAreaId);
      if (o1 != null) {
        o1.isDrawed = false;
      }
    }
    DrawRange(o, o.col, o.row);
  }

  function getTextWidthAndHeight(s) {
    return pdfCanvas.GetContext().measureText(s);
  }

  function hideInputBox() {
    var inputContainer = document.getElementById(myInputContainerId);
    inputContainer.style.width = "0px";
    inputContainer.style.height = "0px";
    inputContainer.style.border = "0px";
    inputContainer.style.padding = "0px";
    inputContainer.style.margin = "0px";
    inputContainer.style.opacity = 0;
  }

  function setInputBoxBlurEvent(inputBox, o) {
    inputBox.onblur = function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      hideInputBox(inputBox);
      setTextBoxValue(inputBox, o);
    };
  }

  function deSelectRectFun() {
    clearSelectMarks();
    resetRectSelectionFun();
    resetSelectRectSingleFun();
    selectedTextBoxList.length = 0;
    selectedColRowList.length = 0;
  }

  function clearSelectMarks() {
    FloatImageManager.ClearAllHandlerMarks();
    removeContextMenuFun();
    clearSelectTextboxMark();
    clearSelectColRowMark();
  }

  this.deSelectRect = deSelectRectFun;

  this.setSelectSingleStartRow = function (row) {
    selectStartRowSingle = row;
  };

  this.setSelectSingleEndRow = function (row) {
    selectEndRowSingle = row;
  };

  function startSelectRect(rangeStartCol, rangeStartRow) {
    if (selectEndCol == -1) {
      deSelectRectFun();
    }
    selectStartCol = rangeStartCol;
    selectStartRow = rangeStartRow;
  }

  function setInputBoxValueToDisplay() {
    var o = document.getElementById(myInputContainerId);
    if (o) {
      var forTextBoxId = o.getAttribute("forTextBoxId");
      var t = MyTextBoxManager.getTextBoxById(forTextBoxId);
      if (t && t.value != o.value) {
        setTextBoxValue(o, t);
      }
    }
  }

  function endSelectRect(rangeEndCol, rangeEndRow) {
    selectEndCol = rangeEndCol;
    selectEndRow = rangeEndRow;
    adjustSelectRect();
    setSelectRange(selectStartCol, selectStartRow, selectEndCol, selectEndRow);
    displayFontInfo();
  }

  function displayFontInfo() {
    if (selectedColRowList.length == 0) {
      return;
    }
    var t = selectedColRowList[0];
    var o = cellSheet.cells[t.col][t.row];
    if (document.getElementById(instanceId + "_select_font"))
      document.getElementById(instanceId + "_select_font").value = o.fontFamily;
    if (document.getElementById(instanceId + "_select_fontSize"))
      document.getElementById(instanceId + "_select_fontSize").value =
        o.fontSize;
  }

  function adjustSelectRect() {
    var L = [];
    var t1 = selectStartCol;
    var t2 = selectStartRow;
    var t3 = selectEndCol;
    var t4 = selectEndRow;
    for (var col = selectStartCol; col <= selectEndCol; col++) {
      for (var row = selectStartRow; row <= selectEndRow; row++) {
        var o = cellSheet.cells[col][row];
        if (o.isInMergeArea) {
          if (!L.Contains(o.mergeAreaId)) {
            var o1 = Comman.getMergeAreaById(cellSheet, o.mergeAreaId);
            if (o1) {
              if (t1 > o1.startCol - 1) {
                t1 = o1.startCol - 1;
              }
              if (t2 > o1.startRow - 1) {
                t2 = o1.startRow - 1;
              }
              if (t3 < o1.endCol - 1) {
                t3 = o1.endCol - 1;
              }
              if (t4 < o1.endRow - 1) {
                t4 = o1.endRow - 1;
              }
            }
          }
        }
      }
    }
    selectStartCol = t1;
    selectStartRow = t2;
    selectEndCol = t3;
    selectEndRow = t4;
  }

  function setSelectRange(
    selectStartCol,
    selectStartRow,
    selectEndCol,
    selectEndRow,
  ) {
    var L = [];
    for (var row = selectStartRow; row <= selectEndRow; row++) {
      for (var col = selectStartCol; col <= selectEndCol; col++) {
        if (col == -1 || row == -1) {
          continue;
        }
        addToSelectedColRowList({ col: col, row: row });
        var textbox = getTextBox(col, row);
        if (!textbox) {
          continue;
        }
        if (!L.Contains(textbox.id)) {
          L.Add(textbox.id);
          textbox.isFirstRow = false;
          textbox.isFirstCol = false;
          textbox.isEndRow = false;
          textbox.isEndCol = false;
          if (textbox.row == selectStartRow) {
            textbox.isFirstRow = true;
          }
          if (
            textbox.row + textbox.rangeEndRow - textbox.rangeStartRow ==
            selectEndRow
          ) {
            textbox.isEndRow = true;
          }
          if (textbox.col == selectStartCol) {
            textbox.isFirstCol = true;
          }
          if (
            textbox.col + textbox.rangeEndCol - textbox.rangeStartCol ==
            selectEndCol
          ) {
            textbox.isEndCol = true;
          }
          selectedTextBoxList.push(textbox);
        }
      }
    }
    setSelectedTextBoxFocus();
  }

  function setSelectedTextBoxFocus() {
    var isDrawColorMark = selectedTextBoxList.length > 1;
    for (var i = 0; i < selectedTextBoxList.length; i++) {
      var textbox = selectedTextBoxList[i];
      textbox.isDrawColorMark = isDrawColorMark;
      textbox.isDrawDragHand = i == selectedTextBoxList.length - 1;
      textbox.focus();
    }
  }

  function clearSelectTextboxMark() {
    for (var i = 0; i < selectedTextBoxList.length; i++) {
      var textbox = selectedTextBoxList[i];
      textbox.blur();
    }
    selectedTextBoxList.length = 0;
  }

  this.startAutoFill = function () {
    autoFillRangeStartCol = selectStartCol;
    autoFillRangeEndCol = selectEndCol;
    autoFillRangeStartRow = selectStartRow;
    autoFillRangeEndRow = selectEndRow;
  };

  this.endAutoFill = function () {
    this.copyRange();
    this.paste_autoFill();
    autoFillRangeStartCol = -1;
    autoFillRangeEndCol = -1;
    autoFillRangeStartRow = -1;
    autoFillRangeEndRow = -1;
  };

  this.setAutoFillRange = function () {
    var L = [];
    this.removeAutoFillRect();
    autoFillRangeTextBoxList = [];
    for (var row = autoFillRangeStartRow; row <= autoFillRangeEndRow; row++) {
      for (var col = autoFillRangeStartCol; col <= autoFillRangeEndCol; col++) {
        if (col == -1 || row == -1) {
          continue;
        }
        var textbox = getTextBox(col, row);
        if (!textbox) {
          continue;
        }
        if (!L.Contains(textbox.id)) {
          L.Add(textbox.id);
          textbox.isFirstRow = false;
          textbox.isFirstCol = false;
          textbox.isEndRow = false;
          textbox.isEndCol = false;
          if (textbox.row == selectStartRow) {
            textbox.isFirstRow = true;
          }
          if (
            textbox.row + textbox.rangeEndRow - textbox.rangeStartRow ==
            selectEndRow
          ) {
            textbox.isEndRow = true;
          }
          if (textbox.col == selectStartCol) {
            textbox.isFirstCol = true;
          }
          if (
            textbox.col + textbox.rangeEndCol - textbox.rangeStartCol ==
            selectEndCol
          ) {
            textbox.isEndCol = true;
          }
          autoFillRangeTextBoxList.push(textbox);
        }
      }
    }
    this.drawAutoFillRect();
  };

  this.drawAutoFillRect = function () {
    for (var i = 0; i < autoFillRangeTextBoxList.length; i++) {
      var textbox = autoFillRangeTextBoxList[i];
      textbox.drawAutoFillBorder();
    }
  };

  this.removeAutoFillRect = function () {
    for (var i = 0; i < autoFillRangeTextBoxList.length; i++) {
      var textbox = autoFillRangeTextBoxList[i];
      textbox.removeAutoFillBorder();
    }
  };

  function getTextBox(col, row) {
    var o = cellSheet.cells[col][row];
    var textboxId = "";
    if (o.isInMergeArea) {
      var o1 = Comman.getMergeAreaById(cellSheet, o.mergeAreaId);
      if (!o1) {
        o.isInMergeArea = false;
        textboxId = Comman.getTextBoxId(col, row, col, row);
      } else {
        var c1 = o1.startCol - 1,
          r1 = o1.startRow - 1,
          c2 = o1.endCol - 1,
          r2 = o1.endRow - 1;
        if (col != c1 || row != r1) {
          return null;
        }
        textboxId = Comman.getTextBoxId(c1, r1, c2, r2);
      }
    } else {
      textboxId = Comman.getTextBoxId(col, row, col, row);
    }
    var textbox = MyTextBoxManager.getTextBoxById(textboxId);
    return textbox;
  }

  function DrawCellImage(/*CellProp*/ oo, x, y, width, height) {
    if (oo.imageIndex == -1) {
      return;
    }
    x = x + 1;
    y = y + 1;
    width = width - 2;
    height = height - 2;
    var index = oo.imageIndex;
    var style = oo.imageStyle;
    var halign = oo.imageHAlign;
    var valign = oo.imageVAlign;
    var o = Comman.getCellImageByIndex(cellSheet, index);
    if (o == null || !isGoodImageType(o.imageType)) {
      return;
    }
    var xRect = new XRect(x, y, width, height);
    if (xRect.GetWidth() <= 0 || xRect.GetHeight() <= 0) {
      return;
    }
    var image = getImageFromImageList(o.imageIndex);
    if (!image) {
      return;
    }
    image.drawCellImage(
      doc,
      style,
      xRect,
      pageIndex,
      halign,
      valign,
      CanvasType.imageLayer,
    );
  }

  function drawFloatImagesAllPages() {
    if (cellSheet.floatImageList.length == 0) {
      return;
    }
    setFloatImagePageIndex();
    var L3 = convertPageInfoListAll;
    for (var i = 0; i < L3.length; i++) {
      var p = L3[i];
      drawFloatImages(p);
    }
  }

  function setFloatImagePageIndex() {
    for (var i = 0; i < cellSheet.floatImageList.length; i++) {
      setFloatImagePageIndexOne(cellSheet.floatImageList[i]);
    }
  }

  function setFloatImagePageIndexOne(p) {
    let ypos1 = 0;
    for (var i = 0; i < convertPageInfoListAll.length; i++) {
      let cp = convertPageInfoListAll[i];
      let ypos2 = ypos1 + cp.contentHeight;
      if (p.ypos >= ypos1 && p.ypos < ypos2) {
        p.pageIndex = cp.pageIndex;
        return;
      }
      ypos1 = ypos2;
    }
  }

  function drawFloatImages(p) {
    let L = [];
    for (var i = 0; i < cellSheet.floatImageList.length; i++) {
      let t = cellSheet.floatImageList[i];
      if (t.pageIndex === p.pageIndex) {
        L.push(t);
      }
    }
    if (L.length == 0) {
      return;
    }
    for (var i = 0; i < L.length; i++) {
      var floatImage = L[i];
      var index = floatImage.index;
      var o = Comman.getCellImageByIndex(cellSheet, index);
      if (o == null || !isGoodImageType(o.imageType)) {
        return;
      }
      var image = getImageFromImageList(o.imageIndex);
      var imageData = image.GetImage();
      drawFloatImage(floatImage, imageData);
    }
  }

  function isGoodImageType(imageType) {
    imageType = imageType.toLowerCase();
    return (
      imageType == "jpg" ||
      imageType == "jpeg" ||
      imageType == "bmp" ||
      imageType == "png" ||
      imageType == "svg" ||
      imageType == "gif"
    );
  }

  function drawBackGroundImageAllPages() {
    var L3 = convertPageInfoListAll;
    for (var i = 0; i < L3.length; i++) {
      var p = L3[i];
      drawBackGroundImage(p);
    }
  }

  function drawBackGroundImage(p) {
    if (cellSheet.backgroundImageIndex == -1) {
      return;
    }
    var index = cellSheet.backgroundImageIndex;
    var style = cellSheet.backgroundImageStyle;
    var o = Comman.getCellImageByIndex(cellSheet, index);
    if (o == null) {
      return;
    }
    var x = GetRangeX(p.startCol);
    var y = GetRangeY(p.startRow);
    var w = p.contentWidth;
    var h = p.contentHeight;
    var xRect = new XRect(x, y, w, h);
    var image = getImageFromImageList(o.imageIndex);
    image.drawBackImage(
      doc,
      style,
      xRect,
      pageIndex,
      CanvasType.backgroundLayer,
    );
  }

  function getImageFromImageList(imageIndex) {
    for (var i = 0; i < imageList.length; i++) {
      var p = imageList[i];
      if (p.imageIndex == imageIndex) {
        return p;
      }
    }
    return null;
  }

  function SetMergeAreaUnDrawed() {
    for (var i = 0; i < cellSheet.cellMergeAreaList.length; i++) {
      cellSheet.cellMergeAreaList[i].isDrawed = false;
    }
  }

  function IsRowPageBreak(row) {
    for (var i = 0; i < cellSheet.pageHardBreakRowList.length; i++) {
      var p = cellSheet.pageHardBreakRowList[i];
      if (p == row) {
        return true;
      }
    }
    return false;
  }

  function DrawMergeArea(/*CellMergeArea*/ o1, /*int*/ x, /*int*/ y) {
    var width = 0;
    var height = 0;

    for (var col = o1.startCol - 1; col < o1.endCol; col++) {
      if (col > cellSheet.colWidthList.length - 1) {
        break;
      }
      width += cellSheet.colWidthList[col];
    }
    for (var row = o1.startRow - 1; row < o1.endRow; row++) {
      if (row > cellSheet.rowHeightList.length - 1) {
        break;
      }
      height += cellSheet.rowHeightList[row];
    }

    if (isDrawObj(DrawObjType.grid)) {
      DrawMergeAreaBorder(o1, x, y);
    }

    if (isDrawObj(DrawObjType.cellImage)) {
      DrawCellImage(
        cellSheet.cells[o1.startCol - 1][o1.startRow - 1],
        x,
        y,
        width,
        height,
      );
    }

    if (isDrawObj(DrawObjType.text)) {
      DrawText(
        cellSheet.cells[o1.startCol - 1][o1.startRow - 1],
        x,
        y,
        width,
        height,
        o1.startCol - 1,
        o1.startRow - 1,
        o1.endCol - 1,
        o1.endRow - 1,
      );
    }
  }

  function DrawMergeAreaBorder(o1, x, y) {
    var x1 = x;
    for (var col = o1.startCol - 1; col < o1.endCol; col++) {
      if (col > cellSheet.colWidthList.length - 1) {
        break;
      }
      var y1 = y;
      for (var row = o1.startRow - 1; row < o1.endRow; row++) {
        if (row > cellSheet.rowHeightList.length - 1) {
          break;
        }
        var o = cellSheet.cells[col][row];
        if (col == o1.startCol - 1) {
          DrawLine.drawLine(
            o.borderLeft,
            Comman.ToXColor(o.borderLeftColor),
            pdfCanvas,
            new XPoint(x1, y1),
            new XPoint(x1, y1 + cellSheet.rowHeightList[row]),
            cellAreaHeight,
            isDesignMode,
            CanvasType.gridLayer,
          );
        }
        if (row == o1.startRow - 1) {
          DrawLine.drawLine(
            o.borderTop,
            Comman.ToXColor(o.borderTopColor),
            pdfCanvas,
            new XPoint(x1, y1),
            new XPoint(x1 + cellSheet.colWidthList[col], y1),
            cellAreaHeight,
            isDesignMode,
            CanvasType.gridLayer,
          );
        }
        if (col == o1.endCol - 1) {
          DrawLine.drawLine(
            o.borderRight,
            Comman.ToXColor(o.borderRightColor),
            pdfCanvas,
            new XPoint(x1 + cellSheet.colWidthList[col], y1),
            new XPoint(
              x1 + cellSheet.colWidthList[col],
              y1 + cellSheet.rowHeightList[row],
            ),
            cellAreaHeight,
            isDesignMode,
            CanvasType.gridLayer,
          );
          if (o.borderRight > 1 && col + 1 < cellSheet.colWidthList.length) {
            cellSheet.cells[col + 1][row].borderLeft = 0;
          }
        }
        if (row == o1.endRow - 1) {
          DrawLine.drawLine(
            o.borderBottom,
            Comman.ToXColor(o.borderBottomColor),
            pdfCanvas,
            new XPoint(x1, y1 + cellSheet.rowHeightList[row]),
            new XPoint(
              x1 + cellSheet.colWidthList[col],
              y1 + cellSheet.rowHeightList[row],
            ),
            cellAreaHeight,
            isDesignMode,
            CanvasType.gridLayer,
          );
          if (o.borderBottom > 1 && row + 1 < cellSheet.rowHeightList.length) {
            cellSheet.cells[col][row + 1].borderTop = 0;
          }
        }
        y1 += cellSheet.rowHeightList[row];
      }
      x1 += cellSheet.colWidthList[col];
    }
  }

  this.showTopLabelContextMenu = function (pos) {
    if (selectStartColSingle == -1 || selectEndColSingle == -1) {
      return;
    }
    new TopLabelContextMenuClass({
      pos: pos,
      parentEl: parentEl,
      instanceName: instanceName,
      contextMenuThemeConfig: contextMenuThemeConfig,
    }).doJob();
  };

  this.showLeftLabelContextMenu = function (pos) {
    if (selectStartRowSingle == -1 || selectEndRowSingle == -1) {
      return;
    }
    new LeftLabelContextMenuClass({
      pos: pos,
      parentEl: parentEl,
      instanceName: instanceName,
      contextMenuThemeConfig: contextMenuThemeConfig,
    }).doJob();
  };

  this.showCellContextMenu = function (pos) {
    if (selectedTextBoxList.length == 0) {
      return;
    }
    new CellContextMenuClass({
      pos: pos,
      parentEl: parentEl,
      instanceName: instanceName,
      contextMenuThemeConfig: contextMenuThemeConfig,
    }).doJob();
  };

  this.mergeCells = function () {
    if (
      selectStartCol == -1 ||
      selectStartRow == -1 ||
      selectEndCol == -1 ||
      selectEndRow == -1
    ) {
      return;
    }
    if (selectedTextBoxList.length <= 1) {
      return;
    }
    recordUndoContent();
    operCell.MergeCells(
      selectStartCol + 1,
      selectStartRow + 1,
      selectEndCol + 1,
      selectEndRow + 1,
    );
    deSelectRectFun();
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  };

  this.unmergeCells = function () {
    if (
      selectStartCol == -1 ||
      selectStartRow == -1 ||
      selectEndCol == -1 ||
      selectEndRow == -1
    ) {
      return;
    }
    recordUndoContent();
    operCell.UnmergeCells(
      selectStartCol + 1,
      selectStartRow + 1,
      selectEndCol + 1,
      selectEndRow + 1,
    );
    deSelectRectFun();
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  };

  this.insertRow = function (num) {
    if (selectStartRowSingle == -1 || selectEndRowSingle == -1) {
      return;
    }
    recordUndoContent();
    if (!num) {
      num = 1;
    }
    for (var i = 0; i < num; i++) {
      operCell.InsertRow(selectStartRowSingle + 1, 1, 0);
    }
    recordRedoContent();
    totalHeight = GetTotalHeight();
    redraw({ isNeedRedrawMark: true });
  };

  this.insertCol = function (num) {
    if (selectStartColSingle == -1 || selectEndColSingle == -1) {
      return;
    }
    recordUndoContent();
    if (!num) {
      num = 1;
    }
    for (var i = 0; i < num; i++) {
      operCell.InsertCol(selectStartColSingle + 1, 1, 0);
    }
    recordRedoContent();
    totalWidth = GetTotalWidth();
    redraw({ isNeedRedrawMark: true });
  };

  this.appendRow = function () {
    recordUndoContent();
    operCell.AppendRow(30, true);
    recordRedoContent();
    totalHeight = GetTotalHeight();
    redraw({ isNeedRedrawMark: true });
  };

  this.appendCol = function () {
    recordUndoContent();
    operCell.AppendCol(30, true);
    recordRedoContent();
    totalWidth = GetTotalWidth();
    redraw({ isNeedRedrawMark: true });
  };

  this.deleteRow = function () {
    if (selectStartRowSingle == -1 || selectEndRowSingle == -1) {
      return;
    }
    recordUndoContent();
    operCell.DeleteRow(
      selectStartRowSingle + 1,
      selectEndRowSingle - selectStartRowSingle + 1,
      0,
    );
    recordRedoContent();
    selectStartRowSingle = -1;
    selectEndRowSingle = -1;
    totalHeight = GetTotalHeight();
    redraw({ isNeedRedrawMark: true });
  };

  this.deleteCol = function () {
    if (selectStartColSingle == -1 || selectEndColSingle == -1) {
      return;
    }
    recordUndoContent();
    operCell.DeleteCol(
      selectStartColSingle + 1,
      selectEndColSingle - selectStartColSingle + 1,
      0,
    );
    recordRedoContent();
    selectStartColSingle = -1;
    selectEndColSingle = -1;
    totalWidth = GetTotalWidth();
    redraw({ isNeedRedrawMark: true });
  };

  this.showColumnPickWindow = function () {
    new ColumnPickWindow({ parentObj: me, parentEl: parentEl });
  };

  let insertPictureObj;
  this.insertPicture = function () {
    var o = selectedColRowList[0];
    if (!o) {
      alert("请选择一个单元格");
      return;
    }
    insertPictureObj = new InsertPictureClass({ parentObj: me, type: 1 });
    insertPictureObj.doJob();
  };

  this.insertFloatPicture = function () {
    var o = selectedColRowList[0];
    if (!o) {
      alert("请选择一个单元格");
      return;
    }
    insertPictureObj = new InsertPictureClass({ parentObj: me, type: 2 });
    insertPictureObj.doJob();
  };

  this.setBackImage = function () {
    new InsertBackImageClass({
      parentObj: me,
      parentEl: parentEl,
      instanceId: instanceId,
    }).doJob();
  };

  this.setBackImageDo = function (imagePlaceType) {
    if (imagePlaceType === 3) {
      operCell.SetBackImage(-1, 0, 0);
      recordRedoContent();
      drawObjTypes.push(DrawObjType.backgroundImage);
      redraw({ isNeedRedrawMark: true });
      return;
    }
    insertPictureObj = new InsertPictureClass({
      parentObj: me,
      type: 3,
      imagePlaceType: imagePlaceType,
    });
    insertPictureObj.doJob();
  };

  this.setBackImageDoDo = function (dataUrl, imagePlaceType) {
    var pos1 = dataUrl.indexOf("/");
    var pos2 = dataUrl.indexOf(";");
    var pos3 = dataUrl.indexOf(",");
    var imageData = dataUrl.substr(pos3 + 1);
    var imageType = dataUrl.substr(pos1 + 1, pos2 - pos1 - 1);
    var imageIndex = operCell.AddImage(imageData, imageType);
    operCell.SetBackImage(imageIndex, imagePlaceType, 0);
    if (insertPictureObj) insertPictureObj.destroy();
    recordRedoContent();
    drawObjTypes.push(DrawObjType.backgroundImage);
    redraw({ isNeedRedrawMark: true });
  };

  this.insertImage = function (dataUrl) {
    recordUndoContent();
    var o = selectedColRowList[0];
    var col = o.col + 1;
    var row = o.row + 1;
    var pos1 = dataUrl.indexOf("/");
    var pos2 = dataUrl.indexOf(";");
    var pos3 = dataUrl.indexOf(",");
    var imageData = dataUrl.substr(pos3 + 1);
    var imageType = dataUrl.substr(pos1 + 1, pos2 - pos1 - 1);
    var imageIndex = operCell.AddImage(imageData, imageType);
    operCell.SetCellImage(col, row, 0, imageIndex, 3, 2, 2);
    if (insertPictureObj) insertPictureObj.destroy();
    recordRedoContent();
    drawObjTypes.push(DrawObjType.cellImage);
    redraw({ isNeedRedrawMark: true });
  };

  function InsertImage(imageData, imageType) {
    recordUndoContent();
    var col = GetCurrentCol();
    var row = GetCurrentRow();
    var imageIndex = operCell.AddImage(imageData, imageType);
    operCell.SetCellImage(col, row, 0, imageIndex, 3, 2, 2);
    recordRedoContent();
    drawObjTypes.push(DrawObjType.cellImage);
    redraw({ isNeedRedrawMark: true });
  }

  this.insertFloatImage = function (dataUrl) {
    recordUndoContent();
    var o = selectedColRowList[0];
    var col = o.col + 1;
    var row = o.row + 1;
    var pos1 = dataUrl.indexOf("/");
    var pos2 = dataUrl.indexOf(";");
    var pos3 = dataUrl.indexOf(",");
    var imageData = dataUrl.substr(pos3 + 1);
    var imageType = dataUrl.substr(pos1 + 1, pos2 - pos1 - 1);
    var imageIndex = operCell.AddImage(imageData, imageType);
    operCell.SetCellFloatImage(
      col,
      row,
      0,
      "FloatImage_" + imageIndex,
      imageIndex,
    );
    insertPictureObj.destroy();
    var floatImage = cellSheet.floatImageList.Find(function (p) {
      return p.index == imageIndex;
    });
    var imageData = new Image();
    imageData.onload = function () {
      floatImage.width = imageData.width;
      floatImage.height = imageData.height;
      drawObjTypes.push(DrawObjType.floatImage);
      drawFloatImage(floatImage, imageData);
    };
    imageData.src = dataUrl;
  };

  function drawFloatImage(floatImage, imageData) {
    var xRect = new XRect(
      floatImage.xpos + startX,
      floatImage.ypos + startY,
      floatImage.width,
      floatImage.height,
    );
    var t = new FloatImageDraw({
      parentObj: me,
      parentEl: parentEl,
      imageData: imageData,
      floatImage: floatImage,
      xRect: xRect,
    });
    FloatImageManager.Add(t);
  }

  this.deleteFloatImage = function (floatImage) {
    debugger;
    operCell.DeleteImage(floatImage.index);
    cellSheet.floatImageList.RemoveAll(function (p) {
      return p.index == floatImage.index;
    });
    FloatImageManager.DeleteByFloatImageIndex(floatImage.index);
  };

  this.pageSet = function () {
    new PageSetClass({
      dialogThemeConfig: dialogThemeConfig,
      parentObj: me,
      parentInstanceName: instanceName,
      cellSheet: cellSheet,
      parentEl: parentEl,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
    }).doJob();
  };

  this.pageSet_setValue = function () {
    var select_paperOrientation = document.getElementById(
      "select_paperOrientation",
    ).value;
    var input_paperHeight = document.getElementById("input_paperHeight").value;
    var input_paperWidth = document.getElementById("input_paperWidth").value;
    var leftMargin = document.getElementById("input_leftMargin").value;
    var rightMargin = document.getElementById("input_rightMargin").value;
    var topMargin = document.getElementById("input_topMargin").value;
    var bottomMargin = document.getElementById("input_bottomMargin").value;
    if (leftMargin == "") {
      alert("请录入左边距值!");
      return;
    }
    if (rightMargin == "") {
      alert("请录入右边距值!");
      return;
    }
    if (topMargin == "") {
      alert("请录入上边距值!");
      return;
    }
    if (bottomMargin == "") {
      alert("请录入下边距值!");
      return;
    }
    if (
      isNaN(leftMargin) ||
      isNaN(rightMargin) ||
      isNaN(topMargin) ||
      isNaN(bottomMargin)
    ) {
      alert("请录入数字!");
      return;
    }
    recordUndoContent();
    cellSheet.printInfo.printOrient = parseInt(select_paperOrientation);
    cellSheet.printInfo.paperWidth =
      Comman.mmmToPixels2(parseFloat(input_paperWidth) * 10) * scaleRate;
    cellSheet.printInfo.paperHeight =
      Comman.mmmToPixels2(parseFloat(input_paperHeight) * 10) * scaleRate;
    cellSheet.printInfo.marginLeft =
      Comman.mmmToPixels2(parseFloat(leftMargin) * 10) * scaleRate;
    cellSheet.printInfo.marginRight =
      Comman.mmmToPixels2(parseFloat(rightMargin) * 10) * scaleRate;
    cellSheet.printInfo.marginTop =
      Comman.mmmToPixels2(parseFloat(topMargin) * 10) * scaleRate;
    cellSheet.printInfo.marginBottom =
      Comman.mmmToPixels2(parseFloat(bottomMargin) * 10) * scaleRate;
    cellSheet.printInfo.contentWidth =
      cellSheet.printInfo.paperWidth -
      cellSheet.printInfo.marginLeft -
      cellSheet.printInfo.marginRight;
    cellSheet.printInfo.contentHeight =
      cellSheet.printInfo.paperHeight -
      cellSheet.printInfo.marginTop -
      cellSheet.printInfo.marginBottom;
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
    var el = document.getElementById("div_pageSet");
    if (el) {
      parentEl.parentElement.removeChild(el);
    }
  };

  this.printPreview = function () {
    var d = unScalePageForSave();
    myAjaxJson(
      pdfGenUrl,
      d,
      function (data) {
        var url = getLocation() + "/tempData/" + data;
        new PrintPreviewClass({ pdfUrl: url }).doJob();
      },
      function () {
        alert("预览失败!");
      },
    );
  };

  this.save = function () {
    Save();
  };

  /**
   * 保存工作簿
   * @function Save
   * @description 保存当前工作簿到服务器或本地
   * @returns {Object} 工作簿数据对象
   */
  function Save() {
    cellSheet.calculateInfo = calculateInfo;
    cellSheet.checkResultMap = checkResultMap;
    cellSheet.fillDataMaps1 = fillDataMaps1;
    cellSheet.fillDataMaps2 = fillDataMaps2;
    config.saveMethod(me);
  }

  this.save2 = function () {
    config.saveMethod2(me);
  };

  this.getCommanColumnMaps = function () {
    return new GetCommanColumnMaps({
      parentObj: me,
      cellSheet: cellSheet,
      operCell: operCell,
    }).doJob();
  };

  this.duplicatePage = function () {
    recordUndoContent();
    DuplicatePageA(1, templateRowCount);
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  };

  this.deleteLastPage = function () {
    recordUndoContent();
    DeletePage();
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  };

  function DuplicateFloatImageToPageEnd(copyStartRow, copyEndRow) {
    //粘贴到尾部的情况
    let startPageIndex = getPageIndexByRow(copyStartRow - 1);
    if (startPageIndex == -1) {
      return;
    }
    let endPageIndex = getPageIndexByRow(copyEndRow - 1);
    if (endPageIndex == -1) {
      return;
    }
    let floatImageList = Comman.DeepCopyArray(
      getFloatImageListByPageIndex(startPageIndex, endPageIndex),
    );
    if (floatImageList.length == 0) {
      return;
    }
    let addYPos = getRowsHeight(1, operCell.GetRows(0) - 1);
    let addPageCount = convertPageInfoListAll.length;
    for (var i = 0; i < floatImageList.length; i++) {
      var p = floatImageList[i];
      p.ypos += addYPos;
      p.pageIndex += addPageCount;
      cellSheet.floatImageList.push(p);
    }
  }

  function DeleteFloatImage(copyStartRow, copyEndRow) {
    let startPageIndex = getPageIndexByRow(copyStartRow - 1);
    if (startPageIndex == -1) {
      return;
    }
    let endPageIndex = getPageIndexByRow(copyEndRow - 1);
    if (endPageIndex == -1) {
      return;
    }
    let floatImageList = Comman.DeepCopyArray(
      getFloatImageListByPageIndex(startPageIndex, endPageIndex),
    );
    if (floatImageList.length == 0) {
      return;
    }
    cellSheet.floatImageList.RemoveAll(function (p) {
      return p.pageIndex >= startPageIndex && p.pageIndex <= endPageIndex;
    });
  }

  function getRowsHeight(startRow, endRow) {
    let t = 0;
    for (var row = startRow - 1; row < endRow; row++) {
      t += cellSheet.rowHeightList[row];
    }
    return t;
  }

  function getFloatImageListByPageIndex(startPageIndex, endPageIndex) {
    var L = [];
    for (var i = 0; i < cellSheet.floatImageList.length; i++) {
      var p = cellSheet.floatImageList[i];
      if (p.pageIndex >= startPageIndex && p.pageIndex <= endPageIndex) {
        L.push(p);
      }
    }
    return L;
  }

  function getPageIndexByRow(row) {
    for (var i = 0; i < convertPageInfoListAll.length; i++) {
      var p = convertPageInfoListAll[i];
      if (row >= p.startRow && row <= p.endRow) {
        return p.pageIndex;
      }
    }
    return -1;
  }

  function DuplicatePage() {
    DuplicatePageAll();
  }

  function DuplicatePageA(startRow, endRow) {
    DuplicateFloatImageToPageEnd(startRow, endRow);
    operCell.CopyRange(1, startRow, operCell.GetCols(0) - 1, endRow);
    operCell.SetRowPageBreak(operCell.GetRows(0), 1);
    operCell.Paste(1, operCell.GetRows(0), 0, 1, 0);
    operCell.SetRowPageBreak(operCell.GetRows(0), 1);
    redraw({ isNeedRedrawMark: true });
  }

  function DuplicatePageAll() {
    DuplicatePageA(1, operCell.GetRows(0) - 1);
  }

  function DeletePage() {
    var t =
      convertPageInfoList_Vertical[convertPageInfoList_Vertical.length - 1];
    if (!t || t.length === 1) {
      return;
    }
    if (t.startRow === -1) {
      t.startRow = 0;
    }
    if (t.endRow === -1) {
      t.endRow = operCell.GetRows(0) - 1 - 1;
    }
    DeleteFloatImage(t.startPage + 1, t.endRow + 1);
    operCell.DeleteRow(t.startRow + 1, t.endRow - t.startRow + 1, 0);
    redraw({ isNeedRedrawMark: true });
  }

  function DeletePageA(startRow, endRow) {
    DeleteFloatImage(startRow, endRow);
    operCell.DeleteRow(startRow, endRow - startRow + 1, 0);
    redraw({ isNeedRedrawMark: true });
  }

  function GetCellContent() {
    var d = unScalePageForSave();
    var t1 = cellSheet["version"];
    if (t1 && t1 == "2") {
      var t = JSON.parse(d);
      /*版本2比较卡，将格式回到版本1*/
      //t.cellsStr = getCellStrFromCells(t);
      //t.cells.length = 0;
      //t.cells = new Array();
      //return JSON.stringify(t);
      t.cellsStr = null;
      t.version = "1";
      return JSON.stringify(t);
    }
    return d;
  }

  function getCellStrFromCells(t) {
    var LAll = [];
    for (var i = 0; i < t.cells.length; i++) {
      var t1 = t.cells[i];
      var L = [];
      for (var k = 0; k < t1.length; k++) {
        var t2 = getPropStr(t1[k]);
        L.push(t2);
      }
      LAll.push(L);
    }
    return LAll;
  }

  function getPropStr(o) {
    var tAr = [
      encodeStr(o.str),
      o.backgroundColor,
      o.borderLeft,
      o.borderTop,
      o.borderRight,
      o.borderBottom,
      o.borderLeftColor,
      o.borderTopColor,
      o.borderRightColor,
      o.borderBottomColor,
      o.imageIndex,
      o.imageStyle,
      o.imageHAlign,
      o.imageVAlign,
      getFontFamilyIndex(o.fontFamily),
      o.fontSize,
      o.fontStyle,
      o.fontColor,
      o.lineSpace,
      o.cellHAlign,
      o.cellVAlign,
      getBooleanNumber(o.isInMergeArea),
      o.mergeAreaId,
      o.formulaId,
      o.note,
      o.numType,
      o.digital,
      getBooleanNumber(o.isMultiLine),
      getBooleanNumber(o.isAutoScale),
    ];
    return tAr.join(",");
  }

  function getFontFamilyIndex(v) {
    return cellSheet.fontFamilyList.indexOf(v);
  }

  function getBooleanNumber(v) {
    if (v) {
      return 1;
    }
    return 0;
  }

  function encodeStr(s) {
    return s.replace(/,/g, "{$}");
  }

  this.getCellContent = GetCellContent;

  /**
   * 重做操作
   * @function Redo
   * @description 重做上一次撤销的操作
   */
  function Redo() {
    var o = myUndoRedo.getRedoContent();
    if (o == null) {
      return;
    }
    workbook["sheets"][o.sheetIndex]["content"] = Comman.DeepCopyObj(o.content);
    cellSheet = workbook["sheets"][o.sheetIndex]["content"];
    operCell.Open(cellSheet);
    if (o.sheetIndex == sheetIndex) {
      redraw({ isNeedRedrawMark: true });
    }
  }

  this.redo = Redo;

  /**
   * 撤销操作
   * @function Undo
   * @description 撤销上一次操作，恢复到上一个历史状态
   */
  function Undo() {
    var o = myUndoRedo.getUndoContent();
    if (o == null) {
      return;
    }
    workbook["sheets"][o.sheetIndex]["content"] = Comman.DeepCopyObj(o.content);
    cellSheet = workbook["sheets"][o.sheetIndex]["content"];
    operCell.Open(cellSheet);
    if (o.sheetIndex == sheetIndex) {
      redraw({ isNeedRedrawMark: true });
    }
  }

  this.undo = Undo;

  this.selectall = function () {
    if (isSelectedAll) {
      isSelectedAll = false;
      deSelectRectFun();
    } else {
      isSelectedAll = true;
      setSelectRange(
        0,
        0,
        cellSheet.colWidthList.length - 1,
        cellSheet.rowHeightList.length - 1,
      );
    }
  };

  this.redrawOneCell2 = function (t) {
    var o = cellSheet.cells[t.col][t.row];
    if (o.str != "") {
      var t1 = getTextBox(t.col, t.row);
      if (t1) {
        this.redrawOneCell(t.col, t.row);
      }
    }
  };

  this.setCellAlignLeft = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      operCell.SetCellHAlign(col, row, sheetIndex, 1);
      this.redrawOneCell2(o);
    }
    recordRedoContent();
  };

  this.setCellAlignCenter = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      operCell.SetCellHAlign(col, row, sheetIndex, 4);
      this.redrawOneCell2(o);
    }
    recordRedoContent();
  };

  this.setCellAlignRight = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      operCell.SetCellHAlign(col, row, sheetIndex, 2);
      this.redrawOneCell2(o);
    }
    recordRedoContent();
  };

  this.setCellAlignBottom = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      operCell.SetCellVAlign(col, row, sheetIndex, 16);
      this.redrawOneCell2(o);
    }
    recordRedoContent();
  };

  this.setCellAlignMiddle = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      operCell.SetCellVAlign(col, row, sheetIndex, 32);
      this.redrawOneCell2(o);
    }
    recordRedoContent();
  };

  this.setCellAlignTop = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      operCell.SetCellVAlign(col, row, sheetIndex, 8);
      this.redrawOneCell2(o);
    }
    recordRedoContent();
  };

  this.setCellBold = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      var t = operCell.GetCellFontStyle(col, row, sheetIndex);
      var t1 = Comman.GetFontStyle(t);
      if (t1.fontWeight != "bold") {
        t = t + 2;
      } else {
        t = t - 2;
      }
      operCell.SetCellFontStyle(col, row, sheetIndex, t);
      this.redrawOneCell2(o);
    }
    recordRedoContent();
  };

  this.setCellItalic = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      var t = operCell.GetCellFontStyle(col, row, sheetIndex);
      var t1 = Comman.GetFontStyle(t);
      if (t1.fontStyle != "Italic") {
        t = t + 4;
      } else {
        t = t - 4;
      }
      operCell.SetCellFontStyle(col, row, sheetIndex, t);
      this.redrawOneCell2(o);
    }
    recordRedoContent();
  };

  this.setCellSup = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    var o = selectedColRowList[0];
    var col = o.col + 1;
    var row = o.row + 1;
    var str = operCell.GetCellString(col, row, 0);
    if (str == "" || isHtml(str)) {
      return;
    }
    var flag = false;
    if (inputBoxSelectText == "" || inputBoxSelectText == str) {
      flag = true;
      str = str.replace(/&Sup/g, "");
      str = str.replace(/&Sub/g, "");
      str = str.replace(/&End/g, "");
      if (!getDefaultTextForCellSupSub(str)) {
        return;
      }
    }
    recordUndoContent();
    var v = f_reaplace(
      str,
      inputBoxSelectTextStartOffset,
      inputBoxSelectTextEndOffset,
      "&Sup" + inputBoxSelectText + "&End",
    );
    if (flag) {
      inputBoxSelectTextStartOffset = 0;
      inputBoxSelectTextEndOffset = 0;
      inputBoxSelectText = "";
    }
    SetCellString(col, row, 0, v);
    removeInput();
    this.redrawOneCell(col - 1, row - 1);
    recordRedoContent();
  };

  function getDefaultTextForCellSupSub(str) {
    var t = getNumberFromString(str);
    if (t.s == "") {
      return false;
    }
    inputBoxSelectTextStartOffset = t.pos1;
    inputBoxSelectTextEndOffset = t.pos2 + 1;
    inputBoxSelectText = t.s;
    return true;
  }

  this.setCellSub = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    var o = selectedColRowList[0];
    var col = o.col + 1;
    var row = o.row + 1;
    var str = operCell.GetCellString(col, row, 0);
    if (str == "" || isHtml(str)) {
      return;
    }
    var flag = false;
    if (inputBoxSelectText == "" || inputBoxSelectText == str) {
      flag = true;
      str = str.replace(/&Sup/g, "");
      str = str.replace(/&Sub/g, "");
      str = str.replace(/&End/g, "");
      if (!getDefaultTextForCellSupSub(str)) {
        return;
      }
    }
    recordUndoContent();
    var v = f_reaplace(
      str,
      inputBoxSelectTextStartOffset,
      inputBoxSelectTextEndOffset,
      "&Sub" + inputBoxSelectText + "&End",
    );
    if (flag) {
      inputBoxSelectTextStartOffset = 0;
      inputBoxSelectTextEndOffset = 0;
      inputBoxSelectText = "";
    }
    SetCellString(col, row, 0, v);
    removeInput();
    this.redrawOneCell(col - 1, row - 1);
    recordRedoContent();
  };

  function getNumberFromString(s) {
    var tempStr = "";
    var pos1 = -1;
    var pos2 = -1;
    var flag = false;
    var firstTime = true;
    for (var i = s.length - 1; i >= 0; i--) {
      if (/[0-9]/.test(s.substr(i, 1))) {
        tempStr += s.substr(i, 1);
        flag = true;
        if (firstTime == true) {
          firstTime = false;
          pos2 = i;
          pos1 = i;
        } else {
          pos1 = i;
        }
      } else {
        if (flag == true) {
          break;
        }
      }
    }
    return {
      s: tempStr.split("").reverse().join(""),
      pos1: pos1,
      pos2: pos2,
    };
  }

  function f_reaplace(s1, pos1, pos2, s2) {
    if (pos1 == -1 || pos2 == -1) {
      return s1;
    }
    if (pos1 == 0) {
      return s2 + s1.substr(pos2);
    } else {
      return s1.substring(0, pos1) + s2 + s1.substr(pos2);
    }
  }

  this.setCellUnderline = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      var t = operCell.GetCellFontStyle(col, row, sheetIndex);
      var t1 = Comman.GetFontStyle(t);
      if (t1.textDecoration != "underline") {
        t = t + 8;
      } else {
        t = t - 8;
      }
      operCell.SetCellFontStyle(col, row, sheetIndex, t);
    }
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  };

  this.setCellAutoZoom = function (v) {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      operCell.SetCellFontAutoZoom(col, row, sheetIndex, v);
      this.redrawOneCell(col - 1, row - 1);
    }
    recordRedoContent();
  };

  this.setCellTextStyle = function (v) {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      operCell.SetCellTextStyle(col, row, sheetIndex, v);
      this.redrawOneCell(col - 1, row - 1);
    }
    recordRedoContent();
  };

  this.setCellForeColor = function () {
    if (selectedColRowList.length == 0) {
      alert("请先选择单元格!");
      return;
    }
    new ColorPicker({
      parentObj: me,
      parentEl: parentEl,
      parentId: instanceId,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
      leftLabelWidth: leftLabelWidth,
      topLabelHeight: topLabelHeight,
      leftLabelPadding: leftLabelPadding,
      topLabelPadding: topLabelPadding,
      toolbarHeight: toolbarHeight,
      useModel: "foregroundColor",
    }).doJob();
  };

  this.setFontColor = function (color) {
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      operCell.SetCellTextColor(col, row, sheetIndex, color);
      this.redrawOneCell(col - 1, row - 1);
    }
    recordRedoContent();
  };

  this.setCellBackColor = function () {
    if (selectedColRowList.length == 0) {
      alert("请先选择单元格!");
      return;
    }
    new ColorPicker({
      parentObj: me,
      parentEl: parentEl,
      parentId: instanceId,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
      leftLabelWidth: leftLabelWidth,
      topLabelHeight: topLabelHeight,
      leftLabelPadding: leftLabelPadding,
      topLabelPadding: topLabelPadding,
      toolbarHeight: toolbarHeight,
      useModel: "backgroundColor",
    }).doJob();
  };

  this.setBackColor = function (color) {
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col + 1;
      var row = o.row + 1;
      operCell.SetCellBackColor(col, row, sheetIndex, color);
      this.redrawOneCell(col - 1, row - 1);
    }
    recordRedoContent();
  };

  this.selectCellBorderColor = function () {
    new ColorPicker({
      parentObj: me,
      parentEl: parentEl,
      parentId: instanceId,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
      leftLabelWidth: leftLabelWidth,
      topLabelHeight: topLabelHeight,
      leftLabelPadding: leftLabelPadding,
      topLabelPadding: topLabelPadding,
      toolbarHeight: toolbarHeight,
      useModel: "cellBorderColor",
    }).doJob();
  };

  this.selectCellBorderColor_do = function (color) {
    definedBorderColor = color;
    cellToolbar.setSelectCellBorderColorButtonColor(color);
  };

  this.setDefinedLineStyle = function (style) {
    definedLineStyle = style;
    cellToolbar.setSelectLineStyleButton(style);
  };

  this.getDefinedLineStyle = function () {
    return definedLineStyle;
  };

  this.setCellBorder = function () {
    if (selectedColRowList.length == 0) {
      alert("请先选择单元格!");
      return;
    }
    new SetCellBorderClass({
      dialogThemeConfig: dialogThemeConfig,
      parentObj: me,
      parentInstanceName: instanceName,
      cellSheet: cellSheet,
      parentEl: parentEl,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
    }).doJob();
  };

  this.setCellBorder_setValue = function () {
    var borderType = GetCellBorderTypeValue();
    var lineStyle = parseInt(document.getElementById("select_lineStyle").value);
    var el = document.getElementById("div_setCellBorder");
    if (el) {
      parentEl.parentElement.removeChild(el);
    }
    setCellBorder_setValue_do(borderType, lineStyle);
  };

  this.setCellBorder_setValue_do = function (borderType, lineStyle) {
    recordUndoContent();
    if (borderType == "outborder") {
      setCellOutBorder(lineStyle);
    } else {
      for (var i = 0; i < selectedColRowList.length; i++) {
        var o = selectedColRowList[i];
        setCellBorder_do(o.col, o.row, borderType, lineStyle);
      }
    }
    recordRedoContent();
    redraw();
  };

  function setCellOutBorder(lineStyle) {
    lineStyle = 4;
    var startCol = 0;
    var startRow = 0;
    var endCol = 0;
    var endRow = 0;
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col;
      var row = o.row;
      if (i == 0) {
        startCol = col;
        startRow = row;
        endCol = col;
        endRow = row;
      } else {
        if (col < startCol) {
          startCol = col;
        } else if (col > endCol) {
          endCol = col;
        }
        if (row < startRow) {
          startRow = row;
        } else if (row > endRow) {
          endRow = row;
        }
      }
    }
    var col = startCol;
    for (var row = startRow; row <= endRow; row++) {
      setCellBorderLeft(col, row, lineStyle);
    }
    var col = endCol;
    for (var row = startRow; row <= endRow; row++) {
      setCellBorderRight(col, row, lineStyle);
    }
    var row = startRow;
    for (var col = startCol; col <= endCol; col++) {
      setCellBorderTop(col, row, lineStyle);
    }
    var row = endRow;
    for (var col = startCol; col <= endCol; col++) {
      setCellBorderBottom(col, row, lineStyle);
    }
  }

  function setCellBorderLeft(col, row, lineStyle) {
    cellSheet.cells[col][row].borderLeftColor = definedBorderColor;
    cellSheet.cells[col][row].borderLeft = lineStyle;
    if (col - 1 >= 0) {
      cellSheet.cells[col - 1][row].borderRight = lineStyle;
      cellSheet.cells[col - 1][row].borderRightColor = definedBorderColor;
    }
  }

  function setCellBorderRight(col, row, lineStyle) {
    cellSheet.cells[col][row].borderRightColor = definedBorderColor;
    cellSheet.cells[col][row].borderRight = lineStyle;
    if (col + 1 <= cellSheet.colWidthList.length - 1) {
      cellSheet.cells[col + 1][row].borderLeft = lineStyle;
      cellSheet.cells[col + 1][row].borderLeftColor = definedBorderColor;
    }
  }

  function setCellBorderTop(col, row, lineStyle) {
    cellSheet.cells[col][row].borderTopColor = definedBorderColor;
    cellSheet.cells[col][row].borderTop = lineStyle;
    if (row - 1 >= 0) {
      cellSheet.cells[col][row - 1].borderBottom = lineStyle;
      cellSheet.cells[col][row - 1].borderBottomColor = definedBorderColor;
    }
  }

  function setCellBorderBottom(col, row, lineStyle) {
    cellSheet.cells[col][row].borderBottomColor = definedBorderColor;
    cellSheet.cells[col][row].borderBottom = lineStyle;
    if (row + 1 <= cellSheet.rowHeightList.length - 1) {
      cellSheet.cells[col][row + 1].borderTop = lineStyle;
      cellSheet.cells[col][row + 1].borderTopColor = definedBorderColor;
    }
  }

  function setCellBorder_do(col, row, borderType, lineStyle) {
    if (borderType == "all") {
      setCellBorderLeft(col, row, lineStyle);
      setCellBorderRight(col, row, lineStyle);
      setCellBorderTop(col, row, lineStyle);
      setCellBorderBottom(col, row, lineStyle);
    } else if (borderType == "left") {
      setCellBorderLeft(col, row, lineStyle);
    } else if (borderType == "top") {
      setCellBorderTop(col, row, lineStyle);
    } else if (borderType == "right") {
      setCellBorderRight(col, row, lineStyle);
    } else if (borderType == "bottom") {
      setCellBorderBottom(col, row, lineStyle);
    }
  }

  function GetCellBorderTypeValue() {
    var elAr = document.getElementsByName("radio_cellBorder");
    for (var i = 0; i < elAr.length; i++) {
      var o = elAr[i];
      if (o.checked) {
        return o.value;
      }
    }
    return 1;
  }

  this.changeFont = function () {
    var v = document.getElementById(instanceId + "_select_font").value;
    if (v == "") {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var t = selectedColRowList[i];
      cellSheet.cells[t.col][t.row].fontFamily = v;
      if (cellSheet.fontFamilyList.indexOf(v) == -1) {
        cellSheet.fontFamilyList.push(v);
      }
      this.redrawOneCell2(t);
    }
    recordRedoContent();
  };

  this.clearCellBorder = function () {
    if (selectedColRowList.length == 0) {
      alert("请先选择单元格!");
      return;
    }
    new ClearCellBorderClass({
      dialogThemeConfig: dialogThemeConfig,
      parentObj: me,
      parentInstanceName: instanceName,
      cellSheet: cellSheet,
      parentEl: parentEl,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
    }).doJob();
  };

  this.clearCellBorder_setValue = function () {
    var borderType = GetCellBorderTypeValue();
    var el = document.getElementById("div_clearCellBorder");
    if (el) {
      parentEl.parentElement.removeChild(el);
    }
    this.clearCellBorder_setValue_do(borderType);
  };

  this.clearCellBorder_setValue_do = function (borderType) {
    recordUndoContent();
    if (borderType == "outborder") {
      clearCellOutBorder();
    } else {
      for (var i = 0; i < selectedColRowList.length; i++) {
        var o = selectedColRowList[i];
        clearCellBorder_do(o.col, o.row, borderType);
      }
    }
    recordRedoContent();
    redraw();
  };

  function clearCellOutBorder() {
    var startCol = 0;
    var startRow = 0;
    var endCol = 0;
    var endRow = 0;
    for (var i = 0; i < selectedColRowList.length; i++) {
      var o = selectedColRowList[i];
      var col = o.col;
      var row = o.row;
      if (i == 0) {
        startCol = col;
        startRow = row;
        endCol = col;
        endRow = row;
      } else {
        if (col < startCol) {
          startCol = col;
        } else if (col > endCol) {
          endCol = col;
        }
        if (row < startRow) {
          startRow = row;
        } else if (row > endRow) {
          endRow = row;
        }
      }
    }
    var col = startCol;
    for (var row = startRow; row <= endRow; row++) {
      clearCellBorderLeft(col, row);
    }
    var col = endCol;
    for (var row = startRow; row <= endRow; row++) {
      clearCellBorderRight(col, row);
    }
    var row = startRow;
    for (var col = startCol; col <= endCol; col++) {
      clearCellBorderTop(col, row);
    }
    var row = endRow;
    for (var col = startCol; col <= endCol; col++) {
      clearCellBorderBottom(col, row);
    }
  }

  function clearCellBorderLeft(col, row) {
    cellSheet.cells[col][row].borderLeft = 0;
    if (col - 1 >= 0) {
      cellSheet.cells[col - 1][row].borderRight = 0;
    }
  }

  function clearCellBorderTop(col, row) {
    cellSheet.cells[col][row].borderTop = 0;
    if (row - 1 >= 0) {
      cellSheet.cells[col][row - 1].borderBottom = 0;
    }
  }

  function clearCellBorderRight(col, row) {
    cellSheet.cells[col][row].borderRight = 0;
    if (col + 1 <= cellSheet.colWidthList.length - 1) {
      cellSheet.cells[col + 1][row].borderLeft = 0;
    }
  }

  function clearCellBorderBottom(col, row) {
    cellSheet.cells[col][row].borderBottom = 0;
    if (row + 1 <= cellSheet.rowHeightList.length - 1) {
      cellSheet.cells[col][row + 1].borderTop = 0;
    }
  }

  function clearCellBorder_do(col, row, borderType) {
    if (borderType == "all") {
      clearCellBorderLeft(col, row);
      clearCellBorderTop(col, row);
      clearCellBorderRight(col, row);
      clearCellBorderBottom(col, row);
    } else if (borderType == "left") {
      clearCellBorderLeft(col, row);
    } else if (borderType == "top") {
      clearCellBorderTop(col, row);
    } else if (borderType == "right") {
      clearCellBorderRight(col, row);
    } else if (borderType == "bottom") {
      clearCellBorderBottom(col, row);
    }
  }

  function removeCellContextMenu() {
    var id = "div_contextMenu_" + instanceName;
    var el = document.getElementById(id);
    if (el) {
      el.parentElement.removeChild(el);
    }
  }

  this.copyImage = function () {
    removeCellContextMenu();
    if (
      selectStartCol == -1 ||
      selectStartRow == -1 ||
      selectEndCol == -1 ||
      selectEndRow == -1
    ) {
      return;
    }
    var o = cellSheet.cells[selectStartCol][selectStartRow];
    if (o.imageIndex == -1) {
      return;
    }
    var imageData = Comman.getCellImageByIndex(cellSheet, o.imageIndex);
    if (imageData == null) {
      return;
    }
    top.copyedImageData = imageData;
  };

  this.pasteImage = function () {
    removeCellContextMenu();
    if (
      selectStartCol == -1 ||
      selectStartRow == -1 ||
      selectEndCol == -1 ||
      selectEndRow == -1
    ) {
      return;
    }
    if (!top.copyedImageData) {
      return;
    }
    recordUndoContent();
    var imageIndex = operCell.AddImage(
      top.copyedImageData.imageData,
      top.copyedImageData.imageType,
    );
    operCell.SetCellImage(
      selectStartCol + 1,
      selectStartRow + 1,
      0,
      imageIndex,
      3,
      2,
      2,
    );
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  };

  this.copyText = function () {
    removeCellContextMenu();
    if (
      selectStartCol == -1 ||
      selectStartRow == -1 ||
      selectEndCol == -1 ||
      selectEndRow == -1
    ) {
      return;
    }
    top.copyedTextAr = new GetRangeData({
      cellSheet: cellSheet,
      startCol: selectStartCol,
      startRow: selectStartRow,
      endCol: selectEndCol,
      endRow: selectEndRow,
    }).doJob();
  };

  this.pasteText = function () {
    removeCellContextMenu();
    if (
      selectStartCol == -1 ||
      selectStartRow == -1 ||
      selectEndCol == -1 ||
      selectEndRow == -1
    ) {
      return;
    }
    removeInput();
    recordUndoContent();
    new PasteRangeData({
      cellSheet: cellSheet,
      operCell: operCell,
      startCol: selectStartCol,
      startRow: selectStartRow,
    }).doJob();
    removeInput();
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  };

  this.copyRange = function () {
    removeCellContextMenu();
    if (
      selectStartCol == -1 ||
      selectStartRow == -1 ||
      selectEndCol == -1 ||
      selectEndRow == -1
    ) {
      return;
    }
    operCell.CopyRange(
      selectStartCol + 1,
      selectStartRow + 1,
      selectEndCol + 1,
      selectEndRow + 1,
    );
  };

  this.paste = function () {
    removeCellContextMenu();
    if (
      selectStartCol == -1 ||
      selectStartRow == -1 ||
      selectEndCol == -1 ||
      selectEndRow == -1
    ) {
      return;
    }
    recordUndoContent();
    var t = selectedColRowList[0];
    operCell.Paste(t.col + 1, t.row + 1, 0, 1, 0);
    removeInput();
    recordRedoContent();
    totalWidth = GetTotalWidth();
    totalHeight = GetTotalHeight();
    redraw({ isNeedRedrawMark: true });
  };

  this.setDigital = function () {
    if (selectedColRowList.length == 0) {
      alert("请先选择单元格!");
      return;
    }
    var t = selectedColRowList[0];
    var o = cellSheet.cells[t.col][t.row];
    var userInput = prompt("请输入小数位数：", o.digital);
    if (userInput !== null) {
      if (isNaN(userInput) || userInput.indexOf(".") != -1) {
        alert("请录入整数!");
      } else {
        recordUndoContent();
        for (var i = 0; i < selectedColRowList.length; i++) {
          t = selectedColRowList[i];
          o = cellSheet.cells[t.col][t.row];
          o.digital = parseInt(userInput);
          if (o.numType != 5) {
            o.numType = 1;
          }
          this.redrawOneCell(t.col, t.row);
        }
        operCell.CalculateSheet(0);
        recordRedoContent();
      }
    }
  };

  this.amendSetting = function () {
    if (selectedColRowList.length == 0) {
      return;
    }
    var L = [];
    for (var i = 0; i < selectedColRowList.length; i++) {
      var t = selectedColRowList[i];
      var t1 = getTextBox(t.col, t.row);
      if (!t1) {
        continue;
      }
      var o = cellSheet.cells[t.col][t.row];
      L.push(o);
    }
    var amendObj = {};
    if (L.length == 1 && L[0].amendObj) {
      amendObj = Comman.DeepCopyObj(L[0].amendObj);
    }
    new AmendSettingClass({
      amendObj: amendObj,
      dialogThemeConfig: dialogThemeConfig,
      parentObj: me,
      parentInstanceName: instanceName,
      cellSheet: cellSheet,
      parentEl: parentEl,
      parentElWidth: parentElWidth,
      parentElHeight: parentElHeight,
    }).doJob();
  };

  this.setAmend = function (amendObj) {
    if (readOnlyText) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var t = selectedColRowList[i];
      var o = cellSheet.cells[t.col][t.row];
      var t1 = getTextBox(t.col, t.row);
      if (!t1) {
        continue;
      }
      o.numType = 1;
      if (!o.amendObj) {
        o.rawValue = o.str;
      }
      o.amendObj = Comman.DeepCopyObj(amendObj);
      o.str = Comman.formatCellStr(o);
      this.redrawOneCell(t.col, t.row);
    }
    operCell.CalculateSheet(0);
    recordRedoContent();
    if (setAmendCallback) {
      setAmendCallback(cellSheet.cells);
    }
  };

  this.setNumType = function (v, isNeedRedraw) {
    if (selectedColRowList.length == 0) {
      return;
    }
    removeInput();
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var t = selectedColRowList[i];
      cellSheet.cells[t.col][t.row].numType = v;
    }
    recordRedoContent();
    if (isNeedRedraw) {
      redraw({ isNeedRedrawMark: true });
    }
  };

  this.openFile = function () {
    var t1 = document.createElement("input");
    t1.setAttribute("type", "file");
    t1.setAttribute("accept", ".json");
    t1.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const content = e.target.result;
        //console.log(content); // 文件内容
        // 在这里处理文件内容
        ResetCellData(JSON.parse(content), false, false);
      };
      reader.readAsText(file);
    });
    t1.click();
  };

  function ClearCellContent() {
    if (readOnlyText) {
      return;
    }
    if (selectedColRowList.length == 0) {
      return;
    }
    removeInput();
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var t = selectedColRowList[i];
      var o = cellSheet.cells[t.col][t.row];
      o.str = "";
      o.rawValue = "";
    }
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  }

  this.clearCellContent = ClearCellContent;

  function ClearCellHiddenContent() {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var t = selectedColRowList[i];
      var o = cellSheet.cells[t.col][t.row];
      o.columnName = "";
      o.imageInfo = "";
    }
    recordRedoContent();
  }

  this.clearCellHiddenContent = ClearCellHiddenContent;

  function ClearCellImage() {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var t = selectedColRowList[i];
      var o = cellSheet.cells[t.col][t.row];
      o.imageIndex = -1;
    }
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  }

  this.clearCellImage = ClearCellImage;

  function ClearCellFormula() {
    if (selectedColRowList.length == 0) {
      return;
    }
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var t = selectedColRowList[i];
      var o = cellSheet.cells[t.col][t.row];
      var o1 = cellSheet.formulaList.Find(function (p) {
        return p.targetCol == t.col && p.targetRow == t.row;
      });
      if (o1 != null) {
        var t1 = o1.id;
        if (t1 != "") {
          cellSheet.formulaList.RemoveAll(function (p) {
            return p.id == t1;
          });
        }
      }
      o.formulaId = "";
    }
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  }

  this.clearCellFormula = ClearCellFormula;

  function ClearCellAllContent() {
    if (readOnlyText) {
      return;
    }
    if (selectedColRowList.length == 0) {
      return;
    }
    removeInput();
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var t = selectedColRowList[i];
      var o = cellSheet.cells[t.col][t.row];
      o.str = "";
      o.rawValue = "";
      var t1 = o.formulaId;
      if (t1 != "") {
        cellSheet.formulaList.RemoveAll(function (p) {
          return p.id == t1;
        });
      }
      o.formulaId = Guid.Empty.toString();
      o.imageIndex = -1;
      o.columnName = "";
      o.imageInfo = "";
      if (o.isInMergeArea) {
        operCell.UnmergeCells(t.col + 1, t.row + 1, t.col + 1, t.row + 1);
      }
    }
    recordRedoContent();
    redraw({ isNeedRedrawMark: true });
  }

  this.clearCellAllContent = ClearCellAllContent;

  this.setFormula = function () {
    //if (selectedTextBoxList.length != 1) {
    //    return;
    //}
    //var v = document.getElementById("input_formula").value;
    //if (v == "") {
    //    return;
    //}
    //var t = selectedColRowList[0];
    //var o = cellSheet.cells[t.col][t.row];
    //if (o.formulaId != "" && o.formulaId != Guid.Empty.toString()) {
    //    var o1 = cellSheet.formulaList.Find(function (p) { return p.id == o.formulaId });
    //    if (o1 != null) {
    //        o1
    //    }
    //}
  };

  this.changeFontSize = function () {
    var fontSize = document.getElementById(
      instanceId + "_select_fontSize",
    ).value;
    if (fontSize == "") {
      return;
    }
    fontSize = parseFloat(fontSize);
    recordUndoContent();
    for (var i = 0; i < selectedColRowList.length; i++) {
      var t = selectedColRowList[i];
      var col = t.col + 1;
      var row = t.row + 1;
      operCell.SetCellFontSize(col, row, sheetIndex, fontSize);
      this.redrawOneCell2(t);
    }
    recordRedoContent();
  };

  this.setModelProperty = function () {
    if (config.setModelPropertyMethod) {
      config.setModelPropertyMethod(this, operCell);
    }
  };

  this.getRangeWindow = function () {
    if (config.getRangeWindowMethod) {
      config.getRangeWindowMethod(this, operCell);
    }
  };

  this.showSelectColumnsWindow = function () {
    if (config.showSelectColumnsWindowMethod) {
      config.showSelectColumnsWindowMethod(this, operCell);
    }
  };

  this.clearPageBreakRowList = function () {
    cellSheet.pageHardBreakRowList = [];
    cellSheet.pageHardBreakColList = [];
    redraw({ isNeedRedrawMark: true });
  };

  function GetOperCell() {
    return operCell;
  }

  this.getOperCell = GetOperCell;

  function GetOperCellForDataMake() {
    return operCellForDataMake;
  }

  this.getCellSheet = function () {
    return cellSheet;
  };

  this.getCalculateInfo = function () {
    return calculateInfo;
  };

  function GetFillDataJsonData() {
    return fillDataJsonData;
  }

  function GetFillDataMaps1() {
    return fillDataMaps1;
  }

  function GetFillDataMaps2() {
    return fillDataMaps2;
  }

  function SetupAutoComplete(L) {
    var mySetupAutoCompleteInterval = setInterval(function () {
      if (!isDrawComplete) {
        return;
      }
      clearInterval(mySetupAutoCompleteInterval);
      setupAutoCompleteDo(L);
    }, 100);
  }

  function setupAutoCompleteDo(L) {
    //L = [{tableAndColumn:"table1.column1","config": { apiUrl: "", columnInfoList: [{columnName:"c1", width: 100}...], valueColumnMaps:[{source:"xxx1",target:"table1.column1"}....] }}...];
    for (var i = 0; i < L.length; i++) {
      var p = L[i];
      if (p.type === 3) {
        setupAutoCompleteThree(p);
      } else if (p.type === 2) {
        setupAutoCompleteTwo(p);
      } else {
        setupAutoCompleteOne(p);
      }
    }
  }

  function setupAutoCompleteOne(p) {
    var t1 = p.tableAndColumn;
    for (var i = 0; i <= 99; i++) {
      var t2 = getColRowRefTableAndColumnInfo(t1 + "." + i);
      if (!t2) {
        break;
      }
      var col = t2.col - 1;
      var row = t2.row - 1;
      var textBox = getTextBox(col, row);
      if (!textBox) {
        break;
      }
      textBox.autoCompleteConfig = p.configDetail;
    }
  }

  function setupAutoCompleteTwo(p) {
    var t = new GetOneRightCellClass({
      operCell: operCell,
      cellSheet: cellSheet,
      needFindStr: p.needFindStr,
    }).doJob();
    if (!t) {
      return;
    }
    var col = t.col;
    var row = t.row;
    var textBox = getTextBox(col, row);
    if (!textBox) {
      return;
    }
    textBox.autoCompleteConfig = p.configDetail;
  }

  function setupAutoCompleteThree(p) {
    var col = p.col - 1;
    var row = p.row - 1;
    var textBox = getTextBox(col, row);
    if (!textBox) {
      return;
    }
    textBox.autoCompleteConfig = p.configDetail;
  }

  function GetCheckResultData() {
    SetCheckResultData();
    return checkResultMap;
  }

  function SetCheckResultData() {
    for (var i = 0; i < checkResultMap.length; i++) {
      var p = checkResultMap[i];
      var t1 = p.items;
      var t2 = p.itemValues;
      var L = checkResultMapItemNames;
      for (var j = 0; j < L.length; j++) {
        setCheckResult(t1, t2, L[j]);
      }
    }
  }

  this.setCheckResultData = SetCheckResultData;

  function setCheckResult(t1, t2, key) {
    for (var i = 0; i < t1[key].length; i++) {
      var t = t1[key][i];
      var tAr = t.split("_");
      var col = Number(tAr[0]);
      var row = Number(tAr[1]);
      var o = cellSheet.cells[col][row];
      t2[key][i] = o.str;
    }
  }

  function SetCheckResultMapV(v) {
    checkResultMap = v;
  }

  function GetCheckResultMapV() {
    return JSON.parse(JSON.stringify(checkResultMap));
  }

  function SetCheckResultSelectModel(v) {
    g_forSelectCheckResult = v;
    if (v != "-1") {
      ShowCheckResultMarks();
    } else {
      RemoveCheckResultMarks();
    }
  }

  function SetMaybeSetValuesToCell(values) {
    ClearMaybeSetValueEls();
    var L = new GetMaybeFillColRowList({
      parentObj: me,
      cellSheet: cellSheet,
      operCell: operCell,
      currentCol: GetCurrentCol() - 1,
      currentRow: GetCurrentRow() - 1,
    }).doJob();
    removeInput();
    for (var i = 0; i < L.length; i++) {
      if (i > values.length - 1) {
        break;
      }
      var col = L[i].col;
      var row = L[i].row;
      SetCellString(col + 1, row + 1, 0, values[i]);
    }
  }

  function ShowMaybeSetValues(values) {
    ClearMaybeSetValueEls();
    var L = new GetMaybeFillColRowList({
      parentObj: me,
      cellSheet: cellSheet,
      operCell: operCell,
      currentCol: GetCurrentCol() - 1,
      currentRow: GetCurrentRow() - 1,
    }).doJob();
    for (var i = 0; i < L.length; i++) {
      if (i > values.length - 1) {
        break;
      }
      showMaybeSetValueOne(L[i], values[i]);
    }
  }

  function ClearMaybeSetValueEls() {
    for (var i = 0; i < maybeSetValueEls.length; i++) {
      var t = maybeSetValueEls[i];
      if (t && t.parentElement) {
        t.parentElement.removeChild(t);
      }
    }
    maybeSetValueEls = [];
  }

  function showMaybeSetValueOne(colRow, v) {
    var o = getTextBox(colRow.col, colRow.row);
    var x = o.x + 4;
    var y = o.y + 4;
    var w = o.width - 8;
    var h = o.height - 8;
    var t = document.createElement("div");
    t.style.position = "absolute";
    t.style.left = x + "px";
    t.style.top = y + "px";
    t.style.width = w + "px";
    t.style.height = h + "px";
    t.style.textAlign = "center";
    t.style.border = "1px dashed #CC00FF";
    t.innerText = v;
    parentEl.appendChild(t);
    maybeSetValueEls.push(t);
  }

  function SetCellImageByTableAndColumn(key, base64, imageType) {
    var t = getColRowRefTableAndColumnInfo(key);
    if (!t) {
      return;
    }
    var index = operCell.AddImage(base64, imageType);
    operCell.SetCellImage(t.col, t.row, 0, index, 3, 2, 2);
    drawObjTypes.push(DrawObjType.cellImage);
    redraw({ isNeedRedrawMark: true });
  }

  function SetCellImage(col, row, base64, imageType, style, halign, valign) {
    var index = operCell.AddImage(base64, imageType);
    operCell.SetCellImage(col, row, 0, index, style, halign, valign);
    drawObjTypes.push(DrawObjType.cellImage);
    redraw({ isNeedRedrawMark: true });
  }

  function ClearPageView() {
    resetContent();
    FloatImageManager.Clear();
    page.render();
  }

  function GetInstrumentData() {
    return new GetInstrumentDataClass({
      operCell: operCell,
      cellSheet: cellSheet,
    }).doJob();
  }

  function GetInstrumentCells() {
    return new GetInstrumentCellsClass({
      operCell: operCell,
      cellSheet: cellSheet,
    }).doJob();
  }

  this.getInstrumentCells = function () {
    return GetInstrumentCells();
  };

  function SetupEventToCell(o, eventName, eventCallback) {
    var textbox = getTextBox(o.col - 1, o.row - 1);
    if (eventName == "click") {
      textbox.additionalClickEvent = eventCallback;
    }
  }

  this.setupEventToCell = function (o, eventName, eventCallback) {
    SetupEventToCell(o, eventName, eventCallback);
  };

  function GetBaojiadanCheckItemsData1() {
    return new GetBaojiadanCheckItemsClass1({
      operCell: operCell,
      cellSheet: cellSheet,
    }).doJob();
  }

  function GetBaojiadanCheckItemsData2() {
    return new GetBaojiadanCheckItemsClass2({
      operCell: operCell,
      cellSheet: cellSheet,
    }).doJob();
  }

  function GetOneRightCellStr(needFindStr) {
    return new GetOneRightCellStrClass({
      operCell: operCell,
      cellSheet: cellSheet,
      needFindStr: needFindStr,
    }).doJob();
  }

  function GetOneRightCell(needFindStr) {
    return new GetOneRightCellClass({
      operCell: operCell,
      cellSheet: cellSheet,
      needFindStr: needFindStr,
    }).doJob();
  }

  function GetBottomCells(needFindStr) {
    return new GetBottomCellsClass({
      operCell: operCell,
      cellSheet: cellSheet,
      needFindStr: needFindStr,
    }).doJob();
  }

  /**
   * 获取单元格字符串
   * @function GetCellString
   * @description 获取指定单元格的文本内容
   * @param {number} col - 列号（从1开始）
   * @param {number} row - 行号（从1开始）
   * @param {number} sheet - 工作表索引
   * @returns {string} 单元格的文本内容
   */
  function GetCellString(col, row, sheet) {
    var t = operCell.GetCellString(col, row, sheet);
    if (t.indexOf("<") != -1 && t.indexOf(">") != -1) {
      var div = document.createElement("div");
      div.innerHTML = t;
      return div.innerText;
    }
    return t;
  }

  this.insertHardPageBreakRow = function () {
    if (selectStartRowSingle == -1) {
      return;
    }
    if (selectStartRowSingle + 2 > operCell.GetRows(0)) {
      return;
    }
    operCell.SetRowPageBreak(selectStartRowSingle + 2, 1);
    redraw({ isNeedRedrawMark: true });
  };

  this.clearHardPageBreakRow = function () {
    if (selectStartRowSingle == -1) {
      return;
    }
    if (selectStartRowSingle + 2 > operCell.GetRows(0)) {
      return;
    }
    operCell.SetRowPageBreak(selectStartRowSingle + 2, 0);
    redraw({ isNeedRedrawMark: true });
  };

  function SetIsAutoGenColumn(v) {
    isAutoGenColumn = v;
  }

  return {
    DoJob: DoJob,
    ClearPageView: ClearPageView,
    ResetCellData: ResetCellData,
    GetFillDataObj: GetFillDataObj,
    GetFillDataJsonData: GetFillDataJsonData,
    GetFillDataMaps1: GetFillDataMaps1,
    GetFillDataMaps2: GetFillDataMaps2,
    GetOperCell: GetOperCell,
    GetCellContent: GetCellContent,
    SetCellString: SetCellString,
    GetCellString: GetCellString,
    GetCurrentCol: GetCurrentCol,
    GetCurrentRow: GetCurrentRow,
    GetOperCellForDataMake: GetOperCellForDataMake,
    SetTableAndColumnInfos: SetTableAndColumnInfos,
    Save: Save,
    getReportBodyParm: getReportBodyParm,
    SetupAutoComplete: SetupAutoComplete,
    GetCheckResultData: GetCheckResultData,
    GetCheckResultMapV: GetCheckResultMapV,
    SetCheckResultMapV: SetCheckResultMapV,
    SetCheckResultSelectModel: SetCheckResultSelectModel,
    ShowMaybeSetValues: ShowMaybeSetValues,
    ClearMaybeSetValueEls: ClearMaybeSetValueEls,
    SetMaybeSetValuesToCell: SetMaybeSetValuesToCell,
    InsertImage: InsertImage,
    GetTotalWidth: GetTotalWidth,
    GetTotalHeight: GetTotalHeight,
    SetCellValueByTableAndColumn: SetCellValueByTableAndColumn,
    SetCellImageByTableAndColumn: SetCellImageByTableAndColumn,
    GetInstrumentData: GetInstrumentData,
    GetBaojiadanCheckItemsData1: GetBaojiadanCheckItemsData1,
    GetBaojiadanCheckItemsData2: GetBaojiadanCheckItemsData2,
    GetOneRightCellStr: GetOneRightCellStr,
    DuplicatePage: DuplicatePage,
    DuplicatePageA: DuplicatePageA,
    DuplicatePageAll: DuplicatePageAll,
    DeletePage: DeletePage,
    DeletePageA: DeletePageA,
    GetBottomCells: GetBottomCells,
    GetInstrumentCells: GetInstrumentCells,
    SetupEventToCell: SetupEventToCell,
    GetOneRightCell: GetOneRightCell,
    SetCellImage: SetCellImage,
    Undo: Undo,
    Redo: Redo,
    SetIsAutoGenColumn: SetIsAutoGenColumn,
  };
}
