/**
 * 公式计算类
 * 负责处理和计算各种公式表达式
 */
'use strict';

let g_isCalFormula = 1;

/**
 * 创建公式计算实例
 * @param {Object} formula - 公式对象
 * @param {Object} cellSheet - 单元格表格对象
 * @returns {Object} 公式计算实例
 */
function CalFormula(formula, cellSheet) {
  let codeLine;

  /**
   * 执行公式计算
   * @returns {string} 计算结果
   */
  function doJob() {
    codeLine = Comman.DeepCopyObj(formula.codeLine);
    
    try {
      let startPos = codeLine.length - 1;
      let pos1 = findFlagRightToLeft("(", startPos);
      
      while (pos1 !== -1) {
        let pos2 = findFlagLeftToRight(")", pos1);
        if (pos2 === -1) {
          break;
        }
        
        let funBody = codeLine.GetRange(pos1 + 1, pos2 - (pos1 + 1));
        let funName = "";
        
        if (pos1 - 1 >= 0) {
          funName = codeLine[pos1 - 1].toLowerCase();
        }
        
        if (funBody.length === 0) {
          calculateFunctionValue(funName, null, pos1, pos2);
        } else {
          let paramList = getParamList(funBody);
          calculateFunctionValue(funName, paramList, pos1, pos2);
        }
        
        startPos = codeLine.length - 1;
        pos1 = findFlagRightToLeft("(", startPos);
      }
      
      if (codeLine.length > 1) {
        calculateOneValue(codeLine);
      }
      
      return getStringValue(codeLine);
    } catch (ex) {
      console.log(formula);
      console.log(ex);
      return "#Error";
    }
  }

  /**
   * 计算单个值
   * @param {Array} valueList - 值列表
   */
  function calculateOneValue(valueList) {
    if (valueList.length <= 1) {
      return;
    }
    
    calculateExponentiation(valueList);
    calculateMultiplicationAndDivision(valueList);
    calculateAdditionAndSubtraction(valueList);
    calculateLogicalComparison(valueList);
    calculateLogicalOperation(valueList);
  }

  /**
   * 计算逻辑运算
   * @param {Array} valueList - 值列表
   */
  function calculateLogicalOperation(valueList) {
    let index = valueList.findIndex(function (p) {
      return p.toLowerCase() === "and" || p.toLowerCase() === "or";
    });
    
    while (index !== -1) {
      if (valueList[index].toLowerCase() === "and") {
        let result = andOperation(valueList[index - 1], valueList[index + 1]);
        setValue2(valueList, index - 1, index + 1, result, 2);
      } else if (valueList[index].toLowerCase() === "or") {
        let result = orOperation(valueList[index - 1], valueList[index + 1]);
        setValue2(valueList, index - 1, index + 1, result, 2);
      }
      
      index = valueList.findIndex(function (p) {
        return p.toLowerCase() === "and" || p.toLowerCase() === "or";
      });
    }
  }

  /**
   * 或运算
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 运算结果
   */
  function orOperation(value1, value2) {
    return (convertToBoolean(value1) || convertToBoolean(value2)).toString();
  }

  /**
   * 且运算
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 运算结果
   */
  function andOperation(value1, value2) {
    return (convertToBoolean(value1) && convertToBoolean(value2)).toString();
  }

  /**
   * 计算逻辑比较
   * @param {Array} valueList - 值列表
   */
  function calculateLogicalComparison(valueList) {
    let index = valueList.findIndex(function (p) {
      return p === ">" || p === "<" || p === "=" || p === ">=" || p === "<=" || p === "<=";
    });
    
    while (index !== -1) {
      if (valueList[index - 1].startsWith('"') || valueList[index + 1].startsWith('"')) {
        handleStringComparison(valueList, index);
      } else {
        handleNumberComparison(valueList, index);
      }
      
      index = valueList.findIndex(function (p) {
        return p === ">" || p === "<" || p === "=" || p === ">=" || p === "<=" || p === "<=";
      });
    }
  }

  /**
   * 处理字符串比较
   * @param {Array} valueList - 值列表
   * @param {number} index - 操作符索引
   */
  function handleStringComparison(valueList, index) {
    const operator = valueList[index];
    const value1 = valueList[index - 1];
    const value2 = valueList[index + 1];
    let result;
    
    switch (operator) {
      case ">":
        result = compareStringsGreater(value1, value2);
        break;
      case "<":
        result = compareStringsLess(value1, value2);
        break;
      case "=":
        result = compareStringsEqual(value1, value2);
        break;
      case ">=":
        result = compareStringsGreaterOrEqual(value1, value2);
        break;
      case "<=":
        result = compareStringsLessOrEqual(value1, value2);
        break;
      case "<>":
        result = compareStringsNotEqual(value1, value2);
        break;
    }
    
    setValue2(valueList, index - 1, index + 1, result, 2);
  }

  /**
   * 处理数字比较
   * @param {Array} valueList - 值列表
   * @param {number} index - 操作符索引
   */
  function handleNumberComparison(valueList, index) {
    const operator = valueList[index];
    const value1 = valueList[index - 1];
    const value2 = valueList[index + 1];
    let result;
    
    if (value1 === "_loopcell_") {
      result = value1 + operator + value2;
    } else {
      switch (operator) {
        case ">":
          result = compareNumbersGreater(value1, value2);
          break;
        case "<":
          result = compareNumbersLess(value1, value2);
          break;
        case "=":
          result = compareNumbersEqual(value1, value2);
          break;
        case ">=":
          result = compareNumbersGreaterOrEqual(value1, value2);
          break;
        case "<=":
          result = compareNumbersLessOrEqual(value1, value2);
          break;
        case "<>":
          result = compareNumbersNotEqual(value1, value2);
          break;
      }
    }
    
    setValue2(valueList, index - 1, index + 1, result, 2);
  }

  /**
   * 数字不等于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareNumbersNotEqual(value1, value2) {
    try {
      return (convertToNumber(value1) !== convertToNumber(value2)).toString();
    } catch (e) {
      return compareStringsNotEqual(value1, value2);
    }
  }

  /**
   * 数字小于等于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareNumbersLessOrEqual(value1, value2) {
    try {
      return (convertToNumber(value1) <= convertToNumber(value2)).toString();
    } catch (e) {
      return compareStringsLessOrEqual(value1, value2);
    }
  }

  /**
   * 数字大于等于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareNumbersGreaterOrEqual(value1, value2) {
    try {
      return (convertToNumber(value1) >= convertToNumber(value2)).toString();
    } catch (e) {
      return compareStringsLessOrEqual(value1, value2);
    }
  }

  /**
   * 数字等于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareNumbersEqual(value1, value2) {
    try {
      return (convertToNumber(value1) === convertToNumber(value2)).toString();
    } catch (e) {
      return compareStringsEqual(value1, value2);
    }
  }

  /**
   * 数字小于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareNumbersLess(value1, value2) {
    try {
      return (convertToNumber(value1) < convertToNumber(value2)).toString();
    } catch (e) {
      return compareStringsLess(value1, value2);
    }
  }

  /**
   * 数字大于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareNumbersGreater(value1, value2) {
    try {
      return (convertToNumber(value1) > convertToNumber(value2)).toString();
    } catch (e) {
      return compareStringsGreater(value1, value2);
    }
  }

  /**
   * 字符串不等于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareStringsNotEqual(value1, value2) {
    value1 = getStringValue(value1);
    value2 = getStringValue(value2);
    return (value1 !== value2).toString();
  }

  /**
   * 字符串小于等于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareStringsLessOrEqual(value1, value2) {
    value1 = getStringValue(value1);
    value2 = getStringValue(value2);
    const comparison = stringCompare(value1, value2);
    return (comparison === -1 || comparison === 0).toString();
  }

  /**
   * 字符串大于等于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareStringsGreaterOrEqual(value1, value2) {
    value1 = getStringValue(value1);
    value2 = getStringValue(value2);
    const comparison = stringCompare(value1, value2);
    return (comparison === 1 || comparison === 0).toString();
  }

  /**
   * 字符串等于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareStringsEqual(value1, value2) {
    value1 = getStringValue(value1);
    value2 = getStringValue(value2);
    return (value1 === value2).toString();
  }

  /**
   * 字符串小于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareStringsLess(value1, value2) {
    value1 = getStringValue(value1);
    value2 = getStringValue(value2);
    const comparison = stringCompare(value1, value2);
    return (comparison === -1).toString();
  }

  /**
   * 字符串大于比较
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 比较结果
   */
  function compareStringsGreater(value1, value2) {
    value1 = getStringValue(value1);
    value2 = getStringValue(value2);
    const comparison = stringCompare(value1, value2);
    return (comparison === 1).toString();
  }

  /**
   * 计算加减法
   * @param {Array} valueList - 值列表
   */
  function calculateAdditionAndSubtraction(valueList) {
    let index = valueList.findIndex(function (p) {
      return p === "+" || p === "-";
    });
    
    while (index !== -1) {
      if (valueList[index] === "+") {
        if (valueList[index - 1].startsWith('"') || valueList[index + 1].startsWith('"')) {
          const result = concatenateStrings(valueList[index - 1], valueList[index + 1]);
          setValue2(valueList, index - 1, index + 1, result, 1);
        } else {
          const result = addNumbers(valueList[index - 1], valueList[index + 1]);
          setValue2(valueList, index - 1, index + 1, result, 2);
        }
      } else if (valueList[index] === "-") {
        if (index === 0) {
          const result = valueList[index] + valueList[index + 1];
          setValue2(valueList, index, index + 1, result, 2);
        } else {
          const result = subtractNumbers(valueList[index - 1], valueList[index + 1]);
          setValue2(valueList, index - 1, index + 1, result, 2);
        }
      }
      
      index = valueList.findIndex(function (p) {
        return p === "+" || p === "-";
      });
    }
  }

  /**
   * 数字相加
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 相加结果
   */
  function addNumbers(value1, value2) {
    try {
      return (convertToNumber(value1) + convertToNumber(value2)).toString();
    } catch (e) {
      return concatenateStrings(value1, value2);
    }
  }

  /**
   * 数字相减
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 相减结果
   */
  function subtractNumbers(value1, value2) {
    return (convertToNumber(value1) - convertToNumber(value2)).toString();
  }

  /**
   * 字符串相加
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 相加结果
   */
  function concatenateStrings(value1, value2) {
    return getStringValue(value1) + getStringValue(value2);
  }

  /**
   * 计算乘除法
   * @param {Array} valueList - 值列表
   */
  function calculateMultiplicationAndDivision(valueList) {
    let index = valueList.findIndex(function (p) {
      return p === "*" || p === "/";
    });
    
    while (index !== -1) {
      if (valueList[index] === "*") {
        let pos1 = index - 1;
        let pos2 = index + 1;
        let v1 = valueList[pos1];
        let v2 = valueList[pos2];
        
        if (v2 === "-") {
          pos2++;
          v2 += valueList[pos2];
        }
        
        const result = multiplyNumbers(v1, v2);
        setValue2(valueList, pos1, pos2, result, 2);
      } else if (valueList[index] === "/") {
        let pos1 = index - 1;
        let pos2 = index + 1;
        let v1 = valueList[pos1];
        let v2 = valueList[pos2];
        
        if (v2 === "-") {
          pos2++;
          v2 += valueList[pos2];
        }
        
        const result = divideNumbers(v1, v2);
        setValue2(valueList, pos1, pos2, result, 2);
      }
      
      index = valueList.findIndex(function (p) {
        return p === "*" || p === "/";
      });
    }
  }

  /**
   * 计算乘方
   * @param {Array} valueList - 值列表
   */
  function calculateExponentiation(valueList) {
    let index = valueList.findIndex(function (p) {
      return p === "^";
    });
    
    while (index !== -1) {
      if (valueList[index] === "^") {
        let pos1 = index - 1;
        let pos2 = index + 1;
        let v1 = valueList[pos1];
        let v2 = valueList[pos2];
        
        if (v2 === "-") {
          pos2++;
          v2 += valueList[pos2];
        }
        
        const result = calculatePower(v1, v2);
        setValue2(valueList, pos1, pos2, result, 2);
      }
      
      index = valueList.findIndex(function (p) {
        return p === "^";
      });
    }
  }

  /**
   * 数字相除
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 相除结果
   */
  function divideNumbers(value1, value2) {
    return (convertToNumber(value1) / convertToNumber(value2)).toString();
  }

  /**
   * 数字相乘
   * @param {string} value1 - 第一个值
   * @param {string} value2 - 第二个值
   * @returns {string} 相乘结果
   */
  function multiplyNumbers(value1, value2) {
    return (convertToNumber(value1) * convertToNumber(value2)).toString();
  }

  /**
   * 计算乘方
   * @param {string} value1 - 底数
   * @param {string} value2 - 指数
   * @returns {string} 乘方结果
   */
  function calculatePower(value1, value2) {
    return Math.pow(convertToNumber(value1), convertToNumber(value2)).toString();
  }

  /**
   * 计算函数值
   * @param {string} functionName - 函数名
   * @param {Array} paramList - 参数列表
   * @param {number} pos1 - 起始位置
   * @param {number} pos2 - 结束位置
   */
  function calculateFunctionValue(functionName, paramList, pos1, pos2) {
    if (paramList === null) {
      if (functionName === "loopcell") {
        const value = "_loopcell_";
        setValue1(codeLine, pos1, pos2, value, 2);
      } else if (functionName === "today") {
        const value = getTodayValue();
        setValue1(codeLine, pos1, pos2, value, 2);
      } else if (functionName === "now") {
        const value = getNowValue();
        setValue1(codeLine, pos1, pos2, value, 2);
      }
      throw functionName + "()未实现!";
    }
    
    for (let i = 0; i < paramList.length; i++) {
      calculateOneValue(paramList[i]);
    }
    
    if (functionName === "if") {
      const value = getIfValue(paramList[0], paramList[1], paramList[2]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "value") {
      const value = getValueValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "find") {
      const value = getFindValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "abs") {
      const value = getABSValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "comp") {
      const value = getCompValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "date") {
      const value = getDateValue(paramList[0], paramList[1], paramList[2]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "datestr") {
      const value = getDateStrValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "datevalue") {
      const value = getDateValueValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "left") {
      const value = getLeftValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "lower") {
      const value = getLowerValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "mid") {
      const value = getMidValue(paramList[0], paramList[1], paramList[2]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "mod") {
      const value = getModValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "right") {
      const value = getRightValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "round") {
      const value = getRoundValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "sin") {
      const value = getSinValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "sqrt") {
      const value = getSqrtValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "power") {
      const value = getPowerValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "pi") {
      const value = Math.PI.toString();
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "string") {
      const value = getStringValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "strlen") {
      const value = getStrLenValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "tan") {
      const value = getTanValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "trimleft") {
      const value = getTrimLeftValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "trimright") {
      const value = getTrimRightValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "upper") {
      const value = getUpperValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "getcellvalue") {
      const value = getCellValueValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "min") {
      if (paramList.length === 1) {
        paramList.push(["True"]);
      }
      const value = getMinValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "max") {
      if (paramList.length === 1) {
        paramList.push(["True"]);
      }
      const value = getMaxValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "average") {
      if (paramList.length === 1) {
        paramList.push(["True"]);
      }
      const value = getAverageValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 1);
    } else if (functionName === "sum") {
      if (paramList.length === 1) {
        paramList.push(["True"]);
      }
      const value = getSumValue(paramList[0], paramList[1]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "stdev") {
      const value = getSTDEVValue(paramList[0]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (functionName === "select") {
      if (paramList.length === 1) {
        paramList.push(["True"]);
        paramList.push(["1"]);
      } else if (paramList.length === 2) {
        paramList.push(["1"]);
      }
      const value = getSelectValue(paramList[0], paramList[1], paramList[2]);
      setValue1(codeLine, pos1, pos2, value, 2);
    } else if (paramList.length === 1) {
      const value = getNoFunNameValue(paramList[0]);
      setValue2(codeLine, pos1, pos2, value, 2);
    } else {
      throw functionName + "未实现!";
    }
  }

  /**
   * 获取幂值
   * @param {string} value1 - 底数
   * @param {string} value2 - 指数
   * @returns {string} 幂值结果
   */
  function getPowerValue(value1, value2) {
    return Math.pow(Number(value1), Number(value2)).toString();
  }

  /**
   * 获取选择值
   * @param {Array} list1 - 范围列表
   * @param {Array} list2 - 条件列表
   * @param {Array} list3 - 索引列表
   * @returns {string} 选择结果
   */
  function getSelectValue(list1, list2, list3) {
    const rangeStr = getStringValue(list1);
    const cellRange = Comman.GetCellRange(rangeStr);
    const loopCondition = getStringValue(list2);
    const num = convertToInteger(getStringValue(list3));
    let index = 0;
    
    for (let col = cellRange.startCol; col <= cellRange.endCol; col++) {
      for (let row = cellRange.startRow; row <= cellRange.endRow; row++) {
        const cellValue = cellSheet.cells[col][row].str;
        if (!stringIsEmpty(cellValue)) {
          const condition = loopCondition.replace("_loopcell_", cellValue);
          const conditionList = Comman.SplitSource(condition);
          calculateOneValue(conditionList);
          if (convertToBoolean(conditionList.join("")) === true) {
            index++;
            if (index === num) {
              return cellValue;
            }
          }
        }
      }
    }
    
    throw "未找到对应的单元格!";
  }

  /**
   * 获取平均值
   * @param {Array} list1 - 范围列表
   * @param {Array} list2 - 条件列表
   * @returns {string} 平均值结果
   */
  function getAverageValue(list1, list2) {
    return getRangeSValue(list1, list2, "average");
  }

  /**
   * 获取最大值
   * @param {Array} list1 - 范围列表
   * @param {Array} list2 - 条件列表
   * @returns {string} 最大值结果
   */
  function getMaxValue(list1, list2) {
    return getRangeSValue(list1, list2, "max");
  }

  /**
   * 获取最小值
   * @param {Array} list1 - 范围列表
   * @param {Array} list2 - 条件列表
   * @returns {string} 最小值结果
   */
  function getMinValue(list1, list2) {
    return getRangeSValue(list1, list2, "min");
  }

  /**
   * 获取标准差
   * @param {Array} list1 - 范围列表
   * @returns {string} 标准差结果
   */
  function getSTDEVValue(list1) {
    const rangeStr = getStringValue(list1);
    const cellRange = Comman.GetCellRange(rangeStr);
    const values = [];
    
    for (let col = cellRange.startCol; col <= cellRange.endCol; col++) {
      for (let row = cellRange.startRow; row <= cellRange.endRow; row++) {
        const cellValue = cellSheet.cells[col][row].str;
        if (!stringIsEmpty(cellValue)) {
          values.push(convertToNumber(cellValue));
        }
      }
    }
    
    if (values.length === 0) {
      return '';
    }
    
    return calculateStandardDeviation(values, true);
  }

  /**
   * 计算数组的标准差
   * @param {Array<number>} data - 数值数组
   * @param {boolean} isSample - 是否为样本（true 则计算样本标准差，false 则计算总体标准差）
   * @returns {number} 标准差
   */
  function calculateStandardDeviation(data, isSample = false) {
    // 步骤1：计算均值
    const mean = data.reduce((sum, num) => sum + num, 0) / data.length;

    // 步骤2：计算方差（各数据与均值差的平方和）
    const variance = data.reduce((sum, num) => {
        return sum + Math.pow(num - mean, 2);
      }, 0) / (isSample ? data.length - 1 : data.length);

    // 步骤3：方差开方得到标准差
    return Math.sqrt(variance);
  }

  /**
   * 获取范围值
   * @param {Array} list1 - 范围列表
   * @param {Array} list2 - 条件列表
   * @param {string} type - 类型
   * @returns {string} 范围值结果
   */
  function getRangeSValue(list1, list2, type) {
    const rangeStr = getStringValue(list1);
    const cellRange = Comman.GetCellRange(rangeStr);
    const loopCondition = getStringValue(list2);
    const values = [];
    
    for (let col = cellRange.startCol; col <= cellRange.endCol; col++) {
      for (let row = cellRange.startRow; row <= cellRange.endRow; row++) {
        const cellValue = cellSheet.cells[col][row].str;
        if (!stringIsEmpty(cellValue)) {
          const condition = loopCondition.replace("_loopcell_", cellValue);
          const conditionList = Comman.SplitSource(condition);
          calculateOneValue(conditionList);
          if (convertToBoolean(conditionList.join("")) === true) {
            values.push(convertToNumber(cellValue));
          }
        }
      }
    }
    
    if (values.length === 0) {
      return "";
    }
    
    if (type === "min") return Math.min(...values).toString();
    else if (type === "max") return Math.max(...values).toString();
    else if (type === "average") return (values.reduce((sum, val) => sum + val, 0) / values.length).toString();
    else if (type === "sum") return values.reduce((sum, val) => sum + val, 0).toString();
    else throw "未实现" + type + "方法！";
  }

  /**
   * 获取单元格值
   * @param {Array} list - 列表
   * @returns {string} 单元格值
   */
  function getCellValueValue(list) {
    const cellAddress = getStringValue(list);
    const colRow = Comman.GetColRow(cellAddress);
    const cellValue = cellSheet.cells[colRow.col][colRow.row].str;
    
    if (!isNaN(cellValue)) {
      return cellValue;
    }
    
    return '"' + cellValue + '"';
  }

  /**
   * 获取大写值
   * @param {Array} list - 列表
   * @returns {string} 大写值
   */
  function getUpperValue(list) {
    const value = getStringValue(list);
    return value.toUpperCase();
  }

  /**
   * 获取右修剪值
   * @param {Array} list - 列表
   * @returns {string} 右修剪值
   */
  function getTrimRightValue(list) {
    const value = getStringValue(list);
    return value.trimEnd();
  }

  /**
   * 获取左修剪值
   * @param {Array} list - 列表
   * @returns {string} 左修剪值
   */
  function getTrimLeftValue(list) {
    const value = getStringValue(list);
    return value.trimStart();
  }

  /**
   * 获取今天的值
   * @returns {string} 今天的时间戳
   */
  function getTodayValue() {
    return new Date().getTime().toString();
  }

  /**
   * 获取正切值
   * @param {Array} list - 列表
   * @returns {string} 正切值
   */
  function getTanValue(list) {
    const value = convertToNumber(getStringValue(list));
    return Math.tan(value).toString();
  }

  /**
   * 获取和值
   * @param {Array} list1 - 范围列表
   * @param {Array} list2 - 条件列表
   * @returns {string} 和值结果
   */
  function getSumValue(list1, list2) {
    return getRangeSValue(list1, list2, "sum");
  }

  /**
   * 获取字符串长度
   * @param {Array} list - 列表
   * @returns {string} 字符串长度
   */
  function getStrLenValue(list) {
    const value = getStringValue(list);
    return value.length.toString();
  }

  /**
   * 获取平方根
   * @param {Array} list - 列表
   * @returns {string} 平方根
   */
  function getSqrtValue(list) {
    const value = convertToNumber(getStringValue(list));
    return Math.sqrt(value).toString();
  }

  /**
   * 获取正弦值
   * @param {Array} list - 列表
   * @returns {string} 正弦值
   */
  function getSinValue(list) {
    const value = convertToNumber(getStringValue(list));
    return Math.sin(value).toString();
  }

  /**
   * 获取四舍五入值
   * @param {Array} list1 - 数值列表
   * @param {Array} list2 - 小数位数列表
   * @returns {string} 四舍五入值
   */
  function getRoundValue(list1, list2) {
    const value = convertToNumber(getStringValue(list1));
    const decimalPlaces = convertToInteger(getStringValue(list2));
    return roundLikeCSharp(value, decimalPlaces).toString();
  }

  /**
   * C#风格的四舍五入
   * @param {number} number - 数值
   * @param {number} decimalPlaces - 小数位数
   * @returns {number} 四舍五入结果
   */
  function roundLikeCSharp(number, decimalPlaces = 0) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
  }

  /**
   * 获取右部字符串
   * @param {Array} list1 - 字符串列表
   * @param {Array} list2 - 长度列表
   * @returns {string} 右部字符串
   */
  function getRightValue(list1, list2) {
    const value = getStringValue(list1);
    const length = convertToInteger(getStringValue(list2));
    
    if (length > value.length) {
      return value;
    }
    
    return value.substring(value.length - length, length);
  }

  /**
   * 获取当前时间值
   * @returns {string} 当前时间戳
   */
  function getNowValue() {
    return new Date().getTime().toString();
  }

  /**
   * 获取模值
   * @param {Array} list1 - 第一个值列表
   * @param {Array} list2 - 第二个值列表
   * @returns {string} 模值
   */
  function getModValue(list1, list2) {
    const value1 = convertToNumber(getStringValue(list1));
    const value2 = convertToNumber(getStringValue(list2));
    return (value1 % value2).toString();
  }

  /**
   * 获取中间字符串
   * @param {Array} list1 - 字符串列表
   * @param {Array} list2 - 起始位置列表
   * @param {Array} list3 - 长度列表
   * @returns {string} 中间字符串
   */
  function getMidValue(list1, list2, list3) {
    const value = getStringValue(list1);
    const start = convertToInteger(getStringValue(list2));
    const length = convertToInteger(getStringValue(list3));
    
    if (start > value.length - 1) {
      return "";
    }
    
    if (length > value.length) {
      return value.substring(start, value.length);
    }
    
    return value.substring(start, length);
  }

  /**
   * 获取小写值
   * @param {Array} list - 列表
   * @returns {string} 小写值
   */
  function getLowerValue(list) {
    const value = getStringValue(list);
    return value.toLowerCase();
  }

  /**
   * 获取左部字符串
   * @param {Array} list1 - 字符串列表
   * @param {Array} list2 - 长度列表
   * @returns {string} 左部字符串
   */
  function getLeftValue(list1, list2) {
    const value = getStringValue(list1);
    const length = convertToInteger(getStringValue(list2));
    
    if (length <= value.length) {
      return value.substring(0, length);
    } else {
      return value;
    }
  }

  /**
   * 获取日期值
   * @param {Array} list1 - 日期字符串列表
   * @returns {string} 日期时间戳
   */
  function getDateValueValue(list1) {
    const dateStr = getStringValue(list1);
    const timestamp = Date.parse(dateStr.replace("年", "-").replace("月", "-").replace("日", "-"));
    
    if (isNaN(timestamp)) {
      return new Date(1900, 1, 1).getTime().toString();
    }
    
    return new Date(timestamp).getTime().toString();
  }

  /**
   * 补零
   * @param {number} value - 数值
   * @returns {string} 补零后的字符串
   */
  function padZero(value) {
    const str = value.toString();
    if (str.length === 1) {
      return "0" + str;
    }
    return str;
  }

  /**
   * 获取日期字符串
   * @param {Array} list1 - 时间戳列表
   * @param {Array} list2 - 格式样式列表
   * @returns {string} 日期字符串
   */
  function getDateStrValue(list1, list2) {
    const dateTicks = convertToLong(getStringValue(list1));
    const style = convertToInteger(getStringValue(list2));
    const date = new Date(dateTicks);
    
    if (style === 0) {
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    } else if (style === 1) {
      return date.getFullYear() + "-" + padZero(date.getMonth() + 1) + "-" + padZero(date.getDate()) + " " + padZero(date.getHours()) + ":" + padZero(date.getMinutes()) + ":" + padZero(date.getSeconds());
    } else if (style >= 2 && style <= 7) {
      throw "style为" + style + "的日期格式暂未实现！";
    } else if (style === 8) {
      return getNumberChName1(date.getFullYear()) + "年" + getNumberChName2(date.getMonth() + 1) + "月" + getNumberChName2(date.getDate()) + "日";
    } else if (style === 9) {
      return getNumberChName1(date.getFullYear()) + "年" + getNumberChName2(date.getMonth() + 1) + "月";
    } else if (style === 10) {
      return getNumberChName2(date.getMonth() + 1) + "月" + getNumberChName2(date.getDate()) + "日";
    } else if (style === 11) {
      return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
    } else if (style === 12) {
      return date.getFullYear() + "年" + (date.getMonth() + 1) + "月";
    } else if (style === 13) {
      return (date.getMonth() + 1) + "月" + date.getDate() + "日";
    } else {
      throw "style为" + style + "的日期格式暂未实现！";
    }
  }

  /**
   * 获取数字中文名称2
   * @param {number} value - 数值
   * @returns {string} 中文名称
   */
  function getNumberChName2(value) {
    return getNumChName2(value);
  }

  /**
   * 获取数字中文名称1
   * @param {number} value - 数值
   * @returns {string} 中文名称
   */
  function getNumberChName1(value) {
    const str = value.toString();
    const chars = [];
    
    for (let i = 0; i < str.length; i++) {
      chars.push(getNumChName(convertToInteger(str[i].toString())));
    }
    
    return chars.join("");
  }

  /**
   * 获取数字中文名称
   * @param {number} value - 数值
   * @returns {string} 中文名称
   */
  function getNumChName(value) {
    if (value === 0) return "○";
    if (value === 1) return "一";
    if (value === 2) return "二";
    if (value === 3) return "三";
    if (value === 4) return "四";
    if (value === 5) return "五";
    if (value === 6) return "六";
    if (value === 7) return "七";
    if (value === 8) return "八";
    if (value === 9) return "九";
    throw new Error("不是指定的格式!");
  }

  /**
   * 获取数字中文名称2
   * @param {number} value - 数值
   * @returns {string} 中文名称
   */
  function getNumChName2(value) {
    const str = value.toString();
    const chars = [];
    const units = ["个", "十", "百", "千", "万", "十万", "百万", "千万", "亿", "十亿", "百亿", "千亿"];
    
    for (let i = str.length - 1; i >= 0; i--) {
      chars.push(getNumChName(convertToInteger(str[i].toString())));
      if (i > 0) {
        chars.push(units[i]);
      }
    }
    
    chars.reverse();
    return chars.join("");
  }

  /**
   * 获取日期值
   * @param {Array} list1 - 年列表
   * @param {Array} list2 - 月列表
   * @param {Array} list3 - 日列表
   * @returns {string} 日期时间戳
   */
  function getDateValue(list1, list2, list3) {
    try {
      const year = convertToInteger(getStringValue(list1));
      const month = convertToInteger(getStringValue(list2));
      const day = convertToInteger(getStringValue(list3));
      const date = new Date(year, month - 1, day);
      return date.getTime().toString();
    } catch (e) {
      const date = new Date(1900, 1, 1);
      return date.getTime().toString();
    }
  }

  /**
   * 获取比较值
   * @param {Array} list1 - 第一个值列表
   * @param {Array} list2 - 第二个值列表
   * @returns {string} 比较结果
   */
  function getCompValue(list1, list2) {
    const value1 = getStringValue(list1);
    const value2 = getStringValue(list2);
    return stringCompare(value1, value2).toString();
  }

  /**
   * 获取绝对值
   * @param {Array} list - 列表
   * @returns {string} 绝对值
   */
  function getABSValue(list) {
    const value = getStringValue(list);
    return Math.abs(convertToNumber(value)).toString();
  }

  /**
   * 获取无函数名值
   * @param {Array} list - 列表
   * @returns {string} 值
   */
  function getNoFunNameValue(list) {
    return getStringValue(list);
  }

  /**
   * 获取查找值
   * @param {Array} list1 - 字符串列表
   * @param {Array} list2 - 查找字符串列表
   * @returns {string} 查找结果
   */
  function getFindValue(list1, list2) {
    const value1 = getStringValue(list1);
    const value2 = getStringValue(list2);
    return value1.indexOf(value2).toString();
  }

  /**
   * 获取值
   * @param {Array} list - 列表
   * @returns {string} 值
   */
  function getValueValue(list) {
    const value = getStringValue(list);
    
    if (value.endsWith("%")) {
      const numStr = value.substr(0, value.length - 1);
      if (isNaN(numStr)) {
        return 0;
      }
      return Number(numStr) / 100;
    }
    
    if (isNaN(value)) {
      return 0;
    }
    
    return Number(value);
  }

  /**
   * 设置值1
   * @param {Array} list - 列表
   * @param {number} pos1 - 起始位置
   * @param {number} pos2 - 结束位置
   * @param {string} value - 值
   * @param {number} type - 类型
   */
  function setValue1(list, pos1, pos2, value, type) {
    list[pos1 - 1] = value;
    
    for (let i = pos1; i <= pos2; i++) {
      list[i] = "$$$";
    }
    
    list.RemoveAll(function (p) {
      return p === "$$$";
    });
  }

  /**
   * 设置值2
   * @param {Array} list - 列表
   * @param {number} pos1 - 起始位置
   * @param {number} pos2 - 结束位置
   * @param {string} value - 值
   * @param {number} type - 类型
   */
  function setValue2(list, pos1, pos2, value, type) {
    list[pos1] = value;
    
    for (let i = pos1 + 1; i <= pos2; i++) {
      list[i] = "$$$";
    }
    
    list.RemoveAll(function (p) {
      return p === "$$$";
    });
  }

  /**
   * 获取if值
   * @param {Array} list1 - 条件列表
   * @param {Array} list2 - 真值列表
   * @param {Array} list3 - 假值列表
   * @returns {string} if结果
   */
  function getIfValue(list1, list2, list3) {
    const condition = getStringValue(list1);
    const trueValue = getStringValue(list2);
    const falseValue = getStringValue(list3);
    
    if (convertToBoolean(condition)) {
      return trueValue;
    } else {
      return falseValue;
    }
  }

  /**
   * 获取字符串值
   * @param {string|Array} value - 值
   * @returns {string} 字符串值
   */
  function getStringValue(value) {
    if (Array.isArray(value)) {
      return getStringValue2(value);
    }
    return getStringValue1(value);
  }

  /**
   * 获取字符串值1
   * @param {string} value - 值
   * @returns {string} 字符串值
   */
  function getStringValue1(value) {
    return value.trim('"');
  }

  /**
   * 获取字符串值2
   * @param {Array} list - 列表
   * @returns {string} 字符串值
   */
  function getStringValue2(list) {
    return getStringValue1(list.join(""));
  }

  /**
   * 获取参数列表
   * @param {Array} funBody - 函数体
   * @returns {Array} 参数列表
   */
  function getParamList(funBody) {
    return splitStringList(funBody, ",");
  }

  /**
   * 分割字符串列表
   * @param {Array} list - 列表
   * @param {string} splitor - 分隔符
   * @returns {Array} 分割结果
   */
  function splitStringList(list, splitor) {
    const result = [];
    let current = [];
    
    for (let i = 0; i < list.length; i++) {
      if (list[i] === splitor) {
        result.push(Comman.DeepCopyObj(current));
        current = [];
      } else {
        current.push(list[i]);
      }
    }
    
    if (list.length > 0) {
      result.push(current);
    }
    
    return result;
  }

  /**
   * 从左到右查找标志
   * @param {string} flag - 标志
   * @param {number} index - 起始索引
   * @returns {number} 找到的位置
   */
  function findFlagLeftToRight(flag, index) {
    return codeLine.indexOf(flag, index);
  }

  /**
   * 从右到左查找标志
   * @param {string} flag - 标志
   * @param {number} index - 起始索引
   * @returns {number} 找到的位置
   */
  function findFlagRightToLeft(flag, index) {
    return codeLine.lastIndexOf(flag, index);
  }

  /**
   * 转换为布尔值
   * @param {string} value - 值
   * @returns {boolean} 布尔值
   */
  function convertToBoolean(value) {
    // 简单的布尔值转换
    if (value === "true" || value === "True") return true;
    if (value === "false" || value === "False") return false;
    if (value === "1") return true;
    if (value === "0") return false;
    return Boolean(value);
  }

  /**
   * 转换为数字
   * @param {string} value - 值
   * @returns {number} 数字
   */
  function convertToNumber(value) {
    return Number(value);
  }

  /**
   * 转换为整数
   * @param {string} value - 值
   * @returns {number} 整数
   */
  function convertToInteger(value) {
    return parseInt(value, 10);
  }

  /**
   * 转换为长整数
   * @param {string} value - 值
   * @returns {number} 长整数
   */
  function convertToLong(value) {
    return parseInt(value, 10);
  }

  /**
   * 字符串比较
   * @param {string} str1 - 字符串1
   * @param {string} str2 - 字符串2
   * @returns {number} 比较结果
   */
  function stringCompare(str1, str2) {
    return str1.localeCompare(str2);
  }

  /**
   * 字符串是否为空
   * @param {string} value - 值
   * @returns {boolean} 是否为空
   */
  function stringIsEmpty(value) {
    return value === null || value === undefined || value.trim() === "";
  }

  return {
    DoJob: doJob,
  };
}