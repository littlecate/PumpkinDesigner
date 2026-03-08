'use strict';

/**
 * @fileoverview 消息提示控件模块，提供滑动动画效果的消息提示
 * @module MyMsgEx
 */

/**
 * 消息提示类
 * @class
 * @param {Object} config - 配置对象
 * @param {HTMLElement} config.slidingDiv - 滑动的div元素
 * @param {number} config.distanceX - X方向移动距离
 * @param {number} config.distanceY - Y方向移动距离
 * @param {number} config.duration - 动画持续时间（毫秒）
 */
function MyMsgEx(config) {
    var slidingDiv = config.slidingDiv;
    var startX = Number(slidingDiv.style.left.replace("px", ""));
    var startY = Number(slidingDiv.style.top.replace("px", ""));
    var endX = startX + config.distanceX; // 目标X坐标  
    var endY = startY - config.distanceY; // 目标Y坐标  

    // 定义滑动动画的持续时间（以毫秒为单位）  
    var duration = config.duration;

    function setMsg(s) {
        slidingDiv.innerHTML = s;
    }

    function slideOut() {
        // 计算每一帧需要移动的距离（假设每秒60帧）  
        var frames = duration / (1000 / 60);
        var deltaX = (endX - startX) / frames;
        var deltaY = (endY - startY) / frames;

        var frameCount = 0;

        // 使用requestAnimationFrame来执行动画  
        function animate() {
            if (frameCount < frames) {
                slidingDiv.style.left = (endX - frameCount * deltaX) + 'px';
                slidingDiv.style.top = (endY - frameCount * deltaY) + 'px';

                frameCount++;

                // 请求下一帧  
                requestAnimationFrame(animate);
            }
            else {
                slidingDiv.style.display = "none";
            }
        }

        // 开始动画  
        requestAnimationFrame(animate);
    }

    function slideIn() {
        slidingDiv.style.display = "";
        // 计算每一帧需要移动的距离（假设每秒60帧）  
        var frames = duration / (1000 / 60);
        var deltaX = (endX - startX) / frames;
        var deltaY = (endY - startY) / frames;

        var frameCount = 0;
        var startTime = new Date();

        // 使用requestAnimationFrame来执行动画  
        function animate() {
            if (frameCount < frames) {
                slidingDiv.style.left = (startX + frameCount * deltaX) + 'px';
                slidingDiv.style.top = (startY + frameCount * deltaY) + 'px';

                frameCount++;

                // 请求下一帧  
                requestAnimationFrame(animate);
            }
            else if (new Date() - startTime < duration + 3000) {
                // 请求下一帧  
                requestAnimationFrame(animate);
            }
            else {
                slideOut();
            }
        }

        // 开始动画  
        requestAnimationFrame(animate);
    }

    return {
        slideIn: slideIn,
        slideOut: slideOut,
        setMsg: setMsg
    }
}