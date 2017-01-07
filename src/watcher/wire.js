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

var Wire = Events.extend({
    className: 'Wire',
    constructor: function () {
        var the = this;

        Wire.parent(the);
        the.guid = random.guid();
        the[_responseList] = [];
        the[_responseMap] = {};
    },

    /**
     * 与响应者关联
     */
    link: function () {
        var the = this;
        var response = Wire.response;

        if (response &&
            // 用来接收变化
            isFunction(response.receive) &&
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

        array.delete(the[_responseList], response);
        the.unlinked = true;
    },

    /**
     * 传递
     */
    pipe: function () {
        var the = this;
        var args = access.args(arguments);

        array.each(the[_responseList].slice(), function (index, response) {
            // 如果已经被销毁的 response
            if (!response || !response.respond) {
                return;
            }

            response.pipe.apply(response, args);
        });
    }
});
var _responseList = Wire.sole();
var _responseMap = Wire.sole();

Wire.response = null;
module.exports = Wire;


function isFunction(any) {
    return typeis.Function(any);
}