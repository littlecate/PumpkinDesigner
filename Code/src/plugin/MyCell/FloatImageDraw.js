'use strict';

/**
 * @fileoverview 浮动图片绘制模块，提供浮动图片的管理和交互功能
 * @module FloatImageDraw
 */

/**
 * 浮动图片管理器
 * @namespace FloatImageManager
 */
let FloatImageManager = {};

/**
 * 浮动图片对象列表
 * @type {Array}
 */
FloatImageManager.Objs = [];
let closeButtonImage = "data:image/png;base64,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";
FloatImageManager.Add = function (o) {
    FloatImageManager.Objs.Add(o);
}
FloatImageManager.DeleteByFloatImageIndex = function (floatImageIndex) {
    for (var i = FloatImageManager.Objs.length - 1; i >= 0; i--) {
        var t = FloatImageManager.Objs[i];        
        if (t.getFloatImageIndex() == floatImageIndex) {
            FloatImageManager.Objs.splice(i, 1);
            t.destroy();
        }
        t = null;
        //delete t;        
    }
}

FloatImageManager.Clear = function () {
    for (var i = FloatImageManager.Objs.length - 1; i >= 0; i--) {
        var t = FloatImageManager.Objs[i];
        t.destroy();
        FloatImageManager.Objs.splice(i, 1);
        t = null;
        //delete t;
    }
    FloatImageManager.Objs = [];
}

FloatImageManager.Find = function (fn) {
    return FloatImageManager.Objs.Find(fn);
}

FloatImageManager.ClearAllHandlerMarks = function () {
    for (var i = 0; i < FloatImageManager.Objs.length; i++) {
        FloatImageManager.Objs[i].clearControlMarks();
    }
}

