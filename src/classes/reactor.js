/**
 * model 与 directive 之间的桥梁
 * @author ydr.me
 * @created 2016-12-29 20:41
 */


'use strict';

var random = require('blear.utils.random');
var array = require('blear.utils.array');
var Events = require('blear.classes.events');

var Reactor = Events.extend({
    className: 'Reactor',
    constructor: function () {
        this.guid = random.guid();
        this.directiveList = [];
        this.directiveMap = [];
    },

    add: function () {

        if (Reactor.target) {
            var directive = Reactor.target;
            var directiveGuid = directive.guid;

            if (!this.directiveMap[directiveGuid]) {
                this.directiveMap[directiveGuid] = true;
                this.directiveList.push(directive);
            }
        }
    },

    notify: function () {
        array.each(this.directiveList, function (index, directive) {
            directive.dispath();
        });
    }
});

Reactor.target = null;

module.exports = Reactor;


