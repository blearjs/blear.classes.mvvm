/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-31 02:36
 */


'use strict';

var Events = require('blear.classes.events');
var array = require('blear.utils.array');
var object = require('blear.utils.object');

var observe = require('./observe');
var Agent = require('./agent');

var defaults = {};
var Watcher = Events.extend({
    className: 'Watcher',

    constructor: function (data, options) {
        var the = this;

        the[_agents] = [];
        observe(the, data);
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
        the[_agents] = null;

        Watcher.invoke('destroy', the);
    }
});
var _agents = Watcher.sole();

object.define(Watcher, 'target', {
    get: function () {
        return Agent.target;
    },
    set: function (target) {
        Agent.target = target;
    }
});

module.exports = Watcher;
