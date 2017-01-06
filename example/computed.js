/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-03 18:04
 */


'use strict';

var MVVM = require('../src/index');

var n = function () {
    return Number(Math.random().toFixed(2));
};

window.data = {
    firstName: '张',
    lastName: '三',
    filter: 0.5,
    arr1: []
};
new MVVM({
    el: '#app',
    data: data,
    computed: {
        fullName: {
            get: function () {
                return this.firstName + ' ' + this.lastName
            },
            set: function (val) {
                var full = val.match(/^(.*?)\s(.*)$/) || ['', ''];

                this.firstName = full[1];
                this.lastName = full[2];
            }
        },
        arr2: function () {
            var the = this;
            return the.arr1.filter(function (item) {
                return item > the.filter;
            });
        }
    },
    methods: {
        onPush: function () {
            this.arr1.push(n());
        },
        onFilter: function () {
            this.filter = n();
        }
    }
});
