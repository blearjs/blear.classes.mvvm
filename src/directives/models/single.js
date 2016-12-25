/**
 * single model
 * @author ydr.me
 * @created 2016-12-25 19:53
 */


'use strict';

var event = require('blear.core.event');

var eventParser = require('../../parsers/event');
var strFlow = require('../../utils/string-flow');
var varible = require('../../utils/varible');
var configs = require('../../configs');

var utilsName = varible();
var updateName = varible();

exports.init = function (directive, node, newVal) {
    var elementName = configs.elementName;
    var modelName = directive.modelName;
    var vm = directive.vm;

    directive[updateName] = eventParser(
        'if(' + elementName + '.type==="radio"){' +
        /****/elementName + '.checked=Boolean(' + utilsName + '.similar(' + modelName + ',' + elementName + '.value));' +
        '}else{' +
        /****/elementName + '.value=' + modelName + ';' +
        '}',
        utilsName
    );

    var change = eventParser(
        modelName + '=' + elementName + '.value;'
    );

    event.on(vm.el, 'change', node, directive.listener = function (ev) {
        change(node, ev, directive.scope);
    });
};

exports.update = function (directive, node) {
    directive[updateName](node, null, directive.scope, strFlow);
};


