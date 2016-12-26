/**
 * model 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var event = require('blear.core.event');

var pack = require('./pack');
var cateMap = {
    text: require('./models/text'),
    checkbox: require('./models/checkbox'),
    single: require('./models/single'),
    multiple: require('./models/multiple')
};

module.exports = pack({
    init: function (node) {
        var the = this;
        var desc = the.desc;
        var scope = the.scope;
        var tagName = node.tagName.toLowerCase();
        var inputType = node.type;

        if (tagName === 'select' || tagName === 'textarea') {
            inputType = tagName;
        }

        var modelName =  desc.exp;

        the.modelName = modelName;
        the.modelType = inputType;
        the.get = function () {
            return scope[modelName];
        };
        the.set = function (val) {
            scope[modelName] = val;
        };

        var modelCate;

        switch (inputType) {
            case 'text':
            case 'password':
            case 'textarea':
                modelCate = 'text';
                break;

            case 'checkbox':
                modelCate = inputType;
                break;

            case 'radio':
                modelCate = 'single';
                break;

            case 'select':
                modelCate = node.multiple ? 'multiple' : 'single';
                break;
        }

        the.modelCate = modelCate;
        cateMap[modelCate].init(the, node);
    },
    update: function (node, newVal, oldVal) {
        var the = this;
        cateMap[the.modelCate].update(the, node, newVal);
    },
    destroy: function () {
        var the = this;

        event.on(el, 'input', the.listener);
        event.on(el, 'compositionstart', the.compositionstart);
        event.on(el, 'compositionend', the.compositionend);
    }
});

