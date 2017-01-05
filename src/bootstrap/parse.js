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

var textParser = require('../parsers/text');
var Directive = require('../classes/directive');
var configs = require('../configs');

var attrDirectiveRE;
var ctrlDirectiveRE;
var directiveFilterDelimiterRE;
var CTRL_STR = 'ctrl';
var ATTR_STR = 'attr';
var HTML_STR = 'html';
var TEXT_STR = 'text';
var EVENT_STR = 'event';
var CONDITION_STR = 'condition';
var DISPLAY_STR = 'display';
var MODEL_STR = 'model';
var FOR_STR = 'for';
var PRE_STR = 'pre';
var categoryNameMap = {};
var lastAttrDirective = null;

categoryNameMap['for'] = FOR_STR;
categoryNameMap['show'] = DISPLAY_STR;
categoryNameMap['hide'] = DISPLAY_STR;
categoryNameMap['if'] = CONDITION_STR;
categoryNameMap['else'] = CONDITION_STR;
categoryNameMap['else-if'] = CONDITION_STR;
categoryNameMap[MODEL_STR] = MODEL_STR;
categoryNameMap[HTML_STR] = HTML_STR;
categoryNameMap[TEXT_STR] = TEXT_STR;
categoryNameMap[PRE_STR] = PRE_STR;


function compileRegExp() {
    attrDirectiveRE = new RegExp('^' + string.escapeRegExp(configs.attrDirective));
    ctrlDirectiveRE = new RegExp('^' + string.escapeRegExp(configs.ctrlDirective));
    directiveFilterDelimiterRE = new RegExp(string.escapeRegExp(configs.directiveFilterDelimiter));
}


/**
 * 解析属性节点为指令信息
 * @param {ViewModel} vm
 * @param {HTMLElement} node
 * @param {Node} attr
 */
exports.attr = function (vm, node, attr) {
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

    // 控制分类中再细分，默认为事件
    if (category === CTRL_STR) {
        category = categoryNameMap[name] || EVENT_STR;
    }

    switch (category) {
        case EVENT_STR:
            directive = Directive.create(EVENT_STR, name, vm);
            break;

        case ATTR_STR:
            directive = Directive.create(ATTR_STR, name, vm);
            break;

        default:
            directive = Directive.create(category, name, vm);
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

    array.reduce(delimiters, function (prevVal, nowVal) {
        prevVal[nowVal] = true;
        return prevVal;
    }, directive.filters);
    directive.node = node;
    directive.attr = attrName;
    directive.exp = directive.value = attrValue;
    directive.prev = lastAttrDirective;

    if (lastAttrDirective) {
        lastAttrDirective.refPrev = directive;
    }

    lastAttrDirective = directive;

    return directive;
};


/**
 * 解析文本节点为指令信息
 * @param {ViewModel} vm
 * @param {Node} node
 */
exports.text = function (vm, node) {
    var expression = node.textContent;
    var tokens = textParser(expression);
    var directives = [];

    // 纯文本，直接跳过
    if (tokens === null) {
        return directives;
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

        var directive = Directive.create(TEXT_STR, TEXT_STR, vm);
        var tokenValue = token.value;

        directive.filters.once = token.once;
        directive.node = textNodes[index];
        directive.attr = null;
        directive.exp = directive.value = tokenValue;
        directives.push(directive);
    });

    return directives;
};
