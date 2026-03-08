'use strict';

/**
 * @fileoverview 插入背景图模块，提供设置背景图的对话框功能
 * @module InsertBackImageClass
 */

/**
 * 插入背景图类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {Object} config.parentEl - 父元素
 * @param {string} config.instanceId - 实例ID
 */
function InsertBackImageClass(config) {
  let parentObj = config.parentObj;
  let parentEl = config.parentEl;
  let instanceId = config.instanceId;
  let imagePlaceType = 0;

  let windowId = "div_insert_back_image_" + instanceId;

  var windowDiv = document.getElementById(windowId);
  if (windowDiv) {
    windowDiv.parentElement.removeChild(windowDiv);
  }

  let win = new MyWindow({
    id: windowId,
    parent: parentEl.parentElement,
    isDrag: true,
    width: 350,
    height: 240,
    title: "插入背景图",
  });

  let el = document.createElement("div");
  win.setWindowContent(el);
  el.style.width = "100%";
  el.style.height = "100%";
  el.style.boxSizing = "border-box";
  el.style.padding = "12px";

  var style = document.createElement('style');
  style.innerHTML = `
    .insert-back-image-radioGroup {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    .insert-back-image-radioItem {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 4px;
      transition: all 0.2s ease;
      background-color: #F8FAFC;
    }
    .insert-back-image-radioItem:hover {
      background-color: #E2E8F0;
    }
    .insert-back-image-radioItem input[type="radio"] {
      accent-color: #4A5568;
    }
    .insert-back-image-radioItem span {
      color: #2D3748;
      font-size: 9pt;
    }
    .insert-back-image-buttonGroup {
      display: flex;
      justify-content: center;
      gap: 12px;
    }
    .insert-back-image-button {
      background-color: #F8FAFC;
      color: #4A5568;
      border: 1px solid #E2E8F0;
      padding: 6px 16px;
      border-radius: 4px;
      font-size: 9pt;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .insert-back-image-button:hover {
      background-color: #E2E8F0;
      border-color: #CBD5E0;
    }
  `;
  el.appendChild(style);

  var div1 = document.createElement("div");
  div1.className = "insert-back-image-radioGroup";
  el.appendChild(div1);

  var L = ['平铺','居中','拉伸','清除背景图'];
  for(let i = 0; i < L.length; i++){
    let radioItem = document.createElement("div");
    radioItem.className = "insert-back-image-radioItem";
    radioItem.style.cursor = "pointer";
    
    let t1 = document.createElement("input");
    t1.setAttribute("type", "radio");
    t1.setAttribute("name", windowId + "_radio");  
    t1.onclick = function(e){
        imagePlaceType = i;
    }
    if (i === 0) {
      t1.checked = true;
    }
    radioItem.appendChild(t1);

    let t2 = document.createElement('span');
    t2.innerHTML = L[i];
    radioItem.appendChild(t2);
    
    // 添加点击事件，使得点击文字时也能选中radio
    radioItem.onclick = function(e){
      if (e.target !== t1) {
        t1.checked = true;
        imagePlaceType = i;
      }
    };
    
    div1.appendChild(radioItem);
  }

  var div2 = document.createElement('div');
  div2.className = "insert-back-image-buttonGroup";
  el.appendChild(div2);

  var confirmButton = document.createElement('input');
  confirmButton.setAttribute('type', 'button');
  confirmButton.setAttribute('value', '确定');
  confirmButton.className = "insert-back-image-button";
  confirmButton.onclick = function(e){
    parentObj.setBackImageDo(imagePlaceType);   
    win.close(); 
  }
  div2.appendChild(confirmButton);
  
  var cancelButton = document.createElement('input');
  cancelButton.setAttribute('type', 'button');
  cancelButton.setAttribute('value', '取消');
  cancelButton.className = "insert-back-image-button";
  cancelButton.onclick = function(e){
    win.close(); 
  }
  div2.appendChild(cancelButton);

  function doJob() {}

  return {
    doJob: doJob,
  };
}
