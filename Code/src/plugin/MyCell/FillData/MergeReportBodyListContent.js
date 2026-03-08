'use strict';

/**
 * @fileoverview 合并报表主体列表内容模块 - 提供报表主体合并功能
 * @description 该模块负责合并多个报表主体的内容，
 * 支持横向和纵向两种合并方式。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 合并报表主体列表内容类
 * @class MergeReportBodyListContent
 * @description 合并多个报表主体的内容
 * @param {Array} reportBodyList - 报表主体列表
 * @param {Object} cellSheet - 单元格表格对象
 * @returns {Object} 包含doJob方法的对象
 */
function MergeReportBodyListContent(reportBodyList, cellSheet) {
    /**
     * 执行合并任务
     * @function doJob
     * @description 根据报表主体的方向（横向/纵向）分别进行合并处理
     * @returns {void}
     */
    function doJob() {
        if (reportBodyList.length <= 1) {
            return reportBodyList;
        }
        var tAr = reportBodyList.filter(p => p.orientation == "横向");
        if (tAr.length > 1) {
            new MergeReportBodyListContentH(tAr, cellSheet).doJob();
        }
        tAr = reportBodyList.filter(p => p.orientation == "竖向");
        if (tAr.length > 1) {
            new MergeReportBodyListContentV(tAr, cellSheet).doJob();
        }
    }

    return {
        doJob: doJob
    }
}