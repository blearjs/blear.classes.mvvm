/**
 * 配置
 * @author ydr.me
 * @created 2016-12-25 12:04
 */


'use strict';

// 事件指令前缀
// 如：@click="onClick"
exports.eventDirective = '@';

// 属性指令前缀
// 如：:diabled="abc"
exports.attrDirective = ':';

// 控制指令前缀
// 如：$if="abc"
exports.controlDirective = '$';

// 指令过滤器分隔符
// 如：@click.enter.false="onClick"
exports.directiveFilterDelimiter = '.';

// 文本表达式开始标签
// 如：{{text}}
exports.textOpenTag = '{{';

// 文本表达式关闭标签
// 如：{{text}}
exports.textCloseTag = '}}';

// 元素名称
// 如："onChange($el)"
exports.elementName = '$el';

// 事件名称
// 如："onChange($ev)"
exports.eventName = '$ev';
