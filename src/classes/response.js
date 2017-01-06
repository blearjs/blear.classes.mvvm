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
var typeis = require('blear.utils.typeis');
var object = require('blear.utils.object');
var Watcher = require('../watcher/index');

var Queue = require('./queue');
var expParser = require('../parsers/expression');
var evtParser = require('../parsers/event');
var configs = require('../configs');

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
        the.newVal = undefined;

        var exp = directive.exp;
        var scope = directive.scope;

        switch (directive.category) {
            // 事件指令
            case 'event':
                // 表达式解析需要在指令 init 之后
                var executer = evtParser(exp);
                the.get = function (el, ev) {
                    return executer(scope, el, ev);
                };
                break;

            // 普通指令
            // 虚拟指令
            default:
                if (directive.empty) {
                    the.get = function () {
                        // empty
                    };
                } else {
                    // 表达式解析需要在指令 init 之后
                    var getter = expParser(exp);
                    the.get = function () {
                        return (the.newVal = getter(scope));
                    };
                }
                break;
        }

        if (directive.category === 'model') {
            the.set = function (val) {
                object.set(scope, directive.modelName, val);
            };
        }

        if (!directive.filters.once) {
            the.respond = function (operation) {
                the.beforeGet();
                the.get();

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

                var isForDirective = directive.category === 'for';

                // for 变化的不是同一个数组（多维数组）
                var notSameOrigin = isForDirective && the.newVal !== operation.parent;

                // set 的是 for 指定的字段 abc.list = [1, 2, 3];
                var setSameKey = isForDirective && operation.method === 'set' && operation.key === directive.exp;

                if (notSameOrigin && !setSameKey) {
                    // 如果是计算属性的话，当做 set 来处理，重写 operation
                    if (the.newVal[configs.computedFlagName]) {
                        operation = object.filter(operation, [
                            'newVal',
                            'oldVal',
                            'parent',
                            'type',
                            'insertValue'
                        ]);
                        operation.method = 'set';
                    }
                    // 其他变化都忽略
                    else {
                        the.afterGet();
                        return;
                    }
                }

                // for 指令数组变化同源 && 已经变化
                if (the.newVal !== the.oldVal) {
                    directive.update(directive.node, the.newVal, the.oldVal, operation);
                }

                the.afterGet();
            };
        }
    },

    beforeGet: function () {
        Watcher.response = this;
    },

    afterGet: function () {
        Watcher.response = null;

        var the = this;
        var newVal = the.newVal;

        if (typeof newVal === 'object') {
            the.oldVal = object.assign(typeis.Object(newVal) ? {} : [], newVal)
        } else {
            the.oldVal = newVal;
        }
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
