/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-01 17:10
 */


'use strict';

var rs = require('./random-string');
var ra = require('./random-array');
var MVVM = require('../src/index');

var data = window.data = {
    students: [{
        name: '张三',
        tags: [
            '乐观',
            '好学'
        ]
    }, {
        name: '李四',
        tags: [
            '勤奋',
            '刻苦',
            '专研'
        ]
    }]
};

new MVVM({
    el: '#app',
    data: data,
    methods: {
        onPush: function () {
            data.students.push({
                name: rs(),
                tags: ra()
            });
        },
        onShift: function () {
            data.students.shift();
        },
        onChangeName: function () {
            if(!data.students.length) {
                return;
            }

            data.students[0].name = rs();
        },
        onChangeTags: function () {
            if(!data.students.length) {
                return;
            }

            data.students[0].tags = ra();
        }
    }
});


