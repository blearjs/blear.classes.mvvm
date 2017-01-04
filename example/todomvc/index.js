/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-03 22:10
 */


'use strict';

var MVVM = require('../../src/index');
window.data = {
    newTodo: '',
    store: [],
    filter: 0,
    todos: function () {
        switch (this.filter) {
            case 0:
                return this.store;

            case 1:
                return this.store.filter(function (item) {
                    return !item.completed;
                });

            case 2:
                return this.store.filter(function (item) {
                    return item.completed;
                });
        }
    },
    remaining: function () {
        return this.todos().length;
    }
};

new MVVM({
    el: '#todoapp',
    data: data,
    methods: {
        onAdd: function () {
            if (!this.newTodo) {
                return;
            }

            var item = {
                name: this.newTodo,
                completed: false
            };

            this.store.push(item);
            this.newTodo = '';
        },
        onRemove: function (index) {
            var item = this.todos.call(this)[index];
            this.store.delete(item);
        },
        onFilter: function (filter) {
            this.filter = filter;
        }
    }
});


