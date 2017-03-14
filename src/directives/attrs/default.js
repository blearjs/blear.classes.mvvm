/**
 * 普通属性指令
 * @author ydr.me
 * @created 2016-12-26 18:05
 */


'use strict';

var array = require('blear.utils.array');
var attribute = require('blear.core.attribute');

var strFlow = require('../../utils/string-flow');

// 布尔属性
// @link http://www.cnblogs.com/rubylouvre/p/4797187.html
// checked: 其实所有表单元素都有此属性，但只有radio, checkbox能在图形上表现出勾选的效果，一旦勾选上，其name及value就能提交
// selected: option的属性，一旦选上，就出现高亮状态，并将其name,value(没有就取其innerHTML)提交上去
// readonly: 用于输入性的控件，让用户只能看，不能修改
// disabled: 让表单元素蒙上一个灰白的色调，用户无法操作它，也不会提交其内容
// multiple：让下拉框变成多选形式，可以按着SHIFT进行多选
// hidden: 用于所有元素，这是HTML5新增的布尔属性，效果如同display:none，但其优先级低于CSS，因此没有大规范使用
// contentEditable： 应用于所有可见的非表单元素，让元素也像INPUT那样编辑它里面的内容
// async： 用于script标签，是近十年出现最有用的属性，让脚本不再堵塞页面加载，早期IE出了一个defer属性,有关它的区别可见这里
var booleanAttrs = array.reduce('checked selected readonly disabled multiple hidden contenteditable async'.split(' '), function (p, n) {
    p[n] = 1;
    return p;
}, {});
var booleanAttrMap = {
    readonly: 'readOnly',
    contenteditable: 'contentEditable'
};

exports.update = function (directive, newVal) {
    var value = directive.get();
    var node = directive.node;
    var name = directive.name;
    var isBooleanAttr = booleanAttrs[name];

    if (directive.filters.prop) {
        node[name] = value;
    } else if (isBooleanAttr) {
        var key = booleanAttrMap[name.toLowerCase()] || name;
        node[key] = Boolean(value);
    } else {
        attribute.attr(node, name, strFlow.to(value));
    }
};


