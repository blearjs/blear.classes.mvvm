/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-31 02:36
 */


'use strict';

var Events = require('blear.classes.events');
var array = require('blear.utils.array');
var object = require('blear.utils.object');
var random = require('blear.utils.random');

var observe = require('./observe');
var Agent = require('./agent');

var defaults = {};
var Watcher = Events.extend({
    className: 'Watcher',

    constructor: function (data, options) {
        var the = this;

        the.guid = random.guid();
        the[_agentMap] = {};
        the[_agentList] = [];
        observe(the, data);
    },

    link: function (agent) {
        var the = this;

        if (agent && agent instanceof Agent) {
            var map = the[_agentMap];
            var list = the[_agentList];
            var guid = agent.guid;

            if (map[guid]) {
                return;
            }

            map[guid] = true;
            list.push(agent);
        }
    },

    dispath: function () {
        //
    },

    destroy: function () {
        var the = this;

        // 取消所有代理与响应者的关联关系
        array.each(the[_agentList], function (index, agent) {
            agent.unlink();
        });
        the[_agentList] = null;
        Watcher.invoke('destroy', the);
    }
});
var _agentMap = Watcher.sole();
var _agentList = Watcher.sole();

object.define(Watcher, 'active', {
    get: function () {
        return Agent.watcher;
    },
    set: function (watcher) {
        Agent.watcher = watcher;
    }
});

Agent.Watcher = Watcher;
module.exports = Watcher;
