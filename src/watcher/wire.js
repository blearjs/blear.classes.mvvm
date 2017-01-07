/**
 * 导线
 * @author ydr.me
 * @created 2016-12-30 13:30
 * @updated 2017年01月07日15:10:21
 */


'use strict';

var Events = require('blear.classes.events');
var random = require('blear.utils.random');
var array = require('blear.utils.array');
var access = require('blear.utils.access');
var typeis = require('blear.utils.typeis');

var Wire = Events.extend({
    className: 'Wire',
    constructor: function () {
        var the = this;

        Wire.parent(the);
        the.guid = random.guid();
        the[_terminalList] = [];
        the[_terminalMap] = {};
    },

    /**
     * 与响应者关联
     */
    link: function () {
        var the = this;
        // 获取当前视图链接的终端
        var terminal = Wire.Watcher.terminal;

        if (
            terminal &&
            // 用来接收变化
            isFunction(terminal.pipe) &&
            // 用来关联代理
            isFunction(terminal.link)
        ) {
            var guid = terminal.guid;
            var map = the[_terminalMap];
            var list = the[_terminalList];

            if (map[guid]) {
                return;
            }

            map[guid] = true;
            list.push(terminal);
            terminal.link(the);
        }
    },

    /**
     * 切断与某个终端的关联
     * @param terminal
     */
    unlink: function (terminal) {
        var the = this;

        array.delete(the[_terminalList], terminal);
        the.unlinked = true;
    },

    /**
     * 传递
     */
    pipe: function () {
        var the = this;
        var args = access.args(arguments);

        array.each(the[_terminalList].slice(), function (index, terminal) {
            // 如果已经被销毁的 terminal
            if (!terminal || !isFunction(terminal.pipe)) {
                return;
            }

            terminal.pipe.apply(terminal, args);
        });
    }
});
var _terminalList = Wire.sole();
var _terminalMap = Wire.sole();

module.exports = Wire;

function isFunction(any) {
    return typeis.Function(any);
}
