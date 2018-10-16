/**
 * 首页
 * @author ydr.me
 * @created 2016-12-17 19:12
 */


'use strict';


var MVVM = require('../../src/index');


window.mv1 = new MVVM({
    el: '#demo1',
    components: {
        'custom-login': require('../components/custom-login/index')
    },
    data: {
        title: 'demo1',
    },
    // @coolievue
    template: require('./template.html'),
    style: require('./style.css'),
    methods: {

    }
});

window.mv2 = new MVVM({
    el: '#demo2',
    beforeCreate: function () {
        this.$options.components.customLogin = require('../components/custom-login/index');
    },
    data: {
        title: 'demo2',
    },
    // @coolievue
    template: require('./template.html'),
    style: require('./style.css'),
    methods: {

    }
});
