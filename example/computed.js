/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-03 18:04
 */


'use strict';

var MVVM = require('../src/index');

window.data = {
    firstName: '张',
    lastName: '三',
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
            return this.arr1.filter(function (item) {
                return item.n > 0.5;
            });
        }
    },
    methods: {
        onPush: function () {
            this.arr1.push({n: Math.random()})
        }
    }
});
