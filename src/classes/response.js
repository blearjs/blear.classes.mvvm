/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-01 11:17
 */


'use strict';


var Events = require('blear.classes.events');

var Response = Events.extend({
    className: 'Response',
    constructor: function (directive) {
        var the = this;

        Response.parent(the);
        the.directive = directive;
        the[_agentList] = [];
        the[_agentMap] = {};
    },

    add: function (agent) {
        var the = this;
        var guid = agent.guid;
        var map = the[_agentMap];
        var list = the[_agentList];

        if (map[guid]) {
            return;
        }

        map[guid] = true;
        list.push(agent);
    }
});
var _agentList = Response.sole();
var _agentMap = Response.sole();

module.exports = Response;
