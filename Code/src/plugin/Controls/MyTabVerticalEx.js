'use strict';

/**
 * @fileoverview 垂直标签页控件模块，提供垂直布局的标签页组件
 * @module MyTabVerticalEx
 */

/**
 * 垂直标签页类
 * @class
 * @param {Object} config - 配置对象
 * @param {Array} config.tabs - 标签页配置数组
 * @param {Object} myWindowConfig - 窗口配置对象
 */
function MyTabVerticalEx(config, myWindowConfig) {
    var mainDiv, selectedTab;    
    var tabsAr = [];    

    doJob();
    function doJob() {
        var t = document.getElementById(myWindowConfig.id);
        if (t) {
            t.parentElement.removeChild(t);
        }        
        var myWindow = new MyWindowEx(myWindowConfig);

        mainDiv = document.createElement("div");
        mainDiv.style.width = "100%";
        mainDiv.style.height = "100%";
        mainDiv.style.margin = "0px";
        mainDiv.style.padding = "0px";
        mainDiv.style.textAlign = "center";
        myWindow.setWindowContent(mainDiv);

        setTabs();
    }

    function setTabs() {
        var tAr = config.tabs;
        for (var i = 0; i < tAr.length; i++) {
            var t = tAr[i];
            var t1 = new OneTab(t);
            tabsAr.push(t1);
        }        
    }

    function OneTab(t) {
        let me = this;
        this.id = t.id;
        this.hint = t.hint;
        var t1 = document.createElement("div");
        t1.style.width = t.width + "px";
        t1.style.height = t.height + "px";
        t1.style.marginTop = (t.marginTop + "px") || "0px";
        t1.style.position = "relative";
        mainDiv.appendChild(t1);

        var canvas = document.createElement("canvas");
        canvas.setAttribute("width", t.width + "px");
        canvas.setAttribute("height", t.height + "px");
        canvas.style.width = t.width + "px";
        canvas.style.height = t.height + "px";
        t1.appendChild(canvas);

        var t2;

        this.drawHint = function () {
            t2 = document.createElement("div");
            var hintWidth = 100;
            t2.style.width = hintWidth + "px";
            t2.style.height = t.height + "px";
            t2.style.position = "absolute";
            t2.style.top = "0px";
            t2.style.left = (- hintWidth) + "px";
            t2.style.backgroundColor = "#EDF2FA";
            t2.style.textAlign = "center";
            t2.style.color = "red";
            t2.style.display = "none";
            t2.innerHTML = this.hint;
            t1.appendChild(t2);
            return t2;
        }

        if (this.hint) {
            this.hintEl = this.drawHint();
        }

        var ctx = canvas.getContext("2d", { willReadFrequently: false });

        var imageData2;
        var imageData3;

        if (t.backgroundImage) {
            var image = new Image();
            image.onload = function () {
                doJob();
            }
            image.src = t.backgroundImage;
        }
        else {
            doJob();
        }

        function doJob() {
            draw1();
            imageData2 = Comman.getBrightnessImageData(ctx, canvas, 1.2);
            imageData3 = Comman.getBrightnessImageData(ctx, canvas, 1.5);
            t1.onmouseover = function () {
                if (!isSelected()) {
                    draw2();
                }
                showHint();
            }
            t1.onmouseout = function () {
                if (!isSelected()) {
                    draw1();
                }
                hideHint();
            }
        }

        function showHint() {
            if (t2)
                t2.style.display = "";
        }

        function hideHint() {
            if (t2)
                t2.style.display = "none";
        }

        function draw1() {
            if (t.backgroundImage)
                ctx.drawImage(image, 0, 0);
            else {
                ctx.fillStyle = t.backgroundColor || 'rgb(169, 169, 169)'; // 或者使用十六进制 '#a9a9a9'  
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        function draw2() {
            ctx.putImageData(imageData2, 0, 0);
        }

        function draw3() {
            ctx.putImageData(imageData3, 0, 0);
        }

        t1.onclick = function () {
            if (!isSelected()) {
                selectedTab && selectedTab.unMarkTabSelected();
                me.markTabSelected();
            }
            selectedTab = me;
            me.onClickDo();
        }

        this.onClickDo = function () {
            if (!t.onclick) {
                return;
            }
            t.onclick(me);
        }

        function isSelected() {
            if (!selectedTab)
                return false;
            return selectedTab.id == me.id;
        }

        this.unMarkTabSelected = function () {
            draw1();
        }

        this.markTabSelected = function () {
            draw3();
        }
    }

    this.hide = function () {
        mainDiv.style.display = "none";
    }

    this.show = function () {
        mainDiv.style.display = "";
    }

    this.updateHint = function (id, s) {        
        var o = tabsAr.Find(function (p) { return p.id == id; });
        if (o == null) {
            return;
        }
        o.hint = s;
        if (o.hintEl) {
            o.hintEl.innerHTML = s;
        }
        else {
            o.hintEl = o.drawHint();
        }
    }
}
