# MyCell 操作 API 参考文档

本文档描述了 MyCell 单元格组件 OperCell 类提供的所有操作 API。

## 目录

- [初始化](#初始化)
- [单元格数据操作](#单元格数据操作)
- [单元格样式操作](#单元格样式操作)
- [行列操作](#行列操作)
- [合并单元格操作](#合并单元格操作)
- [复制粘贴操作](#复制粘贴操作)
- [公式操作](#公式操作)
- [图片操作](#图片操作)
- [打印设置](#打印设置)
- [其他操作](#其他操作)

---

## 初始化

### Open(cellSheet)
打开单元格表格。

**参数：**
- `cellSheet` - 单元格表格对象

**示例：**
```javascript
operCell.Open(cellSheet);
```

---

## 单元格数据操作

### SetCellString(col, row, sheet, value)
设置单元格字符串值。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `value` - 字符串值

**示例：**
```javascript
operCell.SetCellString(1, 1, 0, "Hello World");
```

---

### GetCellString(col, row, sheet)
获取单元格字符串值。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `string` - 单元格字符串值

**示例：**
```javascript
var value = operCell.GetCellString(1, 1, 0);
```

---

### SetCellDouble(col, row, sheet, value)
设置单元格双精度值。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `value` - 双精度数值

**示例：**
```javascript
operCell.SetCellDouble(1, 1, 0, 3.14159);
```

---

### S(col, row, sheet, value)
设置单元格字符串（简写方法）。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `value` - 字符串值

**示例：**
```javascript
operCell.S(1, 1, 0, "Hello");
```

---

### SetCellReadOnly(col, row, sheet, isReadOnly)
设置单元格只读状态。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `isReadOnly` - 是否只读

**示例：**
```javascript
operCell.SetCellReadOnly(1, 1, 0, true);
```

---

### SetCellIsCheckBox(col, row, sheet, value)
设置单元格是否为复选框。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `value` - 是否为复选框

**示例：**
```javascript
operCell.SetCellIsCheckBox(1, 1, 0, true);
```

---

### SetCellFillDataType(col, row, sheet, fillDataType)
设置单元格填充数据类型。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `fillDataType` - 填充数据类型

**示例：**
```javascript
operCell.SetCellFillDataType(1, 1, 0, 1);
```

---

### SetChartData(col, row, sheet, chartData)
设置图表数据。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `chartData` - 图表数据（JSON字符串）

**示例：**
```javascript
operCell.SetChartData(1, 1, 0, '{"type":"bar","data":[1,2,3]}');
```

---

### GetChartData(col, row, sheet)
获取图表数据。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `string` - 图表数据

**示例：**
```javascript
var chartData = operCell.GetChartData(1, 1, 0);
```

---

## 单元格样式操作

### SetCellFont(col, row, sheet, fontIndex)
设置单元格字体。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `fontIndex` - 字体索引

**示例：**
```javascript
operCell.SetCellFont(1, 1, 0, 0);
```

---

### GetCellFont(col, row, sheet)
获取单元格字体对象。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `Object` - 字体对象

**示例：**
```javascript
var font = operCell.GetCellFont(1, 1, 0);
```

---

### GetFontName(fontIndex)
根据索引获取字体名称。

**参数：**
- `fontIndex` - 字体索引

**返回值：** `string` - 字体名称

**示例：**
```javascript
var fontName = operCell.GetFontName(0);
```

---

### SetCellFontSize(col, row, sheet, fontSize)
设置单元格字体大小。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `fontSize` - 字体大小

**示例：**
```javascript
operCell.SetCellFontSize(1, 1, 0, 14);
```

---

### GetCellFontSize(col, row, sheet)
获取单元格字体大小。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `number` - 字体大小

**示例：**
```javascript
var fontSize = operCell.GetCellFontSize(1, 1, 0);
```

---

### SetCellFontStyle(col, row, sheet, fontStyle)
设置单元格字体样式。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `fontStyle` - 字体样式（参考 FontStyle 枚举）

**FontStyle 枚举值：**
| 值 | 说明 |
|----|------|
| 0 | 常规 |
| 1 | 粗体 |
| 2 | 斜体 |
| 4 | 下划线 |
| 8 | 删除线 |

**示例：**
```javascript
operCell.SetCellFontStyle(1, 1, 0, 1); // 粗体
operCell.SetCellFontStyle(1, 1, 0, 3); // 粗体+斜体
```

---

### GetCellFontStyle(col, row, sheet)
获取单元格字体样式。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `number` - 字体样式

**示例：**
```javascript
var fontStyle = operCell.GetCellFontStyle(1, 1, 0);
```

---

### SetCellTextColor(col, row, sheet, fontColor)
设置单元格文本颜色。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `fontColor` - 文本颜色值

**示例：**
```javascript
operCell.SetCellTextColor(1, 1, 0, 0xFF0000); // 红色
```

---

### GetCellTextColor(col, row, sheet)
获取单元格文本颜色。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `number` - 文本颜色值

**示例：**
```javascript
var textColor = operCell.GetCellTextColor(1, 1, 0);
```

---

### SetCellBackColor(col, row, sheet, fontColor)
设置单元格背景颜色。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `fontColor` - 背景颜色值

**示例：**
```javascript
operCell.SetCellBackColor(1, 1, 0, 0xFFFF00); // 黄色
```

---

### SetCellTextLineSpace(col, row, sheet, lineSpace)
设置单元格文本行间距。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `lineSpace` - 行间距

**示例：**
```javascript
operCell.SetCellTextLineSpace(1, 1, 0, 2);
```

---

### GetCellTextLineSpace(col, row, sheet)
获取单元格文本行间距。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `number` - 行间距

**示例：**
```javascript
var lineSpace = operCell.GetCellTextLineSpace(1, 1, 0);
```

---

### SetCellTextStyle(col, row, sheet, value)
设置单元格文本样式。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `value` - 样式值（2=多行文本）

**示例：**
```javascript
operCell.SetCellTextStyle(1, 1, 0, 2); // 多行文本
```

---

### SetCellFontAutoZoom(col, row, sheet, enable)
设置单元格字体自动缩放。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `enable` - 是否启用（1=启用）

**返回值：** `number` - 返回1

**示例：**
```javascript
operCell.SetCellFontAutoZoom(1, 1, 0, 1);
```

---

### SetCellAlign(col, row, sheet, align)
设置单元格对齐方式。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `align` - 对齐方式

**示例：**
```javascript
operCell.SetCellAlign(1, 1, 0, 0); // 左上对齐
```

---

### GetCellAlign(col, row, sheet)
获取单元格对齐方式。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `number` - 对齐方式

**示例：**
```javascript
var align = operCell.GetCellAlign(1, 1, 0);
```

---

### SetCellHAlign(col, row, sheet, value)
设置单元格水平对齐方式。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `value` - 水平对齐值（0=左, 1=中, 2=右）

**示例：**
```javascript
operCell.SetCellHAlign(1, 1, 0, 1); // 居中
```

---

### GetCellHAlign(col, row, sheet)
获取单元格水平对齐方式。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `number` - 水平对齐值

**示例：**
```javascript
var hAlign = operCell.GetCellHAlign(1, 1, 0);
```

---

### SetCellVAlign(col, row, sheet, value)
设置单元格垂直对齐方式。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `value` - 垂直对齐值（0=上, 1=中, 2=下）

**示例：**
```javascript
operCell.SetCellVAlign(1, 1, 0, 1); // 居中
```

---

### GetCellVAlign(col, row, sheet)
获取单元格垂直对齐方式。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `number` - 垂直对齐值

**示例：**
```javascript
var vAlign = operCell.GetCellVAlign(1, 1, 0);
```

---

## 行列操作

### GetRows(sheet)
获取行数。

**参数：**
- `sheet` - 工作表索引

**返回值：** `number` - 行数

**示例：**
```javascript
var rows = operCell.GetRows(0);
```

---

### GetCols(sheet)
获取列数。

**参数：**
- `sheet` - 工作表索引

**返回值：** `number` - 列数

**示例：**
```javascript
var cols = operCell.GetCols(0);
```

---

### SetRowHeight(type, height, row, sheet)
设置行高。

**参数：**
- `type` - 类型
- `height` - 行高（像素）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**示例：**
```javascript
operCell.SetRowHeight(0, 30, 1, 0);
```

---

### GetRowHeight(type, row, sheet)
获取行高。

**参数：**
- `type` - 类型
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `number` - 行高

**示例：**
```javascript
var height = operCell.GetRowHeight(0, 1, 0);
```

---

### SetColWidth(type, width, col, sheet)
设置列宽。

**参数：**
- `type` - 类型
- `width` - 列宽（像素）
- `col` - 列号（从1开始）
- `sheet` - 工作表索引

**示例：**
```javascript
operCell.SetColWidth(0, 100, 1, 0);
```

---

### GetColWidth(type, col, sheet)
获取列宽。

**参数：**
- `type` - 类型
- `col` - 列号（从1开始）
- `sheet` - 工作表索引

**返回值：** `number` - 列宽

**示例：**
```javascript
var width = operCell.GetColWidth(0, 1, 0);
```

---

### InsertRow(startRow, count, sheet)
插入行。

**参数：**
- `startRow` - 起始行号（从1开始）
- `count` - 插入数量
- `sheet` - 工作表索引

**示例：**
```javascript
operCell.InsertRow(3, 2, 0); // 在第3行插入2行
```

---

### InsertCleanRow(startRow, count, sheet)
插入空白行。

**参数：**
- `startRow` - 起始行号（从1开始）
- `count` - 插入数量
- `sheet` - 工作表索引

**示例：**
```javascript
operCell.InsertCleanRow(3, 2, 0);
```

---

### DeleteRow(startRow, count, sheet)
删除行。

**参数：**
- `startRow` - 起始行号（从1开始）
- `count` - 删除数量
- `sheet` - 工作表索引

**示例：**
```javascript
operCell.DeleteRow(3, 2, 0); // 删除第3行开始的2行
```

---

### InsertCol(startCol, count, sheet)
插入列。

**参数：**
- `startCol` - 起始列号（从1开始）
- `count` - 插入数量
- `sheet` - 工作表索引

**示例：**
```javascript
operCell.InsertCol(3, 2, 0); // 在第3列插入2列
```

---

### InsertCleanCol(startCol, count, sheet)
插入空白列。

**参数：**
- `startCol` - 起始列号（从1开始）
- `count` - 插入数量
- `sheet` - 工作表索引

**示例：**
```javascript
operCell.InsertCleanCol(3, 2, 0);
```

---

### DeleteCol(startCol, count, sheet)
删除列。

**参数：**
- `startCol` - 起始列号（从1开始）
- `count` - 删除数量
- `sheet` - 工作表索引

**示例：**
```javascript
operCell.DeleteCol(3, 2, 0); // 删除第3列开始的2列
```

---

### AppendRow(height, isClearRow)
追加行。

**参数：**
- `height` - 行高
- `isClearRow` - 是否清除行信息

**示例：**
```javascript
operCell.AppendRow(30, true);
```

---

### AppendCol(width, isClearCol)
追加列。

**参数：**
- `width` - 列宽
- `isClearCol` - 是否清除列信息

**示例：**
```javascript
operCell.AppendCol(100, true);
```

---

### GetCellHeight(col, row)
获取单元格高度（考虑合并区域）。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）

**返回值：** `number` - 单元格高度

**示例：**
```javascript
var height = operCell.GetCellHeight(1, 1);
```

---

### GetCellWidth(col, row)
获取单元格宽度（考虑合并区域）。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）

**返回值：** `number` - 单元格宽度

**示例：**
```javascript
var width = operCell.GetCellWidth(1, 1);
```

---

### GetCellXPos(col, row)
获取单元格X坐标。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）

**返回值：** `number` - X坐标

**示例：**
```javascript
var xPos = operCell.GetCellXPos(1, 1);
```

---

### GetCellYPos(col, row)
获取单元格Y坐标。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）

**返回值：** `number` - Y坐标

**示例：**
```javascript
var yPos = operCell.GetCellYPos(1, 1);
```

---

## 合并单元格操作

### MergeCells(col1, row1, col2, row2)
合并单元格。

**参数：**
- `col1` - 起始列号（从1开始）
- `row1` - 起始行号（从1开始）
- `col2` - 结束列号（从1开始）
- `row2` - 结束行号（从1开始）

**示例：**
```javascript
operCell.MergeCells(1, 1, 3, 2); // 合并A1:C2区域
```

---

### UnmergeCells(col1, row1, col2, row2)
取消合并单元格。

**参数：**
- `col1` - 起始列号（从1开始）
- `row1` - 起始行号（从1开始）
- `col2` - 结束列号（从1开始）
- `row2` - 结束行号（从1开始）

**示例：**
```javascript
operCell.UnmergeCells(1, 1, 3, 2);
```

---

### GetMergeRange(col, row)
获取单元格所在的合并区域。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）

**返回值：** `Object|null` - 合并区域对象，包含 startCol, startRow, endCol, endRow 属性

**示例：**
```javascript
var mergeArea = operCell.GetMergeRange(1, 1);
if (mergeArea) {
    console.log("合并区域: " + mergeArea.startCol + "," + mergeArea.startRow + " - " + mergeArea.endCol + "," + mergeArea.endRow);
}
```

---

## 复制粘贴操作

### CopyRange(col1, row1, col2, row2)
复制区域。

**参数：**
- `col1` - 起始列号（从1开始）
- `row1` - 起始行号（从1开始）
- `col2` - 结束列号（从1开始）
- `row2` - 结束行号（从1开始）

**示例：**
```javascript
operCell.CopyRange(1, 1, 3, 3); // 复制A1:C3区域
```

---

### mfCopyRange(col1, row1, col2, row2)
复制区域（方法别名）。

**参数：**
- `col1` - 起始列号（从1开始）
- `row1` - 起始行号（从1开始）
- `col2` - 结束列号（从1开始）
- `row2` - 结束行号（从1开始）

---

### Paste(col, row, type, samesize, skipblank)
粘贴操作。

**参数：**
- `col` - 目标列号（从1开始）
- `row` - 目标行号（从1开始）
- `type` - 粘贴类型
- `samesize` - 是否保持相同大小
- `skipblank` - 是否跳过空白

**示例：**
```javascript
operCell.Paste(5, 1, 0, false, false); // 粘贴到E1位置
```

---

### mfPaste(col, row, type, samesize, skipblank)
粘贴操作（方法别名）。

**参数：**
- `col` - 目标列号（从1开始）
- `row` - 目标行号（从1开始）
- `type` - 粘贴类型
- `samesize` - 是否保持相同大小
- `skipblank` - 是否跳过空白

---

### GetCopyContent()
获取复制内容。

**返回值：** `Object|null` - 复制信息对象

**示例：**
```javascript
var copyInfo = operCell.GetCopyContent();
```

---

### SetCopyContent(copyContent)
设置复制内容。

**参数：**
- `copyContent` - 复制信息对象

**示例：**
```javascript
operCell.SetCopyContent(copyInfo);
```

---

### SetCopyInfoFromExcel(cellProps, colWidths, rowHeights, mergeAreaList)
从Excel设置复制信息。

**参数：**
- `cellProps` - 单元格属性二维数组
- `colWidths` - 列宽数组
- `rowHeights` - 行高数组
- `mergeAreaList` - 合并区域列表

**示例：**
```javascript
operCell.SetCopyInfoFromExcel(cellProps, colWidths, rowHeights, mergeAreaList);
```

---

## 公式操作

### SetFormula(col, row, sheet, code, sheetName)
设置公式。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `code` - 公式代码（以=开头）
- `sheetName` - 工作表名称

**示例：**
```javascript
operCell.SetFormula(1, 1, 0, "=SUM(A2:A10)", "Sheet1");
```

---

### GetFormula(col, row, sheet)
获取公式对象。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `Object|null` - 公式对象

**示例：**
```javascript
var formula = operCell.GetFormula(1, 1, 0);
```

---

### GetFormulaStr(col, row, sheet)
获取公式字符串。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `string` - 公式字符串

**示例：**
```javascript
var formulaStr = operCell.GetFormulaStr(1, 1, 0);
```

---

### CalculateSheet(sheet)
计算工作表中的所有公式。

**参数：**
- `sheet` - 工作表索引

**示例：**
```javascript
operCell.CalculateSheet(0);
```

---

### SortFormula()
排序公式列表。

**示例：**
```javascript
operCell.SortFormula();
```

---

## 图片操作

### AddImage(imageBase64, imageType)
添加图片。

**参数：**
- `imageBase64` - 图片Base64数据
- `imageType` - 图片类型（如 "png", "jpg"）

**返回值：** `number` - 图片索引

**示例：**
```javascript
var imageIndex = operCell.AddImage("data:image/png;base64,...", "png");
```

---

### SetCellImage(col, row, sheet, imageIndex, style, halign, valign)
设置单元格图片。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `imageIndex` - 图片索引
- `style` - 样式
- `halign` - 水平对齐
- `valign` - 垂直对齐

**示例：**
```javascript
operCell.SetCellImage(1, 1, 0, imageIndex, 0, 1, 1);
```

---

### GetCellImageIndex(col, row, sheet)
获取单元格图片索引。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引

**返回值：** `number` - 图片索引

**示例：**
```javascript
var imageIndex = operCell.GetCellImageIndex(1, 1, 0);
```

---

### UpdateImage(imageIndex, imageBase64)
更新图片。

**参数：**
- `imageIndex` - 图片索引
- `imageBase64` - 新的图片Base64数据

**返回值：** `boolean` - 是否成功

**示例：**
```javascript
var success = operCell.UpdateImage(1, "data:image/png;base64,...");
```

---

### DeleteImage(imageIndex)
删除图片。

**参数：**
- `imageIndex` - 图片索引

**示例：**
```javascript
operCell.DeleteImage(1);
```

---

### SetCellFloatImage(col, row, sheet, name, imageIndex)
设置单元格浮动图片。

**参数：**
- `col` - 列号（从1开始）
- `row` - 行号（从1开始）
- `sheet` - 工作表索引
- `name` - 图片名称
- `imageIndex` - 图片索引

**示例：**
```javascript
operCell.SetCellFloatImage(1, 1, 0, "logo", imageIndex);
```

---

### MoveFloatImage(sheet, name, xpos, ypos, width, height)
移动浮动图片。

**参数：**
- `sheet` - 工作表索引
- `name` - 图片名称
- `xpos` - X坐标
- `ypos` - Y坐标
- `width` - 宽度（-1表示不改变）
- `height` - 高度（-1表示不改变）

**返回值：** `number` - 是否成功（1=成功, 0=失败）

**示例：**
```javascript
operCell.MoveFloatImage(0, "logo", 100, 50, 200, 100);
```

---

### GetFloatImagePos(sheet, name)
获取浮动图片位置。

**参数：**
- `sheet` - 工作表索引
- `name` - 图片名称

**返回值：** `Object|null` - 位置信息对象，包含 xpos, ypos, width, height 属性

**示例：**
```javascript
var pos = operCell.GetFloatImagePos(0, "logo");
```

---

### SetBackImage(imageIndex, option, sheetIndex)
设置背景图片。

**参数：**
- `imageIndex` - 图片索引
- `option` - 选项
- `sheetIndex` - 工作表索引

**示例：**
```javascript
operCell.SetBackImage(imageIndex, 0, 0);
```

---

### GetBackImage(sheet)
获取背景图片信息。

**参数：**
- `sheet` - 工作表索引

**返回值：** `Object` - 背景图片信息，包含 imageIndex 和 option 属性

**示例：**
```javascript
var backImage = operCell.GetBackImage(0);
```

---

## 打印设置

### PrintSetMargin(top, left, bottom, right)
设置打印边距。

**参数：**
- `top` - 上边距
- `left` - 左边距
- `bottom` - 下边距
- `right` - 右边距

**示例：**
```javascript
operCell.PrintSetMargin(20, 20, 20, 20);
```

---

### PrintGetMargin(type)
获取打印边距。

**参数：**
- `type` - 边距类型（0=左, 1=上, 2=右, 3=下）

**返回值：** `number` - 边距值

**示例：**
```javascript
var leftMargin = operCell.PrintGetMargin(0);
```

---

### PrintSetOrient(orient)
设置打印方向。

**参数：**
- `orient` - 打印方向（0=纵向, 1=横向）

**示例：**
```javascript
operCell.PrintSetOrient(1); // 横向
```

---

### PrintGetOrient()
获取打印方向。

**返回值：** `number` - 打印方向

**示例：**
```javascript
var orient = operCell.PrintGetOrient();
```

---

### PrintSetAlign(printHAlign, printVAlign)
设置打印对齐方式。

**参数：**
- `printHAlign` - 水平对齐
- `printVAlign` - 垂直对齐

**示例：**
```javascript
operCell.PrintSetAlign(1, 1); // 居中
```

---

### PrintGetHAlign(sheet)
获取打印水平对齐。

**参数：**
- `sheet` - 工作表索引

**返回值：** `number` - 水平对齐值

**示例：**
```javascript
var hAlign = operCell.PrintGetHAlign(0);
```

---

### PrintGetVAlign(sheet)
获取打印垂直对齐。

**参数：**
- `sheet` - 工作表索引

**返回值：** `number` - 垂直对齐值

**示例：**
```javascript
var vAlign = operCell.PrintGetVAlign(0);
```

---

### PrintGetPaperWidth(sheet)
获取打印纸张宽度。

**参数：**
- `sheet` - 工作表索引

**返回值：** `number` - 纸张宽度

**示例：**
```javascript
var width = operCell.PrintGetPaperWidth(0);
```

---

### PrintGetPaperHeight(sheet)
获取打印纸张高度。

**参数：**
- `sheet` - 工作表索引

**返回值：** `number` - 纸张高度

**示例：**
```javascript
var height = operCell.PrintGetPaperHeight(0);
```

---

### PrintGetPages()
获取打印页数。

**返回值：** `number` - 页数

**示例：**
```javascript
var pages = operCell.PrintGetPages();
```

---

### PrintSetHead(leftStr, midStr, rightStr)
设置打印页眉。

**参数：**
- `leftStr` - 左侧字符串
- `midStr` - 中间字符串
- `rightStr` - 右侧字符串

**示例：**
```javascript
operCell.PrintSetHead("公司名称", "报表标题", "第&P页");
```

---

### PrintSetFoot(leftStr, midStr, rightStr)
设置打印页脚。

**参数：**
- `leftStr` - 左侧字符串
- `midStr` - 中间字符串
- `rightStr` - 右侧字符串

**示例：**
```javascript
operCell.PrintSetFoot("打印日期", "", "共&P页");
```

---

### PrintSetTopTitle(startRow, endRow)
设置打印顶端标题行。

**参数：**
- `startRow` - 起始行号
- `endRow` - 结束行号

**示例：**
```javascript
operCell.PrintSetTopTitle(1, 2); // 第1-2行为顶端标题行
```

---

### PrintSetBottomTitle(startRow, endRow)
设置打印底端标题行。

**参数：**
- `startRow` - 起始行号
- `endRow` - 结束行号

**示例：**
```javascript
operCell.PrintSetBottomTitle(10, 11);
```

---

### SetRowPageBreak(row, value)
设置行分页符。

**参数：**
- `row` - 行号
- `value` - 值（1=设置, 0=取消）

**示例：**
```javascript
operCell.SetRowPageBreak(10, 1); // 在第10行设置分页符
```

---

### IsRowPageBreak(row)
判断行是否为分页符。

**参数：**
- `row` - 行号

**返回值：** `boolean` - 是否为分页符

**示例：**
```javascript
var isBreak = operCell.IsRowPageBreak(10);
```

---

## 其他操作

### CalFun(col, row)
计算指定位置的公式。

**参数：**
- `col` - 列号
- `row` - 行号

**示例：**
```javascript
operCell.CalFun(1, 1);
```

---

## 版本信息

- **文档版本：** 1.0
- **更新日期：** 2024年
- **适用组件：** MyCell 单元格组件
