/**
 * 指令出口
 * @author ydr.me
 * @created 2016-12-24 00:48
 */


'use strict';

var typeis = require('blear.utils.typeis');

var Directive = require('../classes/directive');

var definitionMap = {};

definitionMap.html = require('./html');
definitionMap.text = require('./text');
definitionMap.for = require('./for');
definitionMap.event = require('./event');
definitionMap.model = require('./model');
definitionMap.attr = require('./attr');
definitionMap.pre = require('./pre');
definitionMap.condition = require('./condition');
definitionMap.display = require('./display');
definitionMap.virtual = require('./virtual');

/**
 * 根据类型返回指令实例
 * @param category
 */
module.exports = function (category) {
    var definition;

    if (typeis.String(category)) {
        definition = definitionMap[category];

        if (!definition) {
            if (typeof DEBUG !== 'undefined' && DEBUG) {
                throw new TypeError('未找到`' + category + '`类型指令');
            }

            return;
        }

        return new Directive(definition);
    }

    return new Directive(category);
};


