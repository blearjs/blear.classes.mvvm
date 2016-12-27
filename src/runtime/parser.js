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
var configs = require('../configs');
var Directive = require('../classes/directive');

var attrDirectiveRE;
var ctrlDirectiveRE;
var directiveFilterDelimiterRE;
var CTRL_STR = 'ctrl';
var ATTR_STR = 'attr';
var TEXT_STR = 'text';
var EVENT_STR = 'event';
var CONDITION_STR = 'cond';
var MODEL_STR = 'model';
var FOR_STR = 'for';
var categoryNameMap = {};

categoryNameMap['for'] = FOR_STR;
categoryNameMap['if'] = CONDITION_STR;
categoryNameMap['else'] = CONDITION_STR;
categoryNameMap['else-if'] = CONDITION_STR;
categoryNameMap[MODEL_STR] = MODEL_STR;


function compileRegExp() {
    attrDirectiveRE = new RegExp('^' + string.escapeRegExp(configs.attrDirective));
    ctrlDirectiveRE = new RegExp('^' + string.escapeRegExp(configs.ctrlDirective));
    directiveFilterDelimiterRE = new RegExp(string.escapeRegExp(configs.directiveFilterDelimiter));
}


/**
 * 解析属性节点为指令信息
 * @param {HTMLElement} node
 * @param {Node} attr
 * @param {Object} scope
 * @param {ViewModel} vm
 */
exports.attr = function (node, attr, scope, vm) {
    var attrName = attr.nodeName.toLowerCase();
    var attrValue = attr.nodeValue;
    var category = '';
    var fullname = '';
    var directive;

    if (!attrDirectiveRE) {
        compileRegExp();
    }

    if (ctrlDirectiveRE.test(attrName)) {
        category = CTRL_STR;
        fullname = attrName.replace(ctrlDirectiveRE, '');
    } else if (attrDirectiveRE.test(attrName)) {
        category = ATTR_STR;
        fullname = attrName.replace(attrDirectiveRE, '');
    } else {
        return;
    }

    // @click.enter.false
    var delimiters = fullname.split(directiveFilterDelimiterRE);
    var name = delimiters.shift();
    var filtes = array.reduce(delimiters, function (prevVal, nowVal) {
        prevVal[nowVal] = true;
        return prevVal;
    }, {});

    // 控制分类中再细分，默认为事件
    if (category === CTRL_STR) {
        category = categoryNameMap[name] || EVENT_STR;
    }

    switch (category) {
        case EVENT_STR:
            directive = new Directive(directives.event);
            break;

        case ATTR_STR:
            directive = new Directive(directives);
            break;

        default:
            directive = new Directive(directives[category]);
            break;
    }


    if (!directive) {

        if (typeof DEBUG !== 'undefined' && DEBUG) {
            console.error('未匹配到', category, '指令：');
            console.error('attrName: ', attrName);
            console.error('attrValue: ', attrValue);
        }

        return;
    }

    node.removeAttribute(attrName);
    directive.node = node;
    directive.attr = attr;
    directive.name = name;
    directive.filters = filtes;
    directive.exp = directive.value = attrValue;
    directive.category = category;
    directive.scope = scope;
    directive.vm = vm;
    directive.init();

    var expFn;

    switch (category) {
        case EVENT_STR:
            expFn = eventParser(directive.exp);
            directive.eval = function (el, ev) {
                return expFn.call(scope, el, ev, scope);
            };
            break;

        default:
            expFn = expressionParser(directive.exp);
            directive.eval = function () {
                return expFn.call(scope, scope);
            };
            break;
    }

    directive.expFn = expFn;
    vm.add(directive);

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

        var directive = new Directive(directives.text);
        var tokenValue = token.value;

        directive.node = textNodes[index];
        directive.attr = null;
        directive.exp = directive.value = tokenValue;
        directive.category = TEXT_STR;
        directive.scope = scope;
        directive.vm = vm;
        directive.init();

        var expFn = expressionParser(directive.exp);

        directive.expFn = expFn;
        directive.eval = function () {
            return expFn.call(scope, scope);
        };
        vm.add(directive);
    });
};
