/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

var plan = require('blear.utils.plan');

var MVVM = require('../../src/index');
var utils = require('../utils');

it('>computed get', function (done) {
    var el = utils.createDIV();
    var data = {
        firstName: 'a',
        lastName: 'b'
    };
    var computed = {
        fullName: function () {
            return [this.firstName, this.lastName].join(' ').trim();
        }
    };
    el.innerHTML = '{{fullName}}';

    var mvvm = new MVVM({
        el: el,
        data: data,
        computed: computed
    });

    expect(el.innerHTML).toBe('a b');
    data.firstName = 'aa';
    expect(el.innerHTML).toBe('aa b');

    mvvm.destroy();
    utils.removeDIV(el);
    done();
});

it('>computed get + set', function (done) {
    var el = utils.createDIV();
    var data = {
        firstName: 'a',
        lastName: 'b'
    };
    var computed = {
        fullName: {
            get: function () {
                return [this.firstName, this.lastName].join(' ').trim();
            },
            set: function (val) {
                var arr = val.split(' ');

                this.firstName = arr.shift();
                this.lastName = arr.join(' ');
            }
        }
    };
    el.innerHTML = '{{fullName}}';

    var mvvm = new MVVM({
        el: el,
        data: data,
        computed: computed
    });

    expect(el.innerHTML).toBe('a b');
    data.firstName = 'aa';
    expect(el.innerHTML).toBe('aa b');

    data.fullName = 'x';
    expect(data.firstName).toBe('x');
    expect(data.lastName).toBe('');
    expect(el.innerHTML).toBe('x');

    data.fullName = 'x y z';
    expect(data.firstName).toBe('x');
    expect(data.lastName).toBe('y z');
    expect(el.innerHTML).toBe('x y z');

    mvvm.destroy();
    utils.removeDIV(el);
    done();
});

it('>computed get object', function (done) {
    var el = utils.createDIV();
    var data = {
        todos: [
            {name: '1', complete: false},
            {name: '2', complete: true}
        ]
    };
    var mvvm = new MVVM({
        el: el,
        data: data,
        computed: {
            completedTodos: function () {
                return this.todos.filter(function (todo) {
                    return todo.complete;
                });
            }
        }
    });

    plan
        .taskSync(function () {
            expect(data.completedTodos).toEqual([{name: '2', complete: true}]);
            data.todos.push({name: '3', complete: true});
        })
        .wait(10)
        .taskSync(function () {
            expect(data.completedTodos).toEqual(
                [
                    {name: '2', complete: true},
                    {name: '3', complete: true}
                ]
            );
            mvvm.destroy();
            data.todos.push({name: '4', complete: true});
        })
        .wait(10)
        .taskSync(function () {
            // 因为是计算属性，相当于是 data 的属性
            // 只是添加了 get 方法，所以数据获取的时候
            // 肯定是最新的
            expect(data.completedTodos).toEqual(
                [
                    {name: '2', complete: true},
                    {name: '3', complete: true},
                    {name: '4', complete: true}
                ]
            );
            utils.removeDIV(el);
        })
        .serial(done);
});
