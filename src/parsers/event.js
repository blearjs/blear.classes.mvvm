/**
 * 解析事件
 * @author ydr.me
 * @created 2016-12-25 15:02
 */


'use strict';

var varible = require('../utils/varible');
var configs = require('../configs');

var excuteRE = /\(.*?\)\s*?$/;
var operatorRE = /[!+-=*/]/;


/**
 * 解析事件字符串为函数表达式
 * @param expression
 * @param utilsName
 * @returns {Function}
 */
module.exports = function (expression, utilsName) {
    utilsName = utilsName || varible();
    var scopeName = varible();
    var errorName = varible();
    var eventName = configs.eventName;
    var elName = configs.elementName;
    var body =
        'try{' +
        /****/'with(' + scopeName + '){';

    // 运算
    // 如：abc.def += 123
    if (operatorRE.test(expression)) {
        body += expression;
    }

    // 有括号
    // 如：abc.def(123)
    else if (excuteRE.test(expression)) {
        body += expression;
    }

    // 普通
    // 如：abc.def
    else {
        body += expression + '(' + eventName + ')';
    }

    body +=
        /****/ '}' +
        '}catch(' + errorName + '){' +
        /****/'if(typeof DEBUG!=="undefined"&&DEBUG){' +
        /****//****/'console.error(' + errorName + ');' +
        /****/'}' +
        '}';

    try {
        return new Function(elName, eventName, scopeName, utilsName, body);
    } catch (err) {
        if (typeof DEBUG !== 'undefined' && DEBUG) {
            console.error('表达式书写有误：');
            console.error(body);
            console.error(err);
        }

        return function () {
            // ignore
        };
    }
};


