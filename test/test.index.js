/**
 * karma 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var index = require('../src/index.js');

describe('测试文件', function () {
    it('exports', function (done) {
        expect(index).toEqual('index');
        done();
    });
});
