/**
 * 浅色主题配置
 * 提供浅色主题的样式配置
 */

/**
 * 浅色主题构造函数
 * @returns {Object} 包含getConfig方法的对象
 */
function ThemeLight() {
    /**
     * 获取主题配置
     * @returns {Object} 主题配置对象
     */
    function getConfig() {
        return {
            toolbar: {
                backgroundStyle: 'background: #ffffff;box-shadow: inset 0px -0.5px 0px 0px rgba(118,118,118,1);',
                icon: {
                    open: './theme/light/open.png',
                    export: './theme/light/export.png',
                    alignbottom: './theme/light/alignbottom.png',
                    aligncenter: './theme/light/aligncenter.png',
                    alignleft: './theme/light/alignleft.png',
                    alignmiddle: './theme/light/alignmiddle.png',
                    alignright: './theme/light/alignright.png',
                    aligntop: './theme/light/aligntop.png',
                    appendcol: './theme/light/appendcol.png',
                    appendrow: './theme/light/appendrow.png',
                    autofillcolumn: './theme/light/autofillcolumn.png',
                    bold: './theme/light/bold.png',
                    bordercolor: './theme/light/bordercolor.png',
                    delcol: './theme/light/delcol.png',
                    delrow: './theme/light/delrow.png',
                    drawline: './theme/light/drawline.png',
                    fillcolor: './theme/light/fillcolor.png',
                    fontcolor: './theme/light/fontcolor.png',
                    insertcol: './theme/light/insertcol.png',
                    insertpicture: './theme/light/insertpicture.png',
                    insertrow: './theme/light/insertrow.png',
                    italic: './theme/light/italic.png',
                    linetype: './theme/light/linetype.png',
                    printsetting: './theme/light/printsetting.png',
                    redo: './theme/light/redo.png',
                    selectcolumn: './theme/light/selectcolumn.png',
                    sub: './theme/light/sub.png',
                    sup: './theme/light/sup.png',
                    undo: './theme/light/undo.png',
                    mergecells: './theme/light/mergecells.png',
                    unmergecells: './theme/light/unmergecells.png',
                    ereaseline: './theme/light/ereaseline.png'                    
                }
            },
            hilightColor: '#01b16a',
            loading: './theme/light/loading.svg'
        };
    }

    return {
        getConfig: getConfig
    };
}
