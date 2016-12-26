/**
 * 解析（属性、文本）
 * @author ydr.me
 * @created 2016-12-20 22:22
 */


'use strict';

var array = require('blear.utils.array');
var event = require('blear.core.event');
var modification = require('blear.core.modification');

var expressionParser = require('../parsers/expression');
var textParser = require('../parsers/text');
var eventParser = require('../parsers/event');
var directives = require('../directives/index');
var monitor = require('./monitor');

/**
 * 解析属性节点为指令信息
 * @param {Node} node
 * @param {Node} attr
 * @param {Object} scope
 * @param {ViewModel} vm
 */
exports.attr = function (node, attr, scope, vm) {
    var attrName = attr.nodeName;

    if (attrName[0] !== '@') {
        return;
    }

    var name = attrName.slice(1);
    var exp = attr.nodeValue;
    // @click.enter.false
    var nameArr = name.split('.');
    var directiveName = nameArr.shift();
    var directiveFn = directives[directiveName];
    var directiveFilters = array.reduce(nameArr, function (prevVal, nowVal) {
        prevVal[nowVal] = true;
        return prevVal;
    }, {});

    if (typeof DEBUG === 'undefined' || !DEBUG) {
        node.removeAttribute(attrName);
    }

    var desc = {
        node: node,
        attr: attr,
        name: directiveName,
        exp: exp,
        filters: directiveFilters
    };
    var maybeOnDirective = !directiveFn;
    var directive = maybeOnDirective ? directives.on() : directiveFn();

    // 事件指令
    if (maybeOnDirective) {
        directive.type = 'on';
        var exectter = eventParser(exp);
        directive.exec = function (el, ev) {
            return exectter.call(scope, el, ev, scope);
        };
    }
    // 普通指令
    else {
        var getter = expressionParser(exp);
        directive.getter = getter;
        directive.get = function () {
            return getter.call(scope, scope);
        };
    }

    directive.name = directiveName;
    directive.scope = scope;
    directive.vm = vm;
    directive.desc = desc;
    vm.add(directive);
    monitor.add(directive);
    return directive.aborted;
};


var replaceTextNodes = function (node, tokens) {
    var childNodes = [];

    array.each(tokens, function (index, token) {
        var childNode = modification.create('#text', token);
        childNodes.push(childNode);
        modification.insert(childNode, node, 3);
    });

    node.textContent = '';
    return childNodes;
};
//
//
// var createTextNode = function (node, scope, vm, expression) {
//
// };


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

    // 替换节点，进行精细化更新
    var textNodes = [];

    array.each(tokens, function (index, token) {
        var childNode = modification.create('#text', token.value);
        textNodes.push(childNode);
        modification.insert(childNode, node, 0);
    });

    node.textContent = '';

    array.each(textNodes, function (index, node) {
        var token = tokens[index];

        // 普通文本
        if (!token.tag) {
            return;
        }

        var getter = expressionParser(token.value);
        var directive = directives.text();
        var desc = {
            node: node,
            attr: null,
            expression: expression
        };
        directive.scope = scope;
        directive.vm = vm;
        directive.desc = desc;
        directive.getter = getter;
        directive.get = function () {
            return getter.call(scope, scope);
        };

        vm.add(directive);
        monitor.add(directive);
    });
};
