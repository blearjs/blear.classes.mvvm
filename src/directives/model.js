/**
 * model 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var event = require('blear.core.event');
var object = require('blear.utils.object');

var cateMap = {
    text: require('./models/text'),
    checkbox: require('./models/checkbox'),
    single: require('./models/single'),
    multiple: require('./models/multiple')
};

module.exports = {
    init: function () {
        var the = this;
        var node = the.node;
        var tagName = node.tagName.toLowerCase();
        var inputType = node.type;

        if (tagName === 'select' || tagName === 'textarea') {
            inputType = tagName;
        }

        the.modelName = the.exp;
        the.modelType = inputType;

        var modelCate;

        switch (inputType) {
            case 'checkbox':
                modelCate = inputType;
                break;

            case 'radio':
                modelCate = 'single';
                break;

            case 'select':
                modelCate = node.multiple ? 'multiple' : 'single';
                break;

            default:
                modelCate = 'text';
                break;
        }

        the.modelCate = modelCate;
        cateMap[modelCate].init(the);
    },
    update: function (node, newVal, oldVal) {
        var the = this;

        cateMap[the.modelCate].update(the, newVal);
    },
    destroy: function () {
        var the = this;

        cateMap[the.modelCate].destroy(the);
    }
};

