/**
 * 文本解析
 * @author ydr.me
 * @created 2016-12-23 23:51
 */


'use strict';

var string = require('blear.utils.string');
var array = require('blear.utils.array');
var modification = require('blear.core.modification');

var expression = require('./expression.js');
var configs = require('../configs');
var varible = require('../utils/varible');
var parseExpression = require('./expression');

var tagRE;
var DELIMITERS = [configs.textOpenTag, configs.textCloseTag];
var HTML_CHAR = configs.htmlChar;
// var ONE_TIME_CHAR = configs.oneTimeChar;
var escapeRegExp = string.escapeRegExp;


/**
 * 构造成正则表达式
 * @type {exports.compileRegex}
 * @type {function}
 */
var compileRegex = function compileRegex() {
    var open = escapeRegExp(DELIMITERS[0]);
    var close = escapeRegExp(DELIMITERS[1]);

    tagRE = new RegExp(
        open + '(.+?)' + close,
        'g'
    );
};


/**
 * Parse a template text string into an array of tokens.
 *
 * @param {String} text
 * @return {Array<Object> | null}
 *               - {String} type
 *               - {String} value
 *               - {Boolean} [html]
 *               - {Boolean} [oneTime]
 */

function parseTextToTokens(text) {
    if (!tagRE) {
        compileRegex();
    }

    var tokens = [];
    var lastIndex = tagRE.lastIndex = 0;
    var match;
    var index;
    var value;
    var firstChar;
    var foundTag = false;
    var html = false;

    while (match = tagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
            tokens.push({
                tag: false,
                value: text.slice(lastIndex, index)
            })
        }

        value = match[1];
        firstChar = value.charAt(0);
        html = firstChar === HTML_CHAR;

        if (html) {
            value = value.slice(1);
        }

        tokens.push({
            tag: true,
            value: value.trim(),
            html: html
        });
        foundTag = true;

        lastIndex = index + match[0].length
    }

    if (lastIndex < text.length) {
        tokens.push({
            value: text.slice(lastIndex),
            tag: false
        })
    }

    if (!foundTag) {
        return null;
    }

    return tokens
}


/**
 * 解析文本为表达式执行函数
 * @param node
 * @param text
 * @returns {Array|null}
 */
module.exports = function parseTextToGetter(node, text) {
    var tokens = parseTextToTokens(text);

    if (tokens === null) {
        return null;
    }

    var childNodes = [];
    array.each(tokens, function (index, token) {
        var childNode;

        if (token.tag) {
            childNode = modification.create('#comment', token.value);
        } else {
            childNode = modification.create('#text', token.value);
        }

        childNodes.push(childNode);
    });

    // var expressionList = [];
    //
    // array.each(tokens, function (index, token) {
    //     var expression = '';
    //
    //     if (token.tag) {
    //         expression += '(' + token.value + ')';
    //     } else {
    //         expression += '"' + string.textify(token.value) + '"';
    //     }
    //
    //     expressionList.push(expression);
    // });
    //
    // return parseExpression(expressionList.join(' + '));
};

// var Lexer = require('blear.shims.lexer');
//
// var lexer = new Lexer();
//
// module.exports = function (text) {
//     var tokens = lexer.lex(text);
//
//     debugger;
// };
