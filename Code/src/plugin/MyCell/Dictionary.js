/**
 * 字典类
 * 提供键值对存储和查找功能
 */
'use strict';

/**
 * 字典项构造函数
 * @param {Object} config - 配置对象
 * @param {*} config.key - 键
 * @param {*} config.value - 值
 */
function DictionaryItem(config) {
    /**
     * 键
     * @type {*}
     */
    this.key = config.key;

    /**
     * 值
     * @type {*}
     */
    this.value = config.value;
}

/**
 * 字典构造函数
 * 提供键值对的添加、查找功能
 */
function Dictionary() {
    /**
     * 字典项数组
     * @type {DictionaryItem[]}
     */
    this.items = [];

    var me = this;

    /**
     * 添加键值对
     * @param {*} key - 键
     * @param {*} value - 值
     */
    function Add(key, value) {
        me.items.Add(new DictionaryItem({ key: key, value: value }));
    }

    /**
     * 检查是否包含指定键
     * @param {*} key - 要检查的键
     * @returns {boolean} 是否包含该键
     */
    function ContainsKey(key) {
        for (var i = 0; i < me.items.length; i++) {
            var item = me.items[i];
            if (item.key == key) {
                return true;
            }
        }
        return false;
    }

    /**
     * 根据键获取值
     * @param {*} key - 键
     * @returns {*} 对应的值，如果不存在则返回null
     */
    function GetValue(key) {
        for (var i = 0; i < me.items.length; i++) {
            var item = me.items[i];
            if (item.key == key) {
                return item.value;
            }
        }
        return null;
    }

    return {
        Add: Add,
        ContainsKey: ContainsKey,
        GetValue: GetValue
    };
}
