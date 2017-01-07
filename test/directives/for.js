/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var array = require('blear.utils.array');
var random = require('blear.utils.random');

var MVVM = require('../../src/index');
var utils = require('../utils');

it('@for 1 维数组', function (done) {
    var el = utils.createDIV();
    var data = {
        list: [
            1,
            2
        ]
    };
    el.innerHTML =
        '<p @for="item in list">{{item}}</p>';

    new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toEqual(
        '<p>1</p>' +
        '<p>2</p>'
    );

    data.list.push(3);
    expect(el.innerHTML).toEqual(
        '<p>1</p>' +
        '<p>2</p>' +
        '<p>3</p>'
    );

    data.list.pop();
    expect(el.innerHTML).toEqual(
        '<p>1</p>' +
        '<p>2</p>'
    );

    data.list.unshift(4);
    expect(el.innerHTML).toEqual(
        '<p>4</p>' +
        '<p>1</p>' +
        '<p>2</p>'
    );

    data.list.shift();
    expect(el.innerHTML).toEqual(
        '<p>1</p>' +
        '<p>2</p>'
    );

    data.list.sort(function (a, b) {
        return b - a;
    });
    expect(el.innerHTML).toEqual(
        '<p>2</p>' +
        '<p>1</p>'
    );

    data.list.splice(0, 0, 5);
    expect(el.innerHTML).toEqual(
        '<p>5</p>' +
        '<p>2</p>' +
        '<p>1</p>'
    );

    data.list.splice(1, 2, 6);
    expect(el.innerHTML).toEqual(
        '<p>5</p>' +
        '<p>6</p>'
    );

    data.list.set(0, 7);
    expect(el.innerHTML).toEqual(
        '<p>7</p>' +
        '<p>6</p>'
    );

    data.list.remove(1);
    expect(el.innerHTML).toEqual(
        '<p>7</p>'
    );

    data.list.delete(7);
    expect(el.innerHTML).toEqual('');

    data.list = [8, 9];
    expect(el.innerHTML).toEqual(
        '<p>8</p>' +
        '<p>9</p>'
    );

    data.list = [10, 11];
    expect(el.innerHTML).toEqual(
        '<p>10</p>' +
        '<p>11</p>'
    );

    data.list.push(12);
    expect(el.innerHTML).toEqual(
        '<p>10</p>' +
        '<p>11</p>' +
        '<p>12</p>'
    );

    utils.removeDIV(el);
    done();
});

it('@for sort', function (done) {
    var data = {
        list: []
    };
    var el = utils.createDIV();
    el.innerHTML =
        '<a @for="n in list">{{n}}</a>';
    var length = 30;

    while (length--) {
        data.list.push(random.number(1, 1000));
    }

    new MVVM({
        el: el,
        data: data
    });

    length = 30;

    while (length--) {
        data.list.sort(function () {
            return Math.random() - 0.5;
        });

        array.each(el.children, function (index, childEl) {
            expect(childEl.innerHTML).toBe(data.list[index] + '');
        });
    }

    done();
});

it('@for 1 维数组对象', function (done) {
    var el = utils.createDIV();
    var data = {
        users: [{
            name: 'a'
        }]
    };

    el.innerHTML = '<div @for="user in users">{{user.name}}</div>';
    new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toBe(
        '<div>a</div>'
    );

    data.users[0].name = 'b';
    expect(el.innerHTML).toBe(
        '<div>b</div>'
    );

    var user0El = el.firstElementChild;
    data.users.set(0, {name: 'c'});
    expect(el.innerHTML).toBe(
        '<div>c</div>'
    );
    expect(el.firstElementChild).not.toBe(user0El);

    data.users.unshift({name: 'd'});
    expect(el.innerHTML).toBe(
        '<div>d</div>' +
        '<div>c</div>'
    );

    utils.removeDIV(el);
    done();
});

