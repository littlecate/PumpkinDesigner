"use strict";

function PasteRangeData(config) {
  var cellSheet = config.cellSheet;
  var operCell = config.operCell;
  var startCol = config.startCol;
  var startRow = config.startRow;

  let colDataIndex = 0;

  function doJob() {    
    if(readOnlyText){
      return;
    }
    var data = top.copyedTextAr;
    if (!data || data.length == 0) {
      return;
    }
    setMergeAreaUnDrawed();
    let index = 0;
    for (var row = startRow; row < cellSheet.rowHeightList.length; row++) {
      let L = data[index];
      colDataIndex = 0;
      for (var col = startCol; col < cellSheet.colWidthList.length; col++) {
        if (colDataIndex >= L.length) {
          break;
        }
        if(!cellSheet.cells[col]){
          break;
        }
        var o = cellSheet.cells[col][row];
        if(!o){
          break;
        }
        doJobA(o, col, row, L);
      }
      index++;
      if (index >= data.length) {
        break;
      }
    }
    setMergeAreaUnDrawed();
  }

  function doJobA(o, col, row, L) {
    if (o.isInMergeArea) {
      var o1 = Comman.getMergeAreaById(cellSheet, o.mergeAreaId);
      if (o1 != null && !o1.isDrawed) {        
        operCell.SetCellString(col + 1, row + 1, 0, L[colDataIndex]);
        colDataIndex++;
        o1.isDrawed = true;
      } else if (o1 == null) {
        operCell.SetCellString(col + 1, row + 1, 0, L[colDataIndex]);
        colDataIndex++;
      }
    } else {
      operCell.SetCellString(col + 1, row + 1, 0, L[colDataIndex]);
      colDataIndex++;
    }
  }

  function setMergeAreaUnDrawed() {
    for (var i = 0; i < cellSheet.cellMergeAreaList.length; i++) {
      cellSheet.cellMergeAreaList[i].isDrawed = false;
    }
  }

  return {
    doJob: doJob,
  };
}
