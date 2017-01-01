/**
 * 文件描述
 * @author ydr.me
 * @created 2016-12-31 15:42
 */


'use strict';

var MVVM = require('../src/index');

var data = window.data = {
    list0: [
        // list1
        [
            // list2
            [
                // list3
                []
            ]
        ]
    ]
};

var random = require('blear.utils.random');

var buildString = function () {
    return random.string(5,
        '习近平致信祝贺中国国际电视台开播李克强主持召开国务' +
        '院常务会议茶话会上强调两大精神强调一个词' +
        '环保部发布年度十大雾霾谣言：雾霾能堵死肺泡' +
        '调查称今年近成白领未休年假工作生活满意度不高' +
        '央行下调大额现金交易人民币报告标准至未连接到互联网' +
        '你是哪里啊君主我们租了个房子新年快乐！虽然我发的不是红包，' +
        '但是我给你的是最真诚的祝福，2016年已经过去了，' +
        '我希望在2017年里你更加开心快乐，身体健康，吃嘛嘛香，钱越挣越多。'
    );
};

new MVVM({
    el: '#app',
    data: data,
    methods: {
        pushArray: function () {
            data.list0[0][0][0].push(buildString());
        },
        popArray: function () {
            data.list0[0][0][0].pop();
        }
    }
});

