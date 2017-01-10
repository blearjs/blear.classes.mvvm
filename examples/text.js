/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

function hongbao(money, people, min, max) {
    console.time('计算耗时');
    var arr = [];
    var len = people;

    money *= 100;
    min *= 100;
    max *= 100;

    // 先每人 min 元
    while (len--) {
        arr.push(min);
    }

    var remain = money - people * min;
    // 1分
    var luckyMin = 1;

    // 从剩余金额里随机取钱
    // 循环给人加钱
    var start = 0;
    while (remain) {
        if (start === people) {
            start = 0;
        }

        var luckyPeopleHas = arr[start];
        var luckyPeopleMax = Math.min(remain, max - luckyPeopleHas);
        var luckyMoney = random.number(luckyMin, luckyPeopleMax);

        arr[start] += luckyMoney;
        remain -= luckyMoney;
        start++;
    }

    console.timeEnd('计算耗时');
    return arr.map(function (item) {
        return item / 100;
    });
}


var MVVM = require('../src/index');

var data = window.data = {
    text1: '<b>1</b>',
    text2: 'heh',
    list: hongbao(100, 10, 6, 12)
};

new MVVM({
    el: '#app',
    data: data
});

document.getElementById('change1').onclick = function () {
    data.text1 = random.string();
};

document.getElementById('change2').onclick = function () {
    data.text2 = random.string();
};
