'use strict';

/**
 * @fileoverview 打印预览模块，提供PDF打印预览功能
 * @module PrintPreviewClass
 */

/**
 * 打印预览类
 * @class
 * @param {Object} config - 配置对象
 * @param {string} config.pdfUrl - PDF文件URL
 */
function PrintPreviewClass(config) {
    var pdfUrl = config.pdfUrl;
    var id = "div_printPreview";
    var el = document.getElementById(id);
    if (el) {
        document.body.removeChild(el);
    }
    el = document.createElement("div");
    el.setAttribute("id", id);
    var w = 841;
    var h = 952;
    if (h > document.body.clientHeight) {
        h = document.body.clientHeight;
    }
    el.style.position = "absolute";
    el.style.left = (document.body.clientWidth - w) / 2 + "px";
    el.style.top = (document.body.clientHeight - h) / 2 + "px";
    el.style.width = w + "px";
    el.style.height = h + "px";
    el.setAttribute("class", "shadow");
    document.body.appendChild(el);

    var el1 = document.createElement("div");
    el1.style.width = "100%";
    el1.style.height = "30px"
    el1.style.backgroundColor = "silver";    
    el.appendChild(el1);

    var el3 = document.createElement("input");
    el3.setAttribute("type", "button");
    el3.setAttribute("value", "关闭");
    el3.style.float = "right";
    el3.style.marginTop = "5px";
    el3.style.marginRight = "3px";
    el3.style.height = "20px";
    el3.onclick = function (e) {
        document.body.removeChild(el);
    };
    el1.appendChild(el3);

    var el2 = document.createElement("iframe");
    el2.style.width = "100%";
    el2.style.height = (h - 30) + "px";
    el2.setAttribute("border", "0");
    el2.setAttribute("src", pdfUrl);
    el.appendChild(el2);

    function doJob() {

    }

    return {
        doJob: doJob
    };
}