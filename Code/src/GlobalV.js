/**
 * 全局变量配置
 * 包含系统中使用的各种常量和配置项
 */
'use strict';

const GlobalV = {
    /**
     * 不能出现在开头的字符列表
     * @type {string[]}
     */
    canNotInTheFirstChars: [
        ',', '.', '，', '。', '；', ';', '！', ',', '‰', ',', '!', 
        '：', '〗', '％', '＇', '｝', '］', '》', '】', '』', '＠', 
        '、', '）', '?', '？', '．', '）', ')', '»', '›', '﹞', '”', '’'
    ],
    
    /**
     * 不能出现在结尾的字符列表
     * @type {string[]}
     */
    canNotInTheEndChars: [
        '＜', '{', '[', '（', '〔', '【', '《', '「', '『', '〖', 
        '｛', '［', '<', '«', '‹', '﹝', '〈', '“', '‘', '〝'
    ],
    
    /**
     * 不能分割的字符列表（用于文本换行处理）
     * @type {string[]}
     */
    canNotSplitChars: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/', '%', '‰',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '-', '±'
    ],
    
    /**
     * 数字字符列表
     * @type {string[]}
     */
    numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
    
    /**
     * 标准编号不能分割的字符列表
     * @type {string[]}
     */
    bzNoSplitChars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'G', 'B', 'T', '/', '-', ' ', '—', '　'],
    
    /**
     * 左内边距
     * @type {number}
     */
    paddingLeft: 2,
    
    /**
     * 上内边距
     * @type {number}
     */
    paddingTop: 2,
    
    /**
     * 细线宽度
     * @type {number}
     */
    lineWidth1: 0.567,
    
    /**
     * 中粗线宽度
     * @type {number}
     */
    lineWidth2: 1.077,
    
    /**
     * 粗线宽度
     * @type {number}
     */
    lineWidth3: 1.417,
    
    /**
     * 状态标志：是否已设置
     * @type {boolean}
     */
    isSet: false,
    
    /**
     * 空字符串标记
     * @type {string}
     */
    emptyStrMark: "emptystr",
    
    /**
     * 垂直滚动条处理图像
     * @type {HTMLImageElement}
     */
    vHandlerImage: (function() {
        const image = new Image();
        image.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCAATAAQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAIG/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAIF/9oADAMBAAIQAxAAAAHMKaEgf//EABQQAQAAAAAAAAAAAAAAAAAAABD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EABQQAQAAAAAAAAAAAAAAAAAAABD/2gAIAQEABj8Cf//EABgQAAIDAAAAAAAAAAAAAAAAAAARARDh/9oACAEBAAE/IVI1tf/aAAwDAQACAAMAAAAQO+//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/ED//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/ED//xAAZEAADAQEBAAAAAAAAAAAAAAABESEAcbH/2gAIAQEAAT8QZfcCBQ9XMs3f/9k=";
        return image;
    })()
};
