'use strict';

/**
 * @fileoverview 拖拽控件模块，提供元素的拖拽移动功能
 * @module Drag
 */

/**
 * 拖拽类
 * @class
 * @param {HTMLElement} dragItem - 可拖拽的元素
 * @param {HTMLElement} container - 容器元素
 * @param {Function} onDragAddtionalDo - 拖拽时的额外回调函数
 */
function Drag(dragItem, container, onDragAddtionalDo) {
    // 用于记录鼠标按下时的坐标与div当前的坐标  
    let active = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    // 鼠标按下事件  
    dragItem.addEventListener('mousedown', function (e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        active = true;
    });

    // 鼠标移动事件  
    container.addEventListener('mousemove', function (e) {
        if (active) {

            e.preventDefault(); // 阻止默认事件，比如选中文本  

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, dragItem);
            if (onDragAddtionalDo)
                onDragAddtionalDo(xOffset, yOffset);
        }
    });

    // 鼠标放开事件  
    container.addEventListener('mouseup', function () {
        initialX = currentX;
        initialY = currentY;

        active = false;
    });

    // 用于设置div的位置  
    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;        
    }
}