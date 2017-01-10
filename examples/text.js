/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

function hongbao(money, people, min, max) {
    console.time('计算耗时');
    var list = [];
    var start = 0;

    money *= 100;
    min *= 100;
    max *= 100;

    // function makeSeq2() {
    //     var $n = 10;
    //     var $sum = 100;
    //     var $result = [];
    //     for (var $i = $n; $i >= 1; $i--) {
    //         var $min = ($sum - 12 * ($i - 1)) > 6 ? ($sum - 12 * ($i - 1)) : 6;
    //         var $max = ($sum - 6 * ($i - 1)) < 12 ? ($sum - 6 * ($i - 1)) : 12;
    //
    //         var $randNum = random.number($min, $max);
    //         $sum -= $randNum;
    //         $result.push($randNum);
    //     }
    //     return $result;
    // }
    //
    // return makeSeq2();

    while (start < people - 1) {
        var remainPeople = people - start;
        var perMin = Math.max(min, money / remainPeople);
        var perMax = Math.max(max, money / remainPeople);
        var lucky = random.number(perMin, perMax);

        list.push(lucky / 100);
        money -= lucky;
        start++;
    }

    list.push(money / 100);

    return list;


    // // 先每人 min 元
    // while (len--) {
    //     arr.push(min);
    // }
    //
    // var remain = money - people * min;
    // // 1分
    // var luckyMin = 1;
    //
    // // 从剩余金额里随机取钱
    // // 循环给人加钱
    // var start = 0;
    // while (remain) {
    //     if (start === people) {
    //         start = 0;
    //     }
    //
    //     var luckyPeopleHas = arr[start];
    //     var luckyPeopleMax = Math.min(remain, max - luckyPeopleHas);
    //     var luckyMoney = random.number(luckyMin, luckyPeopleMax);
    //
    //     arr[start] += luckyMoney;
    //     remain -= luckyMoney;
    //     start++;
    // }
    //
    // console.timeEnd('计算耗时');
    // return arr.map(function (item) {
    //     return item / 100;
    // });
}

// var len = 100;
//
// while (len--) {
//     var list = hongbao(100, 10, 6, 12);
//
//     list.forEach(function (item) {
//         if (item < 6 || item > 12) {
//             throw new Error(item + '出错');
//         }
//     });
//
//     console.log(list, eval(list.join('+')));
// }

var MVVM = require('../src/index');

var data = window.data = {
    text1: '<b>1</b>',
    text2: 'heh'
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
