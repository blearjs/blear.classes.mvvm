/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var random = require('blear.utils.random');

var arrayDiff = require('../../src/utils/array-diff');

var arr1 = [1, 2, 3, 4];
var arr2 = [2, 1, 3, 4, 5];
var ret = arrayDiff(arr1, arr2);

document.getElementById('pre1').innerHTML = JSON.stringify(arr1, null, 4);
document.getElementById('pre2').innerHTML = JSON.stringify(ret, null, 4);
document.getElementById('pre3').innerHTML = JSON.stringify(arr2, null, 4);

