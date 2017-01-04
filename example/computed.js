/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-03 18:04
 */


'use strict';

var MVVM = require('../src/index');

window.data = {
    firstName: '张',
    lastName: '三'
};
new MVVM({
    el: '#app',
    data: data,
    computed: {
        fullName1: function () {
            return this.firstName + this.lastName;
        },
        fullName2: {
            get: function () {
                return this.firstName + ' ' + this.lastName
            },
            set: function (val) {
                var full = val.match(/^(.*?)\s(.*)$/) || ['', ''];

                this.firstName = full[1];
                this.lastName = full[2];
            }
        }
    }
});
