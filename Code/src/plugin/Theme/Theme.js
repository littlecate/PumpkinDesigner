/**
 * 主题管理模块
 * 提供主题配置的获取功能
 */

/**
 * 主题管理构造函数
 * @returns {Object} 包含getOne方法的对象
 */
function Theme() {
    /**
     * 根据名称获取主题配置
     * @param {string} name - 主题名称（"dark" 或 "light"）
     * @returns {Object} 主题配置对象
     */
    function getOne(name) {
        if (name == "dark") {
            return new ThemeDark().getConfig();
        }
        if (name == "light") {
            return new ThemeLight().getConfig();
        }
    }

    return {
        getOne: getOne
    };
}
