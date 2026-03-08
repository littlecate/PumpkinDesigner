'use strict';

/**
 * @fileoverview 拖拽控件2模块，提供基于增量位置的拖拽功能
 * @module Drag2
 */

/**
 * 拖拽2类
 * @class
 * @param {HTMLElement} dragItem - 可拖拽的元素
 * @param {HTMLElement} container - 容器元素
 * @param {Function} onDragAddtionalDo - 拖拽时的回调函数，参数为(deltaX, deltaY)
 */
function Drag2(dragItem, container, onDragAddtionalDo) {
    // 用于记录鼠标按下时的坐标与div当前的坐标  
    let active = false;    
    let initialX;
    let initialY;
    
    // 鼠标按下事件  
    dragItem.addEventListener('mousedown', function (e) {
        initialX = e.clientX;
        initialY = e.clientY;

        active = true;
    });

    // 鼠标移动事件  
    container.addEventListener('mousemove', function (e) {
        if (active) {

            e.preventDefault(); // 阻止默认事件，比如选中文本  

            let deltaX = e.clientX - initialX;
            let deltaY = e.clientY - initialY;            

            initialX = e.clientX;
            initialY = e.clientY;

            onDragAddtionalDo(deltaX, deltaY);
        }
    });

    // 鼠标放开事件  
    container.addEventListener('mouseup', function () {        
        active = false;
    });    
}