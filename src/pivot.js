/**
 * 中枢
 * @author ydr.me
 * @created 2016-12-30 13:30
 */


'use strict';

var Events = require('blear.classes.events');
var random = require('blear.utils.random');
var array = require('blear.utils.array');
var access = require('blear.utils.access');
var typeis = require('blear.utils.typeis');

var Pivot = Events.extend({
    className: 'Pivot',
    constructor: function () {
        var the = this;

        Pivot.parent(the);
        the[_list] = [];
        the[_map] = {};
    },

    /**
     * 关联传导神经元
     * @returns {Pivot}
     */
    link: function () {
        var the = this;
        var target = Pivot.target;

        if (!typeis.Function(target)) {
            return the;
        }

        var gid = target[_gid] = target[_gid] || random.guid();
        var map = the[_map];
        var list = the[_list];

        if (map[gid]) {
            return the;
        }

        map[gid] = true;
        list.push(target);
        console.log(target);

        return the;
    },

    /**
     * 中枢变化
     * @returns {Pivot}
     */
    react: function () {
        var the = this;
        var args = access.args(arguments);

        array.each(the[_list], function (index, neuron) {
            try {
                neuron.apply(neuron, args);
            } catch (err) {
                if (typeof DEBUG !== 'undefined' && DEBUG) {
                    console.error('执行中枢变化失败');
                    console.error(err);
                }
            }
        });

        return the;
    }
});
var _list = Pivot.sole();
var _map = Pivot.sole();
var _gid = Pivot.sole();

Pivot.target = null;

// /**
//  * 设置当前目标
//  * @param target
//  */
// Pivot.set = function (target) {
//     Pivot.target = target || null;
// };
//
// /**
//  * 返回当前目标
//  * @returns {null|*}
//  */
// Pivot.get = function () {
//     return Pivot.target;
// };

module.exports = Pivot;
