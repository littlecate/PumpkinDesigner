/**
 * 深色主题配置
 * 提供深色主题的样式配置
 */

/**
 * 深色主题构造函数
 * @returns {Object} 包含getConfig方法的对象
 */
function ThemeDark() {
    /**
     * 获取主题配置
     * @returns {Object} 主题配置对象
     */
    function getConfig() {
        return {
            toolbar: {
                backgroundStyle: 'background: #1F1E24;box-shadow: inset 0px -0.5px 0px 0px rgba(211,211,211,1);',
                icon: {
                    open: './theme/dark/open.png',
                    export: './theme/dark/export.png',
                    alignbottom: './theme/dark/alignbottom.png',
                    aligncenter: './theme/dark/aligncenter.png',
                    alignleft: './theme/dark/alignleft.png',
                    alignmiddle: './theme/dark/alignmiddle.png',
                    alignright: './theme/dark/alignright.png',
                    aligntop: './theme/dark/aligntop.png',
                    appendcol: './theme/dark/appendcol.png',
                    appendrow: './theme/dark/appendrow.png',
                    autofillcolumn: './theme/dark/autofillcolumn.png',
                    bold: './theme/dark/bold.png',
                    bordercolor: './theme/dark/bordercolor.png',
                    delcol: './theme/dark/delcol.png',
                    delrow: './theme/dark/delrow.png',
                    drawline: './theme/dark/drawline.png',
                    fillcolor: './theme/dark/fillcolor.png',
                    fontcolor: './theme/dark/fontcolor.png',
                    insertcol: './theme/dark/insertcol.png',
                    insertpicture: './theme/dark/insertpicture.png',
                    insertrow: './theme/dark/insertrow.png',
                    italic: './theme/dark/italic.png',
                    linetype: './theme/dark/linetype.png',
                    printsetting: './theme/dark/printsetting.png',
                    redo: './theme/dark/redo.png',
                    selectcolumn: './theme/dark/selectcolumn.png',
                    sub: './theme/dark/sub.png',
                    sup: './theme/dark/sup.png',
                    undo: './theme/dark/undo.png',
                    mergecells: './theme/dark/mergecells.png',
                    unmergecells: './theme/dark/unmergecells.png',
                    ereaseline: './theme/dark/ereaseline.png'                    
                }
            },
            hilightColor: '#1A1E24',
            loading: './theme/dark/loading.svg'
        };
    }

    return {
        getConfig: getConfig
    };
}
