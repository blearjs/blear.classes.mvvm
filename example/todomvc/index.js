/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-03 22:10
 */


'use strict';

var array = require('blear.utils.array');

var MVVM = require('../../src/index');

var storeKey = 'blear.todos';

var getStore = function () {
    try {
        return JSON.parse(localStorage.getItem(storeKey)) || [];
    } catch (err) {
        return [];
    }
};

var setStore = function (todos) {
    localStorage.setItem(storeKey, JSON.stringify(todos))
};

var filterTodos = function (filter, todos) {
    switch (filter) {
        case 0:
            return todos;

        case 1:
            return todos.filter(function (item) {
                return !item.completed;
            });

        case 2:
            return todos.filter(function (item) {
                return item.completed;
            });
    }
};

window.mvvm = new MVVM({
    el: '#todoapp',
    data: {
        newTodo: '',
        editingTodo: null,
        todos: getStore(),
        filter: 0
    },
    computed: {
        filteredTodos: function () {
            return filterTodos(this.filter, this.todos);
        },

        remaining: function () {
            return filterTodos(1, this.todos).length;
        },

        allCompleted: {
            get: function () {
                return 0 === this.remaining;
            },
            set: function (newVal) {
                this.todos.forEach(function (todo) {
                    todo.completed = newVal;
                });
                this.filteredTodos = filterTodos(this.filter, this.todos);
            }
        }
    },
    methods: {
        onAdd: function () {
            var todo = this.newTodo.trim();

            if (!todo) {
                return;
            }

            var item = {
                name: todo,
                completed: false
            };

            this.todos.push(item);
            this.newTodo = '';
        },
        onEdit: function (todo) {
            this.editingTodo = todo;
        },
        onRemove: function (todo) {
            this.todos.delete(todo);
        },
        onFilter: function (filter) {
            this.filter = filter;
        },
        onBlur: function (el) {
            if (!this.editingTodo) {
                return;
            }

            var newVal = el.value.trim();

            if (newVal) {
                this.editingTodo.name = el.value;
            } else {
                this.todos.delete(this.editingTodo);
            }

            this.editingTodo = null;
        }
    },
    directives: {
        'todo-focus': function (node, newVal, oldVal) {
            if (newVal) {
                node.focus();
                node.value = this.scope.editingTodo.name;
            }
        }
    },
    watch: {
        todos: setStore
    }
});
