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
var directiveFilterDelimiterRE;
var EVENT_STR = 'event';
var ATTR_STR = 'attr';
var CONTROL_STR = 'control';
var TEXT_STR = 'text';


function compileRegExp() {
    eventDirectiveRE = new RegExp('^' + string.escapeRegExp(configs.eventDirective));
    attrDirectiveRE = new RegExp('^' + string.escapeRegExp(configs.attrDirective));
    controlDirectiveRE = new RegExp('^' + string.escapeRegExp(configs.controlDirective));
    directiveFilterDelimiterRE = new RegExp('^' + string.escapeRegExp(configs.directiveFilterDelimiter));
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
    var attrValue = attr.nodeValue;
    var category = '';
    var directive;

    if (!attrDirectiveRE) {
        compileRegExp();
    }

    if (eventDirectiveRE.test(attrName)) {
        category = EVENT_STR;
        directive = directives.event();
    } else if (attrDirectiveRE.test(attrName)) {
        category = ATTR_STR;
        directive = directives.attr();
    } else if (controlDirectiveRE.test(attrName)) {
        category = CONTROL_STR;
    } else {
        return;
    }

    if (!directive) {

        if (typeof DEBUG !== 'undefined' && DEBUG) {
            console.error('未匹配到', category, '指令：');
            console.error('attrName: ', attrName);
            console.error('attrValue: ', attrValue);
        }

        return;
    }

    var fullname = attrName.replace(attrDirectiveRE, '');
    // @click.enter.false
    var delimiters = fullname.split(directiveFilterDelimiterRE);
    var name = delimiters.shift();
    var filtes = array.reduce(delimiters, function (prevVal, nowVal) {
        prevVal[nowVal] = true;
        return prevVal;
    }, {});

    node.removeAttribute(attrName);

    directive.node = node;
    directive.attr = attr;
    directive.name = name;
    directive.filters = filtes;
    directive.value = attrValue;
    directive.category = category;
    directive.scope = scope;
    directive.vm = vm;
    directive.exp = directive.parse() || attrValue;

    switch (category) {
        case EVENT_STR:
            var exectter = eventParser(directive.exp);
            directive.exec = function (el, ev) {
                return exectter.call(scope, el, ev, scope);
            };
            break;

        case ATTR_STR:
            var getter = expressionParser(directive.exp);
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
        var tokenValue = token.value;

        directive.node = textNodes[index];
        directive.attr = null;
        directive.value = tokenValue;
        directive.category = TEXT_STR;
        directive.scope = scope;
        directive.vm = vm;
        directive.exp = directive.parse() || tokenValue;

        var getter = expressionParser(directive.exp);

        directive.getter = getter;
        directive.eval = function () {
            return getter.call(scope, scope);
        };
        vm.add(directive);
        monitor.add(directive);
    });
};
