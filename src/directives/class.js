/**
 * class 指令
 * @author ydr.me
 * @created 2016-12-26 10:34
 */


'use strict';


var pack = require('./pack');


module.exports = pack({
    // {a: b} => {"a": "b"}
    // {a: b, c} => {"a": "b", c: true}
    // [{a: b, c}, d] => {"a": "b", c: true}
    // [{a: b, c}, d, "e"] => {"a": "b", c: true, }
    parse: function (exp) {



        debugger;
    },
    init: function () {

    }
});

