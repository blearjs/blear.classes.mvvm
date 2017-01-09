/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-06 16:47
 */


'use strict';

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


