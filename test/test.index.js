/**
 * karma 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

window.DEBUG = false;
window.UNIT_TEST = true;

describe('指令', function () {
    // require('./directives/attr');
    // require('./directives/class');
    // require('./directives/for');
    // require('./directives/html');
    // require('./directives/if');
    // require('./directives/if-for');
    require('./directives/model-checkbox');
    require('./directives/model-radio');
    require('./directives/model-select');
    require('./directives/model-text');
    // require('./directives/pre');
    // require('./directives/style');
    // require('./directives/text');
    // 事件
    // 显示
});

describe('参数', function () {
    // @todo
    // computed
    // watch
    // methods
    // directive
});

describe('实例方法', function () {
    // @todo
    // #watch
    // #destroy
});

describe('静态方法', function () {
    // @todo
    // .directive
});

