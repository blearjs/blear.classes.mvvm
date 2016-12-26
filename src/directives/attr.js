/**
 * class 指令
 * @author ydr.me
 * @created 2016-12-26 10:34
 */


'use strict';

var object = require('blear.utils.object');
var array = require('blear.utils.array');
var attribute = require('blear.core.attribute');

var pack = require('./pack');
var varible = require('../utils/varible');
var arrayCompare = require('../utils/array-compare');

var mapRE = /\{.*?}/g;
var groupRE = /\s*,\s*/;
var itemRE = /\s*:\s*/;
var arrRE = /^\[|]$/g;
var strRE = /^["']/;
var spaceRE = /\s+/;
var TRUE_STR = 'true';
var className = varible();

module.exports = pack({
    // a => list: ["a"]
    // {a} => map: {"a": true}
    // [a] => list: ["a"]
    // [{a}] => map: {"a": true}
    // {a: b} => map: {"a": "b"}
    // {a: b, c} => map: {"a": "b", c: true}
    // [{a: b, c}, d] => map: {"a": "b", c: true}, list: ["d"]
    // [{a: b, c}, d, "e"] => map: {"a": "b", c: true, e: true}, list: ["d"]
    parse: function () {
        var value = this.value;
        var map = {};
        var list = [];

        // 先按 {} 分组
        var mapMatches = value.match(mapRE) || [];
        array.each(mapMatches, function (index, match) {
            // 去除左右 {、}
            match = match.slice(1, -1);

            // 然后按 , 分组
            var groups = match.split(groupRE);

            array.each(groups, function (index, group) {
                var items = group.split(itemRE);
                var key = items[0];

                map[key] = items[1] || TRUE_STR;
            });
        });

        // 剩余部分
        value = value.replace(mapRE, '').replace(arrRE, '');
        var listMatches = value.split(groupRE);
        array.each(listMatches, function (index, match) {
            if (!match) {
                return;
            }

            list.push(match);
        });

        var mapExpList = [];
        object.each(map, function (key, val) {
            if (!strRE.test(key)) {
                key = '"' + key + '"';
            }

            mapExpList.push(
                key + ':Boolean(' + val + ')'
            );
        });
        var mapExp = '{' + mapExpList.join(',') + '}';

        var listExpList = [];
        array.each(list, function (index, val) {
            listExpList.push(
                'String(' + val + ')'
            );
        });
        var listExp = '[' + listExpList.join(',') + ']';

        return '{map:' + mapExp + ',list:' + listExp + '}';
    },
    update: function (node, newVal, oldVal) {
        oldVal = oldVal || {list: []};

        object.each(newVal.map, function (key, val) {
            if (val) {
                attribute.addClass(node, key);
            } else {
                attribute.removeClass(node, key);
            }
        });

        var diff = arrayCompare(oldVal.list, newVal.list);

        array.each(diff.insert, function (index, val) {
            attribute.addClass(node, val);
        });

        array.each(diff.remove, function (index, val) {
            attribute.removeClass(node, val);
        });
    }
});

