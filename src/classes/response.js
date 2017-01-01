/**
 * 文件描述
 * @author ydr.me
 * @created 2017-01-01 11:17
 */


'use strict';


var Events = require('blear.classes.events');
var random = require('blear.utils.random');
var array = require('blear.utils.array');

window.ResponseList = [];

var Response = Events.extend({
    className: 'Response',
    constructor: function (directive) {
        var the = this;

        Response.parent(the);
        the.directive = directive;
        the.guid = random.guid();
        the.respond = null;
        the[_agentList] = [];
        the[_agentMap] = {};
        ResponseList.push(the);
    },

    link: function (agent) {
        var the = this;
        var guid = agent.guid;
        var map = the[_agentMap];
        var list = the[_agentList];

        if (map[guid]) {
            return;
        }

        map[guid] = true;
        list.push(agent);
    },

    unlink: function () {
        var the = this;

        array.each(the[_agentList], function (index, agent) {
            agent.unlink(the);
        });

        the.respond = null;
        the.destroy();
    }
});
var _agentList = Response.sole();
var _agentMap = Response.sole();

module.exports = Response;
