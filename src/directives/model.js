/**
 * model 指令
 * @author ydr.me
 * @created 2016-12-19 19:01
 */


'use strict';

var attribute = require('blear.core.attribute');
var event = require('blear.core.event');
var time = require('blear.utils.time');

var pack = require('./pack');
var eventParser = require('../parsers/event');
var varible = require('../utils/varible');
var checkbox = require('./models/checkbox');
var text = require('./models/text');
var configs = require('../configs');

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
                text.init(the, node);
                break;

            case 'checkbox':
                modelCate = inputType;
                checkbox.init(the, node);
                break;
        }

        the.modelCate = modelCate;
    },
    update: function (node, newVal, oldVal) {
        var the = this;

        switch (the.modelCate) {
            case 'checkbox':
                checkbox.update(the, node, newVal);
                break;

            case 'text':
                text.update(the, node, newVal);
                break;
        }
    },
    destroy: function () {
        var the = this;

        event.on(el, 'input', the.listener);
        event.on(el, 'compositionstart', the.compositionstart);
        event.on(el, 'compositionend', the.compositionend);
    }
});

