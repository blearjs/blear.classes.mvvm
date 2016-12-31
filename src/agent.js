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
        the[_list] = [];
        the[_map] = {};
    },

    /**
     * 与响应者关联
     */
    link: function () {
        var the = this;
        var target = Agent.target;

        if (!typeis.Function(target)) {
            return;
        }

        var gid = target[_gid] = target[_gid] || random.guid();
        var map = the[_map];
        var list = the[_list];

        if (map[gid]) {
            return;
        }

        map[gid] = true;
        list.push(target);
    },

    /**
     * 销毁：取消与响应者的管理
     */
    unlink: function () {
        this[_list] = this[_map] = null;
    },

    /**
     * 中枢变化
     */
    react: function () {
        var the = this;
        var args = access.args(arguments);

        array.each(the[_list], function (index, executor) {
            executor.apply(executor, args);
        });
    }
});
var _list = Agent.sole();
var _map = Agent.sole();
var _gid = Agent.sole();

Agent.target = null;
module.exports = Agent;
