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

module.exports = function (expression) {
    var scopeName = varible();
    var eventName = configs.eventName;
    var errorName = varible();
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
        /****/'if(typeof EDBUG!=="undefined"&&DEBUG){' +
        /****//****/'console.error(err);' +
        /****/'}' +
        '}';

    try {
        return new Function(eventName, scopeName, body);
    } catch (err) {
        if (typeof DEBUG !== 'undefined' && DEBUG) {
            console.error('表达式书写有误：');
            console.error(expression);
            console.error(err.stack);
        }

        return function () {
            // ignore
        };
    }
};


