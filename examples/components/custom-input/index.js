// @coolievue

/**
 * 文件描述
 * @author ydr.me
 * @create 2018-09-10 11:43
 * @update 2018-09-10 11:43
 */


'use strict';


module.exports = {
    data: function () {
        return {};
    },
    props: {
        type: {
            default: 'text'
        },
        placeholder: {
            default: '请输入'
        },
        value: {
            default: ''
        }
    },
    /*@coolievue*/
    template: require('./template.html'),
    style: require('./style.css')
};


