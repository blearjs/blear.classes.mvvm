/**
 * karma 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';


var MVVM = require('../src/index.js');
var attribute = require('blear.core.attribute');

describe('blear.classes.mvvm', function () {
    it('元素、样式独立', function () {
        var el1 = document.createElement('div');
        var el2 = document.createElement('div');
        document.body.appendChild(el1);
        document.body.appendChild(el2);
        var mv1 = new MVVM({
            el: el1,
            data: {},
            template: '<p>1</p>',
            style: 'p{width:100px;}'
        });
        var mv2 = new MVVM({
            el: el2,
            template: '<p>2</p>',
            style: 'p{width:100px;}'
        });

        expect(mv1.$el.innerHTML).toEqual('1');
        expect(mv2.$el.innerHTML).toEqual('2');
        expect(attribute.style(mv1.$el, 'width')).toEqual('100px');
        expect(attribute.style(mv2.$el, 'width')).toEqual('100px');
        expect(mv1.$el.attributes[0].name).toMatch(/data-mvvm-\d/);
        expect(mv2.$el.attributes[0].name).toMatch(/data-mvvm-\d/);
        expect(mv1.$el.attributes[0].name).not.toEqual(mv2.$el.attributes[0].name);
    });

    it('同步组件', function () {
        var el = document.createElement('div');
        document.body.appendChild(el);
        var mv = new MVVM({
            el: el,
            components: {
                comA: {
                    template: '<a>comA</a>',
                    style: 'a{font-size:20px;}'
                },
                'com-b': {
                    template: '<b>com-b</b>',
                    style: 'b{font-size:30px;}'
                }
            },
            template: '<p>' +
                '<com-a></com-a>' +
                '<com-b></com-b>' +
                '</p>'
        });
        expect(attribute.style(mv.$el.querySelector('a'), 'font-size')).toEqual('20px');
        expect(attribute.style(mv.$el.querySelector('b'), 'font-size')).toEqual('30px');
    });

    it('异步组件', function () {
        var el = document.createElement('div');
        document.body.appendChild(el);
        var mv = new MVVM({
            el: el,
            components: {
                comA: {
                    template: '<a>comA</a>',
                    style: 'a{font-size:20px;}'
                }
            },
            beforeCreate: function () {
                this.$options.components.comB = {
                    template: '<b>com-b</b>',
                    style: 'b{font-size:30px;}'
                };
            },
            template: '<p>' +
                '<com-a></com-a>' +
                '<com-b></com-b>' +
                '</p>'
        });
        expect(attribute.style(mv.$el.querySelector('a'), 'font-size')).toEqual('20px');
        expect(attribute.style(mv.$el.querySelector('b'), 'font-size')).toEqual('30px');
    });

});