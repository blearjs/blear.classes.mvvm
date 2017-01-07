/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var MVVM = require('../../src/index');
var utils = require('../utils');

it('@if 懒编译特性', function (done) {
    var el = utils.createDIV();
    var data = {
        bool: false,
        text: 'a'
    };
    el.innerHTML = '<p @if="bool">{{text}}</p>';
    var pEl = el.firstElementChild;

    new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toBe('');
    expect(pEl.innerHTML).toBe('{{text}}');

    utils.removeDIV(el);
    done();
});

// it('@if', function (done) {
//     var el = utils.createDIV();
//     var data = {
//         bool: true
//     };
//     el.innerHTML = '<p @if="bool">1</p>';
//
//     new MVVM({
//         el: el,
//         data: data
//     });
//
//     expect(el.innerHTML).toEqual('<p>1</p>');
//     data.bool = false;
//     expect(el.innerHTML).toEqual('');
//
//     utils.removeDIV(el);
//     done();
// });
//
// it('@if + @else', function (done) {
//     var el = utils.createDIV();
//     var data = {
//         bool: true
//     };
//     el.innerHTML = '<p @if="bool">1</p><p @else>2</p>';
//
//     new MVVM({
//         el: el,
//         data: data
//     });
//
//     expect(el.innerHTML).toEqual('<p>1</p>');
//     data.bool = false;
//     expect(el.innerHTML).toEqual('<p>2</p>');
//
//     utils.removeDIV(el);
//     done();
// });
//
// it('@if + @else-if', function (done) {
//     var el = utils.createDIV();
//     var data = {
//         bool1: false,
//         bool2: true
//     };
//     el.innerHTML = '<p @if="bool1">1</p><p @else-if="bool2">2</p>';
//
//     new MVVM({
//         el: el,
//         data: data
//     });
//
//     expect(el.innerHTML).toEqual('<p>2</p>');
//     data.bool1 = true;
//     expect(el.innerHTML).toEqual('<p>1</p>');
//
//     utils.removeDIV(el);
//     done();
// });
//
// it('@if + @else-if + @else', function (done) {
//     var el = utils.createDIV();
//     var data = {
//         bool1: false,
//         bool2: false
//     };
//     el.innerHTML = '' +
//         '<p @if="bool1">1</p>' +
//         '<p @else-if="bool2">2</p>' +
//         '<p @else>3</p>' +
//         '';
//
//     new MVVM({
//         el: el,
//         data: data
//     });
//
//     expect(el.innerHTML).toEqual('<p>3</p>');
//     data.bool1 = true;
//     expect(el.innerHTML).toEqual('<p>1</p>');
//     data.bool1 = false;
//     data.bool2 = true;
//     expect(el.innerHTML).toEqual('<p>2</p>');
//
//     utils.removeDIV(el);
//     done();
// });


