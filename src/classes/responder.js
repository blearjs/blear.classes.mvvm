/**
 * 响应器
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
var Watcher = require('blear.classes.watcher');

var Queue = require('./queue');
var expParser = require('../parsers/expression');
var evtParser = require('../parsers/event');
var configs = require('../configs');

var queue = new Queue();

var Responder = Events.extend({
    className: 'Responder',
    constructor: function (directive) {
        var the = this;

        Responder.parent(the);
        the.directive = directive;
        the.guid = random.guid();
        the[_wireList] = [];
        the[_wireMap] = {};
        the.oldVal = undefined;
        the.newVal = undefined;

        var exp = directive.exp;
        var scope = directive.scope;

        switch (directive.category) {
            // 事件指令
            case 'event':
                // 表达式解析需要在指令 init 之后
                var executer = evtParser(exp);
                directive.get = function (el, ev) {
                    return executer(scope, el, ev);
                };
                break;

            // 普通指令
            // 虚拟指令
            default:
                if (directive.empty) {
                    directive.get = function () {
                        // empty
                    };
                } else {
                    // 表达式解析需要在指令 init 之后
                    var getter = expParser(exp);
                    directive.get = function () {
                        return (the.newVal = getter(scope));
                    };
                }
                break;
        }

        if (directive.category === 'model') {
            directive.set = function (val) {
                object.set(scope, directive.modelName, val);
            };
        }

        if (!directive.filters.once) {
            the.pipe = function (signal) {
                // 推入队列，待下一次事件循环后再进行 DOM 更新
                queue.push(the, signal);
            };
        }

        the.get = directive.get;
        the.set = directive.set;
    },

    beforeGet: function () {
        Watcher.terminal = this;
    },

    afterGet: function () {
        Watcher.terminal = null;

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
        var map = the[_wireMap];
        var list = the[_wireList];

        if (map[guid]) {
            return;
        }

        map[guid] = true;
        list.push(agent);
    },

    unlink: function () {
        var the = this;

        array.each(the[_wireList], function (index, wire) {
            wire.unlink(the);
        });

        the.destroy();
        the.unlinked = true;
        the[_wireList]
            = the[_wireMap]
            = the.pipe
            = the.directive
            = the.get
            = the.set
            = null;
    },

    /**
     * 发声，响应 DOM 变化
     * @param signal
     */
    speak: function (signal) {
        var the = this;
        var directive = the.directive;

        the.beforeGet();
        directive.get();

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
        var notSameOrigin = isForDirective && the.newVal !== signal.parent;

        // set 的是 for 指定的字段 abc.list = [1, 2, 3];
        var setSameKey = isForDirective && signal.method === 'set' && signal.key === directive.exp;

        if (notSameOrigin && !setSameKey) {
            // 如果是计算属性的话，当做 set 来处理，重写 signal
            if (the.newVal[configs.computedFlagName]) {
                signal = object.filter(signal, [
                    'newVal',
                    'oldVal',
                    'parent',
                    'type',
                    'insertValue'
                ]);
                signal.method = 'set';
            }
            // 其他变化都忽略
            else {
                the.afterGet();
                return;
            }
        }

        // for 指令数组变化同源 && 已经变化
        if (the.newVal !== the.oldVal) {
            directive.update(directive.node, the.newVal, the.oldVal, signal);
        }

        the.afterGet();
    }
});
var _wireList = Responder.sole();
var _wireMap = Responder.sole();

module.exports = Responder;
