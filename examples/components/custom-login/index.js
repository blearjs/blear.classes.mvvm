/* @coolievue */

/**
 * 文件描述
 * @author ydr.me
 * @create 2018-09-10 12:45
 * @update 2018-09-10 12:45
 */

'use strict';


var _default = {
    components: {
        'custom-input': require('../custom-input/index'),
        'custom-button': require('../custom-button/index')
    },
    data: function () {
        return {
            username: '',
            password: ''
        };
    },
    props: {},
    methods: {
        onSubmit: function (ev) {
            alert('用户名：' + this.username + '\n密码：' + this.password);
        }
    }
};

exports.__esModule = true;
exports.default = _default;
//@coolievue
_default.template = require('./template.html');
_default.style = require('./style.css');


