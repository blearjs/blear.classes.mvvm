/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-31 02:36
 */


'use strict';

var Events = require('blear.classes.events');
var array = require('blear.utils.array');

var observe = require('./observe');
var Agent = require('./agent');

var defaults = {};
var Watcher = Events.extend({
    className: 'Watcher',

    constructor: function (data, options) {
        var the = this;

        observe(the, data);
        the[_agents] = [];
    },

    add: function (agent) {
        this[_agents].push(agent);
    },

    destroy: function () {
        var the = this;

        // 取消所有代理与响应者的关联关系
        array.each(the[_agents], function (index, agent) {
            agent.unlink();
        });

        Watcher.invoke('destroy', the);
    }
});
var _agents = Watcher.sole();

Watcher.Pivot = Agent;
module.exports = Watcher;
