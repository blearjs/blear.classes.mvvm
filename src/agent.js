/**
 * 观察与响应的代理
 * @author ydr.me
 * @created 2016-12-30 13:30
 */


'use strict';

var Events = require('blear.classes.events');
var random = require('blear.utils.random');
var array = require('blear.utils.array');
var access = require('blear.utils.access');
var typeis = require('blear.utils.typeis');

var Agent = Events.extend({
    className: 'Agent',
    constructor: function () {
        var the = this;

        Agent.parent(the);
        the.guid = random.guid();
        the[_watcherList] = [];
        the[_siblings] = [];
        the[_watcherMap] = {};
        the[_parent] = null;
        the[_child] = null;
        console.log(new Date(), 'create agent', the.guid);
    },

    // /**
    //  * 上级代理
    //  * @param parent
    //  */
    // parent: function (parent) {
    //     if (!parent || parent === this) {
    //         return;
    //     }
    //
    //     this[_parent] = parent;
    //     parent[_child] = this;
    // },

    /**
     * 与响应者关联
     */
    link: function () {
        var the = this;
        var watcher = Agent.watcher;

        if (watcher && watcher instanceof Agent.Watcher) {
            var guid = watcher.guid;
            var map = the[_watcherMap];
            var list = the[_watcherList];

            if (map[guid]) {
                return;
            }

            debugger;
            map[guid] = true;
            list.push(watcher);
            watcher.link(the);
        }
    },


    concat: function (agent) {
        if (agent === this) {
            return;
        }

        console.log(new Date(), 'agent concat', agent.guid, this.guid);
        this[_siblings].push(agent);
    },

    /**
     * 销毁：取消与响应者的管理
     */
    unlink: function () {
        this[_watcherList] = this[_watcherMap] = null;
    },

    /**
     * 中枢变化
     */
    react: function () {
        var the = this;
        var args = access.args(arguments);

        // if (the[_parent]) {
        //     the[_parent].react.apply(the[_parent], args);
        // }
        //
        // if (the[_child]) {
        //     the[_child].react.apply(the[_child], args);
        // }
        //
        // array.each(the[_siblings], function (index, agent) {
        //     agent.react.apply(agent, args);
        // });

        array.each(the[_watcherList], function (index, watcher) {
            watcher.dispath.apply(watcher, args);
        });
    }
});
var _watcherList = Agent.sole();
var _watcherMap = Agent.sole();
var _parent = Agent.sole();
var _child = Agent.sole();
var _siblings = Agent.sole();

if (typeof DEBUG !== 'undefined' && DEBUG) {
    _watcherList = '_watcherList';
    _watcherMap = '_watcherMap';
    _parent = '_parent';
    _child = '_child';
    _siblings = '_siblings';
}

Agent.response = null;
module.exports = Agent;
