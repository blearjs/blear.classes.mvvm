/**
 * 响应器
 * @author ydr.me
 * @created 2017-01-01 11:17
 */


'use strict';


var random = require('blear.utils.random');
// var array = require('blear.utils.array');
// var access = require('blear.utils.access');
// var typeis = require('blear.utils.typeis');
var object = require('blear.utils.object');
var Terminal = require('blear.classes.watcher').Terminal;

var Queue = require('./queue');
var evtParser = require('../parsers/event');
var configs = require('../configs');

var queue = new Queue();
var THIS_STR = 'this';

var Responder = Terminal.extend({
    className: 'Responder',
    constructor: function (directive) {
        var the = this;

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
                exp = THIS_STR;
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
                    directive.get = function () {
                        return the.get();
                    };
                }
                break;
        }

        if (directive.empty) {
            exp = THIS_STR;
        }

        Responder.parent(the, {
            context: scope,
            expression: exp,
            receiver: function (newVal, oldVal, signal) {
                if (!directive.filters.once) {
                    // 推入队列，待下一次事件循环后再进行 DOM 更新
                    queue.push(the, newVal, oldVal, signal);
                }
            },
            imme: false,
            deep: false
        });

        if (directive.category === 'model') {
            directive.set = function (val) {
                object.set(scope, directive.modelName, val);
            };
        }
    },

    /**
     * 发声，响应 DOM 变化
     * @param newVal
     * @param oldVal
     * @param signal
     */
    speak: function (newVal, oldVal, signal) {
        var the = this;
        var directive = the.directive;

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
        var notSameOrigin = isForDirective && newVal !== signal.parent && signal.method !== 'set';

        // set 的是 for 指定的字段 abc.list = [1, 2, 3];
        var setSameKey = isForDirective && signal.method === 'set' && signal.key === directive.exp;

        // 比如：
        // 原始数组 todos = [...]
        // 计算数组 filteredTodos = todos.filter(...)
        if (notSameOrigin && !setSameKey) {
            // 如果是计算属性的话，当做 set 来处理，重写 signal
            if (newVal && newVal[configs.computedFlagName]) {
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
                return;
            }
        }

        directive.update(directive.node, newVal, oldVal, signal);
    },

    destroy: function () {
        var the = this;

        Responder.invoke('destroy', the);
        the.unlinked = true;
        the.directive = null;
    }
});
var _wireList = Responder.sole();
var _wireMap = Responder.sole();

module.exports = Responder;
