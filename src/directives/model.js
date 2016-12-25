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
    radio: require('./models/radio')
};

module.exports = pack({
    init: function (node) {
        var the = this;
        var desc = the.desc;
        var inputType = (node.type || node.tagName).toLowerCase();

        the.modelName = desc.exp;
        the.modelType = inputType;

        var modelCate;

        switch (inputType) {
            case 'text':
            case 'password':
            case 'textarea':
                modelCate = 'text';
                break;

            case 'checkbox':
            case 'radio':
                modelCate = inputType;
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

