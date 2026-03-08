'use strict';

/**
 * @fileoverview 消息提示控件2模块，提供窗口形式的消息提示
 * @module MyMsgEx2
 */

/**
 * 消息提示2类
 * @class
 * @param {Object} config - 配置对象
 * @param {string} config.parentId - 父元素ID
 * @param {HTMLElement} config.parentDiv - 父容器元素
 */
function MyMsgEx2(config) {
    var myWindowConfig = {
        id: "myMsgEx2_" + config.parentId,
        parent: config.parentDiv,
        width: 250,
        height: 100,
        topBorderHeight: 7,
        bottomBorderHeight: 15,
        leftBorderWidth: 10,
        rightBorderWidth: 12,       
        backgroundImage: getLocation() + "/images/FormulaTool/formulaCondition.png",
        isDrag: true
    };

    var outerWindow;
    var o = windowExManager.find(myWindowConfig.id);
    if (!o) {
        outerWindow = new MyWindowEx(myWindowConfig);
    }
    else {
        outerWindow = o.win;
    }
    outerWindow.setZIndex(10000000);
    outerWindow.hide();
    var mainDivWidth = myWindowConfig.width - myWindowConfig.leftBorderWidth - myWindowConfig.rightBorderWidth;
    var mainDivHeight = myWindowConfig.height - myWindowConfig.topBorderHeight - myWindowConfig.bottomBorderHeight;
    var titleDivHeight = 20;
    var buttonDivHeight = 20;
    var middleDivHeight = mainDivHeight - titleDivHeight - buttonDivHeight;
    var mainDiv = document.createElement("div");
    mainDiv.style.width = mainDivWidth + "px";
    mainDiv.style.height = mainDivHeight + "px";
    outerWindow.setWindowContent(mainDiv);

    var titleDiv = document.createElement("div");
    titleDiv.style.width = mainDivWidth + "px";
    titleDiv.style.height = titleDivHeight + "px";
    mainDiv.appendChild(titleDiv);

    var middleDiv = document.createElement("div");
    middleDiv.style.width = mainDivWidth + "px";
    middleDiv.style.height = middleDivHeight + "px";
    middleDiv.style.textAlign = "center";
    middleDiv.style.fontSize = "10pt";
    mainDiv.appendChild(middleDiv);

    var buttonDiv = document.createElement("div");
    buttonDiv.style.width = mainDivWidth + "px";
    buttonDiv.style.height = buttonDivHeight + "px";
    buttonDiv.style.position = "absolute";
    buttonDiv.style.left = "0px";
    buttonDiv.style.bottom = "0px";    
    mainDiv.appendChild(buttonDiv);

    setupConfirmButton();

    function setupConfirmButton() {
        var buttonConfig = {
            parentDiv: buttonDiv,
            backgroundColor: "#CAFFFF",
            width: 40,
            height: 20,
            onclick: function () {
                close();
            }
        };
        var o = new MyButtonEx(buttonConfig);
        var t1 = o.getEl();
        t1.style.position = "absolute";
        t1.style.left = (mainDivWidth - 40) / 2 + "px";
        t1.style.top = (buttonDivHeight - 20) / 2 + "px";
        t1.style.fontSize = "10pt";
        t1.style.color = "red";
        t1.style.border = "1px solid #CAFFFF";
        t1.innerText = "确定";
    }

    function close() {
        outerWindow.hide();
    }

    function showMsg(title, s, paddingTop) {
        titleDiv.innerHTML = title;
        middleDiv.innerHTML = s;
        middleDiv.style.paddingTop = paddingTop;
        outerWindow.show();
    }

    return {
        showMsg: showMsg
    }
}