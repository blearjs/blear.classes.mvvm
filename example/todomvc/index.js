/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-03 22:10
 */


'use strict';

var MVVM = require('../../src/index');
window.data = {
    newTodo: '',
    todos: []
};

new MVVM({
    el: '#todoapp',
    data: data,
    methods: {
        onAddTodo: function () {
            if (!this.newTodo) {
                return;
            }

            this.todos.push({
                name: this.newTodo,
                completed: false
            });

            this.newTodo = '';
        },
        onRemove: function (index) {
            this.todos.remove(index);
        }
    }
});


