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
var typeis = require('blear.utils.typeis');

var observe = require('./observe');
var Agent = require('./agent');

var defaults = {
    keys: null
};
var Watcher = Events.extend({
    className: 'Watcher',

    constructor: function (data, options) {
        var the = this;

        the.guid = random.guid();
        the[_agentMap] = {};
        the[_agentList] = [];
        options = the[_options] = object.assign({}, defaults, options);

        var keys = options.keys;

        if (keys && typeis.Array(keys)) {
            array.each(keys, function (index, key) {
                observe.key(data, key);
            });
        } else {
            observe.data(data);
        }
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

        // // 取消所有代理与响应者的关联关系
        // array.each(the[_agentList], function (index, agent) {
        //     agent.unlink();
        // });
        // the[_agentList] = null;
        Watcher.invoke('destroy', the);
    }
});
var _options = Watcher.sole();
var _agentMap = Watcher.sole();
var _agentList = Watcher.sole();

object.define(Watcher, 'response', {
    get: function () {
        return Agent.response;
    },
    set: function (response) {
        Agent.response = response;
    }
});

Agent.Watcher = Watcher;
module.exports = Watcher;
