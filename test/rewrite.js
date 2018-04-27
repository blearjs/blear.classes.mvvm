/**
 * 文件描述
 * @author ydr.me
 * @create 2018-04-27 15:58
 * @update 2018-04-27 15:58
 */

'use strict';

var fs = require('fs');
var path = require('path');

var dirname = path.join(__dirname, 'statical');
var list = fs.readdirSync(dirname);

list.forEach(function (name) {
    var file1 = path.join(dirname, name);
    var content = fs.readFileSync(file1, 'utf8');
    var nameList = name.split(/[-.]/g);

    nameList.shift();
    nameList.pop();

    content = content.replace(/^\s*?it\(/m, function (source) {
        return '\n\ndescribe(\'' + nameList.join(' ') + '\', function () {\n' + source;
    }).replace(/\n\n$/, '') + '\n});\n\n';

    fs.writeFileSync(file1, content, 'utf8');
});

console.log(dirname, '重写成功');




