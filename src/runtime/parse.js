/**
 * 解析
 * @author ydr.me
 * @created 2016-12-20 22:22
 */


'use strict';

var array = require('blear.utils.array');
var event = require('blear.core.event');

var expressionParser = require('../parsers/expression');
var textParser = require('../parsers/text');
var eventParser = require('../parsers/event');
var directives = require('../directives/index');
var monitor = require('./monitor');

var reVarible = /\{\{([^{}]+?)}}/g;

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

    directive.scope = scope;
    directive.vm = vm;
    directive.desc = desc;

    if (maybeOnDirective) {
        directive.name = 'on';
        directive.type = directiveName;
        var call = eventParser(exp);
        directive.exec = function (ev) {
            return call(ev, scope);
        };
        vm.add(directive);
        monitor.add(directive);
    } else {
        var getter = expressionParser(exp);
        directive.getter = getter;
        directive.name = directiveName;
        directive.get = function () {
            return getter(scope);
        };
        vm.add(directive);
        monitor.add(directive);
        return directive.aborted;
    }
};


/**
 * 解析文本节点为指令信息
 * @param {Node} node
 * @param {Object} scope
 * @param {ViewModel} vm
 */
exports.text = function (node, scope, vm) {
    var expression = node.textContent;
    var getter = textParser(expression);

    if (getter === null) {
        return;
    }

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
        return getter(scope);
    };

    vm.add(directive);
    monitor.add(directive);
};
