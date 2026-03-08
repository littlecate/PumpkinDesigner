'use strict';

/**
 * @fileoverview 页面设置模块，提供纸张大小、方向等页面设置功能
 * @module PageSetClass
 */

/**
 * 纸张和纸张尺寸列表
 * @type {Array}
 */
var paperAndPaperSizeList = [];

/**
 * 设置纸张尺寸
 * @function setPaperSize
 */
function setPaperSize() {    
    var i = parseInt(document.getElementById("select_paper").value);
    var o = paperAndPaperSizeList[i];
    var w = o["width"];
    var h = o["height"];
    var orientation = document.getElementById("select_paperOrientation").value;
    if (orientation == "1") {
        w = o["height"];
        h = o["width"];
    }
    document.getElementById("input_paperWidth").value = w;
    document.getElementById("input_paperHeight").value = h;
    if (i != 0) {
        document.getElementById("input_paperWidth").setAttribute("disabled", "disabled");
        document.getElementById("input_paperHeight").setAttribute("disabled", "disabled");
    }
    else {
        document.getElementById("input_paperWidth").removeAttribute("disabled");
        document.getElementById("input_paperHeight").removeAttribute("disabled");
    }
}

/**
 * 页面设置类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {string} config.parentInstanceName - 父实例名称
 * @param {Object} config.parentEl - 父元素
 * @param {Object} config.cellSheet - 单元格工作表
 * @param {Object} config.dialogThemeConfig - 对话框主题配置
 * @param {number} config.parentElWidth - 父元素宽度
 * @param {number} config.parentElHeight - 父元素高度
 */
