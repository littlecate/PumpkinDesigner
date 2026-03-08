/**
 * @fileoverview 结束执行模块 - 负责报表生成结束后的处理工作
 * @description 该模块负责报表生成结束后的收尾工作，
 * 包括生成报表输出信息、填充页码等功能。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * @fileoverview 结束执行模块 - 负责报表生成结束后的处理工作
 * @description 该模块负责报表生成结束后的收尾工作，
 * 包括生成报表输出信息、填充页码等功能。
 * @author MyCell Designer
 * @version 1.0.0
 */
'use strict';

/**
 * 结束执行类
 * @class EndDo
 * @description 负责报表生成结束后的处理工作
 */
function EndDo() {
    /**
     * 获取报表生成输出信息
     * @function GetGenReportOutInfo
     * @param {Array} fillOneTemplateOutInfoListAll - 所有填充模板输出信息列表
     * @param {Object} fillReportSysInfo - 填充报表系统信息
     * @returns {Object} 报表生成输出信息
     */
    this.GetGenReportOutInfo = function (fillOneTemplateOutInfoListAll, fillReportSysInfo) {
        this.FillPageNo(fillOneTemplateOutInfoListAll);

        var genReportOutInfo = {
            outFileList: []
        };

        fillOneTemplateOutInfoListAll.forEach(function (fillOneTemplateOutInfo) {
            var cellSheet = fillOneTemplateOutInfo.cellSheet;
            genReportOutInfo.outFileList.push(cellSheet);
        }, this);

        return genReportOutInfo;
    };

    /**
     * 填充页码
     * @param {Array} fillOneTemplateOutInfoList - 填充模板输出信息列表
     */
    this.FillPageNo = function (fillOneTemplateOutInfoList) {
        var totalPageCount = 0;

        fillOneTemplateOutInfoList.forEach(function (fillOneTemplateOutInfo) {
            totalPageCount += fillOneTemplateOutInfo.pageNoColRowInfoList.length;
        });

        var pageNo = 1;

        fillOneTemplateOutInfoList.forEach(function (fillOneTemplateOutInfo) {
            var cell = fillOneTemplateOutInfo.cell;

            fillOneTemplateOutInfo.pageNoColRowInfoList.forEach(function (pageNoColRowInfo) {
                cell.SetCellString(pageNoColRowInfo.col, pageNoColRowInfo.row, 0, '第' + pageNo + '页 共' + totalPageCount + '页');
                pageNo++;
            });
        });
    };
}
