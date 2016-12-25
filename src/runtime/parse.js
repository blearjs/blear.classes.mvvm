/**
 * 解析
 * @author ydr.me
 * @created 2016-12-20 22:22
 */


'use strict';

var object = require('blear.utils.object');
var event = require('blear.core.event');

var expressionParse = require('../parsers/expression');
var textParse = require('../parsers/text');
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
    var attrVal = attr.nodeValue;
    // @click.enter.false
    var nameArr = name.split('.');
    var directiveName = nameArr.shift();
    var directiveFn = directives[directiveName];
    var directiveFilters = nameArr;

    if (typeof DEBUG === 'undefined' || !DEBUG) {
        node.removeAttribute(attrName);
    }

    var desc = {
        node: node,
        attr: attr,
        name: directiveName,
        exp: attrVal,
        filters: directiveFilters
    };

    var maybeOnDirective = !directiveFn;
    var directive = maybeOnDirective ? directives.on() : directiveFn();

    directive.scope = scope;
    directive.vm = vm;
    directive.desc = desc;

    if (maybeOnDirective) {
        event.on(vm.el, directiveName, node, function () {
            directive;
            desc;
            debugger;
        });
    } else {
        directive.getter = expressionParse(attrVal);
        vm.add(directive);
        monitor.add(directive);
        return directive.aborted;
    }

    // 其余指令当做事件处理


    // if (typeof DEBUG !== 'undefined' && DEBUG) {
    //     console.error(
    //         '当前正在编译的指令无法解析\n' +
    //         'name: ' + name + '\n' +
    //         'value: ' + attrVal
    //     );
    // }
};


/**
 * 解析文本节点为指令信息
 * @param {Node} node
 * @param {Object} scope
 * @param {ViewModel} vm
 */
exports.text = function (node, scope, vm) {
    var expression = node.textContent;
    var getter = textParse(expression);

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

    vm.add(directive);
    monitor.add(directive);
};
