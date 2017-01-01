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

window.AgentList = [];

var Agent = Events.extend({
    className: 'Agent',
    constructor: function () {
        var the = this;

        Agent.parent(the);
        the.guid = random.guid();
        the[_responseList] = [];
        the[_siblings] = [];
        the[_responseMap] = {};
        the[_parent] = null;
        the[_child] = null;
        AgentList.push(the);
    },

    /**
     * 与响应者关联
     */
    link: function () {
        var the = this;
        var response = Agent.response;

        if (response &&
            // 用来执行变化
            isFunction(response.respond) &&
            // 用来关联代理
            isFunction(response.link)) {
            var guid = response.guid;
            var map = the[_responseMap];
            var list = the[_responseList];

            if (map[guid]) {
                return;
            }

            map[guid] = true;
            list.push(response);
            response.link(the);
        }
    },

    /**
     * 销毁：取消与响应者的管理
     */
    unlink: function (response) {
        var the = this;

        // 2、删除在数据对象上的引用
        var refList = the.refList;

        if(refList) {
            array.delete(refList, the);
            delete the.refMap[the.guid];
        }
        // 普通
        else {
            array.delete(the[_responseList], response);
        }

        the.unlinked = true;
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

        array.each(the[_responseList], function (index, response) {
            // 如果已经被销毁的 response
            if (!response || !response.respond) {
                return;
            }

            response.respond.apply(response, args);
        });
    }
});
var _responseList = Agent.sole();
var _responseMap = Agent.sole();
var _parent = Agent.sole();
var _child = Agent.sole();
var _siblings = Agent.sole();

if (typeof DEBUG !== 'undefined' && DEBUG) {
    _responseList = '_responseList';
    _responseMap = '_responseMap';
    _parent = '_parent';
    _child = '_child';
    _siblings = '_siblings';
}

Agent.response = null;
module.exports = Agent;


function isFunction(any) {
    return typeis.Function(any);
}