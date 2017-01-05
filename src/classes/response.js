/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-01 11:17
 */


'use strict';


var Events = require('blear.classes.events');
var random = require('blear.utils.random');
var array = require('blear.utils.array');
var access = require('blear.utils.access');
var Watcher = require('../watcher/index');

var Queue = require('./queue');
var expParser = require('../parsers/expression');
var evtParser = require('../parsers/event');

var queue = new Queue();

var Response = Events.extend({
    className: 'Response',
    constructor: function (directive) {
        var the = this;

        Response.parent(the);
        the.directive = directive;
        the.guid = random.guid();
        the.respond = null;
        the[_agentList] = [];
        the[_agentMap] = {};
        the.oldVal = undefined;

        var exp = directive.exp;
        var scope = directive.scope;

        switch (directive.category) {
            case 'event':
                // 表达式解析需要在指令 init 之后
                var executer = evtParser(exp);
                directive.get = function (el, ev) {
                    return executer.call(scope, scope, el, ev);
                };
                break;

            default:
                if (directive.empty) {
                    directive.get = function () {
                        // empty
                    };
                } else {
                    // 表达式解析需要在指令 init 之后
                    var getter = expParser(exp);
                    directive.get = function () {
                        the.beforeGet();
                        var ret = getter.call(scope, scope);
                        the.afterGet();
                        return ret;
                    };
                }
                break;
        }

        if (!directive.filters.once) {
            the.respond = function (operation) {
                var newVal = directive.get();

                // 但这里已经修正，在如下 DOM 结构里：
                // <1 @for="list1 in list0">
                //     <2 @for="list2 in list1">
                //         <3 @for="list3 in list2">
                //             {{list0}}    <= 这里对 list0 的引用，当超过两级数组，新建的数据就对此不会生效
                //             [[[1]]]      <= 第 1 次加的
                //             [[[1, 2]]]   <= 第 2 次加的，新的列表里有两项，但历史数据没有被更新
                //         </3>
                //     </2>
                // </1>
                // 不是同一个数据源 => 取消后续操作
                if (directive.category === 'for' && operation.method !== 'set' && newVal !== operation.parent) {
                    return;
                }

                directive.update(directive.node, newVal, the.oldVal, operation);
                the.oldVal = newVal;
            };
        }
    },

    beforeGet: function () {
        Watcher.response = this;
    },

    afterGet: function () {
        Watcher.response = null;
    },

    link: function (agent) {
        var the = this;
        var guid = agent.guid;
        var map = the[_agentMap];
        var list = the[_agentList];

        if (map[guid]) {
            return;
        }

        map[guid] = true;
        list.push(agent);
    },

    unlink: function () {
        var the = this;

        array.each(the[_agentList], function (index, agent) {
            agent.unlink(the);
        });

        the.destroy();
        the.respond = null;
        the.unlinked = true;
    },

    receive: function () {
        var args = access.args(arguments);
        queue.push(this, args);
    }
});
var _agentList = Response.sole();
var _agentMap = Response.sole();

module.exports = Response;
