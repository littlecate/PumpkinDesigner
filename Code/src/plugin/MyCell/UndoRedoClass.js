'use strict';

/**
 * @fileoverview 撤销重做模块，提供操作历史的撤销和重做功能
 * @module UndoRedoClass
 */

/**
 * 撤销重做类
 * @class
 */
function UndoRedoClass() {
    /**
     * 撤销内容数组
     * @type {Array}
     */
    var undoContentAr = [];
    
    /**
     * 重做内容数组
     * @type {Array}
     */
    var redoContentAr = [];
    
    /**
     * 获取索引
     * @type {number}
     */
    var fetchIndex = -2;

    /**
     * 记录撤销内容
     * @function recordUndoContent
     * @param {Object} o - 要记录的内容
     */
    function recordUndoContent(o) {
        if (fetchIndex >= 0) {
            undoContentAr.splice(fetchIndex, undoContentAr.length - 1 - fetchIndex + 1);
            fetchIndex = -2;
        }
        if (undoContentAr.length == 10) {
            undoContentAr.splice(0, 1);
            fetchIndex = -2;
        }
        undoContentAr.push(o);
    }

    function recordRedoContent(o) {
        if (fetchIndex >= 0) {
            redoContentAr.splice(fetchIndex, redoContentAr.length - 1 - fetchIndex + 1);            
        }
        if (redoContentAr.length == 10) {
            redoContentAr.splice(0, 1);            
        }
        redoContentAr.push(o);
    }

    function getUndoContent() {
        if (undoContentAr.length == 0) {
            return null;
        }
        if (fetchIndex == -2) {
            fetchIndex = undoContentAr.length - 1;           
        }
        else {
            fetchIndex--;            
            if (fetchIndex < 0) {
                fetchIndex = 0;
                return null;
            }
        }
        var o = undoContentAr[fetchIndex];
        return o;
    }

    function getRedoContent() {
        if (redoContentAr.length == 0) {
            return null;
        }        
        if (fetchIndex < 0) {
            return null;
        }
        var o = redoContentAr[fetchIndex];
        fetchIndex++;
        if (fetchIndex > redoContentAr.length - 1) {
            fetchIndex = -2;
        }
        return o;
    }

    return {
        recordUndoContent: recordUndoContent,
        recordRedoContent: recordRedoContent,
        getUndoContent: getUndoContent,
        getRedoContent: getRedoContent
    }
}

let myUndoRedo = new UndoRedoClass();