/**
 * 解析（属性、文本）
 * @author ydr.me
 * @created 2016-12-20 22:22
 */


'use strict';

var array = require('blear.utils.array');
var string = require('blear.utils.string');
var event = require('blear.core.event');
var modification = require('blear.core.modification');

var expressionParser = require('../parsers/expression');
var textParser = require('../parsers/text');
var eventParser = require('../parsers/event');
var directives = require('../directives/index');
var monitor = require('./monitor');
var configs = require('../configs');

var eventDirectiveRE;
var attrDirectiveRE;
var controlDirectiveRE;
var EVENT_STR = 'event';
var ATTR_STR = 'attr';
var CONTROL_STR = 'control';


function compileRegExp() {
    eventDirectiveRE = new RegExp('^' + string.escapeRegExp(configs.eventDirective));
    attrDirectiveRE = new RegExp('^' + string.escapeRegExp(configs.attrDirective));
    controlDirectiveRE = new RegExp('^' + string.escapeRegExp(configs.controlDirective));
}


/**
 * 解析属性节点为指令信息
 * @param {HTMLElement} node
 * @param {Node} attr
 * @param {Object} scope
 * @param {ViewModel} vm
 */
exports.attr = function (node, attr, scope, vm) {
    var attrName = attr.nodeName;
    var category = '';

    if (!attrDirectiveRE) {
        compileRegExp();
    }

    if (eventDirectiveRE.test(attrName)) {
        category = EVENT_STR;
    } else if (attrDirectiveRE.test(attrName)) {
        category = ATTR_STR;
    } else if (controlDirectiveRE.test(attrName)) {
        category = CONTROL_STR;
    } else {
        return;
    }

    var name = attrName.replace(attrDirectiveRE, '');
    var attrValue = attr.nodeValue;
    // @click.enter.false
    var nameArr = name.split('.');
    var directiveName = nameArr.shift();
    var directiveFn = directives[directiveName];
    var directiveFilters = array.reduce(nameArr, function (prevVal, nowVal) {
        prevVal[nowVal] = true;
        return prevVal;
    }, {});

    node.removeAttribute(attrName);

    var maybeOnDirective = !directiveFn;
    var directive = maybeOnDirective ? directives.on() : directiveFn();

    directive.node = node;
    directive.attr = attr;
    directive.name = directiveName;
    directive.filters = directiveFilters;
    directive.value = attrValue;
    directive.category = category;
    directive.name = directiveName;
    directive.scope = scope;
    directive.vm = vm;
    var exp = directive.exp = directive.parse();

    switch (category) {
        case EVENT_STR:
                var exectter = eventParser(exp);
                directive.exec = function (el, ev) {
                    return exectter.call(scope, el, ev, scope);
                };
            break;

        case ATTR_STR:
                var getter = expressionParser(exp);
                directive.getter = getter;
                directive.eval = function () {
                    return getter.call(scope, scope);
                };
            break;

        case CONTROL_STR:
            break;
    }

    vm.add(directive);
    monitor.add(directive);

    return directive.aborted;
};


/**
 * 解析文本节点为指令信息
 * @param {Node} node
 * @param {Object} scope
 * @param {ViewModel} vm
 */
exports.text = function (node, scope, vm) {
    var expression = node.textContent;
    var tokens = textParser(expression);

    // 纯文本，直接跳过
    if (tokens === null) {
        return;
    }

    // 1、必须先处理节点
    var textNodes = [];
    array.each(tokens, function (index, token) {
        // 替换文本节点，进行精细化更新
        var textNode = modification.create('#text', token.value);
        textNodes.push(modification.insert(textNode, node, 0));
    });

    if (typeof DEBUG !== 'undefined' && DEBUG) {
        // debug 模式，使用注释替换
        var commentNode = modification.create('#comment', node.textContent);
        modification.replace(commentNode, node);
    } else {
        // 移除原始节点
        modification.remove(node);
    }

    // 2、然后再处理指令，否则会重复处理
    array.each(tokens, function (index, token) {
        // 普通文本
        if (!token.tag) {
            return;
        }

        var directive = directives.text();
        var exp = token.value;
        var desc = {
            node: textNodes[index],
            attr: null,
            value: exp
        };
        desc.exp = exp = directive.parse(desc);
        var getter = expressionParser(exp);
        directive.scope = scope;
        directive.vm = vm;
        directive.desc = desc;
        directive.getter = getter;
        directive.eval = function () {
            return getter.call(scope, scope);
        };
        vm.add(directive);
        monitor.add(directive);
    });
};
