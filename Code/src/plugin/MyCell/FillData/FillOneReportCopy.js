'use strict';

/**
 * @fileoverview 填充单份报表副本模块 - 负责填充单个报表副本的数据
 * @description 该模块负责将数据填充到单个报表副本中，
 * 处理单元格字符串解析、数据替换、签名图片插入、浮动印章绘制等功能。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 是否调试模式
 * @type {boolean}
 * @description 控制是否启用调试模式
 */
let isDebug = false;

/**
 * 填充单份报表副本类
 * @class FillOneReportCopy
 * @description 负责填充单个报表副本的数据
 * @param {Object} cell - 单元格操作对象
 * @param {Object} rsAll - 所有数据记录集
 * @param {Object} printParam - 打印参数
 * @param {number} copyNum - 副本编号
 * @param {number} fillStartRow - 填充起始行
 * @param {Array} reportBodyList - 报表主体列表
 * @param {number} totalRecordCount - 总记录数
 * @param {Object} fillReportSysInfo - 填充报表系统信息
 */
function FillOneReportCopy(cell, rsAll, printParam, copyNum, fillStartRow, reportBodyList, totalRecordCount, fillReportSysInfo) {
    this.cell = cell;
    this.rsAll = rsAll;
    this.printParam = printParam;
    this.copyNum = copyNum;
    this.fillStartRow = fillStartRow;
    this.reportBodyList = reportBodyList;
    this.totalRecordCount = totalRecordCount;
    this.fillReportSysInfo = fillReportSysInfo;
    this.pageNoColRowInfoList = [];
    this.haveFillEmptyStrBodyIndexList = [];
    this.fillOneReportOutInfo = {
        specialColumnFillInfoList: []
    };

    this.DoJob = function () {
        var cols = this.cell.GetCols(0) - 1;
        var rows = this.cell.GetRows(0) - 1;
        for (var col = 1; col <= cols; col++) {
            for (var row = 1; row <= rows; row++) {
                var s = this.cell.GetCellString(col, row, 0);
                if (s.indexOf("[#") !== -1 && s.indexOf("#]") !== -1) {
                    if (!isDebug) {
                        this.FillOneStr(col, row, s);
                    }
                }
                else {
                    this.cell.SetCellReadOnly(col, row, 0, true);
                }
            }
        }

        //合并相关单元格信息    
        this.CombinNeedCombinInfo();

        //填充序号    
        this.FillXuHao();

        //填充以下空白    
        this.FillBodyBlankStr();

        return this.pageNoColRowInfoList;
    };

    this.FillBodyBlankStr = function () {
        var L = this.fillOneReportOutInfo.specialColumnFillInfoList.filter(function (p) {
            return p.type === FillBodyBlankType.以下空白;
        });

        if (L.length === 0) {
            return;
        }

        if (this.fillReportSysInfo.fillBodyBlankType === FillBodyBlankType.默认) {
            var L1 = [];
            L.forEach(function (p) {
                var t = p.bodyIndex;
                if (L1.indexOf(t) === -1) {
                    L1.push(t);
                }
            });
            L1.forEach(function (bodyIndex) {
                var L2 = L.filter(function (p) {
                    return p.bodyIndex === bodyIndex;
                });
                if (reportBodyList[bodyIndex].orientation === "横向") {
                    this.ClearBodyRangeH(L2);
                } else {
                    this.ClearBodyRangeV(L2);
                }
            }, this);
        } else {
            throw new Error("填充以下空白方式有待实现!");
        }
    };

    this.ClearBodyRangeV = function (L) {
        var isHaveFilledEmptyFillStr = false;
        var reportBody = this.reportBodyList[L[0].bodyIndex];
        L.forEach(function (p) {
            var col = p.col;
            var row = p.row;
            if (!isHaveFilledEmptyFillStr) {
                var cellSize = Common.GetCellSize(this.cell, col, row, 0);
                if (cellSize.height > 10 && cellSize.width > 20) {
                    this.cell.SetCellString(col, row, 0, this.fillReportSysInfo.emptyFillStrV);
                    this.FillEmptyToEnd(col, reportBody.endCol, row, reportBody.endRow);
                    isHaveFilledEmptyFillStr = true;
                }
            }
        }, this);
    };

    this.FillEmptyToEnd = function (startCol, endCol, startRow, endRow) {
        for (var col = startCol; col <= endCol; col++) {
            for (var row = startRow; row <= endRow; row++) {
                if (col === startCol && row === startRow) {
                    continue;
                }
                this.cell.SetCellString(col, row, 0, "");
            }
        }
    };

    this.ClearBodyRangeH = function (L) {
        var isHaveFilledEmptyFillStr = false;
        var reportBody = this.reportBodyList[L[0].bodyIndex];
        L.forEach(function (p) {
            var col = p.col;
            var row = p.row;
            if (!isHaveFilledEmptyFillStr) {
                var cellSize = Common.GetCellSize(this.cell, col, row, 0);
                if (cellSize.height > 10 && cellSize.width > 20) {
                    this.cell.SetCellString(col, row, 0, this.fillReportSysInfo.emptyFillStrH);
                    this.FillEmptyToEnd(col, reportBody.endCol, row, reportBody.endRow);
                    isHaveFilledEmptyFillStr = true;
                }
            }
        }, this);
    };

    this.FillXuHao = function () {
        var L = this.fillOneReportOutInfo.specialColumnFillInfoList.filter(function (p) {
            return p.type === SpecialColumnType.序号;
        });

        if (L.length === 0) {
            return;
        }

        if (this.fillReportSysInfo.fillXuHaoType === FillXuHaoType.默认) {
            L.forEach(function (p) {
                this.cell.SetCellString(p.col, p.row, 0, p.s);
            }, this);
        } else {
            throw new Error("填充序号方式有待实现!");
        }
    };

    this.CombinNeedCombinInfo = function () {
        // 实现代码  
    };

    this.FillOneStr = function (col, row, s) {
        while (true) {
            var pos1 = s.indexOf("[#");
            if (pos1 === -1) return;

            var pos2 = s.indexOf("#]", pos1 + 2);
            if (pos2 === -1) return;

            var tt = s.substring(pos1, pos2 + 2 - pos1);
            var t = s.substring(pos1 + 2, pos2 - pos1);
            var tAr = t.split(/\.|。/);

            var t1 = {
                tableName: tAr[0],
                columnName: tAr[1],
                bodyIndex: parseInt(tAr[2]) - 1,
                recNum: parseInt(tAr[3]) - 1,
                dataType: tAr.length > 4 ? tAr[4].toLowerCase() : "c"
            };

            this.cell.SetCellFillDataType(col, row, 0, t1.dataType);

            this.recordFillDataMaps(col, row, s, t1);

            var o = needSetCheckBoxInfoList.find(p => p.tableNameAndColumn == t1.tableName + "." + t1.columnName);            
            if (o != null) {
                var v = "";
                var rs = this.rsAll[t1.tableName];
                if (rs && rs[t1.recNum]) {
                    v = rs[t1.recNum][t1.columnName] || "";
                }                
                if (v == "") {
                    v = o.defaultValue;
                }
                this.cell.SetCellString(col, row, 0, v);
                this.cell.SetCellIsCheckBox(col, row, 0, true);
                return;
            }

            if (t1.tableName === "ccc") {
                if (t1.columnName === "xuhao") {
                    var recNum = this.printParam.recordPerPage * this.copyNum + t1.recNum;
                    if (recNum < this.totalRecordCount) {
                        this.fillOneReportOutInfo.specialColumnFillInfoList.push({
                            col: col,
                            row: row,
                            s: (recNum + 1).toString(),
                            bodyIndex: t1.bodyIndex,
                            type: SpecialColumnType.序号
                        });
                    }
                    this.cell.SetCellString(col, row, 0, "");
                    s = "";
                } else if (t1.columnName === "pageofreport") {
                    this.pageNoColRowInfoList.push({ col: col, row: row });
                    this.cell.SetCellString(col, row, 0, "");
                    s = "";
                }
                else{
                    return;
                }
            } else {
                s = this.FillOneStr2(col, row, t1, s, tt);
                var o = this.GetSignNameInfo(t1);
                if (o) {
                    this.FillOneStrAndSignName(col, row, t1, s, o);
                }
                var o1 = this.GetFloatSealInfo(t1, s);
                if (o1) {
                    this.DrawFloatSeal(col, row, t1, s, o1);
                }
            }
        }
    };

    this.recordFillDataMaps = function (col, row, s, t1) {
        var recNum = this.printParam.recordPerPage * this.copyNum + t1.recNum;
        var t2 = col + "." + row;
        var t3 = t1.tableName + "." + t1.columnName + "." + recNum;
        if (fillDataMaps1[t2]) {
            throw "一个单元格里面只能有一个字段!单元格(" + col + ", " + row + ")字符串内容为:" + s + ",不符合模板设计要求，请修正模板!";
        }
        fillDataMaps1[t2] = { tableName: t1.tableName, columnName: t1.columnName, recNum: recNum };
        ;
        fillDataMaps2[t3] = { col: col, row: row };
        ;
    }

    this.GetFloatSealInfo = function (t1, s) {
        var t = t1.tableName + "." + t1.columnName;
        for (var i = 0; i < this.fillReportSysInfo.floatSealInfoList.length; i++) {
            var p = this.fillReportSysInfo.floatSealInfoList[i];
            if (p.relTableNameAndColumn === t) return p;
            for (var j = 0; j < p.conditionWordList.length; j++) {
                if (s.indexOf(p.conditionWordList[j]) !== -1) return p;
            }
        }
        return null;
    };

    this.DrawFloatSeal = function (col, row, t1, s, o) {
        // 实现绘制浮动图章的逻辑  
    };

    this.FillOneStrAndSignName = function (col, row, t1, s, o) {
        if (o.position === SignNamePosition.仅签名图片) {
            this.cell.SetCellString(col, row, 0, "");
            var index = this.cell.AddImage(o.imagePath);
            this.cell.SetCellImage(col, row, 0, index, 3, 2, 2);
            return;
        }
        if (o.position === SignNamePosition.仅名字) return;
        if (o.position === SignNamePosition.签名图片居上名字居下) {
            this.cell.SetCellAlign(col, row, 0, 4 + 16);
            var index = this.cell.AddImage(o.imagePath);
            this.cell.SetCellImage(col, row, 0, index, 3, 2, 1);
            return;
        }
        if (o.position === SignNamePosition.签名图片居下名字居上) {
            this.cell.SetCellAlign(col, row, 0, 4 + 8);
            var index = this.cell.AddImage(o.imagePath);
            this.cell.SetCellImage(col, row, 0, index, 3, 2, 3);
            return;
        }
        if (o.position === SignNamePosition.签名图片居右名字居左) {
            this.cell.SetCellAlign(col, row, 0, 1 + 32);
            var index = this.cell.AddImage(o.imagePath);
            this.cell.SetCellImage(col, row, 0, index, 3, 3, 2);
            return;
        }
        if (o.position === SignNamePosition.签名图片居左名字居右) {
            this.cell.SetCellAlign(col, row, 0, 2 + 32);
            var index = this.cell.AddImage(o.imagePath);
            this.cell.SetCellImage(col, row, 0, index, 3, 1, 2);
            return;
        }
    };

    this.GetSignNameInfo = function (t1) {
        var t = t1.tableName + "." + t1.columnName;
        for (var i = 0; i < this.fillReportSysInfo.signNameInfoList.length; i++) {
            if (this.fillReportSysInfo.signNameInfoList[i].relTableNameAndColumn === t) {
                return this.fillReportSysInfo.signNameInfoList[i];
            }
        }
        return null;
    };

    this.FillOneStr2 = function (col, row, t1, s, tt) {
        var t2 = "", t = "";

        if (!this.rsAll[t1.tableName]) {
            t2 = s.replace(tt, this.fillReportSysInfo.blankFillStr);
            this.cell.SetCellString(col, row, 0, t2);
            return t2;
        }

        var rs = this.rsAll[t1.tableName];

        if (rs.length === 0) {
            t2 = s.replace(tt, this.fillReportSysInfo.blankFillStr);
            this.cell.SetCellString(col, row, 0, t2);
            return t2;
        }

        var recNum = this.printParam.recordPerPage * this.copyNum + t1.recNum;

        if (t1.bodyIndex >= 0 && recNum >= rs.length) {
            this.cell.SetCellString(col, row, 0, "");
            var t3 = {
                col: col,
                row: row,
                s: (recNum + 1).toString(),
                bodyIndex: t1.bodyIndex,
                type: SpecialColumnType.以下空白
            };
            this.fillOneReportOutInfo.specialColumnFillInfoList.push(t3);
            return "";
        }

        if (t1.bodyIndex === -1 && recNum >= rs.length) {
            t = this.GetOneColumnValue(rs, 0, t1);
            t2 = s.replace(tt, t);
            t2 = this.TrimS(t2);
            this.cell.SetCellString(col, row, 0, t2);
            return t2;
        }

        t = this.GetOneColumnValue(rs, recNum, t1);
        t2 = s.replace(tt, t);
        t2 = this.TrimS(t2);
        this.cell.SetCellString(col, row, 0, t2);
        return t2;
    };

    this.TrimS = function (s) {
        s = Common.TrimS(s);
        if (!s) {
            return this.fillReportSysInfo.blankFillStr;
        }
        return s;
    };

    this.GetOneColumnValue = function (rs, recNum, t1) {
        var t = rs[recNum];
        if (!t) {
            return this.fillReportSysInfo.blankFillStr;
        }
        if (t[t1.columnName]) {
            var t2 = t[t1.columnName].toString();

            if (t2) {
                if (t1.dataType === "d") {
                    return Common.GetDateStr(t2, this.fillReportSysInfo.dateFormat);
                } else if (t1.dataType === "d1") {
                    return Common.GetDateDaxienianyueriStr(t2);
                } else if (t1.dataType === "d2") {
                    return Common.GetDateDaxienianyueStr(t2);
                } else if (t1.dataType === "t1") {
                    return Common.GetDateTimeStr(t2, this.fillReportSysInfo.dateTimeFormat);
                } else if (t1.dataType === "t2") {
                    return Common.GetTimeStr(t2, this.fillReportSysInfo.timeFormat);
                } else if (t1.dataType === "n1") {
                    return Common.GetRenmingbidaxieStr(t2);
                }
            }
            return t2;
        }
        return this.fillReportSysInfo.blankFillStr;
    };
}