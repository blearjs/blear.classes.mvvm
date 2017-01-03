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
    fullName: function () {
        return this.firstName + this.lastName;
    }
};
new MVVM({
    el: '#app',
    data: data
});
