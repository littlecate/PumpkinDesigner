'use strict';

/**
 * @fileoverview 获取拼音首字母模块 - 提供汉字转拼音首字母功能
 * @description 该模块用于将中文字符串转换为拼音首字母缩写。
 * 依赖mypinyin_ziyin和mypinyin_zimuduiyin两个拼音映射表。
 * @author MyCell Designer
 * @version 1.0.0
 */

/**
 * 获取拼音首字母类
 * @class GetPinYinShouZiMu
 * @description 将中文字符串转换为拼音首字母缩写
 * @param {string} str - 需要转换的中文字符串
 * @example
 * var pinyin = new GetPinYinShouZiMu("中华人民共和国");
 * var result = pinyin.doJob(); // 返回 "zhhrmghg"
 */
function GetPinYinShouZiMu(str) {
    /**
     * 执行拼音首字母提取
     * @function doJob
     * @description 遍历字符串中的每个字符，查找对应的拼音并提取首字母
     * @returns {string} 拼音首字母缩写（小写）
     */
    function doJob() {
        var L = [];
        for (var i = 0; i < str.length; i++) {
            var t = str.substr(i, 1);            
            var t2 = str.charCodeAt(i);
            var t3 = mypinyin_ziyin[t2];
            if (t3) {
                var t4 = t3.substring(0, 1);
                var t5 = mypinyin_zimuduiyin[t4];
                if (t5) {
                    L.push(t5.substring(0, 1));
                }
                else {
                    L.push(t4);
                }
            }
            else {
                if (/[a-zA-Z]/.test(t))
                    L.push(t);
            }
        }
        return L.join("").toLowerCase();
    }

    /**
     * 返回公共接口
     * @returns {Object} 包含doJob方法的对象
     */
    return {
        doJob: doJob
    }
}