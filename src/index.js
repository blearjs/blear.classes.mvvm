/**
 * MVVM
 * @author ydr.me
 * @create 2018-10-16 11:29
 * @update 2018-10-16 11:29
 */


'use strict';

var Vue = require('vue/dist/vue.common');
var attribute = require('blear.core.attribute');
var selector = require('blear.core.selector');
var modification = require('blear.core.modification');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var fun = require('blear.utils.function');
var scopeCSS = require('blear.utils.scope-css');


var increaseId = 0;

/**
 * MVVM（封装 VUE）
 * @param options
 * @param options.el
 * @param [options.cssScope] {string} 作用域
 * @param options.data
 * @param options.components
 * @param options.template
 * @param options.method
 * @param options.render
 * @param options.computed
 * @param options.props
 * @param options.propsData
 * @param options.watch
 * @param options.directives
 * @param options.filters
 * @param options.name
 * @param options.delimiters
 * @param options.functional
 * @param options.model
 * @param options.inheritAttrs
 * @param options.comments
 * @returns {Vue}
 */
module.exports = function (options) {
    // 实例化之前进行 css 作用域处理
    var beforeCreate = fun.ensure(options.beforeCreate);
    options.beforeCreate = function () {
        var vm = this;
        var options = vm.$options;
        beforeCreate.call(vm);
        scopeAllComponentsCSS(options);
        var cssText = getAllComponentsCSS(options);
        var styleEl = modification.importStyle(cssText);
        vm.$once('hook:destroyed', function () {
            modification.remove(styleEl);
            modification.insert(options.el, this.$el, 0);
            modification.remove(this.$el);
        });
    };

    var el = options.el = selector.query(options.el)[0];
    var attrs = el.attributes;
    var mounted = fun.ensure(options.mounted);
    options.mounted = function () {
        var vm = this;
        // 恢复 DOM 元素属性
        // @link https://cn.vuejs.org/v2/api/#el
        // 提供的元素只能作为挂载点。不同于 Vue 1.x，所有的挂载元素会被 Vue 生成的 DOM 替换。
        array.each(attrs, function (index, attr) {
            // ignore v-cloak
            if (attr.name === 'v-cloak') {
                return;
            }

            if (attr.name === 'class') {
                attribute.addClass(vm.$el, attr.value);
                return;
            }

            attribute.attr(vm.$el, attr.name, attr.value);
        });
        mounted.call(vm);
    };

    // 实例化 VUE
    return new Vue(options);
};

// ==========================================================
// ==========================================================
// ==========================================================

/**
 * 获取所有子组件的样式
 * @param options
 * @returns {string}
 */
function getAllComponentsCSS(options) {
    var scopeIdMap = {};
    var cssText = '';
    var process = function (component) {
        var scopeId = component._scopeId;
        if (scopeIdMap[scopeId]) {
            return;
        }

        cssText += component.style;
        scopeIdMap[scopeId] = true;

        if (!component.components) {
            return;
        }

        object.each(component.components, function (key, component) {
            process(component);
        });
    };

    process(options);
    return cssText;
}


/**
 * 处理组件 css 作用域
 * @param options
 */
function scopeAllComponentsCSS(options) {
    var process = function (component) {
        // 之前已经有处理过作用域
        if (component._scopeId) {
            return;
        }

        var scopeId = 'data-mvvm-' + increaseId++;
        component._scopeId = scopeId;
        component.style = scopeCSS(component.style, '[' + scopeId + ']', 2);
        object.each(component.components, function (key, component) {
            process(component);
        });
    };

    process(options);
}