function PageSetClass(config) {
    var parentObj = config.parentObj;
    var parentInstanceName = config.parentInstanceName;
    var parentEl = config.parentEl;
    var cellSheet = config.cellSheet;
    var dialogThemeConfig = config.dialogThemeConfig;
    var parentElWidth = config.parentElWidth;
    var parentElHeight = config.parentElHeight;

    var windowId = "div_pageSet";
    var windowDiv = document.getElementById(windowId);
    if (windowDiv) {
        windowDiv.parentElement.removeChild(windowDiv);
    }
    let win = new MyWindow({
        id: windowId,
        parent: parentEl.parentElement,
        isDrag: true,
        width: 600,
        height: 320,
        title: "页面设置",
    });

    let mainDiv = document.createElement("div");
    win.setWindowContent(mainDiv);
    mainDiv.style.width = "100%";
    mainDiv.style.height = "100%";
    mainDiv.style.boxSizing = "border-box";
    mainDiv.style.padding = "12px";

    paperAndPaperSizeList = [
        new PaperAndPaperSize({ paper: 0, explain: "自定义", width: 0, height: 0 }),
        new PaperAndPaperSize({ paper: 1, explain: "DMPAPER_LETTER Letter 8 1/2 x 11 in", width: InchToMM(8.5), height: InchToMM(11) }),
        new PaperAndPaperSize({ paper: 2, explain: "DMPAPER_LETTERSMALL Letter Small 8 1/2 x 11 in", width: InchToMM(8.5), height: InchToMM(11) }),
        new PaperAndPaperSize({ paper: 3, explain: "DMPAPER_TABLOID Tabloid 11 x 17 in", width: InchToMM(11), height: InchToMM(17) }),
        new PaperAndPaperSize({ paper: 4, explain: "DMPAPER_LEDGER Ledger 17 x 11 in", width: InchToMM(17), height: InchToMM(11) }),
        new PaperAndPaperSize({ paper: 5, explain: "DMPAPER_LEGAL Legal 8 1/2 x 14 in", width: InchToMM(8.5), height: InchToMM(14) }),
        new PaperAndPaperSize({ paper: 6, explain: "DMPAPER_STATEMENT Statement 5 1/2 x 8 1/2 in", width: InchToMM(5.5), height: InchToMM(8.5) }),
        new PaperAndPaperSize({ paper: 7, explain: "DMPAPER_EXECUTIVE Executive 7 1/4 x 10 1/2 in", width: InchToMM(7.25), height: InchToMM(10.5) }),
        new PaperAndPaperSize({ paper: 8, explain: "DMPAPER_A3 A3 297 x 420 mm", width: 297, height: 420 }),
        new PaperAndPaperSize({ paper: 9, explain: "DMPAPER_A4 A4 210 x 297 mm", width: 210, height: 297 }),
        new PaperAndPaperSize({ paper: 10, explain: "DMPAPER_A4SMALL A4 Small 210 x 297 mm", width: 210, height: 297 }),
        new PaperAndPaperSize({ paper: 11, explain: "DMPAPER_A5 A5 148 x 210 mm", width: 148, height: 210 }),
        new PaperAndPaperSize({ paper: 12, explain: "DMPAPER_B4 B4 (JIS) 250 x 354", width: 250, height: 354 }),
        new PaperAndPaperSize({ paper: 13, explain: "DMPAPER_B5 B5 (JIS) 182 x 257 mm", width: 182, height: 257 }),
        new PaperAndPaperSize({ paper: 14, explain: "DMPAPER_FOLIO Folio 8 1/2 x 13 in", width: InchToMM(8.5), height: InchToMM(13) }),
        new PaperAndPaperSize({ paper: 15, explain: "DMPAPER_QUARTO Quarto 215 x 275 mm", width: 215, height: 275 }),
        new PaperAndPaperSize({ paper: 16, explain: "DMPAPER_10X14 10x14 in", width: InchToMM(10), height: InchToMM(14) }),
        new PaperAndPaperSize({ paper: 17, explain: "DMPAPER_11X17 11x17 in", width: InchToMM(11), height: InchToMM(17) }),
        new PaperAndPaperSize({ paper: 18, explain: "DMPAPER_NOTE Note 8 1/2 x 11 in", width: InchToMM(8.5), height: InchToMM(11) }),
        new PaperAndPaperSize({ paper: 19, explain: "DMPAPER_ENV_9 Envelope #9 3 7/8 x 8 7/8", width: InchToMM(3 + 7 / 8.0), height: InchToMM(8 + 7 / 8.0) }),
        new PaperAndPaperSize({ paper: 20, explain: "DMPAPER_ENV_10 Envelope #10 4 1/8 x 9 1/2", width: InchToMM(4 + 1 / 8.0), height: InchToMM(9 + 1 / 2.0) }),
        new PaperAndPaperSize({ paper: 21, explain: "DMPAPER_ENV_12 Envelope #11 4 1/2 x 10 3/8", width: InchToMM(4 + 1 / 2.0), height: InchToMM(10 + 3 / 8.0) }),
        new PaperAndPaperSize({ paper: 22, explain: "DMPAPER_ENV_12 Envelope #12 4 \\276 x 12", width: InchToMM(4), height: InchToMM(12) }),
        new PaperAndPaperSize({ paper: 23, explain: "DMPAPER_ENV_14 Envelope #14 5 x 11 1/2", width: InchToMM(5), height: InchToMM(11.5) }),
        new PaperAndPaperSize({ paper: 27, explain: "DMPAPER_ENV_DL Envelope DL 110 x 220mm", width: 110, height: 220 }),
        new PaperAndPaperSize({ paper: 28, explain: "DMPAPER_ENV_C5 Envelope C5 162 x 229 mm", width: 162, height: 229 }),
        new PaperAndPaperSize({ paper: 29, explain: "DMPAPER_ENV_C3 Envelope C3 324 x 458 mm", width: 324, height: 458 }),
        new PaperAndPaperSize({ paper: 30, explain: "DMPAPER_ENV_C4 Envelope C4 229 x 324 mm", width: 229, height: 324 }),
        new PaperAndPaperSize({ paper: 31, explain: "DMPAPER_ENV_C6 Envelope C6 114 x 162 mm", width: 114, height: 162 }),
        new PaperAndPaperSize({ paper: 32, explain: "DMPAPER_ENV_C65 Envelope C65 114 x 229 mm", width: 114, height: 229 }),
        new PaperAndPaperSize({ paper: 33, explain: "DMPAPER_ENV_B4 Envelope B4 250 x 353 mm", width: 250, height: 353 }),
        new PaperAndPaperSize({ paper: 34, explain: "DMPAPER_ENV_B5 Envelope B5 176 x 250 mm", width: 176, height: 250 }),
        new PaperAndPaperSize({ paper: 35, explain: "DMPAPER_ENV_B6 Envelope B6 176 x 125 mm", width: 176, height: 125 }),
        new PaperAndPaperSize({ paper: 36, explain: "DMPAPER_ENV_ITALY Envelope 110 x 230 mm", width: 110, height: 230 }),
        new PaperAndPaperSize({ paper: 37, explain: "DMPAPER_ENV_MONARCH Envelope Monarch 3.875 x 7.5 in", width: InchToMM(3.875), height: InchToMM(7.5) }),
        new PaperAndPaperSize({ paper: 38, explain: "DMPAPER_ENV_PERSONAL 6 3/4 Envelope 3 5/8 x 6 1/2 in", width: InchToMM(3 + 5 / 8.0), height: InchToMM(6 + 1 / 2.0) }),
        new PaperAndPaperSize({ paper: 39, explain: "DMPAPER_FANFOLD_US US Std Fanfold 14 7/8 x 11 in", width: InchToMM(14 + 7 / 8.0), height: InchToMM(11) }),
        new PaperAndPaperSize({ paper: 40, explain: "DMPAPER_FANFOLD_STD_GERMAN German Std Fanfold 8 1/2 x 12 in", width: InchToMM(8.5), height: InchToMM(12) }),
        new PaperAndPaperSize({ paper: 41, explain: "DMPAPER_FANFOLD_LGL_GERMAN German Legal Fanfold 8 1/2 x 13 in", width: InchToMM(8.5), height: InchToMM(13) }),
        new PaperAndPaperSize({ paper: 42, explain: "DMPAPER_ISO_B4 B4 (ISO) 250 x 353 mm", width: 250, height: 353 }),
        new PaperAndPaperSize({ paper: 43, explain: "DMPAPER_JAPANESE_POSTCARD Japanese Postcard 100 x 148 mm", width: 100, height: 148 }),
        new PaperAndPaperSize({ paper: 44, explain: "DMPAPER_9X14 9 x 11 in", width: InchToMM(9), height: InchToMM(11) }),
        new PaperAndPaperSize({ paper: 45, explain: "DMPAPER_10X14 10 x 11 in", width: InchToMM(10), height: InchToMM(11) }),
        new PaperAndPaperSize({ paper: 46, explain: "DMPAPER_15X14 15 x 11 in", width: InchToMM(15), height: InchToMM(11) }),
        new PaperAndPaperSize({ paper: 47, explain: "DMPAPER_ENV_INVITE Envelope Invite 220 x 220 mm", width: 220, height: 220 }),
        new PaperAndPaperSize({ paper: 50, explain: "DMPAPER_LETTER_EXTRA Letter Extra 9 \\275 x 12 in", width: InchToMM(9), height: InchToMM(12) }),
        new PaperAndPaperSize({ paper: 51, explain: "DMPAPER_LEGAL_EXTRA Legal Extra 9 \\275 x 15 in", width: InchToMM(9), height: InchToMM(15) }),
        new PaperAndPaperSize({ paper: 52, explain: "DMPAPER_TABLOID_EXTRA Tabloid Extra 11.69 x 18 in", width: InchToMM(11.69), height: InchToMM(18) }),
        new PaperAndPaperSize({ paper: 53, explain: "DMPAPER_A4_EXTRA A4 Extra 9.27 x 12.69 in", width: InchToMM(9.27), height: InchToMM(12.69) }),
        new PaperAndPaperSize({ paper: 54, explain: "DMPAPER_LETTER_TRANSVERSE Letter Transverse 8 \\275 x 11 in", width: InchToMM(8), height: InchToMM(11) }),
        new PaperAndPaperSize({ paper: 55, explain: "DMPAPER_A4_TRANSVERSE A4 Transverse 210 x 297 mm", width: 210, height: 297 }),
        new PaperAndPaperSize({ paper: 56, explain: "DMPAPER_LETTER_EXTRA_TRANSVERSE Letter Extra Transverse 9\\275 x 12 in", width: InchToMM(9), height: InchToMM(12) }),
        new PaperAndPaperSize({ paper: 57, explain: "DMPAPER_A_PLUS SuperA/SuperA/A4 227 x 356 mm", width: 227, height: 356 }),
        new PaperAndPaperSize({ paper: 58, explain: "DMPAPER_B_PLUS SuperB/SuperB/A3 305 x 487 mm", width: 305, height: 487 }),
        new PaperAndPaperSize({ paper: 59, explain: "DMPAPER_LETTER_PLUS Letter Plus 8.5 x 12.69 in", width: InchToMM(8.5), height: InchToMM(12.69) }),
        new PaperAndPaperSize({ paper: 60, explain: "DMPAPER_A4_PLUS A4 Plus 210 x 330 mm", width: 210, height: 330 }),
        new PaperAndPaperSize({ paper: 61, explain: "DMPAPER_A5_TRANSVERSE A5 Transverse 148 x 210 mm", width: 148, height: 210 }),
        new PaperAndPaperSize({ paper: 62, explain: "DMPAPER_B5_TRANSVERSE B5 (JIS) Transverse 182 x 257 mm", width: 182, height: 257 }),
        new PaperAndPaperSize({ paper: 63, explain: "DMPAPER_A3_EXTRA A3 Extra 322 x 445 mm", width: 322, height: 445 }),
        new PaperAndPaperSize({ paper: 64, explain: "DMPAPER_A5_EXTRA A5 Extra 174 x 235 mm", width: 174, height: 235 }),
        new PaperAndPaperSize({ paper: 65, explain: "DMPAPER_B5_EXTRA B5 (ISO) Extra 201 x 276 mm", width: 201, height: 276 }),
        new PaperAndPaperSize({ paper: 66, explain: "DMPAPER_A2 A2 420 x 594 mm", width: 420, height: 594 }),
        new PaperAndPaperSize({ paper: 67, explain: "DMPAPER_A3_TRANSVERSE A3 Transverse 297 x 420 mm", width: 297, height: 420 }),
        new PaperAndPaperSize({ paper: 68, explain: "DMPAPER_A3_EXTRA_TRANSVERSE A3 Extra Transverse 322 x 445 mm", width: 322, height: 445 })
    ];

    setupContent();
    setValue();

    function setValue() {
        document.getElementById("input_leftMargin").value = Math.round(Comman.pixelsToMmm(cellSheet.printInfo.marginLeft) / 10 / scaleRate);
        document.getElementById("input_rightMargin").value = Math.round(Comman.pixelsToMmm(cellSheet.printInfo.marginRight) / 10 / scaleRate);
        document.getElementById("input_topMargin").value = Math.round(Comman.pixelsToMmm(cellSheet.printInfo.marginTop) / 10 / scaleRate);
        document.getElementById("input_bottomMargin").value = Math.round(Comman.pixelsToMmm(cellSheet.printInfo.marginBottom) / 10 / scaleRate);
    }

    function setupContent() {
        var confirmButtonId = parentInstanceName + "_pageSetConfirm";
        var s = "<style>"
            + ".page-set-table{ width:100%; height:95%; border-collapse: collapse; font-size:9pt; }"
            + ".page-set-table th{ border:1px solid #E2E8F0; width:80px; padding:8px; text-align:left; background-color:#F8FAFC; font-weight:500; color:#2D3748; height:36px; }"
            + ".page-set-table td{ border:1px solid #E2E8F0; padding:8px; height:36px; }"
            + ".page-set-textbox{ border:1px solid #E5E7EB; width:80px; font-size:9pt; padding:4px 8px; border-radius:4px; outline:none; transition:all 0.2s ease; }"
            + ".page-set-textbox:hover{ border-color:#C9CDD4; }"
            + ".page-set-textbox:focus{ border-color:#94A3B8; box-shadow:0 0 0 2px rgba(148,163,184,0.15); }"
            + ".page-set-button{ background-color:#F8FAFC; color:#4A5568; border:1px solid #E2E8F0; padding:6px 16px; border-radius:4px; font-size:9pt; cursor:pointer; transition:all 0.2s ease; }"
            + ".page-set-button:hover{ background-color:#E2E8F0; border-color:#CBD5E0; }"
            + ".page-set-select{ border:1px solid #E5E7EB; padding:4px 8px; border-radius:4px; font-size:9pt; outline:none; transition:all 0.2s ease; }"
            + ".page-set-select:hover{ border-color:#C9CDD4; }"
            + ".page-set-select:focus{ border-color:#94A3B8; box-shadow:0 0 0 2px rgba(148,163,184,0.15); }" 
            + ".page-set-textbox:disabled{ background-color:#F1F5F9; border-color:#E2E8F0; color:#94A3B8; }"
            + "</style>"
            + "<table class='page-set-table'>"
            + "<tr>"
            + "    <th>纸张</th><td id='td_paper' colspan='3'></td>"
            + "</tr>"
            + "<tr>"
            + "    <th>纸张方向</th><td colspan='3'><select id='select_paperOrientation' class='page-set-select'><option value=''></option><option value='0'>纵向</option><option value='1'>横向</option></select></td>"
            + "</tr>"
            + "<tr>"
            + "    <th>纸张长</th><td><input type=text id='input_paperHeight' class='page-set-textbox'/>mm</td><th>纸张宽</th><td><input type=text id='input_paperWidth' class='page-set-textbox'/>mm</td>"
            + "</tr>"
            + "<tr>"
            + "    <th>左边距</th><td><input type=text id='input_leftMargin' class='page-set-textbox'/>mm</td><th>右边距</th><td><input type='text' id='input_rightMargin' class='page-set-textbox'>mm</td>"
            + "</tr>"
            + "<tr>"
            + "    <th>上边距</th><td><input type=text id='input_topMargin' class='page-set-textbox'/>mm</td><th>下边距</th><td><input type='text' id='input_bottomMargin' class='page-set-textbox'>mm</td>"
            + "</tr>"
            + "<tr>"
            + "    <td colspan=4 style='text-align:center; padding:12px;'><input type='button' class='page-set-button' value='确定' id='" + confirmButtonId + "'/>&nbsp;&nbsp;<input type='button' class='page-set-button' value='取消' onclick='document.getElementById(\"div_pageSet\").parentElement.parentElement.removeChild(document.getElementById(\"div_pageSet\"));'/></td>"
            + "</tr>"
            + "</table>";
        mainDiv.innerHTML = s;
        document.getElementById("select_paperOrientation").onchange = function () {
            setPaperSize();
        };
        document.getElementById(confirmButtonId).onclick = function () {
            parentObj.pageSet_setValue();
        };
        // 修正取消按钮的点击事件
        var cancelButton = mainDiv.querySelector("input[value='取消']");
        if (cancelButton) {
            cancelButton.onclick = function () {
                win.close();
            };
        }
        setPaperList();
        setPaperValues();
    }

    function setPaperList() {
        var ar = [];
        ar.push("<select id='select_paper' class='page-set-select' onchange='setPaperSize()' style='width:100%;'>");
        for (var i = 0; i < paperAndPaperSizeList.length; i++) {
            var o = paperAndPaperSizeList[i];
            ar.push("<option value='" + i + "'>" + o["explain"] + "</option>");
        }
        ar.push("</select>");
        document.getElementById("td_paper").innerHTML = ar.join("");
    }

    function InchToMM(v) {
        return v * 25.4;
    }

    function setPaperValues() {
        var paperWidth = cellSheet.printInfo.paperWidth;
        var paperHeight = cellSheet.printInfo.paperHeight;
        var printOrient = cellSheet.printInfo.printOrient;
        document.getElementById("select_paperOrientation").value = printOrient;
        setPaper(paperWidth, paperHeight, printOrient);
    }

    function setPaper(paperWidth, paperHeight, printOrient) {
        var t1 = Math.round(paperWidth / scaleRate);
        var t2 = Math.round(paperHeight / scaleRate);        
        t1 = Comman.pixelsToMM(t1);
        t2 = Comman.pixelsToMM(t2);
        document.getElementById("input_paperWidth").value = t1;
        document.getElementById("input_paperHeight").value = t2;
        for (var i = 0; i < paperAndPaperSizeList.length; i++) {
            var o = paperAndPaperSizeList[i];
            var flag1 = Math.round(o.width) == Math.round(t1) && Math.round(o.height) == Math.round(t2);
            var flag2 = Math.round(o.height) == Math.round(t1) && Math.round(o.width) == Math.round(t2);
            if (flag1 || flag2) {
                document.getElementById("input_paperWidth").setAttribute("disabled", "disabled");
                document.getElementById("input_paperHeight").setAttribute("disabled", "disabled");
                document.getElementById("select_paper").value = i;
                return;
            }
        }
        document.getElementById("select_paper").value = "0";
        document.getElementById("input_paperWidth").removeAttribute("disabled");
        document.getElementById("input_paperHeight").removeAttribute("disabled");
    }

    function doJob() {

    }

    return {
        doJob: doJob
    }
}