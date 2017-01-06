/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var MVVM = require('../../src/index');
var utils = require('../utils');

it('@for 1维数组', function (done) {
    var el = utils.createDIV();
    var data = {
        list: [1, 2]
    };
    el.innerHTML = '' +
        '<p @for="item in list">{{item}}</p>';

    new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toEqual('<p>1</p><p>2</p>');

    data.list.push(3);
    expect(el.innerHTML).toEqual('<p>1</p><p>2</p><p>3</p>');

    data.list.pop();
    expect(el.innerHTML).toEqual('<p>1</p><p>2</p>');

    data.list.unshift(4);
    expect(el.innerHTML).toEqual('<p>4</p><p>1</p><p>2</p>');

    data.list.shift();
    expect(el.innerHTML).toEqual('<p>1</p><p>2</p>');

    data.list.sort(function (a, b) {
        return b - a;
    });
    expect(el.innerHTML).toEqual('<p>2</p><p>1</p>');

    data.list.splice(0, 0, 5);
    expect(el.innerHTML).toEqual('<p>5</p><p>2</p><p>1</p>');

    data.list.splice(1, 2, 6);
    expect(el.innerHTML).toEqual('<p>5</p><p>6</p>');

    data.list.set(0, 7);
    expect(el.innerHTML).toEqual('<p>7</p><p>6</p>');

    data.list.remove(1);
    expect(el.innerHTML).toEqual('<p>7</p>');

    data.list.delete(7);
    expect(el.innerHTML).toEqual('');

    data.list = [8, 9];
    expect(el.innerHTML).toEqual('<p>8</p><p>9</p>');

    data.list = [10, 11];
    expect(el.innerHTML).toEqual('<p>10</p><p>11</p>');

    data.list.push(12);
    expect(el.innerHTML).toEqual('<p>10</p><p>11</p><p>12</p>');

    utils.removeDIV(el);
    done();
});

it('@for 2维数组', function (done) {
    var el = utils.createDIV();
    var data = {
        list: [
            [1, 2]
        ]
    };
    el.innerHTML = '' +
        '<p @for="item in list">' +
        '<span @for="n in item">{{n}}</span>' +
        '</p>';

    new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toEqual('<p><span>1</span><span>2</span></p>');

    data.list[0].push(3);
    expect(el.innerHTML).toEqual('<p><span>1</span><span>2</span><span>3</span></p>');

    data.list[0].pop();
    expect(el.innerHTML).toEqual('<p><span>1</span><span>2</span></p>');

    data.list[0].unshift(4);
    expect(el.innerHTML).toEqual('<p><span>4</span><span>1</span><span>2</span></p>');

    data.list[0].shift();
    expect(el.innerHTML).toEqual('<p><span>1</span><span>2</span></p>');

    data.list[0].sort(function (a, b) {
        return b - a;
    });
    expect(el.innerHTML).toEqual('<p><span>2</span><span>1</span></p>');

    data.list[0].splice(0, 0, 5);
    expect(el.innerHTML).toEqual('<p><span>5</span><span>2</span><span>1</span></p>');

    data.list[0].splice(1, 2, 6);
    expect(el.innerHTML).toEqual('<p><span>5</span><span>6</span></p>');

    data.list[0].set(0, 7);
    expect(el.innerHTML).toEqual('<p><span>7</span><span>6</span></p>');

    data.list[0].remove(1);
    expect(el.innerHTML).toEqual('<p><span>7</span></p>');

    data.list[0].delete(7);
    expect(el.innerHTML).toEqual('<p></p>');

    data.list = [[8, 9]];
    expect(el.innerHTML).toEqual('<p><span>8</span><span>9</span></p>');

    data.list = [[10, 11]];
    expect(el.innerHTML).toEqual('<p><span>10</span><span>11</span></p>');

    data.list[0].push(12);
    expect(el.innerHTML).toEqual('<p><span>10</span><span>11</span><span>12</span></p>');

    utils.removeDIV(el);
    done();
});