function FloatImageDraw(config) {
    var parentObj = config.parentObj;
    var parentEl = config.parentEl;
    var imageData = config.imageData;
    var floatImage = config.floatImage;
    var xRect = config.xRect;

    var controlMarks = [];

    var div = document.createElement("div");
    div.style.width = floatImage.width + "px";
    div.style.height = floatImage.height + "px";
    div.style.position = "absolute";
    div.style.left = xRect.GetX() + "px";
    div.style.top = xRect.GetY() + "px";
    parentEl.appendChild(div);
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", floatImage.width + "px");
    canvas.setAttribute("height", floatImage.height + "px");
    canvas.style.width = floatImage.width + "px"
    canvas.style.height = floatImage.height + "px";    
    div.appendChild(canvas);
    var ctx = canvas.getContext("2d", { willReadFrequently: false });
    try {
        ctx.drawImage(imageData, 0, 0, floatImage.width, floatImage.height);
    } catch (e) {        
        //console.log(e);
    }

    let handlerImage = "data:image/png;base64,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";

    new Drag2(div, parentEl, onDragAddtionalDoA);

    function onDragAddtionalDoA(deltaX, deltaY) {
        div.style.left = Number(div.style.left.replace("px", "")) + deltaX + "px";
        div.style.top = Number(div.style.top.replace("px", "")) + deltaY + "px";
        floatImage.xpos = Number(div.style.left.replace("px", ""));
        floatImage.ypos = Number(div.style.top.replace("px", ""));
    }

    canvas.onmousedown = function (e) {
        parentObj.deSelectRect();
        clearControlMarks();
        drawHandler();
    }

    function clearControlMarks() {
        for (var i = 0; i < controlMarks.length; i++) {
            controlMarks[i].parentElement.removeChild(controlMarks[i]);
        }
        controlMarks = [];
    }

    let leftHandler, topHandler, rightHandler, bottomHandler;
    let controlHandler1, controlHandler2, controlHandler3, controlHandler4,
        controlHandler5, controlHandler6, controlHandler7, controlHandler8;
    function drawHandler() {
        leftHandler = drawLeftHandler();
        topHandler = drawTopHandler();
        rightHandler = drawRightHandler();
        bottomHandler = drawBottomHandler();
        controlHandler1 = drawControlHandler1();
        controlHandler2 = drawControlHandler2();
        controlHandler3 = drawControlHandler3();
        controlHandler4 = drawControlHandler4();
        controlHandler5 = drawControlHandler5();
        controlHandler6 = drawControlHandler6();
        controlHandler7 = drawControlHandler7();
        controlHandler8 = drawControlHandler8();
        drawDeleteButton();
    }

    function drawDeleteButton() {
        var deleteButtonConfig = {
            parentDiv: div,
            backgroundImage: closeButtonImage,
            width: 20,
            height: 20,
            onclick: function () {
                if (confirm("删除浮动图片?"))
                    parentObj.deleteFloatImage(floatImage);
            }
        };
        var t1 = new MyButtonEx(deleteButtonConfig).getEl();
        t1.style.position = "absolute";
        t1.style.top = "8px";
        t1.style.right = "8px";
        controlMarks.push(t1);
    }

    function drawControlHandler1() {
        var t1 = document.createElement("div");
        t1.style.width = "15px";
        t1.style.height = "15px";
        t1.style.position = "absolute";
        t1.style.left = "-7px";
        t1.style.top = "-7px";
        t1.style.backgroundImage = "url(" + handlerImage + ")";
        t1.onmouseover = function (e) {
            t1.style.cursor = "nw-resize";
        }
        t1.onmouseout = function (e) {
            t1.style.cursor = "default";
        }
        t1.addEventListener("mousedown", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        new Drag2(t1, parentEl, onDragAddtionalDo1);
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function onDragAddtionalDo1(deltaX, deltaY) {
        div.style.left = Number(div.style.left.replace("px", "")) + deltaX + "px";
        div.style.top = Number(div.style.top.replace("px", "")) + deltaY + "px";
        div.style.width = Number(div.style.width.replace("px", "")) + (-deltaX) + "px";
        div.style.height = Number(div.style.height.replace("px", "")) + (-deltaY) + "px";
        redrawSomething();
    }

    function redrawSomething() {
        floatImage.xpos = Number(div.style.left.replace("px", ""));
        floatImage.ypos = Number(div.style.top.replace("px", ""));
        floatImage.width = Number(div.style.width.replace("px", ""));
        floatImage.height = Number(div.style.height.replace("px", ""));
        canvas.setAttribute("width", floatImage.width + "px");
        canvas.setAttribute("height", floatImage.height + "px");
        canvas.style.width = floatImage.width + "px";
        canvas.style.height = floatImage.height + "px";
        ctx.clearRect(0, 0, floatImage.width, floatImage.height);
        ctx.drawImage(imageData, 0, 0, floatImage.width, floatImage.height);
        controlHandler2.style.left = floatImage.width / 2 - 7 + "px";
        controlHandler3.style.left = floatImage.width - 7 + "px";
        controlHandler4.style.top = floatImage.height / 2 - 7 + "px";
        controlHandler5.style.top = floatImage.height - 7 + "px";
        controlHandler6.style.left = floatImage.width / 2 - 7 + "px";
        controlHandler6.style.top = floatImage.height - 7 + "px";
        controlHandler7.style.left = floatImage.width - 7 + "px";
        controlHandler7.style.top = floatImage.height - 7 + "px";
        controlHandler8.style.left = floatImage.width - 7 + "px";
        controlHandler8.style.top = floatImage.height / 2 - 7 + "px";
        leftHandler.style.height = floatImage.height + "px";
        topHandler.style.width = floatImage.width + "px";
        rightHandler.style.height = floatImage.height + "px";
        rightHandler.style.left = floatImage.width + "px";
        bottomHandler.style.width = floatImage.width + "px";
        bottomHandler.style.top = floatImage.height + "px";
    }

    function drawControlHandler2() {
        var t1 = document.createElement("div");
        t1.style.width = "15px";
        t1.style.height = "15px";
        t1.style.position = "absolute";
        t1.style.left = floatImage.width / 2 - 7 + "px";
        t1.style.top = "-7px";
        t1.style.backgroundImage = "url(" + handlerImage + ")";
        t1.onmouseover = function (e) {
            t1.style.cursor = "n-resize";
        }
        t1.onmouseout = function (e) {
            t1.style.cursor = "default";
        }
        t1.addEventListener("mousedown", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        new Drag2(t1, parentEl, onDragAddtionalDo2);
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function onDragAddtionalDo2(deltaX, deltaY) {
        deltaX = 0;
        div.style.left = Number(div.style.left.replace("px", "")) + deltaX + "px";
        div.style.top = Number(div.style.top.replace("px", "")) + deltaY + "px";
        div.style.width = Number(div.style.width.replace("px", "")) + (-deltaX) + "px";
        div.style.height = Number(div.style.height.replace("px", "")) + (-deltaY) + "px";
        redrawSomething();
    }

    function drawControlHandler3() {
        var t1 = document.createElement("div");
        t1.style.width = "15px";
        t1.style.height = "15px";
        t1.style.position = "absolute";
        t1.style.left = floatImage.width - 7 + "px";
        t1.style.top = "-7px";
        t1.style.backgroundImage = "url(" + handlerImage + ")";
        t1.onmouseover = function (e) {
            t1.style.cursor = "ne-resize";
        }
        t1.onmouseout = function (e) {
            t1.style.cursor = "default";
        }
        t1.addEventListener("mousedown", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        new Drag2(t1, parentEl, onDragAddtionalDo3);
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function onDragAddtionalDo3(deltaX, deltaY) {
        div.style.left = Number(div.style.left.replace("px", "")) + 0 + "px";
        div.style.top = Number(div.style.top.replace("px", "")) + deltaY + "px";
        div.style.width = Number(div.style.width.replace("px", "")) + deltaX + "px";
        div.style.height = Number(div.style.height.replace("px", "")) + (-deltaY) + "px";
        redrawSomething();
    }

    function drawControlHandler4() {
        var t1 = document.createElement("div");
        t1.style.width = "15px";
        t1.style.height = "15px";
        t1.style.position = "absolute";
        t1.style.left = - 7 + "px";
        t1.style.top = floatImage.height / 2 - 7 + "px";
        t1.style.backgroundImage = "url(" + handlerImage + ")";
        t1.onmouseover = function (e) {
            t1.style.cursor = "w-resize";
        }
        t1.onmouseout = function (e) {
            t1.style.cursor = "default";
        }
        t1.addEventListener("mousedown", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        new Drag2(t1, parentEl, onDragAddtionalDo4);
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function onDragAddtionalDo4(deltaX, deltaY) {
        deltaY = 0;
        div.style.left = Number(div.style.left.replace("px", "")) + deltaX + "px";
        div.style.top = Number(div.style.top.replace("px", "")) + deltaY + "px";
        div.style.width = Number(div.style.width.replace("px", "")) + (-deltaX) + "px";
        div.style.height = Number(div.style.height.replace("px", "")) + deltaY + "px";
        redrawSomething();
    }

    function drawControlHandler5() {
        var t1 = document.createElement("div");
        t1.style.width = "15px";
        t1.style.height = "15px";
        t1.style.position = "absolute";
        t1.style.left = - 7 + "px";
        t1.style.top = floatImage.height - 7 + "px";
        t1.style.backgroundImage = "url(" + handlerImage + ")";
        t1.onmouseover = function (e) {
            t1.style.cursor = "sw-resize";
        }
        t1.onmouseout = function (e) {
            t1.style.cursor = "default";
        }
        t1.addEventListener("mousedown", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        new Drag2(t1, parentEl, onDragAddtionalDo5);
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function onDragAddtionalDo5(deltaX, deltaY) {
        div.style.left = Number(div.style.left.replace("px", "")) + deltaX + "px";
        div.style.top = Number(div.style.top.replace("px", "")) + 0 + "px";
        div.style.width = Number(div.style.width.replace("px", "")) + (-deltaX) + "px";
        div.style.height = Number(div.style.height.replace("px", "")) + deltaY + "px";
        redrawSomething();
    }

    function drawControlHandler6() {
        var t1 = document.createElement("div");
        t1.style.width = "15px";
        t1.style.height = "15px";
        t1.style.position = "absolute";
        t1.style.left = floatImage.width / 2 - 7 + "px";
        t1.style.top = floatImage.height - 7 + "px";
        t1.style.backgroundImage = "url(" + handlerImage + ")";
        t1.onmouseover = function (e) {
            t1.style.cursor = "s-resize";
        }
        t1.onmouseout = function (e) {
            t1.style.cursor = "default";
        }
        t1.addEventListener("mousedown", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        new Drag2(t1, parentEl, onDragAddtionalDo6);
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function onDragAddtionalDo6(deltaX, deltaY) {
        div.style.left = Number(div.style.left.replace("px", "")) + 0 + "px";
        div.style.top = Number(div.style.top.replace("px", "")) + 0 + "px";
        div.style.width = Number(div.style.width.replace("px", "")) + 0 + "px";
        div.style.height = Number(div.style.height.replace("px", "")) + deltaY + "px";
        redrawSomething();
    }

    function drawControlHandler7() {
        var t1 = document.createElement("div");
        t1.style.width = "15px";
        t1.style.height = "15px";
        t1.style.position = "absolute";
        t1.style.left = floatImage.width - 7 + "px";
        t1.style.top = floatImage.height - 7 + "px";
        t1.style.backgroundImage = "url(" + handlerImage + ")";
        t1.onmouseover = function (e) {
            t1.style.cursor = "se-resize";
        }
        t1.onmouseout = function (e) {
            t1.style.cursor = "default";
        }
        t1.addEventListener("mousedown", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        new Drag2(t1, parentEl, onDragAddtionalDo7);
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function onDragAddtionalDo7(deltaX, deltaY) {
        div.style.left = Number(div.style.left.replace("px", "")) + 0 + "px";
        div.style.top = Number(div.style.top.replace("px", "")) + 0 + "px";
        div.style.width = Number(div.style.width.replace("px", "")) + deltaX + "px";
        div.style.height = Number(div.style.height.replace("px", "")) + deltaY + "px";
        redrawSomething();
    }

    function drawControlHandler8() {
        var t1 = document.createElement("div");
        t1.style.width = "15px";
        t1.style.height = "15px";
        t1.style.position = "absolute";
        t1.style.left = floatImage.width - 7 + "px";
        t1.style.top = floatImage.height / 2 - 7 + "px";
        t1.style.backgroundImage = "url(" + handlerImage + ")";
        t1.onmouseover = function (e) {
            t1.style.cursor = "e-resize";
        }
        t1.onmouseout = function (e) {
            t1.style.cursor = "default";
        }
        t1.addEventListener("mousedown", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        new Drag2(t1, parentEl, onDragAddtionalDo8);
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function onDragAddtionalDo8(deltaX, deltaY) {
        div.style.left = Number(div.style.left.replace("px", "")) + 0 + "px";
        div.style.top = Number(div.style.top.replace("px", "")) + 0 + "px";
        div.style.width = Number(div.style.width.replace("px", "")) + deltaX + "px";
        div.style.height = Number(div.style.height.replace("px", "")) + 0 + "px";
        redrawSomething();
    }

    function drawLeftHandler() {
        var t1 = document.createElement("div");
        t1.style.width = 2 + "px";
        t1.style.height = floatImage.height + "px";
        t1.style.position = "absolute";
        t1.style.left = "0px";
        t1.style.top = "0px";
        t1.style.backgroundColor = "blue";
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function drawTopHandler() {
        var t1 = document.createElement("div");
        t1.style.width = floatImage.width + "px";
        t1.style.height = 2 + "px";
        t1.style.position = "absolute";
        t1.style.left = "0px";
        t1.style.top = "0px";
        t1.style.backgroundColor = "blue";
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function drawRightHandler() {
        var t1 = document.createElement("div");
        t1.style.width = 2 + "px";
        t1.style.height = floatImage.height + "px";
        t1.style.position = "absolute";
        t1.style.left = floatImage.width + "px";
        t1.style.top = "0px";
        t1.style.backgroundColor = "blue";
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function drawBottomHandler() {
        var t1 = document.createElement("div");
        t1.style.width = floatImage.width + "px";
        t1.style.height = 2 + "px";
        t1.style.position = "absolute";
        t1.style.left = "0px";
        t1.style.top = floatImage.height + "px";
        t1.style.backgroundColor = "blue";
        div.appendChild(t1);
        controlMarks.push(t1);
        return t1;
    }

    function getFloatImageIndex() {
        return floatImage.index;
    }

    function destroy() {
        div.parentElement.removeChild(div);
    }

    return {
        getFloatImageIndex: getFloatImageIndex,
        clearControlMarks: clearControlMarks,
        destroy: destroy
    }
}