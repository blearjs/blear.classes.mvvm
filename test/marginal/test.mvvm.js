/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-10 11:40
 */


'use strict';

var plan = require('blear.utils.plan');
var random = require('blear.utils.random');
var selector = require('blear.core.selector');

var MVVM = require('../../src/index');
var utils = require('../utils');


describe('mvvm', function () {

it('mvvm 嵌套，父级先销毁', function (done) {
    var el = utils.createDIV();

    el.innerHTML = '<div>{{text}}</div>';
    var firstDivEl = el.firstElementChild;
    var data = {text: 'a'};

    var parentMVVM = new MVVM({
        el: el,
        data: data
    });

    var childEl = document.createElement('div');
    childEl.innerHTML = '{{text}}';
    el.appendChild(childEl);
    var childMVVM = new MVVM({
        el: childEl,
        data: data
    });

    plan
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('a');
            expect(childEl.innerHTML).toBe('a');

            data.text = 'b';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('b');
            expect(childEl.innerHTML).toBe('b');

            parentMVVM.destroy();
            data.text = 'c';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('b');
            expect(childEl.innerHTML).toBe('c');

            childMVVM.destroy();
            data.text = 'd';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('b');
            expect(childEl.innerHTML).toBe('c');

            utils.removeDIV(el);
        })
        .serial(done);
});

it('mvvm 嵌套，子级先销毁', function (done) {
    var el = utils.createDIV();

    el.innerHTML = '<div>{{text}}</div>';
    var firstDivEl = el.firstElementChild;
    var data = {text: 'a'};

    var parentMVVM = new MVVM({
        el: el,
        data: data
    });

    var childEl = document.createElement('div');
    childEl.innerHTML = '{{text}}';
    el.appendChild(childEl);
    var childMVVM = new MVVM({
        el: childEl,
        data: data
    });

    plan
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('a');
            expect(childEl.innerHTML).toBe('a');

            data.text = 'b';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('b');
            expect(childEl.innerHTML).toBe('b');

            childMVVM.destroy();
            data.text = 'c';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('c');
            expect(childEl.innerHTML).toBe('b');

            parentMVVM.destroy();
            data.text = 'd';
        })
        .wait(10)
        .taskSync(function () {
            expect(firstDivEl.innerHTML).toBe('c');
            expect(childEl.innerHTML).toBe('b');

            utils.removeDIV(el);
        })
        .serial(done);
});

it('DOM 游离', function (done) {
    var el = utils.createDIV();

    el.innerHTML =
        '<div>{{text}}</div>' +
        '<div>{{text}}</div>';

    var div0El = el.firstElementChild;
    var div1El = div0El.nextElementSibling;
    var data = {
        text: 'a'
    };
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .taskSync(function () {
            expect(div0El.innerHTML).toBe('a');
            expect(div1El.innerHTML).toBe('a');
            document.body.appendChild(div1El);
        })
        .wait(10)
        .taskSync(function () {
            expect(div0El.innerHTML).toBe('a');
            expect(div1El.innerHTML).toBe('a');

            data.text = 'b';
        })
        .wait(10)
        .taskSync(function () {
            expect(div0El.innerHTML).toBe('b');
            expect(div1El.innerHTML).toBe('b');

            mvvm.destroy();
            data.text = 'c';
        })
        .wait(10)
        .taskSync(function () {
            expect(div0El.innerHTML).toBe('b');
            expect(div1El.innerHTML).toBe('b');

            el.appendChild(div1El);
            utils.removeDIV(el);
        })
        .serial(done);
});

it('table', function (done) {
    var el = utils.createDIV();
    var data = {
        showMark: true,
        users: [
            {name: 'a', mark: 'A'},
            {name: 'b', mark: 'B'},
            {name: 'c', mark: 'C'}
        ]
    };
    var thMarkClass = '_' + random.guid();
    var tdMarkClass = '_' + random.guid();

    el.innerHTML =
        '<table>' +
        /****/'<thead>' +
        /****//****/'<th>' +
        /****//****//****/'<td>' +
        /****//****//****//****/'name' +
        /****//****//****/'</td>' +
        /****//****//****/'<td @if="showMark" class="' + thMarkClass + '">' +
        /****//****//****//****/'mark' +
        /****//****//****/'</td>' +
        /****//****/'</th>' +
        /****/'</thead>' +
        /****/'<tbody>' +
        /****//****/'<tr @for="user in users">' +
        /****//****//****/'<td>' +
        /****//****//****//****/ '{{user.name}}' +
        /****//****//****/'</td>' +
        /****//****//****/'<td @if="showMark" class="' + tdMarkClass + '">' +
        /****//****//****//****/ '{{user.mark}}' +
        /****//****//****/'</td>' +
        /****//****/'</th>' +
        /****/'</tbody>' +
        '</table>';

    var mvvm = new MVVM({
        el: el,
        data: data
    });


    plan
        .taskSync(function () {
            expect(selector.query('.' + thMarkClass).length).toBe(1);
            expect(selector.query('.' + tdMarkClass).length).toBe(3);

            data.showMark = false;
        })
        .wait(10)
        .taskSync(function () {
            expect(selector.query('.' + thMarkClass).length).toBe(0);
            expect(selector.query('.' + tdMarkClass).length).toBe(0);
        })
        .taskSync(function () {
            utils.removeDIV(el);
            mvvm.destroy();
        })
        .serial(done);
});

it('覆盖新数据 数组', function (done) {
    var el = utils.createDIV();
    el.innerHTML = '<a @for="item in user.list">{{item}}</a>';
    var data = {
        user: {
            list: []
        }
    };
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toBe('');
            data.user = {list: [1]};
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toBe('<a>1</a>');
        })
        .taskSync(function () {
            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

it('添加新属性', function (done) {
    var el = utils.createDIV();
    el.innerHTML = '{{user.age}}';
    var data = {
        user: {}
    };
    var mvvm = new MVVM({
        el: el,
        data: data
    });

    plan
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toBe('');
            data.user = {age: 1};
        })
        .wait(10)
        .taskSync(function () {
            expect(el.innerHTML).toBe('1');
        })
        .taskSync(function () {
            mvvm.destroy();
            utils.removeDIV(el);
        })
        .serial(done);
});

// it('method 不能放在 data 上', function (done) {
//     var el1 = utils.createDIV();
//     var el2 = utils.createDIV();
//     var method1 = false;
//     var data = {};
//     var mvvm1 = new MVVM({
//         el: el1,
//         data: data,
//         methods: {
//             onMethod: function () {
//                 method1 = true;
//             }
//         }
//     });
//
//     plan
//         .wait(10)
//         .taskSync(function () {
//            expect(data.onMethod).toBe(undefined);
//         })
//         .taskSync(function () {
//             mvvm1.destroy();
//             utils.removeDIV(el1);
//             utils.removeDIV(el2);
//         })
//         .serial(done);
// });

});

