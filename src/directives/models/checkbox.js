/**
 * checkbox model
 * @author ydr.me
 * @created 2016-12-25 17:43
 */


'use strict';

var typeis = require('blear.utils.typeis');
var array = require('blear.utils.array');
var event = require('blear.core.event');

var varible = require('../../utils/varible');
var eventParser = require('../../parsers/event');
var configs = require('../../configs');

var utils = {
    boo: typeis.Boolean,

    fd: function (arr, val) {
        var foundIndex = -1;

        array.each(arr, function (index, item) {
            if (item + '' === val + '') {
                foundIndex = index;
                return false;
            }
        });

        return foundIndex;
    },

    set: function (arr, val) {
        var foundIndex = utils.fd(arr, val);

        if (foundIndex === -1) {
            arr.push(val);
        }
    },

    rm: function (arr, val) {
        var foundIndex = utils.fd(arr, val);

        if (foundIndex !== -1) {
            arr.splice(foundIndex, 1);
        }
    }
};

var utilsName = varible();
var updateName = varible();

exports.init = function (directive, node) {
    var vm = directive.vm;
    var el = vm.el;
    var scope = directive.scope;
    var modelName = directive.modelName;
    var elementName = configs.elementName;
    var change = eventParser(
        'if(' + utilsName + '.boo(' + modelName + ')){' +
        /****/modelName + ' = Boolean(' + elementName + '.checked);' +
        '}else{' +
        /****/'if(' + elementName + '.checked){' +
        /****//****/utilsName + '.set(' + modelName + ', ' + elementName + '.value);' +
        /****/'}else{' +
        /****//****/utilsName + '.rm(' + modelName + ', ' + elementName + '.value);' +
        /****/'}' +
        '}',
        utilsName
    );

    directive[updateName] = eventParser(
        'if(' + utilsName + '.boo(' + modelName + ')){' +
        /****/elementName + '.checked=Boolean(' + modelName + ');' +
        '}else{' +
        /****/elementName + '.checked=' + utilsName + '.fd(' + modelName + ',' + elementName + '.value)!==-1;' +
        '}',
        utilsName
    );

    event.on(el, 'change', node, directive.listener = function (ev) {
        change(this, ev, scope, utils);
    });
};

exports.update = function (directive, node, newVal) {
    var scope = directive.scope;

    directive[updateName](node, null, scope, utils);
};
