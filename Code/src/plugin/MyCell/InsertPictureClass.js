"use strict";

/**
 * @fileoverview 插入图片模块，提供插入单元格图片、浮动图片、背景图片功能
 * @module InsertPictureClass
 */

/**
 * 插入图片类
 * @class
 * @param {Object} config - 配置对象
 * @param {Object} config.parentObj - 父对象
 * @param {number} config.type - 类型（1=单元格图片，2=浮动图片，3=背景图片）
 * @param {number} config.imagePlaceType - 图片放置类型（仅type=3时有效）
 */
function InsertPictureClass(config) {
  let parentObj = config.parentObj;
  let type = config.type;
  let imagePlaceType = config.imagePlaceType;
  let el = document.createElement("input");
  el.setAttribute("type", "file");
  el.setAttribute("id", "input_insertPictureFile");
  el.setAttribute("accept", ".bmp, .jpg, .gif, .png, .jpeg, .svg");
  el.style.opacity = 0;
  el.addEventListener("change", getImageData);
  document.body.appendChild(el);
  el.click();

  function doJob() {
    //
  }

  function getImageData() {
    if (!el.files || el.files.length == 0) {
      alert("请选择文件!");
      return;
    }
    var file = el.files[0];
    var fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    if (
      fileExt != ".bmp" &&
      fileExt != ".jpg" &&
      fileExt != ".gif" &&
      fileExt != ".png" &&
      fileExt != ".jpeg" &&
      fileExt != ".svg"
    ) {
      alert("请上传.bmp, .jpg, .gif, .png, .jpeg, .svg格式的文件!");
      return;
    }
    var file = el.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      var dataUrl = event.target.result;
      if (type == 1) parentObj.insertImage(dataUrl);
      else if (type == 2) parentObj.insertFloatImage(dataUrl);
      else if (type == 3) parentObj.setBackImageDoDo(dataUrl, imagePlaceType);
    };
    reader.readAsDataURL(file);
  }

  function destroy() {
    el.parentElement.removeChild(el);
  }

  return {
    doJob: doJob,
    destroy: destroy,
  };
}
