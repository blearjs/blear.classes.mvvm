/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-03 22:10
 */


'use strict';

var MVVM = require('../../src/index');

window.data = {
    newTodo: '',
    editingTodo: null,
    todos: [],
    filter: 0
};

new MVVM({
    el: '#todoapp',
    data: data,
    computed: {
        filteredTodos: function () {
            switch (this.filter) {
                case 0:
                    return this.todos;

                case 1:
                    return this.todos.filter(function (item) {
                        return !item.completed;
                    });

                case 2:
                    return this.todos.filter(function (item) {
                        return item.completed;
                    });
            }
        },

        remaining: function () {
            return this.filteredTodos.length;
        }
    },
    methods: {
        onAdd: function () {
            if (!this.newTodo) {
                return;
            }

            var item = {
                name: this.newTodo,
                completed: false
            };

            this.todos.push(item);
            this.newTodo = '';
        },
        onEdit: function (todo) {
            this.editingTodo = todo;
        },
        onRemove: function (index) {
            var item = this.filteredTodos[index];
            this.todos.delete(item);
        },
        onFilter: function (filter) {
            this.filter = filter;
        }
    },
    directives: {
        'todo-focus': function (node, newVal, oldVal) {
            node.focus();
        }
    }
});


