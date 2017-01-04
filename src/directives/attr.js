/**
 * class 指令
 * @author ydr.me
 * @created 2016-12-26 10:34
 */


'use strict';

var object = require('blear.utils.object');
var array = require('blear.utils.array');
var attribute = require('blear.core.attribute');

var varible = require('../utils/varible');
var map = {
    style: require('./attr/style'),
    class: require('./attr/class'),
    default: require('./attr/default')
};


var mapRE = /\{.*?}/g;
// {class1, class2: varible}
// {bordr-width: 20px; width: 30px}
var groupRE = /\s*[,;]\s*/;
var itemRE = /^(.*?)[:=](.*)$/;
var arrRE = /^\[|]$/g;
var strRE = /^["']/;
var spaceRE = /\s+/;
var className = varible();
var TRUE_STR = 'true';
var STYLE_STR = 'style';
var CLASS_STR = 'class';

module.exports = {
    // a => list: ["a"]
    // {a} => map: {"a": true}
    // [a] => list: ["a"]
    // [{a}] => map: {"a": true}
    // {a: b} => map: {"a": "b"}
    // {a: b, c} => map: {"a": "b", c: true}
    // [{a: b, c}, d] => map: {"a": "b", c: true}, list: ["d"]
    // [{a: b, c}, d, "e"] => map: {"a": "b", c: true, e: true}, list: ["d"]
    init: function () {
        var the = this;
        var value = the.value;
        var name = the.name;

        if (name !== STYLE_STR && name !== CLASS_STR) {
            return value;
        }

        // class 会进行布尔值转换，其他的不需要
        var fun = name === CLASS_STR ? 'Boolean' : '';
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
                var items = group.match(itemRE);
                var key = items[1].trim();

                map[key] = items[2].trim() || TRUE_STR;
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
                key + ':' + fun + '(' + val + ')'
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

        the.exp = '{map:' + mapExp + ',list:' + listExp + '}';
    },
    update: function (node, newVal, oldVal) {
        oldVal = oldVal || {map: {}, list: []};

        var processor = map[this.name] || map.default;

        processor.update(this, newVal, oldVal);
    }
};

