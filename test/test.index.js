/**
 * karma 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';


var MVVM = require('../src/index.js');
var attribute = require('blear.core.attribute');
var selector = require('blear.core.selector');

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

    it('属性继承', function () {
        var el = document.createElement('div');
        el.setAttribute('a', '1');
        el.setAttribute('b', '2');
        document.body.appendChild(el);
        var mv = new MVVM({
            el: el,
            template: '<a></a>'
        });
        expect(mv.$el.tagName.toLowerCase()).toEqual('a');
        expect(mv.$el.getAttribute('a')).toEqual('1');
        expect(mv.$el.getAttribute('b')).toEqual('2');
    });

    it('实例销毁', function () {
        var el = document.createElement('div');
        document.body.appendChild(el);
        var id = el.id = 'id-' + Date.now();
        var mv = new MVVM({
            el: el,
            template: '<p>实例销毁</p>',
            style: 'p{width:20px}'
        });
        expect(document.getElementById(id).tagName.toLowerCase()).toEqual('p');
        mv.$destroy();
        expect(document.getElementById(id).tagName.toLowerCase()).toEqual('div');
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

    it('组件复用', function () {
        var el = document.createElement('div');
        document.body.appendChild(el);
        var comA = {
            template: '<a>comA</a>'
        };
        var comB = {
            template: '<b>comB</b>'
        };
        var comI = {
            template: '<span><i>comI</i><com-a></com-a></span>',
            components: {
                comA: comA
            }
        };
        var mv = new MVVM({
            el: el,
            components: {
                comA: comA,
                comB: comB,
                comI: comI
            },
            template: '<p>' +
                '<com-a></com-a>' +
                '<com-b></com-b>' +
                '<com-i></com-i>' +
                '</p>'
        });
        expect(selector.children(mv.$el)[0].tagName.toLowerCase()).toEqual('a');
        expect(selector.children(mv.$el)[1].tagName.toLowerCase()).toEqual('b');
        expect(selector.children(mv.$el)[2].tagName.toLowerCase()).toEqual('span');
        expect(selector.children(
            selector.children(mv.$el)[2]
        )[0].tagName.toLowerCase()).toEqual('i');
        expect(selector.children(
            selector.children(mv.$el)[2]
        )[1].tagName.toLowerCase()).toEqual('a');
    });

});