/**
 * karma 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

window.DEBUG = false;
window.UNIT_TEST = true;

describe('指令', function () {
    require('./directives/attr');
    require('./directives/class');
    require('./directives/display');
    require('./directives/event');
    require('./directives/for');
    // require('./directives/html');
    // require('./directives/if');
    // require('./directives/if-for');
    // require('./directives/model-checkbox');
    // require('./directives/model-radio');
    // require('./directives/model-select');
    // require('./directives/model-text');
    // require('./directives/pre');
    // require('./directives/style');
    // require('./directives/text');
});

// describe('实例', function () {
//     require('./instance/computed');
//     require('./instance/watch');
//     require('./instance/methods');
//     require('./instance/directives');
// });
//
// describe('静态', function () {
//     require('./statical/directive');
// });

describe('性能', function () {
    require('./performance/directive');
});

describe('边界', function () {
    // @todo
    // mvvm 嵌套
    // data 共享
});

