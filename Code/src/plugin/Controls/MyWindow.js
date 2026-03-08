/**
 * 自定义窗口控件
 * 提供可拖动、可关闭的窗口组件
 */
"use strict";

/**
 * 自定义窗口构造函数
 * @param {Object} config - 配置对象
 * @param {string} config.id - 窗口ID
 * @param {HTMLElement} config.parent - 父容器元素
 * @param {number} config.width - 窗口宽度
 * @param {number} config.height - 窗口高度
 * @param {string} config.title - 窗口标题
 * @param {boolean} [config.isDrag] - 是否可拖动
 * @param {string} [config.align] - 对齐方式
 */
function MyWindow(config) {
    var mainDiv, titleDiv, middleDiv;

    doJob();

    /**
     * 设置窗口内容
     * @param {HTMLElement} content - 内容元素
     */
    this.setWindowContent = function (content) {
        middleDiv.innerHTML = "";
        middleDiv.appendChild(content);
    };

    /**
     * 显示窗口
     */
    this.show = function () {
        mainDiv.style.display = "";
    };

    /**
     * 关闭窗口
     */
    this.close = function () {
        mainDiv.parentElement.removeChild(mainDiv);
    };

    /**
     * 初始化窗口
     */
    function doJob() {
        mainDiv = document.createElement("div");
        mainDiv.setAttribute("id", config.id);
        setMainDivProps();

        titleDiv = document.createElement("div");
        titleDiv.style.width = "100%";
        titleDiv.style.height = "32px";
        titleDiv.style.lineHeight = "32px";
        titleDiv.style.backgroundColor = "#F8FAFC";
        titleDiv.style.display = "flex";
        titleDiv.style.alignItems = "center";
        titleDiv.style.borderTopLeftRadius = "4px";
        titleDiv.style.borderTopRightRadius = "4px";
        titleDiv.style.border = "1px solid #E2E8F0";
        titleDiv.style.borderBottom = "none";
        setTitleIcon();
        setTitle();
        setCloseButton();
        mainDiv.appendChild(titleDiv);

        middleDiv = document.createElement("div");
        setMiddleDivProps();
        mainDiv.appendChild(middleDiv);

        config.parent.appendChild(mainDiv);

        if (config.isDrag) {
            new Drag3(titleDiv, mainDiv, config.parent);
        }
    }

    /**
     * 设置关闭按钮
     */
    function setCloseButton() {
        var closeButton = document.createElement('div');
        closeButton.style.cursor = 'pointer';
        closeButton.style.width = '32px';
        closeButton.style.height = '32px';
        closeButton.style.display = 'flex';
        closeButton.style.alignItems = 'center';
        closeButton.style.justifyContent = 'center';
        closeButton.style.color = '#4A5568';
        closeButton.style.fontSize = '14px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.transition = 'background-color 0.2s ease';
        closeButton.innerHTML = '×';
        closeButton.onmouseover = function() {
            closeButton.style.backgroundColor = '#E2E8F0';
        };
        closeButton.onmouseout = function() {
            closeButton.style.backgroundColor = 'transparent';
        };
        titleDiv.appendChild(closeButton);
        closeButton.onclick = function (e) {
            mainDiv.parentElement.removeChild(mainDiv);
        };
    }

    /**
     * 设置标题
     */
    function setTitle() {
        var titleElement = document.createElement('div');
        titleElement.style.flex = '1';
        titleElement.style.height = '32px';
        titleElement.style.lineHeight = '32px';
        titleElement.style.fontSize = '10pt';
        titleElement.style.fontWeight = '500';
        titleElement.style.color = "#2D3748";
        titleElement.innerText = config.title;
        titleDiv.appendChild(titleElement);
    }

    /**
     * 设置标题图标
     */
    function setTitleIcon() {
        var iconElement = document.createElement('div');
        iconElement.style.width = '16px';
        iconElement.style.height = '16px';
        iconElement.style.marginLeft = '12px';
        iconElement.style.marginRight = '8px';
        iconElement.style.overflow = 'hidden';
        iconElement.style.background = 'url("data:image/gif;base64,R0lGODlhDQANAKIAAAAAAP///1CByW2d153K7f///wAAAAAAACH5BAEAAAUALAAAAAANAA0AAAMkKLrM9DCSRlm4OAcVhh/dtwlayX0gOpbaKaoci7leWMfyWDUJADs=") no-repeat center center';
        titleDiv.appendChild(iconElement);
    }

    /**
     * 设置中间内容区域属性
     */
    function setMiddleDivProps() {
        middleDiv.style.width = "100%";
        middleDiv.style.height = "calc(100% - 32px)";
        middleDiv.style.padding = "1px";
        middleDiv.style.boxSizing = "border-box";
    }

    /**
     * 设置主容器属性
     */
    function setMainDivProps() {
        mainDiv.style.width = config.width + "px";
        //mainDiv.style.height = config.height + "px";
        mainDiv.style.margin = "0px";
        mainDiv.style.padding = "0px";
        mainDiv.style.backgroundColor = "#fff";
        mainDiv.style.border = "1px solid #E2E8F0";
        mainDiv.style.borderRadius = "4px";
        mainDiv.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        mainDiv.style.zIndex = 99999;
        mainDiv.style.overflow = "hidden";

        var parentWidth = config.parent.clientWidth;
        var parentHeight = config.parent.clientHeight;

        if (config.align == "center-top") {
            mainDiv.style.position = "absolute";
            mainDiv.style.left = (parentWidth - config.width) / 2 + "px";
        } else {
            mainDiv.style.position = "absolute";
            mainDiv.style.left = (parentWidth - config.width) / 2 + "px";
            mainDiv.style.top = (parentHeight - config.height) / 2 + "px";
        }
    }
}