it('@for 1 维数组对象嵌套 1 维数组', function (done) {
    var el = utils.createDIV();
    var data = {
        teachers: [{
            name: 'A',
            students: [{
                name: 'a'
            }]
        }]
    };

    el.innerHTML =
        '<div @for="index, teacher in teachers">' +
        /****/'<p @for="index2, student in teacher.students">' +
        /****//****/'{{index}}' +
        /****//****/'{{teacher.name}}' +
        /****//****/'{{index2}}' +
        /****//****/'{{student.name}}' +
        /****/'</p>' +
        '</div>';
    new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toBe(
        '<div>' +
        /****/'<p>0A0a</p>' +
        '</div>'
    );

    data.teachers[0].students.push({name: 'b'});
    expect(el.innerHTML).toBe(
        '<div>' +
        /****/'<p>0A0a</p>' +
        /****/'<p>0A1b</p>' +
        '</div>'
    );

    data.teachers[0].students.unshift({name: 'c'});
    expect(el.innerHTML).toBe(
        '<div>' +
        /****/'<p>0A0c</p>' +
        /****/'<p>0A1a</p>' +
        /****/'<p>0A2b</p>' +
        '</div>'
    );

    data.teachers.unshift({
        name: 'B',
        students: []
    });
    expect(el.innerHTML).toBe(
        '<div>' +
        '</div>' +
        '<div>' +
        /****/'<p>1A0c</p>' +
        /****/'<p>1A1a</p>' +
        /****/'<p>1A2b</p>' +
        '</div>'
    );

    data.teachers[0].students.unshift({
        name: 'a'
    });
    expect(el.innerHTML).toBe(
        '<div>' +
        /****/'<p>0B0a</p>' +
        '</div>' +
        '<div>' +
        /****/'<p>1A0c</p>' +
        /****/'<p>1A1a</p>' +
        /****/'<p>1A2b</p>' +
        '</div>'
    );

    utils.removeDIV(el);
    done();
});

it('@for 2 维数组', function (done) {
    var el = utils.createDIV();
    var data = {
        list: [
            [
                1,
                2
            ]
        ]
    };
    el.innerHTML = '' +
        '<p @for="item in list">' +
        /****/'<span @for="n in item">{{n}}</span>' +
        '</p>';

    new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>1</span>' +
        /****/'<span>2</span>' +
        '</p>'
    );

    data.list[0].push(3);
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>1</span>' +
        /****/'<span>2</span>' +
        /****/'<span>3</span>' +
        '</p>'
    );

    data.list[0].pop();
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>1</span>' +
        /****/'<span>2</span>' +
        '</p>'
    );

    data.list[0].unshift(4);
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>4</span>' +
        /****/'<span>1</span>' +
        /****/'<span>2</span>' +
        '</p>'
    );

    data.list[0].shift();
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>1</span>' +
        /****/'<span>2</span>' +
        '</p>'
    );

    data.list[0].sort(function (a, b) {
        return b - a;
    });
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>2</span>' +
        /****/'<span>1</span>' +
        '</p>'
    );

    data.list[0].splice(0, 0, 5);
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>5</span>' +
        /****/'<span>2</span>' +
        /****/'<span>1</span>' +
        '</p>'
    );

    data.list[0].splice(1, 2, 6);
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>5</span>' +
        /****/'<span>6</span>' +
        '</p>'
    );

    data.list[0].set(0, 7);
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>7</span>' +
        /****/'<span>6</span>' +
        '</p>'
    );

    data.list[0].remove(1);
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>7</span>' +
        '</p>'
    );

    data.list[0].delete(7);
    expect(el.innerHTML).toEqual(
        '<p>' +
        '</p>'
    );

    data.list = [[8, 9]];
    expect(el.innerHTML).toEqual(
        '<p>' +
        '<span>8</span>' +
        '<span>9</span>' +
        '</p>'
    );

    data.list = [[10, 11]];
    expect(el.innerHTML).toEqual(
        '<p>' +
        '<span>10</span>' +
        '<span>11</span>' +
        '</p>'
    );

    data.list[0].push(12);
    expect(el.innerHTML).toEqual(
        '<p>' +
        '<span>10</span>' +
        '<span>11</span>' +
        '<span>12</span>' +
        '</p>'
    );

    data.list.push([13]);
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>10</span>' +
        /****/'<span>11</span>' +
        /****/'<span>12</span>' +
        '</p>' +
        '<p>' +
        /****/'<span>13</span>' +
        '</p>'
    );

    utils.removeDIV(el);
    done();
});

