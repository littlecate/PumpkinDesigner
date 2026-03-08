'use strict';
let commanColumnMaps = {};
let commanColumnMapsMainTable = {};
let customDataTableName = "";
let isUseCommanColumnMaps = false;
let isAutoGenColumn = false;
function GenColumnStr(config) {
    var refStr1 = config.refStr1.toLowerCase();
    var refStr2 = config.refStr2.toLowerCase();   
    var order = config.order;

    function doJob() {
        var t1 = commanColumnMapsMainTable[refStr2 + "_" + refStr1];
        var t2 = commanColumnMapsMainTable[refStr1 + "_" + refStr2];
        var t3 = commanColumnMapsMainTable[refStr2 + "_"];
        var t4 = commanColumnMapsMainTable[refStr1 + "_"];
        var t5 = commanColumnMaps[refStr2 + "_" + refStr1];
        var t6 = commanColumnMaps[refStr1 + "_" + refStr2];
        if (t1) {
            if (order) {
                return t1[order - 1];
            }
            return t1[0];
        }
        else if (t2) {
            if (order) {
                return t2[order - 1]
            }
            return t2[0];
        }
        else if (t3) {
            if (order) {
                return t3[order - 1];
            }
            return t3[0];
        }
        else if (t4) {
            if (order) {
                return t4[order - 1]
            }
            return t4[0];
        }
        if (isUseCommanColumnMaps) {
            if (t5) {
                if (order) {
                    return t5[order - 1];
                }
                return t5[0];
            }
            else if (t6) {
                if (order) {
                    return t6[order - 1]
                }
                return t6[0];
            }
        }
        if(isAutoGenColumn){
            return doJobA();    
        }   
        return ""; 
    }

    function doJobA() {
        var t1 = getPinYinShouZiMu(refStr1);
        var t2 = getPinYinShouZiMu(refStr2);
        var t3 = t1 + "$" + t2 + "$" + order;
        var t4 = leftMark + customDataTableName + "." + t3 + ".0.1.c" + rightMark;
        return t4;
    }

    function getPinYinShouZiMu(s) {
        return new GetPinYinShouZiMu(s).doJob();
    }    

    return {
        doJob: doJob
    }
}