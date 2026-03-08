'use strict';

/**
 * @fileoverview 获取引用行列列表模块，从公式代码中解析出引用的单元格位置
 * @module GetRefColRowList
 */

/**
 * 获取引用行列列表类
 * @class
 * @param {Array} _codeLineRaw - 原始代码行列表
 */
function GetRefColRowList(/*List <string > */_codeLineRaw) {

    var codeLineRaw = Comman.DeepCopyObj(_codeLineRaw);

    /*public List < ColRow > */
    function DoJob() {
        /*List < ColRow >*/var L = [];/*new List < ColRow > ();*/
        var reg1 = /^([A-Za-z]{1,3})(\d{1,5})$/;
        var reg2 = /^([A-Za-z]{1,3})(\d{1,5}):([A-Za-z]{1,3})(\d{1,5})$/;        
        for (var i = 0; i < codeLineRaw.Count(); i++) {
            var p = codeLineRaw[i];
            var mc = Regex.Match(p, reg1);
            if (mc.Success) {
                var colRow = Comman.GetColRow(p.ToUpper());
                L.Add(colRow);
            }
            else {
                mc = Regex.Match(p, reg2);
                if (mc.Success) {
                    var ar = p.split(':');
                    var colRow1 = Comman.GetColRow(ar[0]);
                    var colRow2 = Comman.GetColRow(ar[1]);
                    L.AddRange(GetRangeColRowList(colRow1, colRow2));
                }
            }
        }
        return L;
    }

    /*private List < ColRow > */
    function GetRangeColRowList(/*ColRow */colRow1, /*ColRow */colRow2) {
        /*List < ColRow >*/var L = [];/* new List < ColRow > ()*/;
        for (var col = colRow1.col; col <= colRow2.col; col++) {
            for (var row = colRow1.row; row <= colRow2.row; row++) {
                L.Add(new ColRow({
                    col: col,
                    row: row
                }));
            }
        }
        return L;
    }

    return {
        DoJob: DoJob
    }
}