it('@for 3 维数组', function (done) {
    var el = utils.createDIV();
    var data = {
        list: [
            [
                [
                    1,
                    2
                ]
            ]
        ]
    };
    el.innerHTML =
        '<p @for="item in list">' +
        /****/'<span @for="n in item">' +
        /****//****/'<em @for="x in n">{{x}}</em>' +
        /****/'</span>' +
        '</p>';

    new MVVM({
        el: el,
        data: data
    });

    // [[[1, 2]]]
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>' +
        /****//****/'<em>1</em>' +
        /****//****/'<em>2</em>' +
        /****/'</span>' +
        '</p>'
    );

    // [[[1, 2, 3]]]
    data.list[0][0].push(3);
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>' +
        /****//****/'<em>1</em>' +
        /****//****/'<em>2</em>' +
        /****//****/'<em>3</em>' +
        /****/'</span>' +
        '</p>'
    );

    // [[[1, 2, 3], [4]]]
    data.list[0].push([4]);
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>' +
        /****//****/'<em>1</em>' +
        /****//****/'<em>2</em>' +
        /****//****/'<em>3</em>' +
        /****/'</span>' +
        /****/'<span>' +
        /****//****/'<em>4</em>' +
        /****/'</span>' +
        '</p>'
    );

    // [[[1, 2, 3], [4, 5]]]
    data.list[0][1].push(5);
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>' +
        /****//****/'<em>1</em>' +
        /****//****/'<em>2</em>' +
        /****//****/'<em>3</em>' +
        /****/'</span>' +
        /****/'<span>' +
        /****//****/'<em>4</em>' +
        /****//****/'<em>5</em>' +
        /****/'</span>' +
        '</p>'
    );

    // [[[1, 2, 3], [4, 5]], [[6]]]
    data.list.push([[6]]);
    expect(el.innerHTML).toEqual(
        '<p>' +
        /****/'<span>' +
        /****//****/'<em>1</em>' +
        /****//****/'<em>2</em>' +
        /****//****/'<em>3</em>' +
        /****/'</span>' +
        /****/'<span>' +
        /****//****/'<em>4</em>' +
        /****//****/'<em>5</em>' +
        /****/'</span>' +
        '</p>' +
        '<p>' +
        /****/'<span>' +
        /****//****/'<em>6</em>' +
        /****/'</span>' +
        '</p>'
    );

    utils.removeDIV(el);
    done();
});

it('@for 4 维数组', function (done) {
    var el = utils.createDIV();
    var data = {
        list: [
            [
                [
                    [
                        1,
                        2
                    ]
                ]
            ]
        ]
    };

    el.innerHTML =
        '<a @for="a in list">' +
        /****/'<b @for="b in a">' +
        /****//****/'<c @for="c in b">' +
        /****//****//****/'<d @for="d in c">' +
        /****//****//****//****/'{{JSON.stringify(list)}}' +
        /****//****//****/'</d>' +
        /****//****/'</c>' +
        /****/'</b>' +
        '</a>'
    ;
    new MVVM({
        el: el,
        data: data
    });

    expect(el.innerHTML).toBe(
        '<a>' +
        /****/'<b>' +
        /****//****/'<c>' +
        /****//****//****/'<d>' +
        /****//****//****//****/'[[[[1,2]]]]' +
        /****//****//****/'</d>' +
        /****//****//****/'<d>' +
        /****//****//****//****/'[[[[1,2]]]]' +
        /****//****//****/'</d>' +
        /****//****/'</c>' +
        /****/'</b>' +
        '</a>'
    );

    data.list[0][0][0].push(3);
    expect(el.innerHTML).toBe(
        '<a>' +
        /****/'<b>' +
        /****//****/'<c>' +
        /****//****//****/'<d>' +
        /****//****//****//****/'[[[[1,2,3]]]]' +
        /****//****//****/'</d>' +
        /****//****//****/'<d>' +
        /****//****//****//****/'[[[[1,2,3]]]]' +
        /****//****//****/'</d>' +
        /****//****//****/'<d>' +
        /****//****//****//****/'[[[[1,2,3]]]]' +
        /****//****//****/'</d>' +
        /****//****/'</c>' +
        /****/'</b>' +
        '</a>'
    );

    utils.removeDIV(el);
    done();
});
