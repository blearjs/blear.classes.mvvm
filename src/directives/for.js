/**
 * html 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var modification = require('blear.core.modification');
var array = require('blear.utils.array');

var directive = require('./directive');
var compile = require('../utils/compile');
var address = require('../utils/address');

module.exports = directive({
    aborted: true,
    install: function (node) {
        var the = this;
        var director = the.director;
        var arr = director.value.match(/^(.*)\s+in\s+(.*)$/);

        the.alias = arr[1];
        director.expression = the.expression = arr[2];
        the.scope = director.scope;
        the.address = address(node, '@for');
        the.tplNode = node;
        modification.remove(node);
    },
    update: function (node, newVal, oldVal, operation) {
        var the = this;
        var director = the.director;
        var alias = the.alias;
        var expression = the.expression;
        var parentScope = the.scope;
        var address = the.address;
        var tplNode = the.tplNode;
        var data = director.get(expression);

        debugger;
        array.each(data, function (index, data) {
            // 以 parentScope 创建一个实例，这个实例属性是空的，但原型指向 parentScope
            // 此时的 childScope 可以访问 parentScope 的属性
            var childScope = Object.create(parentScope);
            var childNode = tplNode.cloneNode(true);

            childScope[alias] = data;
            modification.insert(childNode, address, 0);
            compile(childNode, director.mvvm, childScope);
        });
    }
});

