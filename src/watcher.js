/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-31 02:36
 */


'use strict';

var Events = require('blear.classes.events');

var watch = require('./watch');
var Pivot = require('./pivot');

var Watcher = Events.extend({
    className: 'Watcher',

    constructor: function (data, options) {
        watch(data);
    },

    destroy: function () {
        var the = this;


        Watcher.invoke('destroy', the);
    }
});

Watcher.Pivot = Pivot;
module.exports = Watcher;
