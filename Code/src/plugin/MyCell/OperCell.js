/**
 * 单元格操作类
 * 负责单元格的复制、粘贴、插入、删除、合并等操作
 */
'use strict';

/** 设置检查结果回调函数 */
let setCheckResultCallBack;

/**
 * 创建单元格操作实例
 * @param {Object} cellDesigner - 单元格设计器对象
 * @returns {Object} 单元格操作实例
 */
function OperCell(cellDesigner) {
  /** @type {CellSheet|null} 单元格表格对象 */
  var cellSheet = null;
  
  /** @type {CopyInfo|null} 复制信息对象 */
  var copyInfo = null;
  
  /** @type {boolean} 是否已排序公式 */
  let isHaveSortFormula = false;

  /**
   * 打开单元格表格
   * @param {CellSheet} _cellSheet - 单元格表格对象
   */
  function Open(_cellSheet) {
    cellSheet = _cellSheet;
  }

  /**
   * 从Excel设置复制信息
   * @param {Array<Array<CellProp>>} cellProps - 单元格属性二维数组
   * @param {Array<number>} colWidths - 列宽数组
   * @param {Array<number>} rowHeights - 行高数组
   * @param {Array<CellMergeArea>} mergeAreaList - 合并区域列表
   */
  function SetCopyInfoFromExcel(cellProps, colWidths, rowHeights, mergeAreaList) {
    copyInfo = new CopyInfo({
      copyPropList: [],
      copyFormulaList: [],
      copyMergeAreaList: [],
    });
    
    var rowCount = cellProps.length;
    var colCount = cellProps[0].length;
    
    for (var col = 0; col < colCount; col++) {
      var tempList = [];
      for (var row = 0; row < rowCount; row++) {
        var cellProp = Comman.DeepCopyObj(cellProps[row][col]);
        
        if (cellProp.isInMergeArea) {
          var mergeArea = Comman.DeepCopyObj(
            mergeAreaList.Find(function (item) {
              return item.id === cellProp.mergeAreaId;
            })
          );
          copyInfo.copyMergeAreaList.Add(mergeArea);
        }
        
        tempList.Add(
          new CopyProp({
            cell: cellProp,
            col: col,
            row: row,
            width: colWidths[col],
            height: rowHeights[row],
          })
        );
      }
      copyInfo.copyPropList.Add(tempList);
    }
    console.log(copyInfo);
  }

  /**
   * 复制区域
   * @param {number} col1 - 起始列号(1-based)
   * @param {number} row1 - 起始行号(1-based)
   * @param {number} col2 - 结束列号(1-based)
   * @param {number} row2 - 结束行号(1-based)
   */
  function CopyRange(col1, row1, col2, row2) {
    copyInfo = new CopyInfo({
      copyPropList: [],
      copyFormulaList: [],
      copyMergeAreaList: [],
    });
    
    for (var col = col1 - 1; col < col2; col++) {
      var tempList = [];
      for (var row = row1 - 1; row < row2; row++) {
        var cellProp = Comman.DeepCopyObj(cellSheet.cells[col][row]);
        
        if (cellProp.isInMergeArea) {
          var mergeArea = Comman.DeepCopyObj(
            cellSheet.cellMergeAreaList.Find(function (item) {
              return item.id === cellProp.mergeAreaId;
            })
          );
          copyInfo.copyMergeAreaList.Add(mergeArea);
        }
        
        var formula = GetFormula(col + 1, row + 1, 0);
        if (formula) {
          cellProp.formulaId = formula.id;
          copyInfo.copyFormulaList.Add(Comman.DeepCopyObj(formula));
        }
        
        tempList.Add(
          new CopyProp({
            cell: cellProp,
            col: col,
            row: row,
            width: cellSheet.colWidthList[col],
            height: cellSheet.rowHeightList[row],
          })
        );
      }
      copyInfo.copyPropList.Add(tempList);
    }
    top.cellCopyInfo = copyInfo;
  }

  /**
   * 打印公式信息
   * @param {string} logFile - 日志文件路径
   */
  function PrintFormula(logFile) {
    // File.AppendAllText(logFile, "公式：" + JsonConvert.SerializeObject(cellSheet.formulaList) + "\r\n\r\n");
  }

  /**
   * 复制区域(方法别名)
   * @param {number} col1 - 起始列号
   * @param {number} row1 - 起始行号
   * @param {number} col2 - 结束列号
   * @param {number} row2 - 结束行号
   */
  function mfCopyRange(col1, row1, col2, row2) {
    CopyRange(col1, row1, col2, row2);
  }

  /**
   * 粘贴操作
   * @param {number} col - 目标列号
   * @param {number} row - 目标行号
   * @param {number} type - 粘贴类型
   * @param {boolean} samesize - 是否保持相同大小
   * @param {boolean} skipblank - 是否跳过空白
   */
  function Paste(col, row, type, samesize, skipblank) {
    copyInfo = top.cellCopyInfo;
    Paste1(col, row);
    CalculateSheet(0);
  }

  /**
   * 执行粘贴操作
   * @param {number} col - 目标列号
   * @param {number} row - 目标行号
   */
  function Paste1(col, row) {
    var copyObjLen1 = copyInfo.copyPropList.length;
    var copyObjLen2 = copyInfo.copyPropList[0].length;
    
    UnmergeCells(col, row, col + copyObjLen1 - 1, row + copyObjLen2 - 1);
    
    col = col - 1;
    row = row - 1;
    
    var colDiff = col - copyInfo.copyPropList[0][0].col;
    var rowDiff = row - copyInfo.copyPropList[0][0].row;
    
    var mergeAreaIdDic = new Dictionary();
    var formulaIdDic = new Dictionary();
    
    for (var i = 0; i < copyObjLen1; i++) {
      var targetCol = col + i;
      for (var k = 0; k < copyObjLen2; k++) {
        var copyProp = Comman.DeepCopyObj(copyInfo.copyPropList[i][k]);
        var targetRow = row + k;
        
        if (targetCol === cellSheet.colWidthList.length) {
          AppendCol(copyProp.width, true);
        }
        if (targetRow === cellSheet.rowHeightList.length) {
          AppendRow(copyProp.height, true);
        }
        
        var cell = Comman.DeepCopyObj(copyProp.cell);
        
        if (cell.isInMergeArea) {
          var mergeAreaId = cell.mergeAreaId;
          if (!mergeAreaIdDic.ContainsKey(mergeAreaId)) {
            mergeAreaIdDic.Add(mergeAreaId, Guid.NewGuid());
            var mergeArea = Comman.DeepCopyObj(
              copyInfo.copyMergeAreaList.Find(function (item) {
                return item.id === mergeAreaId;
              })
            );
            mergeArea.id = mergeAreaIdDic.GetValue(mergeAreaId);
            mergeArea.startCol += colDiff;
            mergeArea.endCol += colDiff;
            mergeArea.startRow += rowDiff;
            mergeArea.endRow += rowDiff;
            cellSheet.cellMergeAreaList.Add(mergeArea);
          }
          cell.mergeAreaId = mergeAreaIdDic.GetValue(mergeAreaId);
        }
        
        if (!string.IsNullOrEmpty(cell.formulaId)) {
          var formulaId = cell.formulaId;
          if (!formulaIdDic.ContainsKey(formulaId)) {
            formulaIdDic.Add(formulaId, Guid.NewGuid());
            var formula = Comman.DeepCopyObj(
              copyInfo.copyFormulaList.Find(function (item) {
                return item.id === formulaId;
              })
            );
            formula.id = formulaIdDic.GetValue(formulaId);
            
            if (colDiff !== 0) {
              new AdjustFormula(formula).AddCol(copyInfo.copyPropList[0][0].col, colDiff);
              formula.targetCol += colDiff;
            }
            if (rowDiff !== 0) {
              new AdjustFormula(formula).AddRow(copyInfo.copyPropList[0][0].row, rowDiff);
              formula.targetRow += rowDiff;
            }
            
            cellSheet.formulaList.RemoveAll(function (item) {
              return item.targetCol === targetCol && item.targetRow === targetRow;
            });
            cellSheet.formulaList.Add(formula);
          }
          cell.formulaId = formulaIdDic.GetValue(formulaId);
        }
        
        cellSheet.colWidthList[targetCol] = copyProp.width;
        cellSheet.rowHeightList[targetRow] = copyProp.height;
        cellSheet.cells[targetCol][targetRow] = cell;
      }
    }
  }

  /**
   * 取消合并单元格
   * @param {number} col1 - 起始列号
   * @param {number} row1 - 起始行号
   * @param {number} col2 - 结束列号
   * @param {number} row2 - 结束行号
   */
  function UnmergeCells(col1, row1, col2, row2) {
    for (var col = col1 - 1; col < col2 && col < cellSheet.colWidthList.length; col++) {
      for (var row = row1 - 1; row < row2 && row < cellSheet.rowHeightList.length; row++) {
        var cell = cellSheet.cells[col][row];
        if (cell.isInMergeArea) {
          cellSheet.cellMergeAreaList.RemoveAll(function (item) {
            return item.id === cell.mergeAreaId;
          });
        }
        cell.isInMergeArea = false;
        cell.mergeAreaId = Guid.Empty.toString();
      }
    }
  }

  /**
   * 追加行
   * @param {number} height - 行高
   * @param {boolean} isClearRow - 是否清除行信息
   */
  function AppendRow(height, isClearRow) {
    var index = cellSheet.rowHeightList.length - 1;
    for (var col = 0; col < cellSheet.colWidthList.length; col++) {
      var cell = Comman.DeepCopyObj(cellSheet.cells[col][index]);
      ClearCellInfo1(cell);
      cellSheet.cells[col].Add(cell);
    }
    cellSheet.rowHeightList.Add(height);
  }

  /**
   * 清除单元格信息
   * @param {CellProp} cell - 单元格属性对象
   */
  function ClearCellInfo1(cell) {
    if (readOnlyText) {
      return;
    }
    cell.backgroundColor = 0;
    cell.borderBottom = 0;
    cell.borderBottomColor = 0;
    cell.borderLeft = 0;
    cell.borderLeftColor = 0;
    cell.borderRight = 0;
    cell.borderRightColor = 0;
    cell.borderTop = 0;
    cell.borderTopColor = 0;
    cell.formulaId = "";
    cell.imageIndex = -1;
    cell.imageHAlign = -1;
    cell.imageVAlign = -1;
    cell.isInMergeArea = false;
    cell.lineSpace = 0;
    cell.mergeAreaId = "";
    cell.str = "";
    cell.rawValue = null;
  }

  /**
   * 清除行单元格信息
   * @param {CellProp} cell - 单元格属性对象
   * @param {number} curRow - 当前行号
   * @param {boolean} isClearRow - 是否清除行信息
   */
  function ClearRowCellInfo2(cell, curRow, isClearRow) {
    if (readOnlyText) {
      return;
    }
    cell.imageIndex = -1;
    if (cell.isInMergeArea) {
      var mergeArea = cellSheet.cellMergeAreaList.Find(function (item) {
        return item.id === cell.mergeAreaId;
      });
      if (curRow > mergeArea.startRow - 1 && curRow <= mergeArea.endRow - 1) {
        // 在合并区域内，不处理
      } else {
        if (isClearRow) {
          ClearCellInfo1(cell);
        } else {
          cell.isInMergeArea = false;
          cell.mergeAreaId = "";
        }
      }
    }
    cell.str = "";
    cell.rawValue = null;
  }

  /**
   * 清除列单元格信息
   * @param {CellProp} cell - 单元格属性对象
   * @param {number} curCol - 当前列号
   * @param {boolean} isClearCol - 是否清除列信息
   */
  function ClearColCellInfo2(cell, curCol, isClearCol) {
    cell.imageIndex = -1;
    if (cell.isInMergeArea) {
      var mergeArea = cellSheet.cellMergeAreaList.Find(function (item) {
        return item.id === cell.mergeAreaId;
      });
      if (mergeArea && curCol > mergeArea.startCol - 1 && curCol <= mergeArea.endCol - 1) {
        // 在合并区域内，不处理
      } else {
        if (isClearCol) {
          ClearCellInfo1(cell);
        } else {
          cell.isInMergeArea = false;
          cell.mergeAreaId = "";
        }
      }
    }
    cell.str = "";
    cell.rawValue = null;
  }

  /**
   * 追加列
   * @param {number} width - 列宽
   * @param {boolean} isClearCol - 是否清除列信息
   */
  function AppendCol(width, isClearCol) {
    var index = cellSheet.colWidthList.length - 1;
    var cellList = [];
    for (var row = 0; row < cellSheet.rowHeightList.length; row++) {
      var cell = Comman.DeepCopyObj(cellSheet.cells[index][row]);
      ClearCellInfo1(cell);
      cellList.Add(cell);
    }
    cellSheet.cells.Add(cellList);
    cellSheet.colWidthList.Add(width);
  }

  /**
   * 粘贴方法别名
   * @param {number} col - 目标列号
   * @param {number} row - 目标行号
   * @param {number} type - 粘贴类型
   * @param {boolean} samesize - 是否保持相同大小
   * @param {boolean} skipblank - 是否跳过空白
   */
  function mfPaste(col, row, type, samesize, skipblank) {
    Paste(col, row, type, samesize, skipblank);
  }

  /**
   * 设置行分页符
   * @param {number} row - 行号
   * @param {number} value - 值(1=设置, 0=取消)
   */
  function SetRowPageBreak(row, value) {
    if (value === 1) {
      if (!cellSheet.pageHardBreakRowList.Contains(row - 1)) {
        cellSheet.pageHardBreakRowList.Add(row - 1);
      }
    } else if (value === 0) {
      if (cellSheet.pageHardBreakRowList.Contains(row - 1)) {
        cellSheet.pageHardBreakRowList.Remove(row - 1);
      }
    }
  }

  /**
   * 获取行数
   * @param {number} sheet - 工作表索引
   * @returns {number} 行数
   */
  function GetRows(sheet) {
    return cellSheet.rowHeightList.length + 1;
  }

  /**
   * 获取列数
   * @param {number} sheet - 工作表索引
   * @returns {number} 列数
   */
  function GetCols(sheet) {
    return cellSheet.colWidthList.length + 1;
  }

  /**
   * 合并单元格
   * @param {number} col1 - 起始列号
   * @param {number} row1 - 起始行号
   * @param {number} col2 - 结束列号
   * @param {number} row2 - 结束行号
   */
  function MergeCells(col1, row1, col2, row2) {
    if (readOnlyText) {
      return;
    }
    if (col1 === col2 && row1 === row2) {
      return;
    }
    
    UnmergeCells(col1, row1, col2, row2);
    var mergeAreaId = Guid.NewGuid();
    
    for (var col = col1 - 1; col < col2; col++) {
      for (var row = row1 - 1; row < row2; row++) {
        var cell = cellSheet.cells[col][row];
        cell.isInMergeArea = true;
        cell.mergeAreaId = mergeAreaId;
        if (col === col1 - 1 && row === row1 - 1) {
          // 保留第一个单元格的值
        } else {
          cell.str = "";
          cell.rawValue = null;
        }
      }
    }
    
    cellSheet.cellMergeAreaList.Add(
      new CellMergeArea({
        startCol: col1,
        startRow: row1,
        endCol: col2,
        endRow: row2,
        id: mergeAreaId,
        isDrawed: false,
      })
    );
  }

  /**
   * 设置单元格字符串值
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {string} value - 字符串值
   */
  function SetCellString(col, row, sheet, value) {
    if (readOnlyText) {
      return;
    }
    
    col = col - 1;
    row = row - 1;
    var isDiff = false;
    var cell = cellSheet.cells[col][row];
    
    if (Comman.isNumberCell(cell)) {
      isDiff = cell.rawValue !== value;
      cell.rawValue = value;
      cell.str = value;
      cell.str = Comman.formatCellStr(cell);
    } else {
      isDiff = cell.str !== value;
      cell.rawValue = null;
      cell.str = value;
    }
    
    if (isNeedRecordRecordFillDataMaps && !isInFillDataing && fillDataMaps1[col + 1 + "." + (row + 1)]) {
      var fillDataItem = fillDataMaps1[col + 1 + "." + (row + 1)];
      setDataToFillDataJsonData(fillDataItem, value);
    }
    
    if (checkResultMap.length > 0 && cellDesigner) {
      setCheckResultMapValues(col, row, value);
    }
    
    if (isDiff) {
      if (cellDesigner) {
        cellDesigner.redrawOneCell(col, row);
      }
      CalFun(col, row);
    }
  }

  /**
   * 设置检查结果映射值
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {string} value - 值
   */
  function setCheckResultMapValues(col, row, value) {
    var key1 = col + "_" + row;
    var cell = cellSheet.cells[col][row];
    
    for (var i = 0; i < checkResultMap.length; i++) {
      var checkItem = checkResultMap[i];
      var items = checkItem.items;
      var itemValues = checkItem.itemValues;
      var itemNames = checkResultMapItemNames;
      
      for (var j = 0; j < itemNames.length; j++) {
        setCheckResult(items, itemValues, itemNames[j], key1, value, cell);
      }
    }
  }

  /**
   * 设置检查结果
   * @param {Object} items - 项目对象
   * @param {Object} itemValues - 项目值对象
   * @param {string} key - 键名
   * @param {string} key1 - 单元格键
   * @param {string} value - 值
   * @param {CellProp} cell - 单元格属性
   */
  function setCheckResult(items, itemValues, key, key1, value, cell) {
    for (var i = 0; i < items[key].length; i++) {
      var item = items[key][i];
      if (item === key1) {
        itemValues[key][i] = value;
        if (setCheckResultCallBack) {
          setCheckResultCallBack();
        }
      }
    }
  }

  /**
   * 设置数据到填充数据JSON
   * @param {Object} fillDataItem - 填充数据项
   * @param {string} value - 值
   */
  function setDataToFillDataJsonData(fillDataItem, value) {
    if (!fillDataJsonData[fillDataItem.tableName]) {
      fillDataJsonData[fillDataItem.tableName] = [];
    }
    if (!fillDataJsonData[fillDataItem.tableName][fillDataItem.recNum]) {
      var tableData = fillDataJsonData[fillDataItem.tableName];
      for (var i = tableData.length; i < fillDataItem.recNum + 1; i++) {
        tableData.push({});
      }
    }
    fillDataJsonData[fillDataItem.tableName][fillDataItem.recNum][fillDataItem.columnName] = value;
  }

  /**
   * 计算函数
   * @param {number} col - 列号
   * @param {number} row - 行号
   */
  function CalFun(col, row) {
    if (g_isCalFormula !== 1) {
      return;
    }
    CalculateSheet(0);
  }

  /**
   * 获取单元格字符串值
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {string} 单元格字符串值
   */
  function GetCellString(col, row, sheet) {
    return cellSheet.cells[col - 1][row - 1].str.toString();
  }

  /**
   * 设置单元格双精度值
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} value - 双精度值
   */
  function SetCellDouble(col, row, sheet, value) {
    SetCellString(col, row, sheet, value.toString());
  }

  /**
   * 设置单元格字符串(简写)
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {string} value - 字符串值
   */
  function S(col, row, sheet, value) {
    SetCellString(col, row, sheet, value);
  }

  /**
   * 排序公式
   */
  function SortFormula() {
    cellSheet.formulaList.sort(function (a, b) {
      return a.row - b.row;
    });
    cellSheet.formulaList.sort(function (a, b) {
      return a.col - b.col;
    });
  }

  /**
   * 重置所有公式为未计算状态
   */
  function ResetAllFormulaNotCalculate() {
    for (var i = 0; i < cellSheet.formulaList.length; i++) {
      var formula = cellSheet.formulaList[i];
      formula.isCalculated = false;
    }
  }

  /**
   * 计算工作表
   * @param {number} sheet - 工作表索引
   */
  function CalculateSheet(sheet) {
    for (var i = 0; i < 3; i++) {
      CalculateSheetDo(sheet);
    }
  }

  /**
   * 执行工作表计算
   * @param {number} sheet - 工作表索引
   */
  function CalculateSheetDo(sheet) {
    if (!isHaveSortFormula) {
      isHaveSortFormula = true;
      SortFormula();
    }
    ResetAllFormulaNotCalculate();
    
    for (var i = 0; i < cellSheet.formulaList.length; i++) {
      var formula = cellSheet.formulaList[i];
      CalculateOneFormula(formula);
    }
  }

  /**
   * 计算单个公式
   * @param {Formula} formula - 公式对象
   */
  function CalculateOneFormula(formula) {    
    if (readOnlyText) {
      return;
    }
    if (formula.isCalculated) {
      return;
    }
    
    formula.isCalculated = true;
    CalculateRefColRowList(formula.refColRowList);
    
    var result = new CalFormula(formula, cellSheet).DoJob();
    if (result === "NaN") {
      result = "";
    }
    
    var cell = cellSheet.cells[formula.targetCol][formula.targetRow];
    var isDiff = false;
    
    if (Comman.isNumberCell(cell)) {
      isDiff = result !== cell.rawValue;
      cell.rawValue = result;
      cell.str = result;
      cell.str = Comman.formatCellStr(cell);
    } else {
      isDiff = result !== cell.str;
      cell.rawValue = null;
      cell.str = result;
    }
    
    if (isDiff) {
      var cellKey = formula.targetCol + 1 + "." + (formula.targetRow + 1);
      if (isNeedRecordRecordFillDataMaps && fillDataMaps1[cellKey]) {
        var fillDataItem = fillDataMaps1[cellKey];
        setDataToFillDataJsonData(fillDataItem, result);
      }
      if (checkResultMap.length > 0 && cellDesigner) {
        setCheckResultMapValues(formula.targetCol, formula.targetRow, result);
      }
      if (cellDesigner) {
        cellDesigner.redrawOneCell(formula.targetCol, formula.targetRow);
      }
    }
  }

  /**
   * 计算引用列行列表
   * @param {Array} refColRowList - 引用列行列表
   */
  function CalculateRefColRowList(refColRowList) {
    for (var i = 0; i < refColRowList.length; i++) {
      var refItem = refColRowList[i];
      var col = refItem.col - 1;
      var row = refItem.row - 1;
      var formula = cellSheet.formulaList.find(
        function (item) {
          return item.targetCol === col && item.targetRow === row;
        }
      );
      if (formula) {
        CalculateOneFormula(formula);
      }
    }
  }

  /**
   * 获取合并范围
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @returns {CellMergeArea|null} 合并区域对象
   */
  function GetMergeRange(col, row) {
    for (var i = 0; i < cellSheet.cellMergeAreaList.length; i++) {
      var mergeArea = cellSheet.cellMergeAreaList[i];
      if (col >= mergeArea.startCol && col <= mergeArea.endCol &&
          row >= mergeArea.startRow && row <= mergeArea.endRow) {
        return mergeArea;
      }
    }
    return null;
  }

  /**
   * 执行工作(已弃用)
   * @param {string} s1 - 参数1
   * @param {string} s2 - 参数2
   * @param {string} s3 - 参数3
   * @deprecated 不再使用此函数
   */
  function DoWork(s1, s2, s3) {
    throw "不要再使用DoWork函数!";
  }

  /**
   * 插入行
   * @param {number} startRow - 起始行号
   * @param {number} count - 插入数量
   * @param {number} sheet - 工作表索引
   */
  function InsertRow(startRow, count, sheet) {
    for (var i = 0; i < count; i++) {
      InsertOneRow(startRow, sheet, false);
    }
  }

  /**
   * 插入单行
   * @param {number} startRow - 起始行号
   * @param {number} sheet - 工作表索引
   * @param {boolean} isClearRow - 是否清除行信息
   */
  function InsertOneRow(startRow, sheet, isClearRow) {
    var index = startRow - 1;
    if (index > cellSheet.rowHeightList.length - 1) {
      AppendRow(30, isClearRow);
    } else {
      InsertOneRowA(index, isClearRow);
    }
  }

  /**
   * 在指定位置插入行
   * @param {number} index - 插入位置索引
   * @param {boolean} isClearRow - 是否清除行信息
   */
  function InsertOneRowA(index, isClearRow) {
    for (var col = 0; col < cellSheet.colWidthList.length; col++) {
      var cell = new CellProp();
      if (index === 0) {
        cell = Comman.DeepCopyObj(cellSheet.cells[col][0]);
        ClearCellInfo1(cell);
      } else {
        cell = Comman.DeepCopyObj(cellSheet.cells[col][index - 1]);
        ClearRowCellInfo2(cell, index, isClearRow);
      }
      cellSheet.cells[col].Insert(index, cell);
    }
    
    var height = cellSheet.rowHeightList[index];
    cellSheet.rowHeightList.Insert(index, height);
    AdjustCellMergeAreaListForAddRow(index, 1);
    AdjustCellFormulaListForAddRow(index, 1);
    AdjustCellFormulaListTargetForAddRow(index, 1);
    AdjustCheckResultMapForAddRow(index, 1);
  }

  /**
   * 调整添加行后的公式目标列行
   * @param {number} index - 插入位置索引
   * @param {number} addRow - 添加行数
   */
  function AdjustCellFormulaListTargetForAddRow(index, addRow) {
    for (var i = 0; i < cellSheet.formulaList.length; i++) {
      var formula = cellSheet.formulaList[i];
      if (formula.targetRow >= index) {
        formula.targetRow += addRow;
      }
    }
  }

  /**
   * 调整添加行后的公式列表
   * @param {number} index - 插入位置索引
   * @param {number} addRow - 添加行数
   */
  function AdjustCellFormulaListForAddRow(index, addRow) {
    for (var i = 0; i < cellSheet.formulaList.length; i++) {
      new AdjustFormula(cellSheet.formulaList[i]).AddRow(index + 1, addRow);
    }
  }

  /**
   * 调整添加行后的合并区域列表
   * @param {number} index - 插入位置索引
   * @param {number} addRow - 添加行数
   */
  function AdjustCellMergeAreaListForAddRow(index, addRow) {
    for (var i = 0; i < cellSheet.cellMergeAreaList.length; i++) {
      var mergeArea = cellSheet.cellMergeAreaList[i];
      if (mergeArea.startRow - 1 >= index) {
        mergeArea.startRow += addRow;
      }
      if (mergeArea.endRow - 1 >= index) {
        mergeArea.endRow += addRow;
      }
    }
  }

  /**
   * 调整添加列后的公式列表
   * @param {number} index - 插入位置索引
   * @param {number} addCol - 添加列数
   */
  function AdjustCellFormulaListForAddCol(index, addCol) {
    for (var i = 0; i < cellSheet.formulaList.length; i++) {
      new AdjustFormula(cellSheet.formulaList[i]).AddCol(index + 1, addCol);
    }
  }

  /**
   * 调整添加列后的合并区域列表
   * @param {number} index - 插入位置索引
   * @param {number} addCol - 添加列数
   */
  function AdjustCellMergeAreaListForAddCol(index, addCol) {
    for (var i = 0; i < cellSheet.cellMergeAreaList.length; i++) {
      var mergeArea = cellSheet.cellMergeAreaList[i];
      if (mergeArea.startCol - 1 >= index) {
        mergeArea.startCol += addCol;
      }
      if (mergeArea.endCol - 1 >= index) {
        mergeArea.endCol += addCol;
      }
    }
  }

  /**
   * 插入列
   * @param {number} startCol - 起始列号
   * @param {number} count - 插入数量
   * @param {number} sheet - 工作表索引
   */
  function InsertCol(startCol, count, sheet) {
    for (var i = 0; i < count; i++) {
      InsertOneCol(startCol, sheet, false);
    }
  }

  /**
   * 插入单列
   * @param {number} startCol - 起始列号
   * @param {number} sheet - 工作表索引
   * @param {boolean} isClearCol - 是否清除列信息
   */
  function InsertOneCol(startCol, sheet, isClearCol) {
    var index = startCol - 1;
    if (index > cellSheet.colWidthList.length - 1) {
      AppendCol(30, isClearCol);
    } else {
      InsertOneColA(index, isClearCol);
    }
  }

  /**
   * 在指定位置插入列
   * @param {number} index - 插入位置索引
   * @param {boolean} isClearCol - 是否清除列信息
   */
  function InsertOneColA(index, isClearCol) {
    var cellList = [];
    for (var row = 0; row < cellSheet.rowHeightList.length; row++) {
      var cell = null;
      if (index === 0) {
        cell = Comman.DeepCopyObj(cellSheet.cells[0][row]);
        ClearCellInfo1(cell);
      } else {
        cell = Comman.DeepCopyObj(cellSheet.cells[index - 1][row]);
        ClearColCellInfo2(cell, index, isClearCol);
      }
      cellList.Add(cell);
    }
    
    cellSheet.cells.Insert(index, cellList);
    var width = cellSheet.colWidthList[index];
    cellSheet.colWidthList.Insert(index, width);
    AdjustCellMergeAreaListForAddCol(index, 1);
    AdjustCellFormulaListForAddCol(index, 1);
    AdjustCellFormulaListTargeForAddCol(index, 1);
    AdjustCheckResultMapForAddCol(index, 1);
  }

  /**
   * 调整添加列后的检查结果映射
   * @param {number} index - 插入位置索引
   * @param {number} addCol - 添加列数
   */
  function AdjustCheckResultMapForAddCol(index, addCol) {
    for (var i = 0; i < checkResultMap.length; i++) {
      var items = checkResultMap[i].items;
      var itemNames = checkResultMapItemNames;
      for (var j = 0; j < itemNames.length; j++) {
        var itemList = items[itemNames[j]];
        AdjustCheckResultMapForAddColOne(itemList, index, addCol);
      }
    }
  }

  /**
   * 调整添加列后的检查结果映射单项
   * @param {Array} itemList - 项目列表
   * @param {number} index - 插入位置索引
   * @param {number} addCol - 添加列数
   */
  function AdjustCheckResultMapForAddColOne(itemList, index, addCol) {
    for (var i = 0; i < itemList.length; i++) {
      var parts = itemList[i].split("_");
      var col = Number(parts[0]);
      var row = Number(parts[1]);
      if (col >= index) {
        col += addCol;
        itemList[i] = col + "_" + row;
      }
    }
  }

  /**
   * 调整添加行后的检查结果映射
   * @param {number} index - 插入位置索引
   * @param {number} addRow - 添加行数
   */
  function AdjustCheckResultMapForAddRow(index, addRow) {
    for (var i = 0; i < checkResultMap.length; i++) {
      var items = checkResultMap[i].items;
      var itemNames = checkResultMapItemNames;
      for (var j = 0; j < itemNames.length; j++) {
        var itemList = items[itemNames[j]];
        AdjustCheckResultMapForAddRowOne(itemList, index, addRow);
      }
    }
  }

  /**
   * 调整添加行后的检查结果映射单项
   * @param {Array} itemList - 项目列表
   * @param {number} index - 插入位置索引
   * @param {number} addRow - 添加行数
   */
  function AdjustCheckResultMapForAddRowOne(itemList, index, addRow) {
    for (var i = 0; i < itemList.length; i++) {
      var parts = itemList[i].split("_");
      var col = Number(parts[0]);
      var row = Number(parts[1]);
      if (row >= index) {
        row += addRow;
        itemList[i] = col + "_" + row;
      }
    }
  }

  /**
   * 调整添加列后的公式目标列行
   * @param {number} index - 插入位置索引
   * @param {number} addCol - 添加列数
   */
  function AdjustCellFormulaListTargeForAddCol(index, addCol) {
    for (var i = 0; i < cellSheet.formulaList.length; i++) {
      var formula = cellSheet.formulaList[i];
      if (formula.targetCol >= index) {
        formula.targetCol += addCol;
      }
    }
  }

  /**
   * 获取单元格字体
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {Object} 字体对象
   */
  function GetCellFont(col, row, sheet) {
    var fontName = cellSheet.cells[col - 1][row - 1].fontFamily;
    return cellSheet.fontFamilies1[fontName];
  }

  /**
   * 获取字体名称
   * @param {number} fontIndex - 字体索引
   * @returns {string} 字体名称
   */
  function GetFontName(fontIndex) {
    return cellSheet.fontFamilies2[fontIndex];
  }

  /**
   * 设置单元格字体
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} fontIndex - 字体索引
   */
  function SetCellFont(col, row, sheet, fontIndex) {
    var fontFamily = GetFontName(fontIndex);
    cellSheet.cells[col - 1][row - 1].fontFamily = fontFamily;
  }

  /**
   * 获取单元格字体大小
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {number} 字体大小
   */
  function GetCellFontSize(col, row, sheet) {
    return cellSheet.cells[col - 1][row - 1].fontSize;
  }

  /**
   * 设置单元格字体大小
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} fontSize - 字体大小
   */
  function SetCellFontSize(col, row, sheet, fontSize) {
    cellSheet.cells[col - 1][row - 1].fontSize = fontSize;
  }

  /**
   * 获取单元格字体样式
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {number} 字体样式
   */
  function GetCellFontStyle(col, row, sheet) {
    return cellSheet.cells[col - 1][row - 1].fontStyle;
  }

  /**
   * 设置单元格字体样式
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} fontStyle - 字体样式
   */
  function SetCellFontStyle(col, row, sheet, fontStyle) {
    cellSheet.cells[col - 1][row - 1].fontStyle = fontStyle;
  }

  /**
   * 获取单元格文本颜色
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {number} 文本颜色
   */
  function GetCellTextColor(col, row, sheet) {
    return cellSheet.cells[col - 1][row - 1].fontColor;
  }

  /**
   * 设置单元格文本颜色
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} fontColor - 文本颜色
   */
  function SetCellTextColor(col, row, sheet, fontColor) {
    cellSheet.cells[col - 1][row - 1].fontColor = fontColor;
  }

  /**
   * 设置单元格文本样式
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} value - 样式值
   */
  function SetCellTextStyle(col, row, sheet, value) {
    cellSheet.cells[col - 1][row - 1].isMultiLine = value === 2;
  }

  /**
   * 设置单元格背景颜色
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} fontColor - 背景颜色
   */
  function SetCellBackColor(col, row, sheet, fontColor) {
    cellSheet.cells[col - 1][row - 1].backgroundColor = fontColor;
  }

  /**
   * 获取单元格文本行间距
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {number} 行间距
   */
  function GetCellTextLineSpace(col, row, sheet) {
    return cellSheet.cells[col - 1][row - 1].lineSpace;
  }

  /**
   * 设置单元格文本行间距
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} lineSpace - 行间距
   */
  function SetCellTextLineSpace(col, row, sheet, lineSpace) {
    cellSheet.cells[col - 1][row - 1].lineSpace = lineSpace;
  }

  /**
   * 设置行高
   * @param {number} type - 类型
   * @param {number} height - 行高
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   */
  function SetRowHeight(type, height, row, sheet) {
    cellSheet.rowHeightList[row - 1] = height;
  }

  /**
   * 设置列宽
   * @param {number} type - 类型
   * @param {number} width - 列宽
   * @param {number} col - 列号
   * @param {number} sheet - 工作表索引
   */
  function SetColWidth(type, width, col, sheet) {
    cellSheet.colWidthList[col - 1] = width;
  }

  /**
   * 设置单元格对齐方式
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} align - 对齐方式
   */
  function SetCellAlign(col, row, sheet, align) {
    var alignInfo = Comman.GetCellAlign(align);
    cellSheet.cells[col - 1][row - 1].cellHAlign = alignInfo.cellHAlign;
    cellSheet.cells[col - 1][row - 1].cellVAlign = alignInfo.cellVAlign;
  }

  /**
   * 获取单元格对齐方式
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {number} 对齐方式
   */
  function GetCellAlign(col, row, sheet) {
    return cellSheet.cells[col - 1][row - 1].cellHAlign +
           cellSheet.cells[col - 1][row - 1].cellVAlign;
  }

  /**
   * 获取单元格水平对齐方式
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {number} 水平对齐方式
   */
  function GetCellHAlign(col, row, sheet) {
    return cellSheet.cells[col - 1][row - 1].cellHAlign;
  }

  /**
   * 获取单元格垂直对齐方式
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {number} 垂直对齐方式
   */
  function GetCellVAlign(col, row, sheet) {
    return cellSheet.cells[col - 1][row - 1].cellVAlign;
  }

  /**
   * 设置单元格水平对齐方式
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} value - 水平对齐值
   */
  function SetCellHAlign(col, row, sheet, value) {
    cellSheet.cells[col - 1][row - 1].cellHAlign = value;
  }

  /**
   * 设置单元格垂直对齐方式
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} value - 垂直对齐值
   */
  function SetCellVAlign(col, row, sheet, value) {
    cellSheet.cells[col - 1][row - 1].cellVAlign = value;
  }

  /**
   * 插入空白行
   * @param {number} startRow - 起始行号
   * @param {number} count - 插入数量
   * @param {number} sheet - 工作表索引
   */
  function InsertCleanRow(startRow, count, sheet) {
    for (var i = 0; i < count; i++) {
      InsertOneRow(startRow, sheet, true);
    }
  }

  /**
   * 插入空白列
   * @param {number} startCol - 起始列号
   * @param {number} count - 插入数量
   * @param {number} sheet - 工作表索引
   */
  function InsertCleanCol(startCol, count, sheet) {
    for (var i = 0; i < count; i++) {
      InsertOneCol(startCol, sheet, true);
    }
  }

  /**
   * 删除行
   * @param {number} startRow - 起始行号
   * @param {number} count - 删除数量
   * @param {number} sheet - 工作表索引
   */
  function DeleteRow(startRow, count, sheet) {
    var endRow = startRow + count - 1;
    if (endRow > GetRows(sheet) - 1) {
      endRow = GetRows(sheet) - 1;
    }
    if (endRow < startRow) {
      return;
    }
    
    var endCol = GetCols(sheet) - 1;
    for (var row = endRow - 1; row >= startRow - 1; row--) {
      for (var col = 0; col < cellSheet.colWidthList.length; col++) {
        var cell = cellSheet.cells[col][row];
        removeFormula(cell, col, row);
        cellSheet.cells[col].RemoveAt(row);
      }
      adjustFormulaTargetColRowRow(row);
      AdjustCellFormulaListForDeleteRow(row, 1);
      adjustCellMergeAreaListForDeleteRow(row);
      cellSheet.rowHeightList.RemoveAt(row);
    }
  }

  /**
   * 调整删除行后的公式目标列行
   * @param {number} row - 行号
   */
  function adjustFormulaTargetColRowRow(row) {
    for (var i = 0; i < cellSheet.formulaList.length; i++) {
      var formula = cellSheet.formulaList[i];
      if (formula.targetRow >= row) {
        formula.targetRow -= 1;
      }
    }
  }

  /**
   * 调整删除行后的公式列表
   * @param {number} index - 删除位置索引
   * @param {number} deleteCount - 删除数量
   */
  function AdjustCellFormulaListForDeleteRow(index, deleteCount) {
    for (var i = 0; i < cellSheet.formulaList.length; i++) {
      new AdjustFormula(cellSheet.formulaList[i]).DeleteRow(index + 1, deleteCount);
    }
  }

  /**
   * 调整删除行后的合并区域列表
   * @param {number} row - 行号
   */
  function adjustCellMergeAreaListForDeleteRow(row) {
    for (var i = 0; i < cellSheet.cellMergeAreaList.length; i++) {
      var mergeArea = cellSheet.cellMergeAreaList[i];
      if (mergeArea.startRow - 1 > row) {
        mergeArea.startRow -= 1;
      }
      if (mergeArea.endRow - 1 >= row) {
        mergeArea.endRow -= 1;
      }
    }
  }

  /**
   * 删除列
   * @param {number} startCol - 起始列号
   * @param {number} count - 删除数量
   * @param {number} sheet - 工作表索引
   */
  function DeleteCol(startCol, count, sheet) {
    var endCol = startCol + count - 1;
    if (endCol > GetCols(sheet) - 1) {
      endCol = GetCols(sheet) - 1;
    }
    if (endCol < startCol) {
      return;
    }
    
    var endRow = GetRows(sheet) - 1;
    for (var col = endCol - 1; col >= startCol - 1; col--) {
      for (var row = cellSheet.rowHeightList.length - 1; row >= 0; row--) {
        var cell = cellSheet.cells[col][row];
        removeFormula(cell, col, row);
      }
      adjustFormulaTargetColRowCol(col);
      AdjustCellFormulaListForDeleteCol(col, 1);
      adjustCellMergeAreaListForDeleteCol(col);
      cellSheet.cells.RemoveAt(col);
      cellSheet.colWidthList.RemoveAt(col);
    }
  }

  /**
   * 调整删除列后的公式目标列行
   * @param {number} col - 列号
   */
  function adjustFormulaTargetColRowCol(col) {
    for (var i = 0; i < cellSheet.formulaList.length; i++) {
      var formula = cellSheet.formulaList[i];
      if (formula.targetCol >= col) {
        formula.targetCol -= 1;
      }
    }
  }

  /**
   * 调整删除列后的公式列表
   * @param {number} index - 删除位置索引
   * @param {number} deleteCount - 删除数量
   */
  function AdjustCellFormulaListForDeleteCol(index, deleteCount) {
    for (var i = 0; i < cellSheet.formulaList.length; i++) {
      new AdjustFormula(cellSheet.formulaList[i]).DeleteCol(index + 1, deleteCount);
    }
  }

  /**
   * 调整删除列后的合并区域列表
   * @param {number} col - 列号
   */
  function adjustCellMergeAreaListForDeleteCol(col) {
    for (var i = 0; i < cellSheet.cellMergeAreaList.length; i++) {
      var mergeArea = cellSheet.cellMergeAreaList[i];
      if (mergeArea.startCol - 1 > col) {
        mergeArea.startCol -= 1;
      }
      if (mergeArea.endCol - 1 >= col) {
        mergeArea.endCol -= 1;
      }
    }
  }

  /**
   * 移除公式
   * @param {CellProp} cell - 单元格属性对象
   * @param {number} col - 列号
   * @param {number} row - 行号
   */
  function removeFormula(cell, col, row) {
    if (!string.IsNullOrEmpty(cell.formulaId)) {
      cellSheet.formulaList.RemoveAll(function (item) {
        return item.id === cell.formulaId || (item.targetCol === col && item.targetRow === row);
      });
    }
  }

  /**
   * 添加图片
   * @param {string} imageBase64 - 图片Base64数据
   * @param {string} imageType - 图片类型
   * @returns {number} 图片索引
   */
  function AddImage(imageBase64, imageType) {
    var imageIndex = getNewImageIndex();
    cellSheet.cellImageList.Add(
      new CellImage({
        imageData: imageBase64,
        imageType: imageType,
        imageIndex: imageIndex,
      })
    );
    return imageIndex;
  }

  /**
   * 设置单元格图片
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} imageIndex - 图片索引
   * @param {number} style - 样式
   * @param {number} halign - 水平对齐
   * @param {number} valign - 垂直对齐
   */
  function SetCellImage(col, row, sheet, imageIndex, style, halign, valign) {
    var cell = cellSheet.cells[col - 1][row - 1];
    cell.imageIndex = imageIndex;
    cell.imageStyle = style;
    cell.imageHAlign = halign;
    cell.imageVAlign = valign;
  }

  /**
   * 更新图片
   * @param {number} imageIndex - 图片索引
   * @param {string} imageBase64 - 图片Base64数据
   * @returns {boolean} 是否成功
   */
  function UpdateImage(imageIndex, imageBase64) {
    var cellImage = cellSheet.cellImageList.Find(function (item) {
      return item.imageIndex === imageIndex;
    });
    if (cellImage === null) {
      return false;
    }
    cellImage.imageData = imageBase64;
    return true;
  }

  /**
   * 删除图片
   * @param {number} imageIndex - 图片索引
   */
  function DeleteImage(imageIndex) {
    cellSheet.cellImageList.RemoveAll(function (item) {
      return item.imageIndex === imageIndex;
    });
  }

  /**
   * 设置单元格浮动图片
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {string} name - 图片名称
   * @param {number} imageIndex - 图片索引
   */
  function SetCellFloatImage(col, row, sheet, name, imageIndex) {
    cellSheet.floatImageList.Add(
      new FloatImage({
        index: imageIndex,
        name: name,
        xpos: Convert.ToInt32(GetCellXPos(col, row)),
        ypos: Convert.ToInt32(GetCellYPos(col, row)),
        width: 100,
        height: 100,
      })
    );
  }

  /**
   * 移动浮动图片
   * @param {number} sheet - 工作表索引
   * @param {string} name - 图片名称
   * @param {number} xpos - X坐标
   * @param {number} ypos - Y坐标
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @returns {number} 是否成功(1=成功, 0=失败)
   */
  function MoveFloatImage(sheet, name, xpos, ypos, width, height) {
    var floatImage = cellSheet.floatImageList.Find(function (item) {
      return item.name === name;
    });
    if (floatImage === null) {
      return 0;
    }
    floatImage.xpos = xpos;
    floatImage.ypos = ypos;
    if (width !== -1) {
      floatImage.width = width;
    }
    if (height !== -1) {
      floatImage.height = height;
    }
    return 1;
  }

  /**
   * 获取浮动图片位置
   * @param {number} sheet - 工作表索引
   * @param {string} name - 图片名称
   * @returns {Object|null} 位置信息对象
   */
  function GetFloatImagePos(sheet, name) {
    var floatImage = cellSheet.floatImageList.Find(function (item) {
      return item.name === name;
    });
    if (floatImage === null) {
      return null;
    }
    return {
      xpos: floatImage.xpos,
      ypos: floatImage.ypos,
      width: floatImage.width,
      height: floatImage.height,
    };
  }

  /**
   * 获取公式字符串
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {string} 公式字符串
   */
  function GetFormulaStr(col, row, sheet) {
    var formula = GetFormula(col, row, sheet);
    if (formula !== null) {
      return string.Join("", formula.codeLineRaw);
    }
    return "";
  }

  /**
   * 获取公式对象
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {Formula|null} 公式对象
   */
  function GetFormula(col, row, sheet) {
    return cellSheet.formulaList.Find(function (item) {
      return item.targetCol === col - 1 && item.targetRow === row - 1;
    });
  }

  /**
   * 设置公式
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {string} code - 公式代码
   * @param {string} sheetName - 工作表名称
   */
  function SetFormula(col, row, sheet, code, sheetName) {
    cellSheet.formulaList.RemoveAll(function (item) {
      return item.targetCol === col - 1 && item.targetRow === row - 1;
    });
    
    var formulaId = Guid.NewGuid().toString();
    var codeLineRaw = Comman.SplitSource(code);
    Comman.DisposeCodeLineRaw(codeLineRaw, sheetName);
    var codeLine = new ProcessFormulaCodeLine(codeLineRaw).DoJob();
    var cellKey = Comman.GetColRowStr({ col: col, row: row });
    
    if (codeLine.indexOf(cellKey) !== -1) {
      return;
    }
    
    var refColRowList = new GetRefColRowList(codeLineRaw).DoJob();
    var formula = new Formula({
      id: formulaId,
      codeLine: codeLine,
      codeLineRaw: codeLineRaw,
      targetCol: col - 1,
      targetRow: row - 1,
      refColRowList: refColRowList,
    });
    
    cellSheet.cells[col - 1][row - 1].formulaId = formulaId;
    cellSheet.formulaList.Add(formula);
    SortFormula();
  }

  /**
   * 获取打印边距
   * @param {number} type - 边距类型(0=左, 1=上, 2=右, 3=下)
   * @returns {number} 边距值
   */
  function PrintGetMargin(type) {
    if (type === 0) {
      return cellSheet.printInfo.marginLeft;
    }
    if (type === 1) {
      return cellSheet.printInfo.marginTop;
    }
    if (type === 2) {
      return cellSheet.printInfo.marginRight;
    }
    if (type === 3) {
      return cellSheet.printInfo.marginBottom;
    }
    throw new Exception("PrintGetMargin传入参数不正确!");
  }

  /**
   * 获取打印方向
   * @returns {number} 打印方向
   */
  function PrintGetOrient() {
    return cellSheet.printInfo.printOrient;
  }

  /**
   * 获取打印水平对齐
   * @param {number} sheet - 工作表索引
   * @returns {number} 水平对齐值
   */
  function PrintGetHAlign(sheet) {
    return cellSheet.printInfo.printHAlign;
  }

  /**
   * 获取打印垂直对齐
   * @param {number} sheet - 工作表索引
   * @returns {number} 垂直对齐值
   */
  function PrintGetVAlign(sheet) {
    return cellSheet.printInfo.printVAlign;
  }

  /**
   * 设置打印对齐
   * @param {number} printHAlign - 水平对齐值
   * @param {number} printVAlign - 垂直对齐值
   */
  function PrintSetAlign(printHAlign, printVAlign) {
    cellSheet.printInfo.printHAlign = printHAlign;
    cellSheet.printInfo.printVAlign = printVAlign;
  }

  /**
   * 设置打印边距
   * @param {number} top - 上边距
   * @param {number} left - 左边距
   * @param {number} bottom - 下边距
   * @param {number} right - 右边距
   */
  function PrintSetMargin(top, left, bottom, right) {
    cellSheet.printInfo.marginTop = top;
    cellSheet.printInfo.marginLeft = left;
    cellSheet.printInfo.marginBottom = bottom;
    cellSheet.printInfo.marginRight = right;
  }

  /**
   * 设置打印方向
   * @param {number} orient - 打印方向
   */
  function PrintSetOrient(orient) {
    cellSheet.printInfo.printOrient = orient;
  }

  /**
   * 获取打印纸张宽度
   * @param {number} sheet - 工作表索引
   * @returns {number} 纸张宽度
   */
  function PrintGetPaperWidth(sheet) {
    return cellSheet.printInfo.paperWidth;
  }

  /**
   * 获取打印纸张高度
   * @param {number} sheet - 工作表索引
   * @returns {number} 纸张高度
   */
  function PrintGetPaperHeight(sheet) {
    return cellSheet.printInfo.paperHeight;
  }

  /**
   * 获取打印页数
   * @returns {number} 页数
   */
  function PrintGetPages() {
    var headHeight = Comman.GetHeadHeight(cellSheet);
    var tailHeight = Comman.GetTailHeight(cellSheet);
    var pageInfoList = Comman.GetConvertPageInfoList(cellSheet, headHeight, tailHeight);
    return pageInfoList.length;
  }

  /**
   * 判断行是否为分页符
   * @param {number} row - 行号
   * @returns {boolean} 是否为分页符
   */
  function IsRowPageBreak(row) {
    return cellSheet.pageHardBreakRowList.Contains(row - 1);
  }

  /**
   * 获取单元格高度
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @returns {number} 单元格高度
   */
  function GetCellHeight(col, row) {
    var mergeArea = GetMergeRange(col, row);
    if (cellSheet.cells[col - 1][row - 1].isInMergeArea && mergeArea !== null) {
      var height = 0;
      for (var i = mergeArea.startRow - 1; i < mergeArea.endRow; i++) {
        height += cellSheet.rowHeightList[i];
      }
      return height;
    } else {
      return cellSheet.rowHeightList[row - 1];
    }
  }

  /**
   * 获取单元格宽度
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @returns {number} 单元格宽度
   */
  function GetCellWidth(col, row) {
    var mergeArea = GetMergeRange(col, row);
    if (cellSheet.cells[col - 1][row - 1].isInMergeArea && mergeArea !== null) {
      var width = 0;
      for (var i = mergeArea.startCol - 1; i < mergeArea.endCol; i++) {
        width += cellSheet.colWidthList[i];
      }
      return width;
    } else {
      return cellSheet.colWidthList[col - 1];
    }
  }

  /**
   * 获取单元格Y坐标
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @returns {number} Y坐标
   */
  function GetCellYPos(col, row) {
    var y = 0;
    for (var i = 0; i < row - 1; i++) {
      y += cellSheet.rowHeightList[i];
    }
    return y;
  }

  /**
   * 获取单元格X坐标
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @returns {number} X坐标
   */
  function GetCellXPos(col, row) {
    var x = 0;
    for (var i = 0; i < col - 1; i++) {
      x += cellSheet.colWidthList[i];
    }
    return x;
  }

  /**
   * 获取新图片索引
   * @returns {number} 新图片索引
   */
  function getNewImageIndex() {
    var index = 0;
    for (var i = 0; i < cellSheet.cellImageList.length; i++) {
      var cellImage = cellSheet.cellImageList[i];
      if (cellImage.imageIndex > index) {
        index = cellImage.imageIndex;
      }
    }
    return index + 1;
  }

  /**
   * 获取行高
   * @param {number} type - 类型
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {number} 行高
   */
  function GetRowHeight(type, row, sheet) {
    return cellSheet.rowHeightList[row - 1];
  }

  /**
   * 获取列宽
   * @param {number} type - 类型
   * @param {number} col - 列号
   * @param {number} sheet - 工作表索引
   * @returns {number} 列宽
   */
  function GetColWidth(type, col, sheet) {
    return cellSheet.colWidthList[col - 1];
  }

  /**
   * 获取单元格图片索引
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {number} 图片索引
   */
  function GetCellImageIndex(col, row, sheet) {
    var cell = cellSheet.cells[col - 1][row - 1];
    return cell.imageIndex;
  }

  /**
   * 设置背景图片
   * @param {number} imageIndex - 图片索引
   * @param {number} option - 选项
   * @param {number} sheetIndex - 工作表索引
   */
  function SetBackImage(imageIndex, option, sheetIndex) {
    cellSheet.backgroundImageIndex = imageIndex;
    cellSheet.backgroundImageStyle = option;
  }

  /**
   * 获取背景图片
   * @param {number} sheet - 工作表索引
   * @returns {Object} 背景图片信息
   */
  function GetBackImage(sheet) {
    return {
      imageIndex: cellSheet.backgroundImageIndex,
      option: cellSheet.backgroundImageStyle,
    };
  }

  /**
   * 设置单元格字体自动缩放
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} enable - 是否启用(1=启用)
   * @returns {number} 返回1
   */
  function SetCellFontAutoZoom(col, row, sheet, enable) {
    cellSheet.cells[col - 1][row - 1].isAutoScale = enable === 1;
    return 1;
  }

  /**
   * 获取复制内容
   * @returns {CopyInfo|null} 复制信息对象
   */
  function GetCopyContent() {
    return copyInfo;
  }

  /**
   * 设置复制内容
   * @param {CopyInfo} copyContent - 复制信息对象
   */
  function SetCopyContent(copyContent) {
    top.cellCopyInfo = copyContent;
  }

  /**
   * 设置打印页眉
   * @param {string} leftStr - 左侧字符串
   * @param {string} midStr - 中间字符串
   * @param {string} rightStr - 右侧字符串
   */
  function PrintSetHead(leftStr, midStr, rightStr) {
    cellSheet.headerStr = leftStr + "|" + midStr + "|" + rightStr;
  }

  /**
   * 设置打印页脚
   * @param {string} leftStr - 左侧字符串
   * @param {string} midStr - 中间字符串
   * @param {string} rightStr - 右侧字符串
   */
  function PrintSetFoot(leftStr, midStr, rightStr) {
    cellSheet.footerStr = leftStr + "|" + midStr + "|" + rightStr;
  }

  /**
   * 设置打印顶端标题行
   * @param {number} startRow - 起始行号
   * @param {number} endRow - 结束行号
   */
  function PrintSetTopTitle(startRow, endRow) {
    cellSheet.topTitleStartRow = startRow;
    cellSheet.topTitleEndRow = endRow;
  }

  /**
   * 设置打印底端标题行
   * @param {number} startRow - 起始行号
   * @param {number} endRow - 结束行号
   */
  function PrintSetBottomTitle(startRow, endRow) {
    cellSheet.bottomTitleStartRow = startRow;
    cellSheet.bottomTitleEndRow = endRow;
  }

  /**
   * 设置图表数据
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {string} chartData - 图表数据
   */
  function SetChartData(col, row, sheet, chartData) {
    var cell = cellSheet.cells[col - 1][row - 1];
    cell.chartData = chartData;
  }

  /**
   * 获取图表数据
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @returns {string} 图表数据
   */
  function GetChartData(col, row, sheet) {
    var cell = cellSheet.cells[col - 1][row - 1];
    return cell.chartData;
  }

  /**
   * 设置单元格填充数据类型
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {number} fillDataType - 填充数据类型
   */
  function SetCellFillDataType(col, row, sheet, fillDataType) {
    var cell = cellSheet.cells[col - 1][row - 1];
    cell.fillDataType = fillDataType;
  }

  /**
   * 设置单元格只读
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {boolean} isReadOnly - 是否只读
   */
  function SetCellReadOnly(col, row, sheet, isReadOnly) {
    var cell = cellSheet.cells[col - 1][row - 1];
    cell.isReadOnly = isReadOnly;
  }

  /**
   * 设置单元格是否为复选框
   * @param {number} col - 列号
   * @param {number} row - 行号
   * @param {number} sheet - 工作表索引
   * @param {boolean} value - 是否为复选框
   */
  function SetCellIsCheckBox(col, row, sheet, value) {
    var cell = cellSheet.cells[col - 1][row - 1];
    cell.isCheckBox = value;
  }

  return {
    Open: Open,
    CopyRange: CopyRange,
    mfCopyRange: mfCopyRange,
    Paste: Paste,
    UnmergeCells: UnmergeCells,
    AppendRow: AppendRow,
    AppendCol: AppendCol,
    mfPaste: mfPaste,
    SetRowPageBreak: SetRowPageBreak,
    GetRows: GetRows,
    GetCols: GetCols,
    MergeCells: MergeCells,
    SetCellString: SetCellString,
    GetCellString: GetCellString,
    SetCellDouble: SetCellDouble,
    S: S,
    CalculateSheet: CalculateSheet,
    GetMergeRange: GetMergeRange,
    DoWork: DoWork,
    InsertRow: InsertRow,
    InsertCol: InsertCol,
    GetCellFont: GetCellFont,
    GetFontName: GetFontName,
    SetCellFont: SetCellFont,
    GetCellFontSize: GetCellFontSize,
    SetCellFontSize: SetCellFontSize,
    GetCellFontStyle: GetCellFontStyle,
    SetCellFontStyle: SetCellFontStyle,
    GetCellTextColor: GetCellTextColor,
    SetCellTextColor: SetCellTextColor,
    SetCellBackColor: SetCellBackColor,
    GetCellTextLineSpace: GetCellTextLineSpace,
    SetCellTextLineSpace: SetCellTextLineSpace,
    SetRowHeight: SetRowHeight,
    SetColWidth: SetColWidth,
    SetCellAlign: SetCellAlign,
    GetCellAlign: GetCellAlign,
    GetCellHAlign: GetCellHAlign,
    GetCellVAlign: GetCellVAlign,
    SetCellHAlign: SetCellHAlign,
    SetCellVAlign: SetCellVAlign,
    InsertCleanRow: InsertCleanRow,
    InsertCleanCol: InsertCleanCol,
    DeleteRow: DeleteRow,
    DeleteCol: DeleteCol,
    AddImage: AddImage,
    SetCellImage: SetCellImage,
    UpdateImage: UpdateImage,
    DeleteImage: DeleteImage,
    SetCellFloatImage: SetCellFloatImage,
    MoveFloatImage: MoveFloatImage,
    GetFloatImagePos: GetFloatImagePos,
    GetFormula: GetFormula,
    GetFormulaStr: GetFormulaStr,
    PrintGetMargin: PrintGetMargin,
    PrintGetOrient: PrintGetOrient,
    PrintGetHAlign: PrintGetHAlign,
    PrintGetVAlign: PrintGetVAlign,
    PrintSetAlign: PrintSetAlign,
    PrintSetMargin: PrintSetMargin,
    PrintSetOrient: PrintSetOrient,
    PrintGetPaperWidth: PrintGetPaperWidth,
    PrintGetPaperHeight: PrintGetPaperHeight,
    PrintGetPages: PrintGetPages,
    IsRowPageBreak: IsRowPageBreak,
    GetCellHeight: GetCellHeight,
    GetCellWidth: GetCellWidth,
    GetCellYPos: GetCellYPos,
    GetCellXPos: GetCellXPos,
    GetRowHeight: GetRowHeight,
    GetColWidth: GetColWidth,
    GetCellImageIndex: GetCellImageIndex,
    SetBackImage: SetBackImage,
    GetBackImage: GetBackImage,
    SetCellFontAutoZoom: SetCellFontAutoZoom,
    GetCopyContent: GetCopyContent,
    SetCopyContent: SetCopyContent,
    PrintSetHead: PrintSetHead,
    PrintSetFoot: PrintSetFoot,
    PrintSetTopTitle: PrintSetTopTitle,
    PrintSetBottomTitle: PrintSetBottomTitle,
    SetChartData: SetChartData,
    GetChartData: GetChartData,
    SetCopyInfoFromExcel: SetCopyInfoFromExcel,
    CalFun: CalFun,
    SetFormula: SetFormula,
    SetCellFillDataType: SetCellFillDataType,
    SetCellReadOnly: SetCellReadOnly,
    SetCellTextStyle: SetCellTextStyle,
    SetCellIsCheckBox: SetCellIsCheckBox,
    setDataToFillDataJsonData: setDataToFillDataJsonData,
    SortFormula: SortFormula,
  };
}
